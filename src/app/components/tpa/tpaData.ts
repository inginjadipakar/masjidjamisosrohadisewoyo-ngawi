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
  jadwalShift: "Shift Sore (15.45 - 17.00 WIB)" | "Shift Maghrib (18.15 - 19.30 WIB)";
  namaAyah: string;
  namaIbu: string;
  pekerjaanOrtu: string;
  whatsappOrtu: string;
  catatanKhusus?: string;
  status: "Pending" | "ACC";
}

const STORAGE_KEY = "mjs_tpa_registrations_v1";

// Mock data awal jika belum ada data sama sekali di browser
const INITIAL_SEED_DATA: TpaRegistration[] = [
  {
    id: "REG-TPA-001",
    createdAt: "2026-11-01T08:30:00.000Z",
    namaLengkap: "Muhammad Faiz Al-Fatih",
    namaPanggilan: "Faiz",
    tempatLahir: "Ngawi",
    tanggalLahir: "2018-05-14",
    jenisKelamin: "Laki-laki",
    usia: 8,
    sekolahAsal: "SDIT Al-Ihsan Ngawi",
    kelasSekolah: "Kelas 2",
    alamatRumah: "Jl. Trunojoyo No. 45, RT 02/RW 03, Ngawi",
    kemampuanNgaji: "Iqro Jilid 4-6",
    programPilihan: "Tahsin Tajwid & Qur'anic Tech Kids",
    jadwalShift: "Shift Sore (15.45 - 17.00 WIB)",
    namaAyah: "Budi Santoso",
    namaIbu: "Siti Rahmawati",
    pekerjaanOrtu: "Wiraswasta",
    whatsappOrtu: "081234567890",
    catatanKhusus: "Sangat antusias dengan animasi cerita nabi di komputer",
    status: "ACC",
  },
  {
    id: "REG-TPA-002",
    createdAt: "2026-11-01T13:15:00.000Z",
    namaLengkap: "Aisyah Nur Salsabila",
    namaPanggilan: "Aisyah",
    tempatLahir: "Madiun",
    tanggalLahir: "2019-09-20",
    jenisKelamin: "Perempuan",
    usia: 7,
    sekolahAsal: "MIN 1 Ngawi",
    kelasSekolah: "Kelas 1",
    alamatRumah: "Perumahan Griya Indah Asri Blok C-12, Ngawi",
    kemampuanNgaji: "Iqro Jilid 1-3",
    programPilihan: "Tahfidz Juz 30 & Adab Digital Murid",
    jadwalShift: "Shift Sore (15.45 - 17.00 WIB)",
    namaAyah: "Ahmad Zainuddin",
    namaIbu: "Dewi Lestari",
    pekerjaanOrtu: "PNS",
    whatsappOrtu: "085678901234",
    catatanKhusus: "Pemalu di awal, senang menggambar",
    status: "Pending",
  },
  {
    id: "REG-TPA-003",
    createdAt: "2026-11-02T09:40:00.000Z",
    namaLengkap: "Kenzi Rayyan Pratama",
    namaPanggilan: "Kenzi",
    tempatLahir: "Ngawi",
    tanggalLahir: "2017-11-08",
    jenisKelamin: "Laki-laki",
    usia: 9,
    sekolahAsal: "SDN Karangasri 1",
    kelasSekolah: "Kelas 3",
    alamatRumah: "Dusun Krajan, Desa Beran, Kec. Ngawi",
    kemampuanNgaji: "Al-Qur'an Lancar",
    programPilihan: "Qur'anic Tech & Multimedia Islami",
    jadwalShift: "Shift Maghrib (18.15 - 19.30 WIB)",
    namaAyah: "Rudi Hermawan",
    namaIbu: "Nurul Hidayah",
    pekerjaanOrtu: "Karyawan Swasta",
    whatsappOrtu: "087812345678",
    catatanKhusus: "Sudah hafal Juz 30 separuh",
    status: "Pending",
  },
];

export function getTpaRegistrations(): TpaRegistration[] {
  if (typeof window === "undefined") return INITIAL_SEED_DATA;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SEED_DATA));
      return INITIAL_SEED_DATA;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error("Gagal membaca pendaftaran TPA dari localStorage:", e);
    return INITIAL_SEED_DATA;
  }
}

export function saveTpaRegistration(data: Omit<TpaRegistration, "id" | "createdAt" | "status">): TpaRegistration {
  const current = getTpaRegistrations();
  const idNumber = String(current.length + 1).padStart(3, "0");
  const newRecord: TpaRegistration = {
    ...data,
    id: `REG-TPA-${idNumber}`,
    createdAt: new Date().toISOString(),
    status: "Pending",
  };
  const updated = [newRecord, ...current];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error("Gagal menyimpan ke localStorage:", e);
  }
  return newRecord;
}

export function updateTpaStatus(id: string, newStatus: "Pending" | "ACC"): TpaRegistration[] {
  const current = getTpaRegistrations();
  const updated = current.map((item) => (item.id === id ? { ...item, status: newStatus } : item));
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error("Gagal update status:", e);
  }
  return updated;
}

export function deleteTpaPermanently(id: string): TpaRegistration[] {
  const current = getTpaRegistrations();
  const updated = current.filter((item) => item.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error("Gagal menghapus data:", e);
  }
  return updated;
}

/* ──────────────────────────────────────────────────────────
   EXPORT TECH SAMA PERSIS DENGAN PROJECT C:\Users\HP\Desktop\Coding\absensi
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
    "Usia",
    "Sekolah Asal",
    "Kelas",
    "Kemampuan Baca Al-Qur'an",
    "Program Pilihan",
    "Jadwal Shift",
    "Nama Ayah",
    "Nama Ibu",
    "Pekerjaan Orang Tua",
    "WhatsApp Wali Murid",
    "Alamat Lengkap",
    "Catatan Khusus",
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
      item.jadwalShift,
      item.namaAyah,
      item.namaIbu,
      item.pekerjaanOrtu,
      item.whatsappOrtu,
      item.alamatRumah,
      item.catatanKhusus || "-",
    ]
      .map(escapeCell)
      .join(",");
  });

  // Tambahkan UTF-8 BOM (\uFEFF) agar dibuka di Microsoft Excel huruf dan formatnya sempurna
  const csvString = "\uFEFF" + [headers.map(escapeCell).join(","), ...rows].join("\r\n");
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const dateStamp = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `Data_Pendaftaran_TPA_MJS_QURANIC_TECH_${dateStamp}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

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
        <td style="font-weight: 600;">${item.id}</td>
        <td>
          <div style="font-weight: 700; color: #064E3B;">${item.namaLengkap}</div>
          <div style="font-size: 8.5pt; color: #64748b;">Panggilan: ${item.namaPanggilan} (${item.jenisKelamin})</div>
        </td>
        <td>
          <div>${item.usia} Thn / ${item.kelasSekolah}</div>
          <div style="font-size: 8.5pt; color: #64748b;">${item.sekolahAsal}</div>
        </td>
        <td>
          <div style="font-weight: 600;">${item.kemampuanNgaji}</div>
          <div style="font-size: 8.5pt; color: #0f766e;">${item.jadwalShift}</div>
        </td>
        <td>
          <div>Ayah: ${item.namaAyah}</div>
          <div>Ibu: ${item.namaIbu}</div>
          <div style="font-size: 8.5pt; color: #2563eb; font-weight: 600;">WA: ${item.whatsappOrtu}</div>
        </td>
        <td style="font-size: 8.5pt; max-width: 140px;">${item.alamatRumah}</td>
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
        <th style="width: 170px;">Program & Shift</th>
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
