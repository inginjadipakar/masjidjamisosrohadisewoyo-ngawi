export interface TpaRegistration {
  id: string;
  createdAt: string;
  namaLengkap: string;
  namaPanggilan: string;
  tempatLahir: string;
  tanggalLahir: string;
  jenisKelamin: "Laki-laki" | "Perempuan";
  usia: number;
  sekolahAsal: string;
  kelasSekolah: string;
  alamatRumah: string;
  kemampuanNgaji: "Belum Bisa" | "Iqro Jilid 1-3" | "Iqro Jilid 4-6" | "Al-Qur'an Lancar";
  programPilihan: string;
  namaAyah: string;
  namaIbu: string;
  pekerjaanOrtu: string;
  whatsappOrtu: string;
  catatanKhusus?: string;
  status: "Pending" | "ACC";
  approvedAt?: string;
}

const STORAGE_KEY = "mjs_tpa_registrations_v1";
const CLOUD_API_PATH = "/api/registrations";
const UPSTASH_REST_URL = "https://glad-honeybee-171670.upstash.io";
const UPSTASH_TOKEN = "gQAAAAAAAp6WAAIgcDIwMGM0YWMxNjcyY2E0ODk2YTM0NWJmMDcwOGYyYWIyNg";
const REDIS_KEY = "mjs:tpa:registrations_v1";

// Mock data awal kosong (tanpa data dummy)
export const INITIAL_SEED_DATA: TpaRegistration[] = [];

/* ──────────────────────────────────────────────────────────
   1. LOCALSTORAGE CACHE LAYER (SYNC)
   ────────────────────────────────────────────────────────── */

export function getTpaRegistrations(): TpaRegistration[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error("Gagal membaca pendaftaran TPA dari localStorage:", e);
    return [];
  }
}

export function generateNextRegistrationId(existing: TpaRegistration[]): string {
  let maxId = 0;
  for (const item of existing) {
    const match = item.id?.match(/REG-TPA-(\d+)/);
    if (match) {
      const num = parseInt(match[1], 10);
      if (!isNaN(num) && num > maxId) {
        maxId = num;
      }
    }
  }
  return `REG-TPA-${String(maxId + 1).padStart(3, "0")}`;
}

function updateLocalCache(items: TpaRegistration[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.warn("Gagal update localStorage cache:", e);
  }
}

export function saveTpaRegistration(data: Omit<TpaRegistration, "id" | "createdAt" | "status">): TpaRegistration {
  const current = getTpaRegistrations();
  const newId = generateNextRegistrationId(current);
  const newRecord: TpaRegistration = {
    ...data,
    id: newId,
    createdAt: new Date().toISOString(),
    status: "Pending",
  };
  const updated = [newRecord, ...current];
  updateLocalCache(updated);

  // Proaktif sync ke cloud di background
  saveTpaRegistrationAsync(data).catch((err) => {
    console.warn("Background cloud sync error:", err);
  });

  return newRecord;
}

export function updateTpaStatus(id: string, newStatus: "Pending" | "ACC"): TpaRegistration[] {
  const current = getTpaRegistrations();
  const updated = current.map((item) =>
    item.id === id
      ? {
          ...item,
          status: newStatus,
          approvedAt: newStatus === "ACC" ? new Date().toISOString() : undefined,
        }
      : item
  );
  updateLocalCache(updated);

  // Sync ke cloud di background
  updateTpaStatusAsync(id, newStatus).catch((err) => {
    console.warn("Background cloud sync update status error:", err);
  });

  return updated;
}

export function deleteTpaPermanently(id: string): TpaRegistration[] {
  const current = getTpaRegistrations();
  const updated = current.filter((item) => item.id !== id);
  updateLocalCache(updated);

  // Sync ke cloud di background
  deleteTpaPermanentlyAsync(id).catch((err) => {
    console.warn("Background cloud sync delete error:", err);
  });

  return updated;
}

/* ──────────────────────────────────────────────────────────
   2. CLOUD PERSISTENCE LAYER (ASYNC / RESILIENT)
   Mendukung: Vercel Serverless API (/api/registrations)
   dengan direct REST fallback & LocalStorage safety net
   ────────────────────────────────────────────────────────── */

// Helper Direct Fallback ke Upstash Redis REST
async function directUpstashGet(): Promise<TpaRegistration[] | null> {
  try {
    const res = await fetch(`${UPSTASH_REST_URL}/get/${encodeURIComponent(REDIS_KEY)}`, {
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (!json.result) return null;
    return typeof json.result === "string" ? JSON.parse(json.result) : json.result;
  } catch (e) {
    console.warn("Direct Upstash GET failed:", e);
    return null;
  }
}

async function directUpstashSet(items: TpaRegistration[]): Promise<boolean> {
  try {
    const res = await fetch(`${UPSTASH_REST_URL}/set/${encodeURIComponent(REDIS_KEY)}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${UPSTASH_TOKEN}`,
        "Content-Type": "text/plain",
      },
      body: JSON.stringify(items),
    });
    return res.ok;
  } catch (e) {
    console.warn("Direct Upstash SET failed:", e);
    return false;
  }
}

/**
 * Mengambil daftar pendaftaran dari Cloud API secara real-time.
 * Jika offline atau API tidak terjangkau, fallback ke local storage cache.
 */
export async function fetchTpaRegistrationsAsync(): Promise<{
  data: TpaRegistration[];
  source: "cloud" | "cache";
}> {
  try {
    // 1. Coba lewat Vercel Serverless Function /api/registrations
    const res = await fetch(CLOUD_API_PATH, {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        updateLocalCache(json.data);
        return { data: json.data, source: "cloud" };
      }
    }
  } catch {
    // Abaikan dan lanjut ke direct cloud fallback
  }

  // 2. Direct Cloud Fallback (untuk dev server localhost atau bila serverless rewrite belum aktif)
  const directData = await directUpstashGet();
  if (directData && Array.isArray(directData)) {
    updateLocalCache(directData);
    return { data: directData, source: "cloud" };
  }

  // 3. Fallback aman ke Local Cache
  return { data: getTpaRegistrations(), source: "cache" };
}

/**
 * Menyimpan formulir pendaftaran baru ke Cloud API.
 * Data disimpan secara terpusat agar bisa dilihat oleh Admin di mana saja.
 */
export async function saveTpaRegistrationAsync(
  data: Omit<TpaRegistration, "id" | "createdAt" | "status">
): Promise<TpaRegistration> {
  const current = getTpaRegistrations();
  const nextId = generateNextRegistrationId(current);
  const fallbackRecord: TpaRegistration = {
    ...data,
    id: nextId,
    createdAt: new Date().toISOString(),
    status: "Pending",
  };

  try {
    // 1. Coba Vercel API
    const res = await fetch(CLOUD_API_PATH, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        const updated = [json.data, ...current.filter((it) => it.id !== json.data.id)];
        updateLocalCache(updated);
        return json.data;
      }
    }
  } catch {
    // Coba direct REST fallback
  }

  // 2. Direct Cloud Fallback
  const cloudList = (await directUpstashGet()) || current;
  const directId = generateNextRegistrationId(cloudList);
  const cloudRecord: TpaRegistration = {
    ...data,
    id: directId,
    createdAt: new Date().toISOString(),
    status: "Pending",
  };
  const updatedList = [cloudRecord, ...cloudList];
  await directUpstashSet(updatedList);
  updateLocalCache(updatedList);
  return cloudRecord;
}

/**
 * Membersihkan seluruh data pendaftaran (Reset database)
 */
export async function clearAllRegistrationsAsync(): Promise<void> {
  updateLocalCache([]);
  await directUpstashSet([]);
}

/**
 * Memperbarui status pendaftaran (Pending <-> ACC) di cloud
 */
export async function updateTpaStatusAsync(
  id: string,
  newStatus: "Pending" | "ACC"
): Promise<TpaRegistration[]> {
  try {
    const res = await fetch(CLOUD_API_PATH, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: newStatus }),
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success) {
        // Refresh local cache
        const refreshed = await fetchTpaRegistrationsAsync();
        return refreshed.data;
      }
    }
  } catch {
    // Fallback
  }

  // Direct Cloud Fallback
  const cloudList = (await directUpstashGet()) || getTpaRegistrations();
  const updated = cloudList.map((item) =>
    item.id === id
      ? {
          ...item,
          status: newStatus,
          approvedAt: newStatus === "ACC" ? new Date().toISOString() : undefined,
        }
      : item
  );
  await directUpstashSet(updated);
  updateLocalCache(updated);
  return updated;
}

/**
 * Menghapus pendaftaran permanen dari cloud
 */
export async function deleteTpaPermanentlyAsync(id: string): Promise<TpaRegistration[]> {
  try {
    const res = await fetch(`${CLOUD_API_PATH}?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });

    if (res.ok) {
      const refreshed = await fetchTpaRegistrationsAsync();
      return refreshed.data;
    }
  } catch {
    // Fallback
  }

  // Direct Cloud Fallback
  const cloudList = (await directUpstashGet()) || getTpaRegistrations();
  const updated = cloudList.filter((item) => item.id !== id);
  await directUpstashSet(updated);
  updateLocalCache(updated);
  return updated;
}

/**
 * Import koleksi data pendaftaran murid (Backup restore)
 */
export async function importTpaRegistrations(items: TpaRegistration[]): Promise<boolean> {
  if (!Array.isArray(items) || items.length === 0) return false;
  updateLocalCache(items);
  await directUpstashSet(items);
  return true;
}

/**
 * Ekspor database lengkap dalam bentuk file JSON untuk cadangan DKM
 */
export function exportTpaToJson(data: TpaRegistration[]) {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: "application/json;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const dateStamp = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `Backup_Database_TPA_MJS_${dateStamp}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ──────────────────────────────────────────────────────────
   3. EXPORT EXCEL (CSV) RESMI DKM MJS
   Menggunakan UTF-8 BOM agar nama, karakter, & angka rapi di Excel
   ────────────────────────────────────────────────────────── */

export function exportTpaToCsv(data: TpaRegistration[]) {
  const headers = [
    "No",
    "ID Registrasi",
    "Tanggal Daftar",
    "Status",
    "Nama Lengkap Murid",
    "Nama Panggilan",
    "Jenis Kelamin",
    "Tempat Lahir",
    "Tanggal Lahir",
    "Usia (Tahun)",
    "Sekolah Asal",
    "Kelas",
    "Kemampuan Baca Al-Qur'an",
    "Program Pilihan",
    "Nama Ayah",
    "Nama Ibu",
    "Pekerjaan Orang Tua",
    "WhatsApp Wali Murid",
    "Alamat Lengkap",
    "Catatan Khusus",
    "Tanggal Disetujui (ACC)",
  ];

  const escapeCell = (val: string | number | null | undefined): string => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = data.map((item, idx) => {
    const formattedDate = new Date(item.createdAt).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    const formattedAccDate = item.approvedAt
      ? new Date(item.approvedAt).toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "-";

    return [
      idx + 1,
      item.id,
      formattedDate,
      item.status,
      item.namaLengkap,
      item.namaPanggilan,
      item.jenisKelamin,
      item.tempatLahir,
      item.tanggalLahir,
      item.usia,
      item.sekolahAsal,
      item.kelasSekolah,
      item.kemampuanNgaji,
      item.programPilihan,
      item.namaAyah,
      item.namaIbu,
      item.pekerjaanOrtu,
      item.whatsappOrtu,
      item.alamatRumah,
      item.catatanKhusus || "-",
      formattedAccDate,
    ]
      .map(escapeCell)
      .join(",");
  });

  // Tambahkan UTF-8 BOM (\uFEFF)
  const csvString = "\uFEFF" + [headers.map(escapeCell).join(","), ...rows].join("\r\n");
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const dateStamp = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `Data_Pendaftaran_TPA_MJS_${dateStamp}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ──────────────────────────────────────────────────────────
   4. EXPORT LAPORAN CETAK / PDF RESMI KOP SURAT TAKMIR MJS
   ────────────────────────────────────────────────────────── */

export function exportTpaToPdf(data: TpaRegistration[], filterStatus: string = "Semua") {
  const printWindow = window.open("", "_blank", "width=1200,height=800");
  if (!printWindow) {
    alert("Browser memblokir pop-up. Izinkan pop-up jendela untuk mencetak/menyimpan PDF.");
    return;
  }

  const currentDate = new Intl.DateTimeFormat("id-ID", {
    dateStyle: "full",
  }).format(new Date());

  const rowsHtml = data
    .map(
      (item, idx) => `
      <tr>
        <td style="text-align: center;">${idx + 1}</td>
        <td style="font-weight: 600; font-family: monospace;">${item.id}</td>
        <td>
          <div style="font-weight: 700; color: #064E3B;">${item.namaLengkap}</div>
          <div style="font-size: 8.5pt; color: #64748b;">Panggilan: ${item.namaPanggilan} (${item.jenisKelamin})</div>
        </td>
        <td>
          <div>${item.usia} Thn / ${item.kelasSekolah}</div>
          <div style="font-size: 8.5pt; color: #64748b;">${item.sekolahAsal || "-"}</div>
        </td>
        <td>
          <div style="font-weight: 700; color: #0f766e;">${item.programPilihan}</div>
          <div style="font-size: 8pt; color: #b45309; margin-top: 2px;">Kemampuan: ${item.kemampuanNgaji}</div>
        </td>
        <td>
          <div>Ayah: ${item.namaAyah || "-"}</div>
          <div>Ibu: ${item.namaIbu || "-"}</div>
          <div style="font-size: 8.5pt; color: #2563eb; font-weight: 600;">WA: ${item.whatsappOrtu}</div>
        </td>
        <td style="font-size: 8.5pt; max-width: 140px;">${item.alamatRumah || "-"}</td>
        <td style="text-align: center;">
          <span class="badge ${item.status === "ACC" ? "badge-acc" : "badge-pending"}">
            ${item.status}
          </span>
        </td>
      </tr>
    `
    )
    .join("");

  printWindow.document.write(`
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <title>Laporan_Pendaftaran_TPA_MJS_${new Date().toISOString().slice(0, 10)}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Plus Jakarta Sans', Arial, sans-serif;
      font-size: 9.5pt;
      color: #0f172a;
      background: #ffffff;
      padding: 30px 40px;
    }
    .kop-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 3px double #064E3B;
      padding-bottom: 14px;
      margin-bottom: 20px;
    }
    .kop-left {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .kop-logo {
      width: 70px;
      height: 70px;
      object-fit: contain;
    }
    .kop-title h1 {
      font-size: 15pt;
      font-weight: 800;
      color: #064E3B;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
    .kop-title h2 {
      font-size: 11pt;
      font-weight: 700;
      color: #C89B3C;
      margin-top: 2px;
    }
    .kop-title p {
      font-size: 8.5pt;
      color: #475569;
      margin-top: 2px;
    }
    .kop-right {
      text-align: right;
      font-size: 8.5pt;
      color: #475569;
    }
    .report-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 10px 16px;
      margin-bottom: 18px;
    }
    .report-meta-item {
      font-size: 9pt;
      color: #334155;
    }
    .report-meta-item strong {
      color: #064E3B;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
      font-size: 9pt;
    }
    th {
      background: #064E3B;
      color: #ffffff;
      padding: 9px 8px;
      font-weight: 700;
      font-size: 8.5pt;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      border: 1px solid #064E3B;
    }
    td {
      padding: 8px 8px;
      border: 1px solid #cbd5e1;
      vertical-align: top;
      line-height: 1.35;
    }
    tr:nth-child(even) td {
      background: #f8fafc;
    }
    .badge {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 9999px;
      font-size: 8pt;
      font-weight: 700;
      text-transform: uppercase;
    }
    .badge-acc {
      background: #dcfce7;
      color: #15803d;
      border: 1px solid #86efac;
    }
    .badge-pending {
      background: #fef3c7;
      color: #b45309;
      border: 1px solid #fcd34d;
    }
    .footer-sign {
      display: flex;
      justify-content: space-between;
      margin-top: 30px;
      page-break-inside: avoid;
    }
    .sign-box {
      text-align: center;
      width: 240px;
    }
    .sign-space {
      height: 70px;
    }
    .sign-name {
      font-weight: 700;
      text-decoration: underline;
      color: #0f172a;
    }
    .sign-role {
      font-size: 8.5pt;
      color: #64748b;
      margin-top: 2px;
    }
    @media print {
      body { padding: 15mm; }
      @page { size: landscape; margin: 10mm; }
      th { background-color: #064E3B !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .badge-acc { background-color: #dcfce7 !important; color: #15803d !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .badge-pending { background-color: #fef3c7 !important; color: #b45309 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <div class="kop-container">
    <div class="kop-left">
      <img src="/media/image/logo.png" alt="Logo MJS" class="kop-logo" onerror="this.style.display='none'" />
      <div class="kop-title">
        <h1>TPA MJS QUR'ANIC TECH</h1>
        <h2>MASJID JAMI SOSROHADISEWOYO NGAWI</h2>
        <p>Jl. Monginsidi No. 51, RT 011 / RW 002, Pelem II, Desa Pelem, Kecamatan Ngawi, Kabupaten Ngawi, Jawa Timur | Telp / WhatsApp: 087894416915</p>
      </div>
    </div>
    <div class="kop-right">
      <p><strong>Laporan Resmi</strong></p>
      <p>Data Pendaftaran Murid Baru</p>
      <p>Tahun Ajaran 2026/2027</p>
    </div>
  </div>

  <div class="report-meta">
    <div class="report-meta-item">
      Filter Status: <strong>${filterStatus}</strong>
    </div>
    <div class="report-meta-item">
      Total Murid: <strong>${data.length} Orang</strong>
    </div>
    <div class="report-meta-item">
      Tanggal Cetak: <strong>${currentDate}</strong>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width: 35px;">No</th>
        <th style="width: 100px;">ID Registrasi</th>
        <th>Nama Murid</th>
        <th style="width: 140px;">Usia & Sekolah</th>
        <th style="width: 190px;">Program & Shift</th>
        <th style="width: 180px;">Wali & Kontak</th>
        <th>Alamat</th>
        <th style="width: 80px;">Status</th>
      </tr>
    </thead>
    <tbody>
      ${rowsHtml || '<tr><td colspan="8" style="text-align:center;padding:20px;color:#94a3b8">Tidak ada data murid ditemukan.</td></tr>'}
    </tbody>
  </table>

  <div class="footer-sign">
    <div class="sign-box">
      <p>Mengetahui,</p>
      <p><strong>Ketua Takmir MJS</strong></p>
      <div class="sign-space"></div>
      <p class="sign-name">H. Supriyadi, M.Pd</p>
      <p class="sign-role">NIP. MJS-TM-2026</p>
    </div>
    <div class="sign-box">
      <p>Ngawi, ${currentDate}</p>
      <p><strong>Kepala TPA MJS Qur'anic Tech</strong></p>
      <div class="sign-space"></div>
      <p class="sign-name">Ustadz Kemal Thoriq</p>
      <p class="sign-role">Pembina TPA MJS</p>
    </div>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 400);
    };
  </script>
</body>
</html>
`);
  printWindow.document.close();
}
