# 🛡️ Daftar Larangan & Protokol Anti-Slop (Bima Wicaksana)

## 1. Daftar Pola Terlarang (Instant Rejection List)

| Pola AI Slop (DILARANG ❌) | Mengapa Ditolak? | Solusi Benar (DISETUJUI ✅) |
| :--- | :--- | :--- |
| **Gradasi Ungu ke Nila** (`from-indigo-500 to-purple-600`) | Refleks klise AI paling umum di dunia. Membuat produk terlihat murahan. | Gunakan palet warna yang mewakili produk (misal: emerald/gold untuk masjid, earthy brown/green untuk peternakan). |
| **3 Kartu Identik dengan Icon Melayang** | Pola kemalasan layout SaaS paling basi. | Rancang layout editorial: kartu berukuran dinamis, asimetris, atau bento-grid fungsional. |
| **Glassmorphism Berlebihan** (`backdrop-blur-md` berlapis-lapis) | Menurunkan keterbacaan teks dan membebani performa GPU browser. | Gunakan solid surface bersih atau translucent background sangat halus hanya pada sticky navbar. |
| **Tombol Tanpa Focus Ring** | Melanggar aksesibilitas pengguna disabilitas dan keyboard. | Wajib menyertakan `focus-visible:ring-2 focus-visible:ring-offset-2`. |
| **Copywriting Generik AI** (*"Unlock the next-gen power..."*) | Terbaca palsu dan tidak menyampaikan manfaat produk nyata. | Tulis kalimat langsung, to the point, dan membumi dalam bahasa Indonesia yang baik. |

## 2. Checklist 8 Status Interaksi Wajib
Setiap tombol, input, dan link harus memiliki implementasi CSS berikut:
- [ ] `default`: Keadaan normal.
- [ ] `hover`: Perubahan warna / shadow halus saat didekati kursor.
- [ ] `focus-visible`: Garis ring yang kontras saat navigasi keyboard `Tab`.
- [ ] `active`: Animasi penekanan mikro (`scale-[0.98]`).
- [ ] `loading / skeleton`: Placeholder saat menunggu respon server.
- [ ] `empty`: Tampilan bersih saat data belum tersedia.
- [ ] `error`: Indikator merah / border tegas saat input tidak valid.
- [ ] `disabled`: Opacity 50%, kursor `not-allowed`.
