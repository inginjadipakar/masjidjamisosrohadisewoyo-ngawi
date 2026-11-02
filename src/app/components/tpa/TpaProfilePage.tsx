import { useState, useRef } from "react";
import {
  BookOpen,
  Sparkles,
  ArrowRight,
  Send,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle2,
  Calendar,
  User,
  GraduationCap,
  Laptop,
  Heart,
  ChevronRight,
  ChevronLeft,
  Search,
  ExternalLink,
  MessageCircle,
  Play,
  Volume2,
  Menu,
  X,
} from "lucide-react";
import { saveTpaRegistration } from "./tpaData";
import {
  IconTahsin3D,
  IconTahfidz3D,
  IconTech3D,
  IconAdab3D,
  IconAmati3D,
  IconCoba3D,
  IconTanya3D,
  IconTemukan3D,
  JumboBoyCharacter,
  JumboGirlCharacter,
  JumboFeatureGroupScene,
} from "./TpaVisualAssets";

interface TpaProfilePageProps {
  onBackToHome: () => void;
  onNavigateToAdmin?: () => void;
}

export default function TpaProfilePage({ onBackToHome, onNavigateToAdmin }: TpaProfilePageProps) {
  // Hero Carousel State
  const [activeHeroIdx, setActiveHeroIdx] = useState(0);
  const heroImages = [
    {
      title: "TPA MJS Qur'anic Tech — Masjid Jami Sosrohadisewoyo",
      subtitle:
        "Mendidik murid cilik Ngawi agar fasih bertilawah dengan tajwid bersanad, gemar menghafal Al-Qur'an, dan berakhlak mulia di era digital.",
      image: "/media/image/aula.jpg",
    },
    {
      title: "Pendidikan Al-Qur'an & Literasi Digital Murid di Ngawi",
      subtitle:
        "Memadukan keindahan tartil Rasm Utsmani dengan kecakapan berpikir logis dan adab bermedia sejak usia dini.",
      image: "/media/image/bg/bg (3).jpeg",
    },
    {
      title: "Taman Belajar Asri & Ramah Anak di Serambi Masjid",
      subtitle:
        "Didampingi langsung oleh asatidz bersanad dan mentor IT muslim dengan metode santun yang dicintai anak-anak.",
      image: "/media/image/baitullah.png",
    },
  ];

  // Mobile drawer state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Search input state in navbar
  const [navSearch, setNavSearch] = useState("");
  const [activeNavTab, setActiveNavTab] = useState<"home" | "profil" | "visi-misi" | "fasilitas" | "galeri" | "kontak">("profil");

  // Form State
  const [formData, setFormData] = useState({
    namaLengkap: "",
    namaPanggilan: "",
    tempatLahir: "",
    tanggalLahir: "",
    jenisKelamin: "Laki-laki" as "Laki-laki" | "Perempuan",
    usia: 7,
    sekolahAsal: "",
    kelasSekolah: "Kelas 1",
    alamatRumah: "",
    kemampuanNgaji: "Iqro Jilid 1-3" as "Belum Bisa" | "Iqro Jilid 1-3" | "Iqro Jilid 4-6" | "Al-Qur'an Lancar",
    programPilihan: "Tahsin Tajwid & Qur'anic Tech Kids",
    jadwalShift: "Shift Sore (15.45 - 17.00 WIB)" as "Shift Sore (15.45 - 17.00 WIB)" | "Shift Maghrib (18.15 - 19.30 WIB)",
    namaAyah: "",
    namaIbu: "",
    pekerjaanOrtu: "",
    whatsappOrtu: "",
    catatanKhusus: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successModal, setSuccessModal] = useState<string | null>(null);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "usia" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.namaLengkap.trim() || !formData.whatsappOrtu.trim()) {
      alert("Mohon lengkapi Nama Lengkap Murid dan Nomor WhatsApp Wali Murid.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Simpan ke sistem (localStorage) dengan status Pending
      const saved = saveTpaRegistration(formData);

      // 2. Format pesan WhatsApp rapi ke Admin: 087894416915
      const adminWa = "6287894416915";
      const waMessage =
        `*PENDAFTARAN MURID BARU TPA MJS QUR'ANIC TECH*\n` +
        `-----------------------------------------\n` +
        `*No. Registrasi:* ${saved.id}\n` +
        `*Waktu Daftar:* ${new Date().toLocaleDateString("id-ID", { dateStyle: "full" })}\n\n` +
        `*DATA CALON MURID:*\n` +
        `• Nama Lengkap: *${formData.namaLengkap}*\n` +
        `• Nama Panggilan: ${formData.namaPanggilan || "-"}\n` +
        `• Tempat/Tgl Lahir: ${formData.tempatLahir || "-"}, ${formData.tanggalLahir || "-"}\n` +
        `• Jenis Kelamin: ${formData.jenisKelamin}\n` +
        `• Usia: ${formData.usia} Tahun\n` +
        `• Sekolah Asal: ${formData.sekolahAsal || "-"} (${formData.kelasSekolah || "-"})\n` +
        `• Kemampuan Ngaji: *${formData.kemampuanNgaji}*\n\n` +
        `*DATA ORANG TUA / WALI:*\n` +
        `• Nama Ayah: ${formData.namaAyah || "-"}\n` +
        `• Nama Ibu: ${formData.namaIbu || "-"}\n` +
        `• Pekerjaan: ${formData.pekerjaanOrtu || "-"}\n` +
        `• No. WhatsApp: ${formData.whatsappOrtu}\n` +
        `• Alamat Rumah: ${formData.alamatRumah || "-"}\n` +
        `• Catatan Khusus: ${formData.catatanKhusus || "-"}\n\n` +
        `-----------------------------------------\n` +
        `*Pesan Pengirim:* Mohon informasi verifikasi pendaftaran dan orientasi murid baru nggih Ustadz/Admin. Terima kasih banyak.`;

      const waUrl = `https://wa.me/${adminWa}?text=${encodeURIComponent(waMessage)}`;

      // Buka tab WhatsApp
      window.open(waUrl, "_blank", "noopener,noreferrer");

      setSuccessModal(saved.id);
      setIsSubmitting(false);

      // Reset form ringan
      setFormData({
        namaLengkap: "",
        namaPanggilan: "",
        tempatLahir: "",
        tanggalLahir: "",
        jenisKelamin: "Laki-laki",
        usia: 7,
        sekolahAsal: "",
        kelasSekolah: "Kelas 1",
        alamatRumah: "",
        kemampuanNgaji: "Iqro Jilid 1-3",
        programPilihan: "Tahsin Tajwid & Qur'anic Tech Kids",
        jadwalShift: "Shift Sore (15.45 - 17.00 WIB)",
        namaAyah: "",
        namaIbu: "",
        pekerjaanOrtu: "",
        whatsappOrtu: "",
        catatanKhusus: "",
      });
    } catch (err) {
      console.error(err);
      alert("Terjadi kendala saat menyimpan. Silakan coba lagi atau hubungi admin via WhatsApp langsung.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans selection:bg-[#0F766E] selection:text-white">
      {/* ──────────────────────────────────────────────────────────
          1. HEADER / NAVBAR PERSIS REFERENSI
          (Putih bersih, logo lingkaran di tengah gantung ke hero, link kiri & kanan, search pill)
         ────────────────────────────────────────────────────────── */}
      <header className="relative z-40 bg-white shadow-sm border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 relative">
            {/* Navigasi Kiri */}
            <nav className="hidden md:flex items-center space-x-6 lg:space-x-8 text-xs font-bold tracking-wider uppercase">
              <button
                onClick={() => {
                  setActiveNavTab("home");
                  onBackToHome();
                }}
                className={`py-2 transition-colors cursor-pointer ${
                  activeNavTab === "home" ? "text-[#0F766E] border-b-2 border-[#0F766E]" : "text-slate-600 hover:text-[#0F766E]"
                }`}
              >
                HOME
              </button>
              <button
                onClick={() => {
                  setActiveNavTab("profil");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`py-2 transition-colors cursor-pointer ${
                  activeNavTab === "profil" ? "text-[#0F766E] border-b-2 border-[#0F766E]" : "text-slate-600 hover:text-[#0F766E]"
                }`}
              >
                PROFIL
              </button>
              <a
                href="#visi-misi"
                onClick={() => setActiveNavTab("visi-misi")}
                className={`py-2 transition-colors ${
                  activeNavTab === "visi-misi" ? "text-[#0F766E] border-b-2 border-[#0F766E]" : "text-slate-600 hover:text-[#0F766E]"
                }`}
              >
                VISI MISI
              </a>
              <a
                href="#kurikulum"
                onClick={() => setActiveNavTab("fasilitas")}
                className={`py-2 transition-colors ${
                  activeNavTab === "fasilitas" ? "text-[#0F766E] border-b-2 border-[#0F766E]" : "text-slate-600 hover:text-[#0F766E]"
                }`}
              >
                FASILITAS
              </a>
            </nav>

            {/* Mobile Hamburger Button */}
            <div className="flex md:hidden items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle navigation menu"
                className="p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 active:scale-95 transition-all"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* LOGO TENGAH LINGKARAN MENGGANTUNG PERSIS REFERENSI GAMBAR */}
            <div className="absolute left-1/2 -translate-x-1/2 top-2 z-50">
              <div
                onClick={() => onBackToHome()}
                className="group w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-[#C89B3C] p-1.5 bg-white shadow-2xl flex items-center justify-center transform group-hover:scale-105 transition-all cursor-pointer"
                title="Masjid Jami Sosrohadisewoyo"
              >
                <img
                  src="/media/image/logo.png"
                  alt="Logo Yayasan / Masjid Jami Sosrohadisewoyo"
                  className="w-full h-full object-contain rounded-full"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              </div>
            </div>

            {/* Navigasi Kanan & Search Bar Pill Persis Gambar */}
            <div className="flex items-center space-x-5 lg:space-x-7">
              <nav className="hidden md:flex items-center space-x-6 lg:space-x-8 text-xs font-bold tracking-wider uppercase">
                <a
                  href="#kidcamp"
                  className="text-slate-600 hover:text-[#0F766E] py-2 transition-colors"
                >
                  GALERI
                </a>
                <a
                  href="#kontak"
                  onClick={() => setActiveNavTab("kontak")}
                  className="text-slate-600 hover:text-[#0F766E] py-2 transition-colors"
                >
                  KONTAK
                </a>
              </nav>

              {/* Search Pill Input persis screenshot */}
              <div className="relative hidden sm:block">
                <input
                  type="text"
                  placeholder="Ketik di sini ..."
                  value={navSearch}
                  onChange={(e) => setNavSearch(e.target.value)}
                  className="w-36 lg:w-44 pl-3.5 pr-8 py-1.5 text-xs rounded-full border border-slate-200 focus:outline-none focus:border-[#0F766E] transition-all bg-white placeholder:text-slate-400"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Tombol Daftar Cepat */}
              <button
                onClick={scrollToForm}
                className="bg-[#0F766E] hover:bg-[#0d645e] active:scale-95 text-white text-xs font-bold px-4 py-2 rounded-full transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#C89B3C]" />
                <span>DAFTAR</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-5 pt-3 pb-6 space-y-3 shadow-lg">
            <button
              onClick={() => {
                setActiveNavTab("home");
                setMobileMenuOpen(false);
                onBackToHome();
              }}
              className="block w-full text-left py-2 px-3 text-sm font-semibold text-slate-700 hover:bg-teal-50 rounded-lg"
            >
              Home (Beranda Utama)
            </button>
            <a
              href="#visi-misi"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-left py-2 px-3 text-sm font-semibold text-slate-700 hover:bg-teal-50 rounded-lg"
            >
              Tentang Kami & Profil
            </a>
            <a
              href="#kurikulum"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-left py-2 px-3 text-sm font-semibold text-slate-700 hover:bg-teal-50 rounded-lg"
            >
              4 Pilar Kurikulum Murid
            </a>
            <a
              href="#kidcamp"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-left py-2 px-3 text-sm font-semibold text-slate-700 hover:bg-teal-50 rounded-lg"
            >
              KidCamp Belajar Seru
            </a>
            <a
              href="#kontak"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-left py-2 px-3 text-sm font-semibold text-slate-700 hover:bg-teal-50 rounded-lg"
            >
              Kontak & Lokasi Masjid
            </a>
            <div className="pt-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  scrollToForm();
                }}
                className="w-full bg-[#0F766E] text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md"
              >
                <Sparkles className="w-4 h-4 text-[#C89B3C]" />
                <span>Formulir Pendaftaran Online</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ──────────────────────────────────────────────────────────
          2. HERO SLIDER PERSIS GAMBAR REFERENSI
          (Bangunan megah berwibawa, judul bold putih di kiri bawah, dots tengah)
         ────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-slate-900 min-h-[460px] sm:min-h-[520px] lg:min-h-[560px] flex items-end">
        {/* Background Building Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImages[activeHeroIdx].image}
            alt="Bangunan Masjid Jami Sosrohadisewoyo"
            className="w-full h-full object-cover transition-opacity duration-1000 scale-102"
          />
          {/* Subtle gradient overlay to ensure text readability like reference */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-slate-950/20" />
        </div>

        {/* Hero Title & Subtitle di Kiri Bawah Persis Referensi */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-32 w-full">
          <div className="max-w-2xl text-white">
            <h1
              className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-3 leading-tight drop-shadow-md"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {heroImages[activeHeroIdx].title}
            </h1>
            <p className="text-slate-100 text-xs sm:text-sm lg:text-base leading-relaxed font-light drop-shadow max-w-xl">
              {heroImages[activeHeroIdx].subtitle}
            </p>
          </div>
        </div>

        {/* Carousel Navigation Arrows persis screenshot */}
        <button
          onClick={() => setActiveHeroIdx((prev) => (prev === 0 ? heroImages.length - 1 : prev - 1))}
          aria-label="Slide sebelumnya"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 text-white/80 hover:text-white transition-colors cursor-pointer text-2xl"
        >
          ❮
        </button>
        <button
          onClick={() => setActiveHeroIdx((prev) => (prev === heroImages.length - 1 ? 0 : prev + 1))}
          aria-label="Slide berikutnya"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 text-white/80 hover:text-white transition-colors cursor-pointer text-2xl"
        >
          ❯
        </button>

        {/* Dots Tengah Bawah persis screenshot */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {heroImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveHeroIdx(i)}
              aria-label={`Slide ke-${i + 1}`}
              className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                activeHeroIdx === i ? "bg-white scale-125" : "bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          3. BAR TEAL: "Dapatkan Update Berita Terbaru Kami"
          (Latar hijau toska / sage green dengan mandala pattern di kanan persis referensi)
         ────────────────────────────────────────────────────────── */}
      <section className="relative bg-[#0F766E] text-white pt-8 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Geometric Islamic Mandala Watermark di kanan persis gambar */}
        <div className="absolute right-0 top-0 bottom-0 w-96 opacity-15 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-200 via-transparent to-transparent" />

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div>
            <h3 className="font-bold text-base sm:text-xl text-white tracking-wide">
              Dapatkan Update Berita Terbaru Kami
            </h3>
            <p className="text-teal-100 text-xs sm:text-sm mt-1 font-light">
              Informasi kegiatan murid, agenda kajian wali murid, dan pengumuman TPA MJS Ngawi.
            </p>
          </div>

          {/* Input Box Pill persis screenshot */}
          <div className="flex items-center w-full md:w-auto max-w-md gap-2">
            <input
              type="text"
              placeholder="*your_emailhere@email.com / No. WA"
              className="flex-1 bg-white/20 border border-white/40 text-white placeholder:text-teal-100 text-xs sm:text-sm rounded-full px-5 py-2.5 focus:outline-none focus:bg-white/30 transition-all min-h-[44px]"
            />
            <button
              onClick={() => alert("Alhamdulillah! Nomor Anda telah terdaftar dalam siaran informasi TPA MJS.")}
              className="bg-white hover:bg-teal-50 active:scale-95 text-[#0F766E] font-bold text-xs sm:text-sm px-6 py-2.5 rounded-full transition-all cursor-pointer shadow-md flex-shrink-0 min-h-[44px]"
            >
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          4. THE ICONIC KUBAH/DOME ARCH TRANSITION KE "Tentang Kami ..."
          (Lengkungan Kubah Putih dengan Ilustrasi 3D Rehal & Al-Qur'an di Kanan Atas Kubah!)
         ────────────────────────────────────────────────────────── */}
      <div className="relative -mt-16 sm:-mt-20 z-20 pointer-events-none">
        <svg viewBox="0 0 1440 140" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-24 sm:h-36 block">
          <path d="M0,140 L0,70 Q280,70 420,35 Q560,0 720,0 Q880,0 1020,35 Q1160,70 1440,70 L1440,140 Z" fill="#ffffff" />
        </svg>
      </div>

      <section id="visi-misi" className="relative pb-16 bg-white -mt-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">

          {/* ILUSTRASI 3D REHAL AL-QUR'AN DI PUNDAK KUBAH PERSIS GAMBAR REFERENSI (CUTOUT TRANSPARAN TANPA FRAME KOTAK) */}
          <div className="absolute right-4 sm:right-12 -top-16 sm:-top-28 z-30 pointer-events-auto">
            <div className="relative w-28 h-28 sm:w-40 sm:h-40 flex items-center justify-center animate-jumbo-float">
              {/* Piringan kuning lembut bersinar persis ilustrasi referensi */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-300/80 via-yellow-200/90 to-amber-100/90 shadow-xl" />
              <img
                src="/media/tpa/icon_3d_tahsin.png"
                alt="Al-Qur'an di Atas Rehal 3D"
                className="w-20 h-20 sm:w-28 sm:h-28 object-contain relative z-10 filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.18)]"
              />
              {/* Bulan sabit emas & bintang melayang */}
              <div className="absolute -top-1 -right-1 bg-amber-400 text-slate-950 p-2 rounded-full shadow-lg text-xs sm:text-base animate-jumbo-bounce">
                🌙
              </div>
              <div className="absolute bottom-1 -left-2 bg-[#0F766E] text-white px-2.5 py-1 rounded-full shadow-md text-[10px] font-bold tracking-wide">
                MJS EDUKASI
              </div>
            </div>
          </div>

          {/* Judul "Tentang Kami ..." Font Biru/Toska Cantik Bergelombang Persis Gambar */}
          <div className="text-center max-w-3xl mx-auto mb-10 pt-4">
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F766E] mb-6"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Tentang Kami ...
            </h2>

            {/* Paragraf Keterangan Rapi & Tertata */}
            <p className="text-slate-600 text-xs sm:text-sm lg:text-base leading-relaxed text-justify sm:text-center font-normal">
              <strong>TPA MJS Qur'anic Tech</strong> adalah unit pendidikan Al-Qur'an non-formal di bawah naungan
              Dewan Kemakmuran Masjid Jami Sosrohadisewoyo, Jl. Monginsidi No. 51, RT 011 / RW 002, Pelem II, Desa Pelem, Kecamatan Ngawi, Kabupaten Ngawi, Jawa Timur. Kami hadir untuk menanamkan
              akar Al-Qur'an yang kokoh di dada generasi penerus bangsa sejak dini. Dengan bimbingan para asatidz yang
              berpengalaman dan menguasai sanad tajwid rasm Utsmani, murid dibimbing membaca tartil, menghafal juz 30,
              serta dibekali adab islami dan literasi teknologi yang sehat dan terarah.
            </p>
          </div>

          {/* Video Showcase Card Persis Gambar (Rounded Frame dengan Tombol Play Tengah) */}
          <div className="max-w-3xl mx-auto rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-slate-900 relative group mb-16">
            <div className="aspect-video w-full relative flex items-center justify-center">
              <img
                src="/media/image/bg/bg (1).jpeg"
                alt="Video Profil Pembelajaran Murid TPA MJS"
                className={`w-full h-full object-cover transition-transform duration-700 ${
                  videoPlaying ? "opacity-30" : "opacity-85 group-hover:scale-102"
                }`}
              />

              {!videoPlaying ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-slate-950/30">
                  <button
                    onClick={() => setVideoPlaying(true)}
                    aria-label="Putar Video Profil"
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/95 hover:bg-white active:scale-95 text-[#0F766E] shadow-2xl flex items-center justify-center transform hover:scale-110 transition-all cursor-pointer mb-3"
                  >
                    <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current ml-1" />
                  </button>
                  <span className="text-white font-bold text-sm sm:text-base tracking-wide uppercase drop-shadow">
                    Profil TPA MJS Qur'anic Tech Ngawi
                  </span>
                  <span className="text-teal-200 text-xs mt-1">Klik untuk memutar video dokumentasi murid</span>
                </div>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/95 p-8 text-center text-white">
                  <CheckCircle2 className="w-12 h-12 text-[#6EE7B7] mx-auto mb-3" />
                  <h4 className="font-bold text-base mb-2">Dokumentasi Belajar Murid MJS</h4>
                  <p className="text-slate-300 text-xs mb-4 max-w-md">
                    Pembelajaran talaqqi tatap muka, setoran hafalan harian di serambi masjid, dan kelas literasi digital anak.
                  </p>
                  <button
                    onClick={() => setVideoPlaying(false)}
                    className="bg-[#C89B3C] text-slate-950 font-bold text-xs px-5 py-2 rounded-full cursor-pointer hover:bg-[#b3882f]"
                  >
                    Tutup Pratinjau
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Garis Pembatas Halus Persis Referensi */}
          <div className="border-t border-slate-200 w-full mb-16" />

          {/* ──────────────────────────────────────────────────────────
              5. SECTION PRAKATA KEPALA SEKOLAH PERSIS REFERENSI
              (Foto portrait sudut melengkung hijau di kiri, teks kutipan di kanan)
             ────────────────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center mb-16">
            {/* Foto Portrait Sudut Membulat Halus persis referensi */}
            <div className="md:col-span-5 flex justify-center">
              <div className="relative">
                <div className="w-60 h-72 sm:w-68 sm:h-80 rounded-[32px] overflow-hidden shadow-xl border-4 border-white bg-emerald-900">
                  <img
                    src="/media/tpa/ustadz_kemal_thoriq.png"
                    alt="Ustadz Kemal Thoriq - Kepala TPA MJS"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                {/* Tag nama bawah foto seperti referensi */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#0F766E] text-white px-5 py-2 rounded-xl shadow-lg border border-teal-300 text-xs font-bold text-center whitespace-nowrap">
                  Ustadz Kemal Thoriq
                </div>
              </div>
            </div>

            {/* Teks Kanan Kutipan Persis Referensi */}
            <div className="md:col-span-7 text-slate-700">
              <h2
                className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0F766E] mb-5"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Prakata Kepala TPA
              </h2>

              <blockquote className="italic text-slate-600 text-xs sm:text-sm lg:text-base leading-relaxed mb-6 border-l-4 border-[#C89B3C] pl-4">
                "Anak-anak kita hari ini lahir dan tumbuh di tengah lautan gawai dan kecerdasan buatan. Melarang mereka total dari teknologi bukanlah solusi jangka panjang. Kewajiban kita adalah menguatkan akar Al-Qur'an dan menanamkan akhlak mulia di dada mereka, sehingga ketika mereka dewasa, merekalah generasi cerdas beradab yang memimpin peradaban dengan cahaya iman."
              </blockquote>

              <div>
                <div className="font-bold text-slate-900 text-sm sm:text-base">Ustadz Kemal Thoriq</div>
                <div className="text-xs text-[#0F766E] font-semibold">Kepala & Pengasuh TPA MJS Qur'anic Tech Ngawi</div>
              </div>
            </div>
          </div>

          {/* Garis Pembatas Halus */}
          <div className="border-t border-slate-200 w-full mb-16" />

        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          6. KURIKULUM 4 PILAR PEMBELAJARAN (IKON 3D COHESIVE)
         ────────────────────────────────────────────────────────── */}
      <section id="kurikulum" className="py-12 bg-[#F8FAF9] border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-[#C89B3C] uppercase tracking-widest block mb-2">
              Kurikulum Karakter & Keilmuan
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0F766E]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              4 Pilar Pembelajaran Murid
            </h2>
            <div className="w-14 h-1 bg-[#C89B3C] mx-auto rounded-full mt-3 mb-4" />
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Memadukan talaqqi makharijul huruf dari kitab para ulama dengan literasi sains & adab digital era modern.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pilar 1 */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 hover:border-[#0F766E]/50 hover:shadow-xl transition-all duration-300 group flex flex-col justify-between">
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <IconTahsin3D size={64} className="group-hover:scale-105" />
                  <span className="text-xs font-black text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full">Pilar 01</span>
                </div>
                <h3 className="font-bold text-base sm:text-lg text-slate-900 mb-2">Tahsin & Tajwid Sanad</h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Bimbingan talaqqi dari jilid Iqro hingga Al-Qur'an dengan koreksi teliti makhraj huruf, sifat, dan hukum tajwid bersanad.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-100 text-xs font-semibold text-emerald-700">
                ✓ Target: Tartil & Fasih Bersanad
              </div>
            </div>

            {/* Pilar 2 */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 hover:border-amber-500/50 hover:shadow-xl transition-all duration-300 group flex flex-col justify-between">
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <IconTahfidz3D size={64} className="group-hover:scale-105" />
                  <span className="text-xs font-black text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full">Pilar 02</span>
                </div>
                <h3 className="font-bold text-base sm:text-lg text-slate-900 mb-2">Tahfidz Juz 30 Ceria</h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Metode hafalan menyenangkan tanpa membebani mental anak, dilengkapi muroja'ah berantai dan hafalan doa harian.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-100 text-xs font-semibold text-amber-700">
                ✓ Target: Tuntas Hafal Juz 30
              </div>
            </div>

            {/* Pilar 3 */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 hover:border-teal-500/50 hover:shadow-xl transition-all duration-300 group flex flex-col justify-between">
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <IconTech3D size={64} className="group-hover:scale-105" />
                  <span className="text-xs font-black text-teal-800 bg-teal-50 px-2.5 py-1 rounded-full">Pilar 03</span>
                </div>
                <h3 className="font-bold text-base sm:text-lg text-slate-900 mb-2">Qur'anic Tech Kids</h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Pengenalan dasar logika komputasi, coding visual islami, etika bersosial media, dan pemanfaatan teknologi positif.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-100 text-xs font-semibold text-teal-700">
                ✓ Target: Literasi Logika & IT Positif
              </div>
            </div>

            {/* Pilar 4 */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 hover:border-rose-400/50 hover:shadow-xl transition-all duration-300 group flex flex-col justify-between">
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <IconAdab3D size={64} className="group-hover:scale-105" />
                  <span className="text-xs font-black text-rose-800 bg-rose-50 px-2.5 py-1 rounded-full">Pilar 04</span>
                </div>
                <h3 className="font-bold text-base sm:text-lg text-slate-900 mb-2">Adab & Akhlak Mulia</h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Pembiasaan sholat berjamaah tepat waktu di masjid, adab santun kepada orang tua dan guru, serta keteladanan sirah nabawiyah.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-100 text-xs font-semibold text-rose-700">
                ✓ Target: Karakter Santun & Berakhlak
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          6A. SECTION KIDCAMP: BELAJAR SERU, HATI TERJAGA!
          (Langit Biru Ceria, Kartu Bernomor, Animasi Santri Cilik Film Jumbo)
         ────────────────────────────────────────────────────────── */}
      <section id="kidcamp" className="relative overflow-hidden" style={{ isolation: "isolate" }}>
        {/* Wave Top */}
        <div style={{ lineHeight: 0, background: "#F8FAF9" }}>
          <svg viewBox="0 0 1440 70" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ width: "100%", height: "50px", display: "block" }}>
            <path d="M0,20 C240,70 480,0 720,35 C960,70 1200,10 1440,40 L1440,70 L0,70 Z" fill="#87CEEB" />
          </svg>
        </div>

        <div style={{ background: "linear-gradient(180deg, #87CEEB 0%, #B3E5FC 50%, #80DEEA 100%)", position: "relative" }}>
          <div style={{ maxWidth: 1240, margin: "0 auto", padding: "48px 20px 40px", position: "relative", zIndex: 1 }}>

            {/* Badge pill */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.65)", backdropFilter: "blur(12px)", border: "1.5px solid rgba(255,255,255,0.85)", borderRadius: 9999, padding: "7px 24px", color: "#064E3B", fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#FF6B1A", display: "inline-block" }} />
                Metode KidCamp Ceria
              </div>
            </div>

            {/* Header dengan Maskot Santriwati Film Jumbo */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-10">
              <div className="lg:col-span-8 text-center lg:text-left">
                <h2 style={{ fontFamily: "'Baloo 2', cursive", fontSize: "clamp(2.2rem, 5vw, 3.8rem)", fontWeight: 800, color: "#0D3B2E", lineHeight: 1.1, margin: "0 0 14px" }}>
                  Belajar Seru,{" "}
                  <span style={{ color: "#FF6B1A" }}>Hati Terjaga!</span>
                </h2>
                <p style={{ color: "#0D3B2E", fontSize: "1rem", maxWidth: 600, lineHeight: 1.65, margin: "0 auto 0 0", fontWeight: 500 }}>
                  TPA MJS hadir menjadi sahabat tumbuh kembang ananda tercinta. Suasana belajar yang ceria, penuh kasih sayang, dan jauh dari rasa tertekan membuat anak-anak selalu rindu datang ke masjid setiap sore.
                </p>
              </div>
              <div className="lg:col-span-4 flex justify-center">
                <JumboGirlCharacter
                  size="sm"
                  speech="Bismillah! Di TPA MJS, belajar ngaji itu asyik dan punya banyak teman sholeh!"
                />
              </div>
            </div>

            {/* KidCamp 4 Kartu Bernomor */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 20, marginBottom: 40 }}>
              {[
                {
                  num: "1",
                  icon: <IconTahsin3D size={52} />,
                  title: "Tahsin Bersanad",
                  desc: "Makhraj huruf diajarkan lewat nyanyian dan peragaan santun, mempermudah ananda melafalkan ayat dengan tartil.",
                  numBg: "#0284C7",
                },
                {
                  num: "2",
                  icon: <IconTahfidz3D size={52} />,
                  title: "Hafalan Juz 30 Ceria",
                  desc: "Metode muroja'ah interaktif dan kartu prestasi hafalan, merayakan setiap ayat baru yang dihafal ananda.",
                  numBg: "#16A34A",
                },
                {
                  num: "3",
                  icon: <IconTech3D size={52} />,
                  title: "Qur'anic Tech & Logika",
                  desc: "Belajar coding blok warna-warni dan kuis sains Al-Qur'an untuk mengasah daya nalar anak sejak dini.",
                  numBg: "#EA580C",
                },
                {
                  num: "4",
                  icon: <IconAdab3D size={52} />,
                  title: "Adab Murid Nusantara",
                  desc: "Adab salam, senyum, menyayangi teman, dan berbakti kepada orang tua ditanamkan dalam rutinitas harian.",
                  numBg: "#C89B3C",
                },
              ].map((item) => (
                <div
                  key={item.num}
                  style={{
                    background: "#ffffff",
                    borderRadius: 24,
                    padding: "22px 20px 24px",
                    boxShadow: "0 8px 28px rgba(0,0,0,0.08)",
                  }}
                  className="hover:-translate-y-2 hover:shadow-xl transition-all group relative overflow-hidden"
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                    <div style={{ width: 42, height: 42, borderRadius: "50%", background: item.numBg, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: 18, boxShadow: `0 4px 14px ${item.numBg}50` }}>
                      {item.num}
                    </div>
                    <div>{item.icon}</div>
                  </div>
                  <h3 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: "1.15rem", color: "#1A2B3C", marginBottom: 8, lineHeight: 1.25 }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: "0.825rem", color: "#475569", lineHeight: 1.6, margin: 0 }}>
                    {item.desc}
                  </p>
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 4, background: item.numBg, borderRadius: "0 0 24px 24px" }} />
                </div>
              ))}
            </div>

            {/* CTA KidCamp */}
            <div style={{ textAlign: "center", paddingBottom: 8 }}>
              <button
                onClick={scrollToForm}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  background: "#FF6B1A",
                  color: "#fff",
                  fontFamily: "'Baloo 2', sans-serif",
                  fontWeight: 800,
                  fontSize: "0.95rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  padding: "15px 34px",
                  borderRadius: 9999,
                  border: "none",
                  cursor: "pointer",
                  boxShadow: "0 8px 26px rgba(255,107,26,0.45)",
                }}
                className="hover:bg-[#E55A0A] active:scale-95 transition-all"
              >
                <span>🌟 Daftarkan Putra-Putri Sekarang</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* Wave Bottom transisi lembut ke background putih/ivory */}
          <div style={{ lineHeight: 0 }}>
            <svg viewBox="0 0 1440 70" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ width: "100%", height: "50px", display: "block" }}>
              <path d="M0,30 C200,70 500,5 720,40 C940,70 1200,10 1440,40 L1440,70 L0,70 Z" fill="#F4F9F6" />
            </svg>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          6B. TPA NAIK LEVEL: FILOSOFI PENDIDIKAN & ILUSTRASI FILM JUMBO
          (Harmonis dengan latar terang krem/soft ivory #F4F9F6, tidak lagi gelap kontras)
         ────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-[#F4F9F6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-4">
              <span>🌟</span>
              <span>Filosofi TPA Naik Level — MJS Edukasi</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F766E] leading-tight mb-5" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              Teknologi bukan sekadar{" "}
              <span className="italic text-[#064E3B]">layar</span>,<br />
              tapi cara anak belajar{" "}
              <span className="italic text-[#C89B3C]">masa depan</span>
            </h2>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
              TPA Naik Level melatih anak berpikir runtut, logis, dan kritis, sambil menjaga kelembutan hati, adab terhadap sesama, dan akhlak Qur'ani.
            </p>
          </div>

          {/* Widescreen Scene Animasi Film Jumbo */}
          <div className="max-w-5xl mx-auto mb-16">
            <JumboFeatureGroupScene onCtaClick={scrollToForm} />
          </div>

          {/* 4 Steps Inkuiri Santri (01 Amati, 02 Coba, 03 Tanya, 04 Temukan) */}
          <div className="mb-8">
            <div className="text-center mb-10">
              <span className="text-xs font-bold text-[#0F766E] uppercase tracking-widest block mb-2">Metode Inkuiri Murid</span>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                MULAI DARI YANG DEKAT
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm mt-2 max-w-xl mx-auto">
                Rasa ingin tahu anak adalah anugerah fitrah dari Allah. Dari aktivitas sederhana di serambi masjid, anak belajar mengamati, mencoba, bertanya, dan menemukan solusi.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
              {[
                {
                  step: "01",
                  icon: <IconAmati3D size={52} />,
                  label: "Amati",
                  desc: "Melihat keteraturan alam di pelataran masjid dan keindahan susunan ayat Al-Qur'an.",
                  accent: "#0F766E",
                },
                {
                  step: "02",
                  icon: <IconCoba3D size={52} />,
                  label: "Coba",
                  desc: "Mencoba melafalkan makhorijul huruf dan merangkai logika blok sederhana tanpa takut salah.",
                  accent: "#0284C7",
                },
                {
                  step: "03",
                  icon: <IconTanya3D size={52} />,
                  label: "Tanya",
                  desc: "Berani mengajukan pertanyaan adab dan makna ayat kepada asatidz dengan santun.",
                  accent: "#C89B3C",
                },
                {
                  step: "04",
                  icon: <IconTemukan3D size={52} />,
                  label: "Temukan",
                  desc: "Merasakan indahnya ilmu bermanfaat untuk menolong sesama teman dan memakmurkan masjid.",
                  accent: "#DB2777",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      {item.icon}
                      <span className="text-xl font-black text-slate-300">{item.step}</span>
                    </div>
                    <h4 className="font-bold text-lg mb-2 text-slate-900">{item.label}</h4>
                    <p className="text-slate-600 text-xs leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          7. FORMULIR PENDAFTARAN ONLINE SANTRI TPA (UTAMA)
          (Latar Bersih Bernuansa Islami Modern, Langsung Terkoneksi ke WA Admin 087894416915)
         ────────────────────────────────────────────────────────── */}
      <section ref={formRef} id="form-pendaftaran" className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Murid Cilik Faiz Menyambut Calon Murid Baru (Menyatu Tanpa Frame / Tanpa BG) */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 lg:gap-10 mb-12">
            <JumboBoyCharacter
              size="sm"
              speech="Bismillah Ayah & Bunda! Yuk daftarkan ananda di TPA MJS Ngawi, belajarnya seru dan ramah anak!"
              className="flex-shrink-0"
            />
            <div className="text-center md:text-left max-w-xl">
              <span className="text-xs font-bold text-[#C89B3C] uppercase tracking-widest block mb-2">
                Penerimaan Murid Baru Tahun 2026
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#0F766E]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                Formulir Pendaftaran Murid Baru TPA MJS
              </h2>
              <div className="w-16 h-1 bg-[#C89B3C] mx-auto md:mx-0 rounded-full mt-3 mb-4" />
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Silakan isi formulir di bawah ini dengan data yang benar. Setelah disimpan, draf pendaftaran resmi akan otomatis
                terhubung ke WhatsApp Admin di <strong>087894416915</strong> untuk konfirmasi dan proses orientasi.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-[#F8FAF9] text-slate-800 rounded-3xl p-6 sm:p-10 shadow-lg border border-slate-200"
          >
            {/* ── BAGIAN 1: DATA CALON MURID ── */}
            <div className="mb-10">
              <div className="flex items-center gap-3 border-b border-slate-200 pb-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-[#0F766E] text-white flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <h3 className="font-bold text-lg text-slate-900">Data Calon Murid</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Nama Lengkap Murid <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="namaLengkap"
                    required
                    placeholder="Contoh: Muhammad Faiz Al-Fatih"
                    value={formData.namaLengkap}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 text-base sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0F766E] transition-all bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Nama Panggilan
                  </label>
                  <input
                    type="text"
                    name="namaPanggilan"
                    placeholder="Contoh: Faiz"
                    value={formData.namaPanggilan}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 text-base sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0F766E] transition-all bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Tempat Lahir
                  </label>
                  <input
                    type="text"
                    name="tempatLahir"
                    placeholder="Contoh: Ngawi"
                    value={formData.tempatLahir}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 text-base sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0F766E] transition-all bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Tanggal Lahir
                  </label>
                  <input
                    type="date"
                    name="tanggalLahir"
                    value={formData.tanggalLahir}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 text-base sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0F766E] transition-all bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Jenis Kelamin
                  </label>
                  <select
                    name="jenisKelamin"
                    value={formData.jenisKelamin}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 text-base sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0F766E] transition-all bg-white cursor-pointer min-h-[44px]"
                  >
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Usia (Tahun)
                  </label>
                  <input
                    type="number"
                    name="usia"
                    min={4}
                    max={15}
                    value={formData.usia}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 text-base sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0F766E] transition-all bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Sekolah Asal (TK / SD / MI)
                  </label>
                  <input
                    type="text"
                    name="sekolahAsal"
                    placeholder="Contoh: SDIT Al-Ihsan Ngawi / SDN Beran 1"
                    value={formData.sekolahAsal}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 text-base sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0F766E] transition-all bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Kelas di Sekolah
                  </label>
                  <input
                    type="text"
                    name="kelasSekolah"
                    placeholder="Contoh: Kelas 2 / TK B"
                    value={formData.kelasSekolah}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 text-base sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0F766E] transition-all bg-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Kemampuan Membaca Al-Qur'an Saat Ini
                  </label>
                  <select
                    name="kemampuanNgaji"
                    value={formData.kemampuanNgaji}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 text-base sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0F766E] transition-all bg-white cursor-pointer font-medium min-h-[44px]"
                  >
                    <option value="Belum Bisa">Belum Bisa Mengenal Huruf Hijaiyah</option>
                    <option value="Iqro Jilid 1-3">Iqro' Jilid 1 sampai 3</option>
                    <option value="Iqro Jilid 4-6">Iqro' Jilid 4 sampai 6</option>
                    <option value="Al-Qur'an Lancar">Sudah Masuk Al-Qur'an (Belajar Tajwid)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* ── BAGIAN 2: DATA ORANG TUA / WALI ── */}
            <div className="mb-8">
              <div className="flex items-center gap-3 border-b border-slate-200 pb-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-[#C89B3C] text-slate-900 flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <h3 className="font-bold text-lg text-slate-900">Data Orang Tua / Wali</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Nama Ayah
                  </label>
                  <input
                    type="text"
                    name="namaAyah"
                    placeholder="Contoh: Budi Santoso"
                    value={formData.namaAyah}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 text-base sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0F766E] transition-all bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Nama Ibu
                  </label>
                  <input
                    type="text"
                    name="namaIbu"
                    placeholder="Contoh: Siti Rahmawati"
                    value={formData.namaIbu}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 text-base sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0F766E] transition-all bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Pekerjaan Orang Tua
                  </label>
                  <input
                    type="text"
                    name="pekerjaanOrtu"
                    placeholder="Contoh: Wiraswasta / Guru / Karyawan"
                    value={formData.pekerjaanOrtu}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 text-base sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0F766E] transition-all bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Nomor WhatsApp Aktif Wali <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="whatsappOrtu"
                    required
                    placeholder="Contoh: 081234567890"
                    value={formData.whatsappOrtu}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 text-base sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0F766E] transition-all bg-white font-semibold text-[#0F766E]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Alamat Lengkap Rumah
                  </label>
                  <textarea
                    name="alamatRumah"
                    rows={2}
                    placeholder="Jl. / RT / RW / Desa / Kelurahan di Ngawi"
                    value={formData.alamatRumah}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 text-base sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0F766E] transition-all bg-white resize-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Catatan Khusus / Karakter Anak
                  </label>
                  <input
                    type="text"
                    name="catatanKhusus"
                    placeholder="Misal: Senang menggambar, agak pemalu di awal, dll."
                    value={formData.catatanKhusus}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 text-base sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0F766E] transition-all bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Tombol Submit Kirim ke WA Admin */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-600 font-medium">
                🔒 Kerahasiaan data terjamin. Konfirmasi formulir langsung terhubung ke Layanan WhatsApp: <strong>0878-9441-6915</strong>.
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto bg-[#0F766E] hover:bg-[#0d645e] active:scale-95 text-white font-bold px-8 py-4 rounded-full text-sm uppercase tracking-wider transition-all shadow-lg shadow-[#0F766E]/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 min-h-[48px]"
              >
                <Send className="w-4 h-4 text-[#C89B3C]" />
                <span>{isSubmitting ? "Memproses..." : "Kirim Pendaftaran & Buka WhatsApp"}</span>
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          8. STEMPEL LINGKARAN TENGAH PERSIS DI ATAS FOOTER (REFERENSI GAMBAR)
         ────────────────────────────────────────────────────────── */}
      <div className="relative -mb-10 z-30 flex justify-center pointer-events-none">
        <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full border-4 border-[#C89B3C] p-1.5 bg-white shadow-2xl flex items-center justify-center pointer-events-auto">
          <img
            src="/media/image/logo.png"
            alt="Stempel Resmi Masjid Jami Sosrohadisewoyo"
            className="w-full h-full object-contain rounded-full"
          />
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────
          9. FOOTER RESMI PERSIS REFERENSI SCREENSHOT
          (Peta kiri, alamat tengah dengan ikon hijau, form 'Ada Pertanyaan?' kanan)
         ────────────────────────────────────────────────────────── */}
      <footer id="kontak" className="bg-[#111827] text-white pt-18 pb-10 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12 mb-12">
            {/* Kolom 1: Peta Lokasi persis screenshot */}
            <div>
              <h4 className="text-sm font-bold tracking-widest text-white uppercase mb-4">
                Pesantren & Kompleks Masjid
              </h4>
              <div className="rounded-2xl overflow-hidden border border-slate-700 bg-slate-800 h-44 relative shadow-inner">
                <iframe
                  title="Peta Lokasi Masjid Jami Sosrohadisewoyo"
                  src="https://maps.google.com/maps?q=Jalan%20Monginsidi%20No.%2051%20Pelem%20Ngawi&t=&z=16&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full border-0 filter grayscale contrast-125 opacity-80"
                  loading="lazy"
                />
              </div>
              <p className="text-xs text-slate-400 mt-2">Kompleks Masjid Jami Sosrohadisewoyo, Jl. Monginsidi No. 51, RT 011 / RW 002, Pelem II, Desa Pelem, Ngawi.</p>
            </div>

            {/* Kolom 2: Kontak Info Detail persis screenshot */}
            <div>
              <h4 className="text-sm font-bold tracking-widest text-white uppercase mb-4">
                TPA MJS Qur'anic Tech
              </h4>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#10B981] flex-shrink-0 mt-0.5" />
                  <span>Jl. Monginsidi No. 51, RT 011 / RW 002, Pelem II, Desa Pelem, Kecamatan Ngawi, Kabupaten Ngawi, Jawa Timur</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#10B981] flex-shrink-0" />
                  <span>Rizal / Admin: 087894416915</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#10B981] flex-shrink-0" />
                  <span>Wignoyo: 0851 0046 5409</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#10B981] flex-shrink-0" />
                  <span>edukasi@masjidsosrohadisewoyo.id</span>
                </li>
                <li className="flex items-center gap-3">
                  <ExternalLink className="w-4 h-4 text-[#10B981] flex-shrink-0" />
                  <span>www.masjidsosrohadisewoyo.id</span>
                </li>
              </ul>
            </div>

            {/* Kolom 3: Ada Pertanyaan? Form persis screenshot */}
            <div>
              <h4 className="text-sm font-bold tracking-widest text-white uppercase mb-4">
                Ada Pertanyaan ?
              </h4>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="*Email"
                  className="w-full px-3.5 py-2 text-xs rounded-lg bg-transparent border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#0F766E]"
                />
                <input
                  type="text"
                  placeholder="*Your Name"
                  className="w-full px-3.5 py-2 text-xs rounded-lg bg-transparent border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#0F766E]"
                />
                <textarea
                  rows={2}
                  placeholder="*Your Message"
                  className="w-full px-3.5 py-2 text-xs rounded-lg bg-transparent border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#0F766E] resize-none"
                />
                <div className="text-xs text-slate-400">
                  or contact us: 087894416915
                </div>
                <button
                  onClick={() => {
                    window.open(
                      "https://wa.me/6287894416915?text=Assalamualaikum%20Admin%20TPA%20MJS,%20saya%20ingin%20bertanya%20mengenai%20kegiatan%20TPA.",
                      "_blank"
                    );
                  }}
                  className="px-6 py-2 rounded-full border border-white text-white text-xs font-semibold hover:bg-white hover:text-slate-900 transition-all cursor-pointer"
                >
                  Kirim
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div>2026 | TPA MJS Qur'anic Tech — Masjid Jami Sosrohadisewoyo Ngawi.</div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => onBackToHome()}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Kembali ke Beranda Utama
              </button>
              <span>•</span>
              <button
                onClick={scrollToForm}
                className="hover:text-[#C89B3C] transition-colors cursor-pointer"
              >
                Form Pendaftaran Online
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* ──────────────────────────────────────────────────────────
          MODAL SUKSES PENDAFTARAN
         ────────────────────────────────────────────────────────── */}
      {successModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-7 max-w-md w-full shadow-2xl text-center border border-slate-100 transform animate-jumbo-bounce">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#0F766E] flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <h3 className="font-bold text-xl text-slate-900 mb-2">Alhamdulillah! Pendaftaran Tersimpan</h3>
            <div className="inline-block px-3 py-1 bg-slate-100 rounded-full text-xs font-mono font-bold text-slate-700 mb-4">
              No. Registrasi: {successModal}
            </div>

            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6">
              Data calon murid telah tersimpan di sistem TPA MJS. Tab WhatsApp ke Admin (<strong>087894416915</strong>) telah
              dibuka secara otomatis. Silakan kirim pesan tersebut untuk konfirmasi dan proses verifikasi lebih lanjut.
            </p>

            <button
              onClick={() => setSuccessModal(null)}
              className="w-full bg-[#0F766E] hover:bg-[#0d645e] active:scale-95 text-white font-bold py-3.5 rounded-full text-sm transition-all cursor-pointer shadow-md min-h-[44px]"
            >
              Tutup & Selesai
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
