// Vercel Serverless Function: /api/registrations
// Handles CRUD operations for TPA MJS Qur'anic Tech student registrations.
// Persists data in Upstash Redis REST datastore with resilient fallbacks.

const UPSTASH_URL =
  process.env.UPSTASH_REDIS_REST_URL ||
  "https://glad-honeybee-171670.upstash.io";

const UPSTASH_TOKEN =
  process.env.UPSTASH_REDIS_REST_TOKEN ||
  "gQAAAAAAAp6WAAIgcDIwMGM0YWMxNjcyY2E0ODk2YTM0NWJmMDcwOGYyYWIyNg";

const REDIS_KEY = "mjs:tpa:registrations_v1";

interface TpaRegistration {
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
  approvedAt?: string;
}

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

async function redisGetRegistrations(): Promise<TpaRegistration[]> {
  const res = await fetch(`${UPSTASH_URL}/get/${encodeURIComponent(REDIS_KEY)}`, {
    headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
  });
  if (!res.ok) {
    throw new Error(`Upstash GET failed: ${res.statusText}`);
  }
  const data = await res.json();
  if (!data.result) {
    // Seed initial data
    await redisSetRegistrations(INITIAL_SEED_DATA);
    return INITIAL_SEED_DATA;
  }
  try {
    return typeof data.result === "string" ? JSON.parse(data.result) : data.result;
  } catch {
    return INITIAL_SEED_DATA;
  }
}

async function redisSetRegistrations(items: TpaRegistration[]): Promise<void> {
  const bodyStr = JSON.stringify(items);
  const res = await fetch(`${UPSTASH_URL}/set/${encodeURIComponent(REDIS_KEY)}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${UPSTASH_TOKEN}`,
      "Content-Type": "text/plain",
    },
    body: bodyStr,
  });
  if (!res.ok) {
    throw new Error(`Upstash SET failed: ${res.statusText}`);
  }
}

export default async function handler(req: any, res: any) {
  // Setup CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  try {
    // GET: Ambil seluruh pendaftaran
    if (req.method === "GET") {
      const records = await redisGetRegistrations();
      return res.status(200).json({ success: true, data: records });
    }

    // POST: Simpan pendaftaran baru
    if (req.method === "POST") {
      const payload = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      if (!payload || !payload.namaLengkap || !payload.whatsappOrtu) {
        return res.status(400).json({
          success: false,
          error: "Nama Lengkap dan Nomor WhatsApp wajib diisi.",
        });
      }

      const currentList = await redisGetRegistrations();

      // Generate nomor registrasi urut
      const nextNum = String(currentList.length + 1).padStart(3, "0");
      const newRecord: TpaRegistration = {
        ...payload,
        id: `REG-TPA-${nextNum}`,
        createdAt: new Date().toISOString(),
        status: "Pending",
      };

      const updated = [newRecord, ...currentList];
      await redisSetRegistrations(updated);

      return res.status(201).json({ success: true, data: newRecord });
    }

    // PATCH: Update status pendaftaran (Pending <-> ACC)
    if (req.method === "PATCH") {
      const payload = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      const { id, status } = payload || {};

      if (!id || !status) {
        return res.status(400).json({ success: false, error: "ID dan status wajib disertakan." });
      }

      const currentList = await redisGetRegistrations();
      const updated = currentList.map((item) =>
        item.id === id
          ? {
              ...item,
              status,
              approvedAt: status === "ACC" ? new Date().toISOString() : undefined,
            }
          : item
      );

      await redisSetRegistrations(updated);
      const found = updated.find((it) => it.id === id);
      return res.status(200).json({ success: true, data: found });
    }

    // DELETE: Hapus data pendaftaran
    if (req.method === "DELETE") {
      const id = req.query?.id || (typeof req.body === "string" ? JSON.parse(req.body || "{}").id : req.body?.id);
      if (!id) {
        return res.status(400).json({ success: false, error: "ID registrasi wajib disertakan." });
      }

      const currentList = await redisGetRegistrations();
      const updated = currentList.filter((item) => item.id !== id);
      await redisSetRegistrations(updated);

      return res.status(200).json({ success: true, message: `Data ${id} berhasil dihapus.` });
    }

    return res.status(405).json({ success: false, error: "Method not allowed" });
  } catch (error: any) {
    console.error("API /api/registrations error:", error);
    return res.status(500).json({
      success: false,
      error: error?.message || "Internal Server Error",
    });
  }
}
