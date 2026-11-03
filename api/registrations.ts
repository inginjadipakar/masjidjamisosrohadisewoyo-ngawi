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
  namaAyah: string;
  namaIbu: string;
  pekerjaanOrtu: string;
  whatsappOrtu: string;
  catatanKhusus?: string;
  status: "Pending" | "ACC";
  approvedAt?: string;
}

const INITIAL_SEED_DATA: TpaRegistration[] = [];


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

      // Generate nomor registrasi urut tahan bentrok
      let maxId = 0;
      for (const item of currentList) {
        const match = item.id?.match(/REG-TPA-(\d+)/);
        if (match) {
          const num = parseInt(match[1], 10);
          if (!isNaN(num) && num > maxId) maxId = num;
        }
      }
      const nextNum = String(maxId + 1).padStart(3, "0");
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
