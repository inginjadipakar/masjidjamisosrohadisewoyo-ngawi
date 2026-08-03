import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown, ChevronRight, ChevronLeft, ArrowRight, BookOpen, Users, Heart, Star, Wheat, Gift, Gem, Monitor, Handshake, ShoppingBag, Home, RefreshCw, Copy, Check, ShieldCheck, Sparkles } from "lucide-react";
import { gsap } from "gsap";

/* ── Ticker & Floating Waterfall animation injected once ── */
const tickerStyle = `
  @keyframes ticker {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @keyframes pillarGlow {
    0%, 100% { transform: scale(1); opacity: 0.45; }
    50% { transform: scale(1.08); opacity: 0.75; }
  }
  @keyframes floatUp {
    0% { transform: translateY(0); }
    100% { transform: translateY(-50%); }
  }
  .animate-ticker { animation: ticker 55s linear infinite; }
  .font-display { font-family: 'Playfair Display', Georgia, serif; }
  .font-sans { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
  .animate-pillar-glow { animation: pillarGlow 4.2s ease-in-out infinite; }
  .animate-float-slow { animation: floatUp 34s linear infinite; }
  .animate-float-medium { animation: floatUp 26s linear infinite; }
  .animate-float-fast { animation: floatUp 20s linear infinite; }
  .split-panel-top {
    clip-path: inset(0% 0% 0% 0%);
    will-change: clip-path;
  }
  .split-panel-bottom {
    clip-path: inset(0% 0% 0% 0%);
    will-change: clip-path;
  }
`;

/* ── Data ── */

const heroSlides = [
  {
    id: 0,
    pillar: "Baitullah",
    bg: "/media/image/baitullah.png",
    heading: "Baitullah",
    sub: "Merawat Rumah Allah,\nMenguatkan Umat.",
    quote:
      "Sesungguhnya yang memakmurkan masjid Allah hanyalah orang-orang yang beriman kepada Allah dan hari kemudian.",
    quoteRef: "QS At-Taubah: 18",
    cta: "Lihat Program",
  },
  {
    id: 1,
    pillar: "Baitul Mal",
    bg: "/media/image/baitulmal.png",
    heading: "Baitul Mal",
    sub: "Zakat, Sedekah &\nSantunan Sesama.",
    quote: "Tangan di atas lebih baik daripada tangan di bawah.",
    quoteRef: "HR. Bukhari & Muslim",
    cta: "Mulai Berdonasi",
  },
  {
    id: 2,
    pillar: "Baitul Muamalah",
    bg: "/media/image/baitulmuamalah.png",
    heading: "Baitul Muamalah",
    sub: "Membangun Keluarga\nBernilai Islam.",
    quote:
      "Dan nikahkanlah orang-orang yang sendirian di antara kamu, dan orang-orang yang layak menikah.",
    quoteRef: "QS An-Nur: 32",
    cta: "Lihat Layanan",
  },
];

interface DropdownItem {
  title: string;
  badge?: string;
  hasSubmenu?: boolean;
}

interface NavLinkItem {
  label: string;
  hasDropdown: boolean;
  dropdownItems?: DropdownItem[];
}

const navLinks: NavLinkItem[] = [
  {
    label: "Baitullah",
    hasDropdown: true,
    dropdownItems: [
      { title: "ATM Beras" },
      { title: "Perawatan Masjid" },
      { title: "Program Santunan Yatim" },
      { title: "Jumat Bahagia" },
      { title: "Subuh Berkah" },
      { title: "Event Hari Besar Islam", badge: "Segera Dibuka" },
      { title: "Kajian Rutin Malam Senin" },
      { title: "Kajian Akhwat" },
      { title: "Ngaji Kamis Malam" },
      { title: "Pengajian Tahsin Lansia" },
      { title: "Pengajian Tahsin Anak-anak" },
    ],
  },
  {
    label: "Baitul Mal",
    hasDropdown: true,
    dropdownItems: [
      { title: "BMT", badge: "Segera Dibuka" },
    ],
  },
  {
    label: "Baitul Muamalah",
    hasDropdown: true,
    dropdownItems: [
      { title: "Kelas Tahsin Online" },
      { title: "Karantina Tahfidz Qur'an", badge: "Segera Dibuka" },
      { title: "Bazar Meriah" },
      { title: "Sewa Ruangan" },
      { title: "Wedding Organizer", hasSubmenu: true },
      { title: "Ngawi Tekno" },
      { title: "Program Umrah & Haji" },
      { title: "Ebook" },
    ],
  },
];

const tickerItems = [
  "Wedding Islami",
  "Kelas Tahsin Online",
  "Kolaborasi",
  "Sewa Aula",
  "Pelatihan Wirausaha",
  "Santunan Anak Yatim",
  "ATM Beras",
  "Kajian Rutin",
];

const pillarSlides = [
  {
    id: "baitullah",
    label: "PILAR PERTAMA",
    heading: "BAITULLAH",
    subtitle: "Membawa cahaya\nbagi setiap insan.",
    description:
      "Rumah Allah bukan sekadar tempat ibadah, tetapi tempat lahirnya generasi Qur'ani, doa-doa terbaik dipanjatkan, dan kepedulian tumbuh menjadi amal.",
    bg: "linear-gradient(135deg, #052e1c 0%, #064E3B 50%, #0a5940 100%)",
    accent: "#0F766E",
    accentLight: "#6EE7B7",
    image: "/media/image/baitullah.png",
    programCount: 7,
    CardIcon: Home,
    programs: [
      { label: "Kajian & Ilmu", Icon: BookOpen },
      { label: "Santunan Yatim", Icon: Heart },
      { label: "Tahsin Al-Qur'an", Icon: Star },
      { label: "Ibadah & Doa", Icon: Users },
    ],
  },
  {
    id: "baitul-mal",
    label: "PILAR KEDUA",
    heading: "BAITUL MAL",
    subtitle: "Mengelola amanah,\nmenghadirkan keberkahan.",
    description:
      "Setiap donasi yang Anda titipkan, kami kelola dengan amanah untuk membantu mereka yang membutuhkan dan mensejahterakan umat.",
    bg: "linear-gradient(135deg, #5c3407 0%, #92650A 50%, #b87d1a 100%)",
    accent: "#C89B3C",
    accentLight: "#FCD34D",
    image: "/media/image/baitulmal.png",
    programCount: 6,
    CardIcon: Wheat,
    programs: [
      { label: "ATM Beras", Icon: Wheat },
      { label: "Jumat Berbagi", Icon: Gift },
      { label: "Zakat", Icon: Star },
      { label: "Infaq & Sedekah", Icon: Heart },
    ],
  },
  {
    id: "baitul-muamalah",
    label: "PILAR KETIGA",
    heading: "BAITUL MUAMALAH",
    subtitle: "Menggerakkan ekonomi umat,\nmenumbuhkan kebermanfaatan.",
    description:
      "Melalui kolaborasi dan inovasi, kami hadir menjadi jembatan kebaikan yang menghubungkan manfaat bagi banyak orang.",
    bg: "linear-gradient(135deg, #0f1f3d 0%, #1E3A5F 50%, #1e4080 100%)",
    accent: "#3B82F6",
    accentLight: "#93C5FD",
    image: "/media/image/baitulmuamalah.png",
    programCount: 5,
    CardIcon: Handshake,
    programs: [
      { label: "Wedding Islami", Icon: Gem },
      { label: "Tahsin Online", Icon: Monitor },
      { label: "Kolaborasi", Icon: Handshake },
      { label: "UMKM Masjid", Icon: ShoppingBag },
    ],
  },
];

const accordionItems = [
  {
    id: 1,
    title: "Acara Santunan Kolaborasi dengan Kecanduan Sedekah Ngawi dan Laz Ummul Quro",
    description:
      "Program santunan akbar hasil kolaborasi hangat bersama komunitas Kecanduan Sedekah Ngawi dan LAZ Ummul Quro untuk membahagiakan anak-anak yatim dan dhuafa.",
    image: "/media/image/santunan.jpeg",
    tag: "Baitul Mal",
  },
  {
    id: 2,
    title: "Bingkisan Keluarga Dhuafa dan Lansia Dhuafa di Sekitar Masjid Jami Sosrohadisewoyo",
    description:
      "Program kepedulian berbagi bingkisan sembako dan santunan harian untuk keluarga dhuafa dan lansia di sekitar Masjid Jami Sosrohadisewoyo.",
    image: "/media/image/lansia.jpeg",
    tag: "Baitul Mal",
  },
  {
    id: 3,
    title: "Aula Masjid Tersedia untuk Acara Keluarga & Korporat",
    description:
      "Fasilitas aula lantai 2 & ruang serbaguna dengan kapasitas hingga 300 orang untuk menyelenggarakan acara pernikahan islami, syukuran, dan meeting organisasi.",
    image: "/media/image/aula.jpg",
    tag: "Baitul Muamalah",
  },
  {
    id: 4,
    title: "Kelas Tahsin Online",
    description:
      "Belajar membaca Al-Quran dengan tajwid yang benar bersama ustadz berpengalaman — fleksibel, terjangkau, dan bisa diikuti dari mana saja kapan saja.",
    image: "/media/image/bg/bg (4).jpeg",
    tag: "Baitullah",
  },
  {
    id: 5,
    title: "Kolaborasi & Pelatihan Umat",
    description:
      "Bergabunglah dalam ekosistem wirausaha Islami — pelatihan keterampilan, pendampingan bisnis halal, dan jaringan kolaborasi yang saling menguatkan.",
    image: "/media/image/bg/bg (13).jpeg",
    tag: "Baitul Muamalah",
  },
];

const newsItems = [
  {
    id: 1,
    category: "Baitul Mal",
    title: "Acara Santunan Kolaborasi dengan Kecanduan Sedekah Ngawi dan Laz Ummul Quro",
    date: "28 Juli 2026",
    image: "/media/image/santunan.jpeg",
  },
  {
    id: 2,
    category: "Baitul Muamalah",
    title: "Aula Masjid Tersedia untuk Acara Keluarga & Korporat",
    date: "22 Juli 2026",
    image: "/media/image/aula.jpg",
  },
  {
    id: 3,
    category: "Baitul Mal",
    title: "Bingkisan Keluarga Dhuafa dan Lansia Dhuafa di Sekitar Masjid Jami Sosrohadisewoyo",
    date: "15 Juli 2026",
    image: "/media/image/lansia.jpeg",
  },
  {
    id: 4,
    category: "Baitullah",
    title: "Kelas Tahsin Batch 12 Resmi Dibuka, Daftar Sekarang",
    date: "10 Juli 2026",
    image: "/media/image/bg/bg (4).jpeg",
  },
];

const nominals = [10000, 25000, 50000, 100000, 250000, 500000];

/* ── PilarScrollSection — Scroll-driven horizontal (Bolodev technique) ── */

type PillarSlide = (typeof pillarSlides)[number];

function PilarScrollSection({
  pillarSlides,
  activePillar,
  setActivePillar,
  onRegisterScrollTo,
}: {
  pillarSlides: PillarSlide[];
  activePillar: number;
  setActivePillar: (i: number) => void;
  onRegisterScrollTo?: (fn: (idx: number) => void) => void;
}) {
  const outerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const activePillarRef = useRef(activePillar);

  useEffect(() => {
    activePillarRef.current = activePillar;
  }, [activePillar]);

  const scrollToSlide = (idx: number) => {
    const outer = outerRef.current;
    if (!outer) return;
    const outerH = outer.offsetHeight;
    const stickyH = window.innerHeight;
    const scrollable = Math.max(1, outerH - stickyH);
    // target scroll percentage for middle of each slide's hold zone
    const targetProgress = idx === 0 ? 0.11 : idx === 1 ? 0.55 : 0.94;
    const targetScrollY = outer.offsetTop + targetProgress * scrollable;
    window.scrollTo({ top: targetScrollY, behavior: "smooth" });
  };

  useEffect(() => {
    if (onRegisterScrollTo) onRegisterScrollTo(scrollToSlide);
  }, [onRegisterScrollTo]);

  // ── Scroll → horizontal track translation with 2-scroll hold plateaus ──
  useEffect(() => {
    const handleScroll = () => {
      const outer = outerRef.current;
      const track = trackRef.current;
      if (!outer || !track) return;

      const rect = outer.getBoundingClientRect();
      const outerH = outer.offsetHeight;
      const stickyH = window.innerHeight;
      const scrollable = Math.max(1, outerH - stickyH);

      const scrolled = Math.max(0, Math.min(1, -rect.top / scrollable));

      // Smoothstep plateau curve:
      // [0.00 - 0.22]: Hold Slide 0 (Pilar 1)
      // [0.22 - 0.44]: Transition Slide 0 → 1
      // [0.44 - 0.66]: Hold Slide 1 (Pilar 2)
      // [0.66 - 0.88]: Transition Slide 1 → 2
      // [0.88 - 1.00]: Hold Slide 2 (Pilar 3)
      let p = 0;
      if (scrolled <= 0.22) {
        p = 0;
      } else if (scrolled <= 0.44) {
        const t = (scrolled - 0.22) / 0.22;
        p = t * t * (3 - 2 * t);
      } else if (scrolled <= 0.66) {
        p = 1;
      } else if (scrolled <= 0.88) {
        const t = (scrolled - 0.66) / 0.22;
        p = 1 + t * t * (3 - 2 * t);
      } else {
        p = 2;
      }

      const viewportW = outer.clientWidth;
      track.style.transform = `translate3d(-${p * viewportW}px, 0, 0)`;

      const idx = Math.round(p);
      setActivePillar(Math.max(0, Math.min(pillarSlides.length - 1, idx)));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [pillarSlides.length, setActivePillar]);

  return (
    /* Outer: 450vh tall to provide generous ~2 scroll hold durations per slide */
    <div
      ref={outerRef}
      id="pilar-section"
      className="relative"
      style={{ height: `${pillarSlides.length * 150}vh` }}
    >
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen overflow-hidden relative">

        {/* Tab selector */}
        <div className="absolute top-[82px] left-0 right-0 z-30 flex justify-center px-4 pointer-events-auto">
          <div className="bg-black/45 backdrop-blur-xl border border-white/20 p-1.5 rounded-full flex items-center gap-1.5 shadow-2xl">
            {pillarSlides.map((slide, idx) => {
              const isActive = idx === activePillar;
              return (
                <button
                  key={slide.id}
                  onClick={() => scrollToSlide(idx)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                    isActive
                      ? "bg-white text-gray-950 shadow-lg scale-105"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full transition-colors ${isActive ? "bg-[#0F766E]" : "bg-white/40"}`} />
                  <span>{slide.label}</span>
                  <span className="hidden sm:inline opacity-60 text-[10px]">({slide.heading})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Left arrow */}
        {activePillar > 0 && (
          <button
            onClick={() => scrollToSlide(activePillar - 1)}
            className="absolute left-5 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/25 text-white flex items-center justify-center hover:bg-white hover:text-black transition-all shadow-xl cursor-pointer"
            aria-label="Pilar Sebelumnya"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        {/* Right arrow */}
        {activePillar < pillarSlides.length - 1 && (
          <button
            onClick={() => scrollToSlide(activePillar + 1)}
            className="absolute right-5 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/25 text-white flex items-center justify-center hover:bg-white hover:text-black transition-all shadow-xl cursor-pointer"
            aria-label="Pilar Selanjutnya"
          >
            <ChevronRight size={24} />
          </button>
        )}

        {/* Slides track */}
        <div
          ref={trackRef}
          className="flex h-full will-change-transform"
          style={{ width: `${pillarSlides.length * 100}%`, transition: "transform 0.06s ease-out" }}
        >
          {pillarSlides.map((slide, i) => {
            const CardIcon = slide.CardIcon;
            const isActive = i === activePillar;
            return (
              <div
                key={slide.id}
                className="relative flex-shrink-0 h-full overflow-hidden"
                style={{ width: `${100 / pillarSlides.length}%`, background: slide.bg }}
              >
                {/* Fullscreen photo background */}
                <img
                  src={slide.image}
                  alt={slide.heading}
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                  style={{
                    transform: isActive ? "scale(1.04)" : "scale(1.1)",
                    filter: isActive ? "saturate(1) brightness(0.75)" : "saturate(0.6) brightness(0.5)",
                    transition: "transform 1200ms ease, filter 900ms ease",
                  }}
                />

                {/* Dark gradient overlay */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: "linear-gradient(95deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.08) 100%)",
                  }}
                />

                {/* Content: 100% uniform sizing for all 3 slides */}
                <div className="relative z-10 h-full flex items-center">
                  <div className="w-full max-w-[1400px] mx-auto px-10 lg:px-16 pt-[100px] pb-10">
                    <div className="max-w-[600px] flex flex-col text-white">

                      <div
                        className="text-[11px] font-bold tracking-[0.25em] uppercase mb-4"
                        style={{
                          color: slide.accentLight,
                          opacity: isActive ? 1 : 0.3,
                          transform: isActive ? "translate3d(0,0,0)" : "translate3d(0,22px,0)",
                          transition: "opacity 520ms ease, transform 680ms ease",
                        }}
                      >
                        — {slide.label}
                      </div>

                      <h2
                        className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4 leading-tight tracking-tight min-h-[1.2em] flex items-center"
                        style={{
                          fontFamily: "'Playfair Display', Georgia, serif",
                          opacity: isActive ? 1 : 0.3,
                          transform: isActive ? "translate3d(0,0,0)" : "translate3d(0,28px,0)",
                          transition: "opacity 620ms ease 60ms, transform 760ms ease 60ms",
                        }}
                      >
                        {slide.heading}
                      </h2>

                      <p
                        className="text-lg font-semibold italic mb-4 min-h-[1.5em] flex items-center"
                        style={{
                          color: slide.accentLight,
                          opacity: isActive ? 1 : 0.35,
                          transform: isActive ? "translate3d(0,0,0)" : "translate3d(0,30px,0)",
                          transition: "opacity 620ms ease 120ms, transform 760ms ease 120ms",
                        }}
                      >
                        {slide.subtitle}
                      </p>

                      <p
                        className="text-white/75 text-sm leading-relaxed mb-8 max-w-[440px] min-h-[4.5em]"
                        style={{
                          opacity: isActive ? 1 : 0.35,
                          transform: isActive ? "translate3d(0,0,0)" : "translate3d(0,34px,0)",
                          transition: "opacity 640ms ease 180ms, transform 800ms ease 180ms",
                        }}
                      >
                        {slide.description}
                      </p>

                      {/* Program icons */}
                      <div className="flex gap-4 mb-8">
                        {slide.programs.map(({ label, Icon }, j) => (
                          <div
                            key={j}
                            className="flex flex-col items-center gap-2"
                            style={{
                              opacity: isActive ? 1 : 0.35,
                              transform: isActive ? "translate3d(0,0,0)" : "translate3d(0,20px,0)",
                              transition: `opacity 520ms ease ${220 + j * 70}ms, transform 700ms ease ${220 + j * 70}ms`,
                            }}
                          >
                            <div
                              className="w-11 h-11 rounded-xl flex items-center justify-center"
                              style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.22)" }}
                            >
                              <Icon size={18} className="text-white/85" />
                            </div>
                            <span className="text-[10px] text-white/60 text-center font-medium leading-tight w-14">
                              {label}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Info card */}
                      <div
                        className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-4 self-start"
                        style={{
                          opacity: isActive ? 1 : 0.35,
                          transform: isActive ? "translate3d(0,0,0)" : "translate3d(0,16px,0)",
                          transition: "opacity 620ms ease 240ms, transform 780ms ease 240ms",
                        }}
                      >
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                          style={{ background: `${slide.accent}30`, border: `1.5px solid ${slide.accent}55` }}
                        >
                          <CardIcon size={20} style={{ color: slide.accentLight }} />
                        </div>
                        <div>
                          <div className="font-black text-sm leading-tight text-white">{slide.heading}</div>
                          <div className="text-white/50 text-xs">{slide.programCount} Program Aktif</div>
                        </div>
                        <button
                          onClick={() => document.getElementById("program-section")?.scrollIntoView({ behavior: "smooth" })}
                          className="ml-2 px-4 py-2 rounded-full text-xs font-bold text-white inline-flex items-center gap-1.5 hover:opacity-90 transition-all cursor-pointer shadow-md"
                          style={{ background: slide.accent }}
                        >
                          Lihat Program <ArrowRight size={12} />
                        </button>
                      </div>

                    </div>
                  </div>
                </div>

                {/* Ambient glow */}
                <div
                  className="absolute bottom-10 left-1/4 w-72 h-20 rounded-full blur-3xl pointer-events-none"
                  style={{
                    background: `${slide.accent}60`,
                    opacity: isActive ? 0.55 : 0,
                    transition: "opacity 800ms ease",
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Dots navigation */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 pointer-events-auto">
          {pillarSlides.map((p, j) => (
            <button
              key={j}
              onClick={() => scrollToSlide(j)}
              className="rounded-full transition-all duration-500 cursor-pointer"
              style={{
                width: j === activePillar ? "2.2rem" : "0.55rem",
                height: "0.55rem",
                background: j === activePillar ? "white" : "rgba(255,255,255,0.4)",
              }}
              aria-label={`Ke ${p.heading}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Component ── */


export default function App() {
  const [heroSlide, setHeroSlide] = useState(0);
  const [activePillar, setActivePillar] = useState(0);
  const [activeAccordion, setActiveAccordion] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [donationType, setDonationType] = useState<"bulanan" | "sekali">("bulanan");
  const [selectedNominal, setSelectedNominal] = useState(50000);
  const [customNominal, setCustomNominal] = useState("");
  const [showDonationPopup, setShowDonationPopup] = useState(false);
  const [popupNominal, setPopupNominal] = useState(50000);
  const [popupCustom, setPopupCustom] = useState("");
  const [copiedBank, setCopiedBank] = useState(false);
  const scrollToPillarRef = useRef<((i: number) => void) | null>(null);

  // Auto trigger popup on page reload/load after 1.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowDonationPopup(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // GSAP animation when popup is toggled
  useEffect(() => {
    if (showDonationPopup) {
      const backdrop = document.getElementById("popup-backdrop");
      const card = document.getElementById("popup-card");
      if (backdrop && card) {
        gsap.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: "power2.out" });
        gsap.fromTo(
          card,
          { scale: 0.88, opacity: 0, y: 24 },
          { scale: 1, opacity: 1, y: 0, duration: 0.55, ease: "back.out(1.4)" }
        );
      }
    }
  }, [showDonationPopup]);

  const closePopup = () => {
    const backdrop = document.getElementById("popup-backdrop");
    const card = document.getElementById("popup-card");
    if (backdrop && card) {
      gsap.to(card, { scale: 0.92, opacity: 0, y: 15, duration: 0.25, ease: "power2.in" });
      gsap.to(backdrop, {
        opacity: 0,
        duration: 0.25,
        ease: "power2.in",
        onComplete: () => setShowDonationPopup(false),
      });
    } else {
      setShowDonationPopup(false);
    }
  };

  const [activeMobileDropdown, setActiveMobileDropdown] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<"home" | "sewa-ruangan">("home");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLightNavbar, setIsLightNavbar] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 20);

      if (currentView === "sewa-ruangan") {
        setIsLightNavbar(true);
        return;
      }

      const lightSectionIds = ["story-section", "program-section", "berita-section", "cta-section"];
      let lightActive = false;
      const navbarThreshold = 80;

      for (const id of lightSectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= navbarThreshold && rect.bottom >= navbarThreshold) {
            lightActive = true;
            break;
          }
        }
      }

      setIsLightNavbar(lightActive);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [currentView]);

  const handleRoomBooking = (roomName?: string) => {
    const phone = "6287894416915";
    const roomStr = roomName ? ` untuk ${roomName}` : "";
    const message = encodeURIComponent(
      `Assalamualaikum Warahmatullahi Wabarakatuh, saya ingin menanyakan ketersediaan dan booking ruangan${roomStr} di Masjid Jami Sosrohadisewoyo.`
    );
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank", "noopener,noreferrer");
  };

  const handleCopyAccount = (no: string) => {
    navigator.clipboard.writeText(no);
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 2200);
  };

  useEffect(() => {
    const timer = setInterval(() => setHeroSlide((s) => (s + 1) % heroSlides.length), 5500);
    return () => clearInterval(timer);
  }, []);

  // Initial page load / reload GSAP Split-Screen Intro animation
  useEffect(() => {
    const overlay = document.getElementById("transition-overlay");
    const splitTop = document.getElementById("split-top");
    const splitBottom = document.getElementById("split-bottom");
    const brand = document.getElementById("overlay-brand");

    if (overlay && splitTop && splitBottom && brand) {
      overlay.style.pointerEvents = "all";
      const tl = gsap.timeline({
        onComplete: () => {
          overlay.style.pointerEvents = "none";
        },
      });

      tl.to(brand, { opacity: 1, scale: 1, duration: 0.5, ease: "power3.out" })
        .to(brand, { opacity: 0, scale: 0.8, duration: 0.35, ease: "power2.in" }, "+=0.3")
        .to(splitTop, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.8, ease: "expo.inOut" }, "-=0.15")
        .to(splitBottom, { clipPath: "inset(100% 0% 0% 0%)", duration: 0.8, ease: "expo.inOut" }, "<");
    }
  }, []);

  const currentSlide = heroSlides[heroSlide];
  const activeAccordionItem =
    accordionItems.find((i) => i.id === activeAccordion) || accordionItems[0];

  const handlePillarClick = (idx: number) => {
    if (scrollToPillarRef.current) {
      scrollToPillarRef.current(idx);
    } else {
      const elem = document.getElementById("pilar-section");
      elem?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const impactText = (n: number, type: "bulanan" | "sekali" = donationType) => {
    if (!n || n <= 0) return "Pilih nominal atau masukkan jumlah donasi Anda";
    if (type === "bulanan") {
      // Monthly — show recurring + yearly accumulation
      if (n >= 500000) return `🌾 Setiap bulan menanggung ATM beras 5 keluarga — setahun senilai Rp ${(n * 12 / 1000000).toFixed(1)}jt kebaikan berkelanjutan`;
      if (n >= 250000) return `📚 Setiap bulan membiayai 1 anak yatim penuh — setahun = ${(n * 12 / 1000).toFixed(0)}rb investasi masa depan`;
      if (n >= 100000) return `🍚 Setiap bulan beras pokok 1 keluarga dhuafa terpenuhi — amal jariyah yang terus mengalir`;
      if (n >= 50000) return `✏️ Setiap bulan 2 anak yatim mendapat perlengkapan belajar — setahun menyentuh 24 anak`;
      if (n >= 25000) return `📖 Setiap bulan mendanai 1 sesi Tahsin rutin — setahun = 12 sesi ilmu untuk umat`;
      if (n >= 10000) return `🤲 Setiap bulan berkontribusi kajian & santunan harian — kebaikan otomatis tanpa henti`;
      return `🤲 Setiap rupiah yang rutin, sekecil apapun, dicatat sebagai amal jariyah`;
    } else {
      // One-time — show direct one-time impact
      if (n >= 500000) return `🌾 Menanggung ATM beras untuk 5 keluarga dhuafa selama sebulan penuh`;
      if (n >= 250000) return `📚 Membiayai beasiswa & perlengkapan belajar 1 anak yatim selama sebulan`;
      if (n >= 100000) return `🍚 Menyediakan beras pokok untuk 1 keluarga dhuafa selama sebulan`;
      if (n >= 50000) return `✏️ Membantu 2 anak yatim mendapatkan perlengkapan belajar`;
      if (n >= 25000) return `📖 Mendukung operasional 1 sesi kelas Tahsin Al-Qur'an`;
      if (n >= 10000) return `🤲 Berkontribusi dalam program kajian dan santunan harian`;
      return `🤲 Setiap kebaikan, seberapapun kecilnya, dicatat dan dibalas`;
    }
  };

  const formatShort = (n: number) => {
    if (n >= 1000000) return `${n / 1000000}jt`;
    if (n >= 1000) return `${n / 1000}rb`;
    return String(n);
  };

  const handleWhatsAppDonation = (amount?: number | string) => {
    const phone = "6287894416915";
    const amountStr = amount ? ` sebesar Rp ${Number(amount).toLocaleString("id-ID")}` : "";
    const message = encodeURIComponent(
      `Assalamualaikum Warahmatullahi Wabarakatuh, saya ingin berdonasi${amountStr} untuk Masjid Jami Sosrohadisewoyo.`
    );
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank", "noopener,noreferrer");
  };

  const isTransitioningRef = useRef(false);

  const triggerPageTransition = (onMidTransition?: () => void, targetHeadingId?: string) => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;

    const overlay = document.getElementById("transition-overlay");
    const splitTop = document.getElementById("split-top");
    const splitBottom = document.getElementById("split-bottom");
    const brand = document.getElementById("overlay-brand");

    if (!overlay || !splitTop || !splitBottom) {
      if (onMidTransition) onMidTransition();
      isTransitioningRef.current = false;
      return;
    }

    overlay.style.pointerEvents = "all";

    const tl = gsap.timeline({
      defaults: { duration: 1.2, ease: "expo.inOut" },
      onComplete: () => {
        overlay.style.pointerEvents = "none";
        isTransitioningRef.current = false;
      },
    });

    // Phase 1: Wipe IN (Split screen closes from top and bottom)
    tl.to(splitTop, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.7, ease: "expo.inOut" }, 0)
      .to(splitBottom, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.7, ease: "expo.inOut" }, 0)
      .to(brand, { opacity: 1, scale: 1, duration: 0.5, ease: "power3.out" }, "-=0.4");

    // Phase 2: Action at mid-transition (instant jump while screen covered)
    tl.add(() => {
      if (onMidTransition) onMidTransition();
    });

    // Pause briefly so the instant scroll settles before revealing
    tl.to({}, { duration: 0.25 });

    // Phase 3: Wipe OUT (Split screen opens back up)
    tl.to(brand, { opacity: 0, scale: 0.8, duration: 0.3, ease: "power2.in" })
      .to(splitTop, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.75, ease: "expo.inOut" }, "-=0.1")
      .to(splitBottom, { clipPath: "inset(100% 0% 0% 0%)", duration: 0.75, ease: "expo.inOut" }, "<");

    // Phase 4: GSAP Stagger Reveal effect on target heading
    if (targetHeadingId) {
      tl.add(() => {
        const heading = document.getElementById(targetHeadingId);
        if (heading) {
          const targets = heading.children.length > 0 ? Array.from(heading.children) : [heading];
          gsap.fromTo(
            targets,
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.0, stagger: 0.12, ease: "expo.out", clearProps: "all" }
          );
        }
      }, "-=0.5");
    }
  };

  return (
    <>
      <style>{tickerStyle}</style>

      {/* ─────────────── GSAP SPLIT-SCREEN CLIP-PATH OVERLAY ─────────────── */}
      <div
        id="transition-overlay"
        className="fixed inset-0 z-[999999] pointer-events-none flex flex-col overflow-hidden"
        aria-hidden="true"
      >
        <div
          id="split-top"
          className="absolute top-0 left-0 w-full h-[50.5%] bg-gradient-to-br from-[#052E1C] via-[#064E3B] to-[#0F766E] split-panel-top"
        />
        <div
          id="split-bottom"
          className="absolute bottom-0 left-0 w-full h-[50.5%] bg-gradient-to-tr from-[#064E3B] via-[#0F766E] to-[#052E1C] split-panel-bottom"
        />
        <div
          id="overlay-brand"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[10000] opacity-0 scale-75 pointer-events-none flex flex-col items-center gap-3"
        >
          <img
            src="/media/image/logo.png"
            alt="Masjid Jami Sosrohadisewoyo"
            className="h-28 w-auto object-contain drop-shadow-[0_10px_25px_rgba(0,0,0,0.5)]"
          />
          <div className="h-0.5 w-16 bg-[#C89B3C] rounded-full animate-pulse" />
        </div>
      </div>

      {/* ─────────────── CLEAN DUAL-CARD OVERLAPPING DONATION POPUP ─────────────── */}
      {showDonationPopup && (
        <div
          id="popup-backdrop"
          className="fixed inset-0 z-[100000] bg-black/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) closePopup();
          }}
        >
          <div
            id="popup-card"
            className="relative w-full max-w-[820px] max-h-[92vh] my-auto flex flex-col md:flex-row items-center justify-center pointer-events-auto"
          >
            {/* 1. CARD IMAGE (Kiri / Belakang) */}
            <div className="relative w-full md:w-[48%] h-[220px] sm:h-[280px] md:h-[440px] rounded-[24px] md:rounded-[32px] overflow-hidden shadow-xl border border-white/30 shrink-0 bg-slate-900 group">
              <img
                src="/media/image/baitulmal.png"
                alt="Masjid Jami Sosrohadisewoyo Donasi"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

              {/* Badge Top-Left */}
              <div className="absolute top-4 left-4 z-0">
                <div className="inline-flex items-center gap-1.5 bg-black/60 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase text-[#FCD34D] shadow-lg">
                  <Sparkles size={12} className="animate-pulse" />
                  <span>Program Baitul Mal</span>
                </div>
              </div>

              {/* Info Bottom-Left (Scope max-w-[52%] so it never gets overlapped by the right card) */}
              <div className="absolute bottom-4 left-4 max-w-[50%] md:max-w-[54%] text-white z-0">
                <h4
                  className="text-base sm:text-lg font-black text-white leading-snug drop-shadow-md"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Tebar Kebajikan, Berdayakan Umat
                </h4>
                <p className="text-white/80 text-[10px] sm:text-[11px] mt-1 font-medium leading-tight">
                  ATM Beras, Beasiswa Yatim & Operasional Dakwah
                </p>
              </div>
            </div>

            {/* 2. CARD POPUP (Kanan / Tumpang Nindih / Clean White) */}
            <div className="relative w-full md:w-[60%] bg-white text-slate-900 rounded-[24px] md:rounded-[32px] p-5 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.25)] border border-slate-100 -mt-8 md:-mt-0 md:-ml-14 z-10 flex flex-col justify-between max-h-[90vh] overflow-y-auto">
              {/* Close Button */}
              <button
                onClick={closePopup}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-900 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-sm z-20"
                aria-label="Tutup"
              >
                <X size={16} />
              </button>

              <div>
                {/* Header Tag */}
                <div className="inline-flex items-center gap-1.5 text-[#0F766E] text-[10px] font-extrabold tracking-[0.18em] uppercase mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0F766E] animate-pulse" />
                  Masjid Jami Sosrohadisewoyo
                </div>

                {/* Clean Title */}
                <h3
                  className="text-xl sm:text-2xl font-black text-slate-900 leading-[1.2] mb-2"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Bukan sekadar donasi.
                  <br />
                  <span className="text-[#0F766E] italic">Ini adalah amal jariyah.</span>
                </h3>

                {/* Subtitle / Quote */}
                <p className="text-slate-600 text-xs leading-relaxed mb-3.5 font-medium">
                  Setiap rupiah donasi Anda menjadi beras untuk keluarga dhuafa, beasiswa anak yatim,
                  dan operasional dakwah yang pahalanya terus mengalir.
                </p>

                {/* Nominal Selector Pills */}
                <div className="mb-3">
                  <label className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block mb-1.5">
                    Pilih Nominal Donasi
                  </label>
                  <div className="grid grid-cols-3 gap-1.5 mb-2">
                    {[25000, 50000, 100000, 250000, 500000].map((nom) => {
                      const isSelected = popupNominal === nom && !popupCustom;
                      return (
                        <button
                          key={nom}
                          onClick={() => {
                            setPopupNominal(nom);
                            setPopupCustom("");
                          }}
                          className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all duration-200 cursor-pointer border ${
                            isSelected
                              ? "bg-[#064E3B] text-white border-[#064E3B] shadow-sm scale-[1.02]"
                              : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300"
                          }`}
                        >
                          Rp {formatShort(nom)}
                        </button>
                      );
                    })}
                    <input
                      type="number"
                      placeholder="Lainnya"
                      value={popupCustom}
                      onChange={(e) => setPopupCustom(e.target.value)}
                      className="py-1.5 px-2 rounded-lg text-[11px] font-bold bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0F766E] transition-colors"
                    />
                  </div>

                  {/* Impact preview */}
                  <div className="bg-emerald-50/80 border border-emerald-200/60 rounded-lg p-2.5 flex items-center gap-2 text-[11px] text-emerald-900 font-semibold">
                    <Heart size={14} className="text-[#0F766E] shrink-0" />
                    <span className="leading-tight">
                      {impactText(popupCustom ? Number(popupCustom) : popupNominal, "sekali")}
                    </span>
                  </div>
                </div>

                {/* Bank Account Info Card */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 mb-3.5">
                  <div className="flex items-center justify-between text-[10px] mb-1">
                    <span className="text-slate-500 font-bold uppercase tracking-wider">
                      Transfer Bank Syariah (BSI)
                    </span>
                    <span className="text-[#0F766E] font-bold flex items-center gap-1">
                      <ShieldCheck size={12} /> Terverifikasi Amanah
                    </span>
                  </div>
                  <div className="flex items-center justify-between bg-white rounded-lg px-3 py-1.5 border border-slate-200 shadow-sm">
                    <div>
                      <div className="text-[10px] text-slate-400 font-bold tracking-wider">
                        BSI - 7234 8889 01
                      </div>
                      <div className="text-xs font-bold text-slate-800">a.n. Masjid Jami Sosrohadisewoyo</div>
                    </div>
                    <button
                      onClick={() => handleCopyAccount("7234888901")}
                      className="flex items-center gap-1 bg-[#C89B3C] hover:bg-[#b5882e] text-white px-2.5 py-1 rounded-md text-[11px] font-bold transition-all shadow-sm active:scale-95 cursor-pointer shrink-0"
                    >
                      {copiedBank ? <Check size={12} /> : <Copy size={12} />}
                      <span>{copiedBank ? "Tersalin" : "Salin"}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-1.5">
                <button
                  onClick={() => {
                    closePopup();
                    handleWhatsAppDonation(popupCustom || popupNominal);
                  }}
                  className="w-full bg-[#C89B3C] hover:bg-[#b5882e] text-white font-bold py-3 px-5 rounded-full text-xs tracking-wider uppercase transition-all duration-300 shadow-md shadow-[#C89B3C]/20 hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Donasi Sekarang</span>
                  <ArrowRight size={15} />
                </button>

                <button
                  onClick={closePopup}
                  className="text-slate-400 hover:text-slate-700 text-[11px] font-semibold py-0.5 transition-colors cursor-pointer text-center"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div
        className="min-h-screen text-foreground"
        style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
      >
        {/* ─────────────── NAVBAR ─────────────── */}
        <nav
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
            !isScrolled && currentView === "home"
              ? "bg-transparent border-none shadow-none backdrop-blur-none"
              : isLightNavbar
              ? "bg-white/96 backdrop-blur-md shadow-md border-b border-slate-100"
              : "bg-[#064E3B]/96 backdrop-blur-md shadow-xl border-b border-white/10"
          }`}
        >
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10 h-[72px] flex items-center justify-between">
            {/* Logo */}
            <div
              className="flex items-center flex-shrink-0 cursor-pointer py-1"
              onClick={() => {
                setCurrentView("home");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <img
                src={isLightNavbar ? "/media/image/logo2.png" : "/media/image/logo.png"}
                alt="Masjid Jami Sosrohadisewoyo"
                className="h-20 sm:h-24 lg:h-28 w-auto object-contain drop-shadow-2xl transition-transform duration-300 hover:scale-105"
              />
            </div>

            {/* Center links with rich dropdowns */}
            <div className="hidden lg:flex items-center gap-7">
              {navLinks.map((link, idx) => (
                <div key={link.label} className="relative group py-5">
                  <button
                    onClick={() => {
                      setCurrentView("home");
                      const el = document.getElementById("pilar-section");
                      el?.scrollIntoView({ behavior: "smooth" });
                      handlePillarClick(idx);
                    }}
                    className={`flex items-center gap-1.5 text-sm font-bold transition-colors duration-200 cursor-pointer ${
                      isLightNavbar ? "text-[#C89B3C] hover:text-[#064E3B]" : "text-white/85 hover:text-white"
                    }`}
                  >
                    <span>{link.label}</span>
                    <ChevronDown size={14} className={`transition-transform duration-300 ${isLightNavbar ? "text-[#C89B3C]" : "opacity-70"} group-hover:rotate-180`} />
                  </button>

                  {/* Dropdown Menu Overlay Card */}
                  {link.hasDropdown && link.dropdownItems && (
                    <div className="absolute top-full left-0 -ml-2 w-64 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-250 z-50 pt-1">
                      <div className="bg-white rounded-2xl p-2 shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-slate-100 flex flex-col gap-0.5 max-h-[75vh] overflow-y-auto">
                        {link.dropdownItems.map((item, itemIdx) => (
                          <div
                            key={itemIdx}
                            onClick={() => {
                              if (item.badge === "Segera Dibuka") return;
                              if (item.title === "Sewa Ruangan") {
                                setCurrentView("sewa-ruangan");
                                window.scrollTo({ top: 0, behavior: "smooth" });
                                return;
                              }
                              setCurrentView("home");
                              const el = document.getElementById("pilar-section");
                              el?.scrollIntoView({ behavior: "smooth" });
                              handlePillarClick(idx);
                            }}
                            className="group/item flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                          >
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-slate-700 group-hover/item:text-[#064E3B] transition-colors">
                                {item.title}
                              </span>
                              {item.badge && (
                                <span className="text-[10px] font-bold text-amber-600 mt-0.5">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            {item.hasSubmenu && (
                              <ChevronRight size={14} className="text-slate-400 group-hover/item:text-[#064E3B] transition-colors" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Right */}
            <div className="hidden lg:flex items-center gap-5">
              <button
                onClick={() => {
                  setCurrentView("home");
                  const el = document.getElementById("story-section");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`text-sm font-bold transition-colors cursor-pointer ${
                  isLightNavbar ? "text-[#C89B3C] hover:text-[#064E3B]" : "text-white/65 hover:text-white"
                }`}
              >
                Story
              </button>
              <button
                onClick={() => {
                  setCurrentView("home");
                  const el = document.getElementById("program-section");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`text-sm font-bold transition-colors cursor-pointer ${
                  isLightNavbar ? "text-[#C89B3C] hover:text-[#064E3B]" : "text-white/65 hover:text-white"
                }`}
              >
                Menjadi Bagian
              </button>
              <button
                onClick={() => handleWhatsAppDonation()}
                className="bg-[#C89B3C] hover:bg-[#b5882e] text-white text-sm font-bold px-5 py-2.5 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-[#C89B3C]/30 tracking-wide cursor-pointer"
              >
                DONASI
              </button>
            </div>

            {/* Mobile hamburger */}
            <button
              className={`lg:hidden p-2 ${isLightNavbar ? "text-[#C89B3C]" : "text-white"}`}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {menuOpen && (
            <div className={`lg:hidden border-t px-6 py-5 flex flex-col gap-3 max-h-[80vh] overflow-y-auto ${
              isLightNavbar ? "bg-white border-slate-100 shadow-xl" : "bg-[#064E3B] border-white/10"
            }`}>
              {navLinks.map((link, idx) => {
                const isExpanded = activeMobileDropdown === link.label;
                return (
                  <div key={link.label} className={`flex flex-col border-b pb-2 ${isLightNavbar ? "border-slate-100" : "border-white/10"}`}>
                    <div
                      onClick={() => {
                        setActiveMobileDropdown(isExpanded ? null : link.label);
                      }}
                      className={`flex items-center justify-between py-1.5 text-base font-bold cursor-pointer ${
                        isLightNavbar ? "text-[#C89B3C]" : "text-white"
                      }`}
                    >
                      <span>{link.label}</span>
                      <ChevronDown
                        size={16}
                        className={`transition-transform duration-300 ${isExpanded ? "rotate-180 text-[#C89B3C]" : isLightNavbar ? "text-[#C89B3C]/70" : "opacity-60"}`}
                      />
                    </div>

                    {isExpanded && link.dropdownItems && (
                      <div className="pl-3 py-2 flex flex-col gap-2 border-l-2 border-[#C89B3C]/50 my-1 bg-black/15 rounded-r-xl">
                        {link.dropdownItems.map((item, itemIdx) => (
                          <div
                            key={itemIdx}
                            onClick={() => {
                              setMenuOpen(false);
                              if (item.badge === "Segera Dibuka") return;
                              if (item.title === "Sewa Ruangan") {
                                setCurrentView("sewa-ruangan");
                                window.scrollTo({ top: 0, behavior: "smooth" });
                                return;
                              }
                              setCurrentView("home");
                              const el = document.getElementById("pilar-section");
                              el?.scrollIntoView({ behavior: "smooth" });
                              handlePillarClick(idx);
                            }}
                            className="flex items-center justify-between py-1.5 px-2.5 rounded-lg hover:bg-white/10 cursor-pointer"
                          >
                            <span className="text-xs font-semibold text-white/90">{item.title}</span>
                            {item.badge && (
                              <span className="text-[9px] font-bold text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-full border border-amber-300/30">
                                {item.badge}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleWhatsAppDonation();
                }}
                className="bg-[#C89B3C] text-white font-bold py-3 rounded-full mt-2 tracking-wide cursor-pointer"
              >
                DONASI SEKARANG
              </button>
            </div>
          )}
        </nav>

        {/* ─────────────── SEWA RUANGAN PAGE OR HOME ─────────────── */}
        {currentView === "sewa-ruangan" ? (
          <div className="min-h-screen bg-[#FAFAFA] text-[#111827] pt-28 pb-20 font-sans">
            {/* Top Bar Navigation */}
            <div className="max-w-[1240px] mx-auto px-6 mb-8 flex items-center justify-between">
              <button
                onClick={() => {
                  setCurrentView("home");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="inline-flex items-center gap-2 bg-[#064E3B] text-white hover:bg-[#0F766E] font-bold px-5 py-2.5 rounded-full text-xs sm:text-sm transition-all duration-300 shadow-md cursor-pointer"
              >
                <ChevronLeft size={16} />
                <span>Kembali ke Beranda</span>
              </button>
              <div className="text-xs font-bold text-[#0F766E] uppercase tracking-wider hidden sm:block">
                Masjid Jami Sosrohadisewoyo • Layanan Sewa Ruangan
              </div>
            </div>

            {/* Hero Banner */}
            <div className="max-w-[1240px] mx-auto px-6 mb-14">
              <div className="relative bg-gradient-to-br from-[#052E1C] via-[#064E3B] to-[#0F766E] text-white rounded-3xl p-8 sm:p-12 overflow-hidden shadow-2xl">
                <img
                  src="/media/image/baitulmuamalah.png"
                  alt="Sewa Ruangan Masjid"
                  className="absolute inset-0 w-full h-full object-cover opacity-15 mix-blend-overlay"
                />
                <div className="relative z-10 max-w-2xl">
                  <div className="inline-flex items-center gap-2 bg-[#C89B3C]/20 border border-[#C89B3C]/40 px-3.5 py-1 rounded-full text-xs font-bold text-[#FCD34D] uppercase tracking-widest mb-4">
                    <Sparkles size={13} className="animate-pulse" />
                    <span>Fasilitas & Layanan Acara</span>
                  </div>
                  <h1
                    className="text-4xl sm:text-5xl font-black leading-tight mb-4"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    Sewa Ruangan
                  </h1>
                  <p className="text-white/80 text-sm sm:text-base leading-relaxed mb-6 font-medium">
                    Sewa ruangan di sisi halaman Masjid Jami' Sosrohadisewoyo untuk berbagai kebutuhan acara Anda. Fasilitas lengkap, lokasi strategis, dan harga yang terjangkau untuk seminar, meeting, acara keluarga, dan kajian Islam.
                  </p>
                  {/* Stats */}
                  <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm font-bold">
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-xl">
                      🏢 3 Ruangan Utama
                    </div>
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-xl">
                      👥 Kapasitas s/d 300 Orang
                    </div>
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-xl">
                      ⏰ Akses 24 Jam
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* YouTube Video Section */}
            <div className="max-w-[1240px] mx-auto px-6 mb-16">
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <span className="text-[#0F766E] text-xs font-bold uppercase tracking-widest block mb-1">
                      Video Tur & Profil
                    </span>
                    <h3
                      className="text-2xl sm:text-3xl font-black text-slate-900"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      Suasana & Fasilitas Ruangan
                    </h3>
                  </div>
                </div>
                {/* YouTube Embed Player */}
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-md bg-black">
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0&rel=0"
                    title="Video Profil Sewa Ruangan Masjid Jami Sosrohadisewoyo"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </div>

            {/* Pilihan Ruangan Cards */}
            <div className="max-w-[1240px] mx-auto px-6 mb-16">
              <div className="text-center max-w-2xl mx-auto mb-10">
                <span className="text-[#0F766E] text-xs font-bold uppercase tracking-widest block mb-2">
                  Kapasitas & Fasilitas Lengkap
                </span>
                <h2
                  className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight mb-3"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Pilihan Ruangan
                </h2>
                <p className="text-slate-600 text-sm font-medium">
                  Berbagai pilihan ruangan dengan kapasitas dan fasilitas yang berbeda sesuai kebutuhan acara Anda
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Card 1: Aula Lantai 2 Masjid */}
                <div className="bg-white rounded-3xl p-7 shadow-xl border border-slate-200/80 flex flex-col justify-between hover:shadow-2xl transition-all duration-300">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="bg-[#064E3B]/10 text-[#064E3B] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        Aula Utama
                      </span>
                      <span className="text-[#C89B3C] font-black text-lg sm:text-xl">
                        Rp 800.000 <span className="text-xs text-slate-500 font-normal">/ 8 jam</span>
                      </span>
                    </div>
                    <h3
                      className="text-2xl font-black text-slate-900 mb-3"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      Aula Lantai 2 Masjid
                    </h3>
                    <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-600 mb-6 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                      <div>👥 200 orang</div>
                      <div>📐 15m x 20m</div>
                    </div>
                    <div className="space-y-2 mb-8">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                        Fasilitas Termasuk:
                      </span>
                      {["AC", "Sound System", "Proyektor", "Panggung"].map((f) => (
                        <div key={f} className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
                          <Check size={15} className="text-[#0F766E]" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRoomBooking("Aula Lantai 2 Masjid")}
                    className="w-full bg-[#C89B3C] hover:bg-[#b5882e] text-white font-bold py-3.5 rounded-full text-xs uppercase tracking-widest shadow-md transition-all cursor-pointer"
                  >
                    Pesan Sekarang
                  </button>
                </div>

                {/* Card 2: Ruang Serbaguna */}
                <div className="bg-white rounded-3xl p-7 shadow-xl border border-slate-200/80 flex flex-col justify-between hover:shadow-2xl transition-all duration-300">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="bg-[#0F766E]/10 text-[#0F766E] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        Ruang Serbaguna
                      </span>
                      <span className="text-[#C89B3C] font-black text-lg sm:text-xl">
                        Rp 500.000 <span className="text-xs text-slate-500 font-normal">/ 8 jam</span>
                      </span>
                    </div>
                    <h3
                      className="text-2xl font-black text-slate-900 mb-3"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      Ruang Serbaguna
                    </h3>
                    <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-600 mb-6 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                      <div>👥 100 orang</div>
                      <div>📐 10m x 15m</div>
                    </div>
                    <div className="space-y-2 mb-8">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                        Fasilitas Termasuk:
                      </span>
                      {["AC", "Meja Kursi", "Whiteboard", "WiFi"].map((f) => (
                        <div key={f} className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
                          <Check size={15} className="text-[#0F766E]" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRoomBooking("Ruang Serbaguna")}
                    className="w-full bg-[#C89B3C] hover:bg-[#b5882e] text-white font-bold py-3.5 rounded-full text-xs uppercase tracking-widest shadow-md transition-all cursor-pointer"
                  >
                    Pesan Sekarang
                  </button>
                </div>
              </div>
            </div>

            {/* Special Package: Pembuatan Undangan Digital */}
            <div className="max-w-[1240px] mx-auto px-6 mb-16">
              <div className="bg-gradient-to-r from-[#052E1C] to-[#0F766E] text-white rounded-3xl p-8 sm:p-10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 border border-emerald-500/30">
                <div className="max-w-xl">
                  <div className="inline-flex items-center gap-2 bg-[#C89B3C] text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-3 shadow-sm">
                    ✨ Paket Tambahan Spesial
                  </div>
                  <h3
                    className="text-2xl sm:text-3xl font-black text-white leading-tight mb-2"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    Paket Pembuatan Undangan Digital Islami
                  </h3>
                  <p className="text-white/80 text-xs sm:text-sm leading-relaxed font-medium">
                    Lengkapi acara Anda dengan Website Undangan Digital Syar'i (untuk Pernikahan, Aqiqah, atau Syukuran) dengan fitur RSVP tamu otomatis, Musik Islami, dan petunjuk lokasi Google Maps.
                  </p>
                </div>
                <button
                  onClick={() => handleRoomBooking("Paket Undangan Digital")}
                  className="bg-[#C89B3C] hover:bg-[#b5882e] text-white font-extrabold px-7 py-3.5 rounded-full text-xs uppercase tracking-wider transition-all shadow-xl hover:scale-105 shrink-0 cursor-pointer"
                >
                  Tanya Paket Undangan
                </button>
              </div>
            </div>

            {/* Fasilitas Pendukung */}
            <div className="max-w-[1240px] mx-auto px-6 mb-16">
              <div className="text-center max-w-xl mx-auto mb-10">
                <h3
                  className="text-2xl sm:text-3xl font-black text-slate-900 mb-2"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Fasilitas Pendukung
                </h3>
                <p className="text-slate-500 text-xs sm:text-sm font-medium">
                  Fasilitas lengkap untuk mendukung kesuksesan acara Anda
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-md flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#0F766E]/10 text-[#0F766E] flex items-center justify-center shrink-0 font-bold text-lg">
                    📶
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm mb-1">WiFi Gratis</h4>
                    <p className="text-xs text-slate-500 font-medium">Internet untuk semua ruangan</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-md flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#064E3B]/10 text-[#064E3B] flex items-center justify-center shrink-0 font-bold text-lg">
                    🅿️
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm mb-1">Parkir Luas</h4>
                    <p className="text-xs text-slate-500 font-medium">Area parkir yang luas untuk mobil dan motor</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Jenis Acara */}
            <div className="max-w-[1240px] mx-auto px-6 mb-16">
              <div className="text-center max-w-xl mx-auto mb-10">
                <h3
                  className="text-2xl sm:text-3xl font-black text-slate-900 mb-2"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Jenis Acara
                </h3>
                <p className="text-slate-500 text-xs sm:text-sm font-medium">
                  Ruangan kami cocok untuk berbagai jenis acara dan kegiatan
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    icon: "📚",
                    title: "Seminar & Workshop",
                    desc: "Ruang ideal untuk seminar, workshop, dan pelatihan",
                    rooms: ["Aula Utama", "Ruang Serbaguna", "Ruang Kelas"],
                  },
                  {
                    icon: "💼",
                    title: "Meeting & Rapat",
                    desc: "Ruang meeting untuk rapat bisnis dan organisasi",
                    rooms: ["Ruang Meeting", "Ruang Serbaguna"],
                  },
                  {
                    icon: "👨‍👩‍👧‍👦",
                    title: "Acara Keluarga",
                    desc: "Ruang untuk acara keluarga seperti aqiqah, syukuran",
                    rooms: ["Aula Utama", "Ruang Serbaguna"],
                  },
                  {
                    icon: "🕌",
                    title: "Kajian & Pengajian",
                    desc: "Ruang untuk kajian Islam dan pengajian",
                    rooms: ["Aula Utama", "Ruang Serbaguna", "Ruang Kelas"],
                  },
                ].map((evt) => (
                  <div key={evt.title} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-lg flex flex-col justify-between">
                    <div>
                      <div className="text-3xl mb-3">{evt.icon}</div>
                      <h4 className="font-bold text-slate-900 text-base mb-2">{evt.title}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed mb-4 font-medium">{evt.desc}</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                        Ruangan yang cocok:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {evt.rooms.map((r) => (
                          <span key={r} className="text-[10px] font-semibold bg-white border border-slate-200 px-2 py-0.5 rounded-md text-slate-700">
                            {r}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cara Booking */}
            <div className="max-w-[1240px] mx-auto px-6 mb-16">
              <div className="text-center max-w-xl mx-auto mb-10">
                <h3
                  className="text-2xl sm:text-3xl font-black text-slate-900 mb-2"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Cara Booking
                </h3>
                <p className="text-slate-500 text-xs sm:text-sm font-medium">
                  Proses booking yang mudah dan cepat untuk memesan ruangan
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { step: "1", title: "Pilih Ruangan", desc: "Pilih ruangan sesuai kebutuhan dan kapasitas acara Anda" },
                  { step: "2", title: "Hubungi Admin", desc: "Hubungi admin via WhatsApp untuk cek ketersediaan" },
                  { step: "3", title: "Konfirmasi Booking", desc: "Konfirmasi tanggal, waktu, dan detail acara" },
                  { step: "4", title: "Pembayaran", desc: "Lakukan pembayaran sesuai dengan harga yang disepakati" },
                ].map((s) => (
                  <div key={s.step} className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-md relative">
                    <div className="w-9 h-9 rounded-full bg-[#064E3B] text-white font-black text-sm flex items-center justify-center mb-4">
                      {s.step}
                    </div>
                    <h4 className="font-bold text-slate-900 text-base mb-1.5">{s.title}</h4>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Syarat & Ketentuan */}
            <div className="max-w-[1240px] mx-auto px-6 mb-16">
              <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xl">
                <h3
                  className="text-2xl font-black text-slate-900 mb-6"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Syarat & Ketentuan
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm mb-3 text-[#0F766E]">
                      Ketentuan Umum:
                    </h4>
                    <ul className="space-y-2">
                      <li>• Booking minimal H-7 sebelum acara</li>
                      <li>• Pembayaran DP 50% saat konfirmasi</li>
                      <li>• Pelunasan maksimal H-1 acara</li>
                      <li>• Acara harus sesuai dengan nilai-nilai Islam</li>
                      <li>• Tidak diperkenankan untuk acara yang bertentangan dengan syariat</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm mb-3 text-[#0F766E]">
                      Fasilitas Termasuk:
                    </h4>
                    <ul className="space-y-2">
                      <li>• Penggunaan ruangan sesuai durasi</li>
                      <li>• Fasilitas dasar (AC, listrik, air)</li>
                      <li>• Cleaning service setelah acara</li>
                      <li>• Parkir gratis untuk peserta</li>
                      <li>• Akses WiFi gratis</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-slate-100 text-xs text-slate-400 italic font-medium">
                  Catatan: Harga dapat berubah sewaktu-waktu. Untuk informasi terbaru dan booking, silakan hubungi admin melalui WhatsApp.
                </div>
              </div>
            </div>

            {/* Final CTA Banner */}
            <div className="max-w-[1240px] mx-auto px-6">
              <div className="bg-gradient-to-br from-[#064E3B] via-[#052E1C] to-[#0A5940] text-white rounded-3xl p-8 sm:p-12 text-center shadow-2xl relative overflow-hidden">
                <h3
                  className="text-3xl sm:text-4xl font-black mb-3"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Siap Mengadakan Acara Anda?
                </h3>
                <p className="text-white/80 text-sm max-w-xl mx-auto mb-8 font-medium leading-relaxed">
                  Hubungi admin kami sekarang untuk cek ketersediaan ruangan dan dapatkan penawaran terbaik untuk acara Anda di Masjid Jami' Sosrohadisewoyo.
                </p>
                <button
                  onClick={() => handleRoomBooking()}
                  className="bg-[#C89B3C] hover:bg-[#b5882e] text-white font-extrabold px-9 py-4 rounded-full text-xs sm:text-sm uppercase tracking-widest shadow-xl hover:scale-105 transition-all cursor-pointer"
                >
                  Booking Sekarang
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
        <section className="relative h-screen min-h-[700px] overflow-hidden">
          {heroSlides.map((slide, i) => (
            <div
              key={slide.id}
              className="absolute inset-0 transition-opacity duration-1200"
              style={{ opacity: i === heroSlide ? 1 : 0, transition: "opacity 1.2s ease" }}
            >
              <img
                src={slide.bg}
                alt={slide.heading}
                className="w-full h-full object-cover"
                style={{
                  transform: i === heroSlide ? "scale(1)" : "scale(1.06)",
                  transition: "transform 6s ease-out",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-black/10" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
          ))}

          {/* Ticker — hanya di hero, tidak ikut scroll navbar */}
          <div className="absolute top-[90px] lg:top-[100px] left-0 right-0 z-20 bg-[#C89B3C] h-9 flex items-center overflow-hidden">
            <div className="flex animate-ticker whitespace-nowrap">
              {[...tickerItems, ...tickerItems, ...tickerItems, ...tickerItems].map((item, i) => (
                <span
                  key={i}
                  className="text-white text-[11px] font-bold tracking-[0.18em] uppercase mx-7"
                >
                  {item}
                  <span className="opacity-40 mx-3">◆</span>
                </span>
              ))}
            </div>
          </div>

          {/* Floating News Card — absolute center-right, tidak terpotong */}
          <div className="hidden lg:block absolute right-10 top-1/2 -translate-y-1/2 z-20">
            <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl overflow-hidden shadow-2xl w-[270px]">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1776855828554-dfbeed18ffa2?w=420&h=180&fit=crop&auto=format"
                  alt="Berita terkini"
                  className="w-full h-32 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#C89B3C] animate-pulse" />
                  <span className="text-[#C89B3C] text-[10px] font-bold tracking-[0.2em] uppercase">
                    Berita Terbaru
                  </span>
                </div>
                <h3
                  className="text-white text-sm font-bold leading-snug mb-2"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  ATM Beras Menjangkau 1.000 Penerima Manfaat
                </h3>
                <p className="text-white/55 text-xs leading-relaxed mb-3">
                  Program ATM Beras menyentuh lebih dari seribu keluarga dhuafa setiap bulan.
                </p>
                <button className="inline-flex items-center gap-1.5 text-[#C89B3C] text-xs font-semibold hover:gap-2.5 transition-all duration-200">
                  Baca Selengkapnya <ArrowRight size={12} />
                </button>
              </div>
            </div>
          </div>

          <div className="relative z-10 h-full flex items-end pb-20 pt-[120px]">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-10 w-full">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 border border-[#C89B3C]/50 rounded-full bg-[#C89B3C]/10 backdrop-blur-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#C89B3C]" />
                  <span className="text-[#C89B3C] text-[11px] font-bold tracking-[0.2em] uppercase">
                    {currentSlide.pillar}
                  </span>
                </div>

                <h1
                  className="text-6xl lg:text-8xl font-bold text-white leading-none mb-5"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {currentSlide.heading}
                </h1>

                <p className="text-white/80 text-xl lg:text-2xl font-medium mb-7 whitespace-pre-line leading-snug">
                  {currentSlide.sub}
                </p>

                <div className="border-l-2 border-[#C89B3C] pl-4 mb-9 max-w-md">
                  <p className="text-white/55 text-sm italic leading-relaxed">
                    {currentSlide.quote}
                  </p>
                  <p className="text-[#C89B3C] text-xs mt-1.5 font-bold tracking-wide">
                    {currentSlide.quoteRef}
                  </p>
                </div>

                <button className="group inline-flex items-center gap-3 bg-[#C89B3C] hover:bg-white text-white hover:text-[#064E3B] font-bold px-8 py-4 rounded-full transition-all duration-300 shadow-xl shadow-[#C89B3C]/20 hover:shadow-white/20 text-sm tracking-wide">
                  {currentSlide.cta}
                  <ArrowRight
                    size={17}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>

                {/* Slide indicators */}
                <div className="flex items-center gap-3 mt-10">
                  {heroSlides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setHeroSlide(i)}
                      className="transition-all duration-300 rounded-full"
                      style={{
                        width: i === heroSlide ? "2rem" : "0.5rem",
                        height: "0.5rem",
                        background: i === heroSlide ? "#C89B3C" : "rgba(255,255,255,0.35)",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────── STORY TELLING ─────────────── */}
        <section id="story-section" className="py-14 lg:py-20 bg-[#FAFAFA] overflow-hidden">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 bg-[#0F766E]/10 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-[#0F766E]" />
                <span className="text-[#0F766E] text-[11px] font-bold tracking-[0.2em] uppercase">
                  Story
                </span>
              </div>
              <h2
                id="story-heading"
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#111827] leading-tight mb-5"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Dari Sebuah Masjid,
                <br />
                <span className="text-[#0F766E] italic">Lahir Sebuah Peradaban.</span>
              </h2>
              <p className="text-[#6B7280] text-sm sm:text-base leading-relaxed mb-4">
                Masjid Jami Sosrohadisewoyo berdiri bukan sekadar sebagai tempat shalat. Ia adalah
                jantung komunitas — tempat di mana anak-anak belajar mengeja Al-Quran, keluarga
                mendapat santunan di saat sulit, dan pasangan baru memulai hidup bersama dalam
                keberkahan.
              </p>
              <p className="text-[#6B7280] text-sm sm:text-base leading-relaxed mb-7">
                Selama bertahun-tahun, kami merawat tiga pilar: Baitullah untuk kemakmuran ibadah,
                Baitul Mal untuk keadilan sosial, dan Baitul Muamalah untuk keberkahan muamalah.
                Ketiganya bergerak bersama membentuk ekosistem Islam yang utuh.
              </p>
              <button
                onClick={() => {
                  const el = document.getElementById("pilar-section");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="group inline-flex items-center gap-3 border-2 border-[#0F766E] text-[#0F766E] hover:bg-[#0F766E] hover:text-white font-bold px-7 py-3 rounded-full transition-all duration-300 text-sm tracking-wide cursor-pointer"
              >
                Mulai Perjalanan
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="relative my-4 lg:my-0">
              <div className="w-full rounded-2xl overflow-hidden bg-[#042014] shadow-2xl relative flex items-center justify-center border border-emerald-950/20 max-h-[460px] aspect-[4/5] sm:aspect-auto">
                <video
                  src="/media/vidio/story.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full max-h-[460px] object-contain rounded-2xl"
                />
              </div>
              <div className="absolute -bottom-3 -left-3 sm:-bottom-4 sm:-left-4 bg-[#064E3B] text-white rounded-2xl px-5 py-4 shadow-xl z-10">
                <div
                  className="text-2xl sm:text-3xl font-bold"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  1.000+
                </div>
                <div className="text-white/60 text-[10px] sm:text-xs mt-0.5 font-medium tracking-wide uppercase">
                  Penerima Manfaat
                </div>
              </div>
              <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 bg-[#C89B3C] text-white rounded-2xl px-5 py-4 shadow-xl z-10">
                <div
                  className="text-2xl sm:text-3xl font-bold"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  3
                </div>
                <div className="text-white/80 text-[10px] sm:text-xs mt-0.5 font-medium tracking-wide uppercase">
                  Pilar Utama
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────── TIGA PILAR — SCROLL HORIZONTAL ─────────────── */}
        <PilarScrollSection
          pillarSlides={pillarSlides}
          activePillar={activePillar}
          setActivePillar={setActivePillar}
          onRegisterScrollTo={(fn) => (scrollToPillarRef.current = fn)}
        />

        {/* ─────────────── PROGRAM UNGGULAN — EDITORIAL MORPHING STYLE ─────────────── */}
        <section id="program-section" className="min-h-screen lg:h-[calc(100vh-72px)] flex items-center bg-[#F9FAFB] pt-[84px] pb-8 lg:py-0 overflow-hidden">
          <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-10 h-full flex flex-col justify-center">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
              
              {/* Left Column: Bold Yellow Accent Block with Ambient Morphing Texture */}
              <div className="lg:col-span-5 relative bg-[#F59E0B] rounded-3xl p-6 lg:p-8 flex flex-col justify-between overflow-hidden shadow-2xl text-gray-950 min-h-[480px] lg:min-h-[520px] transition-all duration-700 ease-out hover:shadow-amber-500/25 hover:scale-[1.005]">
                {/* Subtle Geometric Pattern Overlay */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-15 transition-all duration-1000 group-hover:opacity-30 group-hover:scale-105"
                  style={{
                    backgroundImage: `radial-gradient(circle at 100% 100%, transparent 0, transparent 40px, #000 41px, #000 43px, transparent 44px), radial-gradient(circle at 0 0, transparent 0, transparent 40px, #000 41px, #000 43px, transparent 44px)`,
                    backgroundSize: "80px 80px",
                  }}
                />

                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 text-[11px] font-black tracking-[0.25em] uppercase mb-3 text-gray-900/80 bg-black/5 backdrop-blur-sm px-3 py-1 rounded-full border border-black/10">
                    <span className="w-2 h-2 rounded-full bg-black animate-ping" />
                    Program Unggulan
                  </div>
                  <h2
                    className="text-3xl lg:text-4xl font-black leading-[1.1] tracking-tight mb-3 text-gray-950"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    Mengapa Harus Menjadi Bagian Dari Kami?
                  </h2>
                  <p className="text-gray-900/80 text-xs sm:text-sm leading-relaxed font-medium max-w-sm mb-4">
                    Setiap program dirancang dengan niat tulus — bukan sekadar kegiatan, tapi keberlanjutan kebaikan bagi umat.
                  </p>
                </div>

                {/* Active Program Photo Preview with Morphing Scale Crossfade */}
                <div className="relative z-10 my-2 rounded-2xl overflow-hidden shadow-xl border border-black/15 h-28 lg:h-36 group cursor-pointer transition-all duration-500 hover:shadow-2xl">
                  <img
                    key={activeAccordionItem.id}
                    src={activeAccordionItem.image}
                    alt={activeAccordionItem.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 ease-out"
                    style={{ animation: "fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent transition-opacity duration-500" />
                  <div className="absolute bottom-2.5 left-3.5 right-3.5 text-white flex items-end justify-between gap-2">
                    <div>
                      <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#F59E0B] block mb-0.5">
                        {activeAccordionItem.tag}
                      </span>
                      <div className="text-xs font-bold truncate">
                        {activeAccordionItem.title}
                      </div>
                    </div>
                    <span className="text-[10px] bg-white/25 backdrop-blur-md px-2.5 py-0.5 rounded-full text-white font-mono shrink-0 shadow-sm border border-white/20">
                      ● Aktif
                    </span>
                  </div>
                </div>

                {/* CTA Link at bottom of block with Morphing Underline */}
                <div className="relative z-10 pt-1">
                  <button
                    onClick={() => document.getElementById("donasi-section")?.scrollIntoView({ behavior: "smooth" })}
                    className="group inline-flex items-center gap-2.5 text-gray-950 font-black text-sm hover:text-black transition-all cursor-pointer"
                  >
                    <span className="relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2.5px] after:bg-gray-950 group-hover:after:w-full after:transition-all after:duration-300">
                      Lihat Semua Program
                    </span>
                    <ArrowRight size={17} className="group-hover:translate-x-2.5 transition-transform duration-300 ease-out" />
                  </button>
                </div>
              </div>

              {/* Right Column: Morphing Editorial List Cards */}
              <div className="lg:col-span-7 flex flex-col justify-center">
                <div className="space-y-2">
                  {accordionItems.map((item, index) => {
                    const isOpen = activeAccordion === item.id;
                    return (
                      <div
                        key={item.id}
                        onClick={() => setActiveAccordion(item.id)}
                        className={`group transition-all duration-400 ease-out cursor-pointer ${
                          isOpen
                            ? "bg-white shadow-lg rounded-2xl border-l-4 border-l-[#0F766E] border-y border-r border-gray-200/80 scale-[1.01]"
                            : "bg-transparent border-b border-gray-200 hover:bg-gray-100/60 border-l-4 border-l-transparent rounded-xl"
                        }`}
                      >
                        <div className="py-3.5 lg:py-4 px-4 lg:px-6 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3.5 flex-1">
                            {/* Morphing Monospace Index Badge */}
                            <span
                              className={`text-xs font-mono font-bold transition-all duration-300 ${
                                isOpen
                                  ? "bg-[#0F766E]/10 text-[#0F766E] px-2 py-0.5 rounded-md scale-105"
                                  : "text-gray-400 group-hover:text-gray-700"
                              }`}
                            >
                              0{index + 1}
                            </span>
                            <div>
                              <div className="text-[9px] font-bold tracking-[0.2em] uppercase text-[#0F766E] mb-0.5">
                                {item.tag}
                              </div>
                              <h3
                                className={`text-base lg:text-lg font-bold transition-all duration-300 ${
                                  isOpen ? "text-[#064E3B] translate-x-1" : "text-gray-900 group-hover:text-[#0F766E] group-hover:translate-x-0.5"
                                }`}
                                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                              >
                                {item.title}
                              </h3>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {/* Morphing Arrow Icon */}
                            <ChevronRight
                              size={18}
                              className={`transition-all duration-400 ease-out ${
                                isOpen
                                  ? "text-[#0F766E] rotate-90 scale-110"
                                  : "text-gray-400 group-hover:text-gray-900 group-hover:translate-x-1"
                              }`}
                            />
                          </div>
                        </div>

                        {/* Expandable description smoothly inside item */}
                        {isOpen && (
                          <div className="px-4 lg:px-6 pb-4 pt-0 pl-14 transition-all duration-400">
                            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed max-w-xl mb-3 border-t border-gray-100 pt-2">
                              {item.description}
                            </p>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                document.getElementById("donasi-section")?.scrollIntoView({ behavior: "smooth" });
                              }}
                              className="group/btn inline-flex items-center gap-1.5 text-[#0F766E] text-xs font-extrabold hover:text-[#064E3B] transition-all cursor-pointer"
                            >
                              <span className="relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#0F766E] group-hover/btn:after:w-full after:transition-all">
                                Ikut Berkontribusi
                              </span>
                              <ArrowRight size={13} className="group-hover/btn:translate-x-1 transition-transform duration-200" />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        </section>


        {/* ─────────────── WATERFALL PHOTO SECTION ─────────────── */}
        <section id="cta-section" className="relative h-screen bg-[#0a0a0a] overflow-hidden flex items-center justify-center">

          {/* ── Photo columns scrolling from bottom to top ── */}
          {(() => {
            const bgImages = [
              "/media/image/bg/bg (1).jpeg",
              "/media/image/bg/bg (2).jpeg",
              "/media/image/bg/bg (3).jpeg",
              "/media/image/bg/bg (4).jpeg",
              "/media/image/bg/bg (5).jpeg",
              "/media/image/bg/bg (6).jpeg",
              "/media/image/bg/bg (7).jpeg",
              "/media/image/bg/bg (8).jpeg",
              "/media/image/bg/bg (9).jpeg",
              "/media/image/bg/bg (10).jpeg",
              "/media/image/bg/bg (11).jpeg",
              "/media/image/bg/bg (12).jpeg",
              "/media/image/bg/bg (13).jpeg",
              "/media/image/bg/bg (14).jpeg",
            ];

            const cols = [
              {
                speed: "animate-float-slow",
                delay: "0s",
                offset: "mt-[-60px]",
                photos: [
                  { src: bgImages[0], label: "Santunan Yatim" },
                  { src: bgImages[1], label: "ATM Beras" },
                  { src: bgImages[2], label: "Tahsin" },
                  { src: bgImages[3], label: "Kajian" },
                  { src: bgImages[4], label: "Santunan Yatim" },
                  { src: bgImages[5], label: "ATM Beras" },
                  { src: bgImages[6], label: "Tahsin" },
                  { src: bgImages[7], label: "Kajian" },
                ],
              },
              {
                speed: "animate-float-medium",
                delay: "-8s",
                offset: "mt-[-120px]",
                photos: [
                  { src: bgImages[8], label: "Wedding" },
                  { src: bgImages[9], label: "Relawan" },
                  { src: bgImages[10], label: "Qurban" },
                  { src: bgImages[11], label: "Ramadhan" },
                  { src: bgImages[12], label: "Wedding" },
                  { src: bgImages[13], label: "Relawan" },
                  { src: bgImages[0], label: "Qurban" },
                  { src: bgImages[1], label: "Ramadhan" },
                ],
              },
              {
                speed: "animate-float-fast",
                delay: "-4s",
                offset: "mt-[-40px]",
                photos: [
                  { src: bgImages[2], label: "Jumat Berbagi" },
                  { src: bgImages[3], label: "Anak Mengaji" },
                  { src: bgImages[4], label: "Gotong Royong" },
                  { src: bgImages[5], label: "Digital Learning" },
                  { src: bgImages[6], label: "Jumat Berbagi" },
                  { src: bgImages[7], label: "Anak Mengaji" },
                  { src: bgImages[8], label: "Gotong Royong" },
                  { src: bgImages[9], label: "Digital Learning" },
                ],
              },
              {
                speed: "animate-float-slow",
                delay: "-14s",
                offset: "mt-[-90px]",
                photos: [
                  { src: bgImages[10], label: "Kolaborasi" },
                  { src: bgImages[11], label: "Wedding Islami" },
                  { src: bgImages[12], label: "Ramadhan" },
                  { src: bgImages[13], label: "Qurban" },
                  { src: bgImages[0], label: "Kolaborasi" },
                  { src: bgImages[1], label: "Wedding Islami" },
                  { src: bgImages[2], label: "Ramadhan" },
                  { src: bgImages[3], label: "Qurban" },
                ],
              },
              {
                speed: "animate-float-medium",
                delay: "-19s",
                offset: "mt-[-70px]",
                photos: [
                  { src: bgImages[4], label: "ATM Beras" },
                  { src: bgImages[5], label: "Jumat Berbagi" },
                  { src: bgImages[6], label: "Santunan Yatim" },
                  { src: bgImages[7], label: "Tahsin Online" },
                  { src: bgImages[8], label: "ATM Beras" },
                  { src: bgImages[9], label: "Jumat Berbagi" },
                  { src: bgImages[10], label: "Santunan Yatim" },
                  { src: bgImages[11], label: "Tahsin Online" },
                ],
              },
            ];

            return (
              <div className="absolute inset-0 flex gap-3 px-3 pointer-events-none select-none">
                {cols.map((col, ci) => (
                  <div
                    key={ci}
                    className={`flex-1 min-w-0 ${col.offset}`}
                  >
                    <div
                      className={`flex flex-col gap-3 ${col.speed}`}
                      style={{ animationDelay: col.delay, animationTimingFunction: "linear" }}
                    >
                      {col.photos.map((photo, pi) => (
                        <div
                          key={pi}
                          className="relative rounded-2xl overflow-hidden flex-shrink-0 w-full"
                          style={{
                            height: `${pi % 3 === 0 ? 220 : pi % 3 === 1 ? 180 : 200}px`,
                            opacity: 0.38,
                          }}
                        >
                          <img
                            src={photo.src}
                            alt={photo.label}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          <span className="absolute bottom-2 left-2.5 text-[9px] text-white/70 font-bold uppercase tracking-widest">
                            {photo.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}

          {/* ── Dark vignette top & bottom ── */}
          <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#0a0a0a] to-transparent z-10 pointer-events-none" />

          {/* ── Centered Headline Overlay ── */}
          <div className="relative z-20 text-center max-w-3xl mx-auto px-6 flex flex-col items-center">
            <div
              className="text-[#C89B3C] text-8xl leading-none mb-1 opacity-50 select-none"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              "
            </div>

            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight mb-5"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: "0 4px 40px rgba(0,0,0,0.8)" }}
            >
              Setiap Langkah Kecil Menjadi Amal Yang Terus Mengalir.
            </h2>

            <p className="text-white/55 text-base font-medium mb-9 max-w-md" style={{ textShadow: "0 2px 20px rgba(0,0,0,0.9)" }}>
              Bergabunglah dengan ribuan jiwa yang telah memilih untuk berdampak.
            </p>

            <button
              onClick={() => document.getElementById("donasi-section")?.scrollIntoView({ behavior: "smooth" })}
              className="group inline-flex items-center gap-3 bg-[#C89B3C] hover:bg-[#b5882e] text-white font-bold px-8 py-4 rounded-full transition-all duration-300 shadow-2xl shadow-[#C89B3C]/30 text-sm tracking-wide hover:scale-105"
            >
              Mari Berdampak
              <ArrowRight size={17} className="group-hover:translate-x-1.5 transition-transform" />
            </button>
          </div>
        </section>


        {/* ─────────────── DONASI ─────────────── */}
        <section
          id="donasi-section"
          className="relative bg-[#064E3B] flex items-center overflow-hidden"
          style={{ minHeight: "100svh", paddingTop: "72px" }}
        >
          {/* Subtle texture overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.04]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,1) 40px, rgba(255,255,255,1) 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,1) 40px, rgba(255,255,255,1) 41px)",
            }}
          />

          <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 lg:px-10 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

              {/* ── Left ── */}
              <div className="flex flex-col">
                {/* Tag */}
                <div className="inline-flex items-center gap-2 mb-4 self-start px-3 py-1.5 bg-white/10 rounded-full border border-white/15">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#C89B3C]" />
                  <span className="text-[#C89B3C] text-[11px] font-black tracking-[0.2em] uppercase">
                    Donasi
                  </span>
                </div>

                {/* Headline */}
                <h2
                  className="text-3xl sm:text-4xl lg:text-[2.75rem] font-black text-white leading-[1.1] tracking-tight mb-3"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Setiap Rupiah Adalah<br />
                  <span className="text-[#C89B3C]">Investasi Akhirat</span>
                </h2>

                <p className="text-white/60 text-sm leading-relaxed mb-5 max-w-md">
                  Amanah yang Anda titipkan kami kelola dengan penuh tanggung jawab untuk tiga pilar keberlanjutan umat.
                </p>

                {/* Ayat card */}
                <div className="bg-white/7 backdrop-blur-sm border border-white/12 rounded-2xl p-5 mb-5">
                  <p className="text-white/75 text-sm italic leading-relaxed mb-2">
                    "Perumpamaan orang yang menginfakkan hartanya di jalan Allah seperti sebutir biji yang menumbuhkan tujuh tangkai, pada setiap tangkai ada seratus biji..."
                  </p>
                  <p className="text-[#C89B3C] text-[11px] font-black tracking-widest uppercase">
                    QS Al-Baqarah: 261
                  </p>
                </div>

                {/* Photo */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xl h-36 lg:h-44">
                  <img
                    src="https://images.unsplash.com/photo-1776855828554-dfbeed18ffa2?w=700&h=400&fit=crop&auto=format"
                    alt="Donasi"
                    className="w-full h-full object-cover opacity-75"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#064E3B]/80 to-transparent" />
                  <div className="absolute bottom-3 left-4">
                    <p className="text-white text-xs font-bold">1.000+ Penerima Manfaat</p>
                    <p className="text-white/60 text-[10px]">Setiap bulan, tanpa henti</p>
                  </div>
                </div>
              </div>

              {/* ── Right — Donation Form ── */}
              <div className="bg-white rounded-3xl p-6 lg:p-7 shadow-2xl">
                <h3
                  className="text-xl font-black text-[#111827] mb-4"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Pilih Jenis Donasi
                </h3>

                {/* Type toggle */}
                <div className="flex bg-[#F3F4F6] rounded-full p-1 mb-2">
                  {(["bulanan", "sekali"] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setDonationType(type)}
                      className="flex-1 py-2 rounded-full text-sm font-bold capitalize transition-all duration-200 cursor-pointer"
                      style={{
                        background: donationType === type ? "#0F766E" : "transparent",
                        color: donationType === type ? "#fff" : "#6B7280",
                        boxShadow: donationType === type ? "0 2px 8px rgba(15,118,110,0.25)" : "none",
                      }}
                    >
                      {type === "bulanan" ? "🔄 Bulanan" : "💳 Sekali Bayar"}
                    </button>
                  ))}
                </div>

                {/* Donation type description */}
                <p className="text-[11px] text-center mb-3.5 font-medium" style={{ color: donationType === "bulanan" ? "#0F766E" : "#9CA3AF" }}>
                  {donationType === "bulanan"
                    ? "✨ Donasi otomatis tiap bulan — jadikan kebaikan sebagai kebiasaan"
                    : "Donasi satu kali — langsung tersalurkan ke program pilihan"}
                </p>

                {/* Nominal grid */}
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {nominals.map((n) => {
                    const active = selectedNominal === n && !customNominal;
                    return (
                      <button
                        key={n}
                        onClick={() => { setSelectedNominal(n); setCustomNominal(""); }}
                        className="py-2.5 rounded-xl text-sm font-bold transition-all duration-200 border cursor-pointer"
                        style={{
                          background: active ? "#0F766E" : "#fff",
                          color: active ? "#fff" : "#374151",
                          borderColor: active ? "#0F766E" : "#E5E7EB",
                          boxShadow: active ? "0 4px 14px rgba(15,118,110,0.2)" : "none",
                        }}
                      >
                        {formatShort(n)}
                      </button>
                    );
                  })}
                </div>

                {/* Custom input */}
                <div className="mb-4">
                  <div
                    className="flex items-center border rounded-xl overflow-hidden transition-colors duration-200"
                    style={{ borderColor: customNominal ? "#0F766E" : "#E5E7EB" }}
                  >
                    <span className="px-4 text-[#6B7280] text-sm font-semibold bg-[#F9FAFB] border-r border-[#E5E7EB] py-3 flex-shrink-0">
                      Rp
                    </span>
                    <input
                      type="number"
                      placeholder="Nominal lainnya"
                      value={customNominal}
                      onChange={(e) => { setCustomNominal(e.target.value); setSelectedNominal(0); }}
                      className="flex-1 px-4 py-3 text-sm text-[#111827] outline-none bg-transparent"
                    />
                  </div>
                </div>

                {/* Impact box */}
                <div
                  className="rounded-xl p-3.5 mb-4 border transition-colors duration-300"
                  style={{
                    background: donationType === "bulanan" ? "#ECFDF5" : "#F0F9FF",
                    borderColor: donationType === "bulanan" ? "#A7F3D0" : "#BAE6FD",
                  }}
                >
                  <div className="text-[10px] mb-1 font-black tracking-wide uppercase flex items-center gap-1.5"
                    style={{ color: donationType === "bulanan" ? "#059669" : "#0284C7" }}
                  >
                    {donationType === "bulanan" ? "🔄 Dampak Bulanan (Amal Jariyah)" : "⚡ Dampak Donasi Sekali"}
                  </div>
                  <div className="font-semibold text-sm" style={{ color: donationType === "bulanan" ? "#064E3B" : "#0C4A6E" }}>
                    {impactText(customNominal ? Number(customNominal) : selectedNominal)}
                  </div>
                </div>

                {/* CTA button */}
                <button
                  onClick={() => handleWhatsAppDonation(customNominal || selectedNominal)}
                  className="w-full text-white font-black py-3.5 rounded-full text-sm tracking-widest transition-all duration-300 shadow-lg uppercase hover:scale-[1.02] cursor-pointer"
                  style={{
                    background: donationType === "bulanan" ? "#0F766E" : "#C89B3C",
                    boxShadow: donationType === "bulanan" ? "0 4px 20px rgba(15,118,110,0.3)" : "0 4px 20px rgba(200,155,60,0.3)",
                  }}
                >
                  {donationType === "bulanan" ? "🔄 Mulai Donasi Bulanan" : "💳 Donasi Sekarang"}
                </button>
                <p className="text-center text-[#9CA3AF] text-xs mt-2.5 font-medium">
                  {donationType === "bulanan"
                    ? "Bisa dibatalkan kapan saja · Transfer Bank, QRIS & e-Wallet"
                    : "Transfer Bank, QRIS & e-Wallet tersedia"}
                </p>
              </div>

            </div>
          </div>
        </section>


        {/* ─────────────── BERITA ─────────────── */}
        <section className="py-24 lg:py-28 bg-[#FAFAFA]">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <div className="flex items-end justify-between mb-12">
              <div>
                <span className="text-[#0F766E] text-[11px] font-bold tracking-[0.2em] uppercase mb-3 block">
                  Terkini
                </span>
                <h2
                  className="text-4xl lg:text-5xl font-bold text-[#111827] leading-tight"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Berita &<br />Aktivitas
                </h2>
              </div>
              <button className="hidden lg:inline-flex items-center gap-2 text-[#0F766E] font-bold text-sm hover:gap-3 transition-all duration-200">
                Lihat Semua <ArrowRight size={15} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newsItems.map((item) => {
                const catColor =
                  item.category === "Baitul Mal"
                    ? { bg: "rgba(15,118,110,0.1)", text: "#0F766E" }
                    : item.category === "Baitullah"
                    ? { bg: "rgba(6,78,59,0.1)", text: "#064E3B" }
                    : { bg: "rgba(200,155,60,0.12)", text: "#C89B3C" };
                return (
                  <div
                    key={item.id}
                    className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-400 border border-[#E5E7EB] cursor-pointer"
                  >
                    <div className="aspect-[3/2] overflow-hidden bg-[#0F766E]/10">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-5">
                      <span
                        className="inline-block text-[10px] font-bold tracking-[0.18em] uppercase mb-3 px-2.5 py-1 rounded-full"
                        style={{ background: catColor.bg, color: catColor.text }}
                      >
                        {item.category}
                      </span>
                      <h4
                        className="text-[#111827] font-bold text-base leading-snug mb-3 group-hover:text-[#0F766E] transition-colors duration-200"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                      >
                        {item.title}
                      </h4>
                      <p className="text-[#9CA3AF] text-xs font-medium">{item.date}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─────────────── PENUTUP / CTA ─────────────── */}
        <section className="relative py-32 lg:py-40 overflow-hidden bg-[#FAFAFA] flex items-center justify-center">
          {/* Subtle bg mesh pattern */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(#064E3B 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          {/* High-clarity Floating Photo Cards around the text */}
          <div className="absolute inset-0 pointer-events-none hidden md:block">
            {/* Top-Left Card */}
            <div className="absolute top-10 left-8 lg:left-16 w-48 lg:w-56 h-60 lg:h-68 rounded-3xl overflow-hidden shadow-2xl border-4 border-white rotate-[-6deg] hover:rotate-0 transition-transform duration-500 pointer-events-auto group">
              <img
                src="https://images.unsplash.com/photo-1722252799008-0b26d4d6965b?w=400&h=500&fit=crop&auto=format"
                alt="Santunan Yatim"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <span className="absolute bottom-3 left-3 text-white text-[11px] font-bold tracking-wide bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                Santunan Yatim
              </span>
            </div>

            {/* Bottom-Left Card */}
            <div className="absolute bottom-10 left-12 lg:left-24 w-44 lg:w-52 h-52 lg:h-60 rounded-3xl overflow-hidden shadow-2xl border-4 border-white rotate-[5deg] hover:rotate-0 transition-transform duration-500 pointer-events-auto group">
              <img
                src="https://images.unsplash.com/photo-1661865781226-bdea5c686d51?w=400&h=500&fit=crop&auto=format"
                alt="ATM Beras"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <span className="absolute bottom-3 left-3 text-white text-[11px] font-bold tracking-wide bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                ATM Beras
              </span>
            </div>

            {/* Top-Right Card */}
            <div className="absolute top-12 right-8 lg:right-16 w-48 lg:w-56 h-60 lg:h-68 rounded-3xl overflow-hidden shadow-2xl border-4 border-white rotate-[7deg] hover:rotate-0 transition-transform duration-500 pointer-events-auto group">
              <img
                src="https://images.unsplash.com/photo-1528862973381-9bc5ad6d4227?w=400&h=500&fit=crop&auto=format"
                alt="Tahsin Al-Qur'an"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <span className="absolute bottom-3 left-3 text-white text-[11px] font-bold tracking-wide bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                Tahsin Al-Qur'an
              </span>
            </div>

            {/* Bottom-Right Card */}
            <div className="absolute bottom-12 right-12 lg:right-24 w-44 lg:w-52 h-52 lg:h-60 rounded-3xl overflow-hidden shadow-2xl border-4 border-white rotate-[-4deg] hover:rotate-0 transition-transform duration-500 pointer-events-auto group">
              <img
                src="https://images.unsplash.com/photo-1757017199822-beab923a1afc?w=400&h=500&fit=crop&auto=format"
                alt="Wedding Islami"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <span className="absolute bottom-3 left-3 text-white text-[11px] font-bold tracking-wide bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                Wedding Islami
              </span>
            </div>
          </div>

          {/* Central content */}
          <div className="relative z-10 text-center max-w-2xl mx-auto px-6 py-4">
            <span className="inline-block text-[#0F766E] text-[11px] font-black tracking-[0.25em] uppercase mb-4 px-4 py-1.5 bg-[#0F766E]/10 rounded-full border border-[#0F766E]/20">
              Bergabung Bersama Kami
            </span>
            <h2
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#111827] leading-[1.15] mb-3"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Masjid Bukan Sekadar
              <br />
              Tempat Ibadah.
            </h2>
            <p
              className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0F766E] mb-6 italic"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Ia Adalah Tempat Harapan Dilahirkan.
            </p>
            <p className="text-[#4B5563] text-sm sm:text-base mb-10 max-w-lg mx-auto leading-relaxed font-medium">
              Mari menjadi bagian dari perjalanan ini — setiap donasi, setiap doa, setiap langkah
              Anda berarti bagi ribuan jiwa.
            </p>

            <button
              onClick={() => handleWhatsAppDonation()}
              className="group inline-flex items-center gap-3 bg-[#064E3B] hover:bg-[#0F766E] text-white font-black px-9 py-4.5 rounded-full text-sm sm:text-base transition-all duration-300 shadow-2xl shadow-[#064E3B]/30 tracking-wide hover:scale-105 cursor-pointer"
            >
              Mulai Berdonasi
              <ArrowRight
                size={19}
                className="group-hover:translate-x-1.5 transition-transform"
              />
            </button>
          </div>
        </section>
        </>
        )}

        {/* ─────────────── FOOTER ─────────────── */}
        <footer className="relative overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="/media/image/footerbg.png"
              alt="Masjid Jami Sosrohadisewoyo"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-[#064E3B]/92" />
          </div>

          <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10 pt-20 pb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16 items-start">
              {/* Col 1 – Brand */}
              <div className="flex flex-col">
                {/* Logo — tanpa jarak berlebih */}
                <img
                  src="/media/image/logo.png"
                  alt="Masjid Jami Sosrohadisewoyo"
                  className="h-28 sm:h-32 w-auto object-contain drop-shadow-xl mb-4 self-start"
                />
                {/* Alamat — langsung di bawah logo, sejajar dengan Baitul Mal */}
                <p className="text-white/60 text-sm leading-relaxed mb-4">
                  Jalan Monginsidi No. 51, RT 011/RW 002,<br />
                  Desa Pelem (Pelem II), Kec. Ngawi,<br />
                  Kabupaten Ngawi, Jawa Timur
                </p>
                <div className="flex flex-col gap-2.5 text-sm">
                  <a
                    href="https://wa.me/6287894416915"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2.5 text-white/80 hover:text-[#25D366] transition-colors font-medium group self-start"
                  >
                    <div className="w-7 h-7 rounded-full bg-[#25D366] flex items-center justify-center text-white shrink-0 shadow-md group-hover:scale-110 transition-transform">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984 0 1.758.459 3.474 1.33 4.987l-1.412 5.161 5.283-1.386c1.455.794 3.1 1.214 4.786 1.215h.004c5.505 0 9.988-4.478 9.989-9.985.001-2.669-1.034-5.177-2.919-7.063-1.884-1.886-4.39-2.913-7.071-2.913zm5.955 14.129c-.253.712-1.464 1.358-2.025 1.442-.516.077-1.173.109-1.89-.12-.435-.14-1.002-.327-1.734-.644-3.097-1.341-5.111-4.475-5.267-4.683-.154-.207-1.261-1.677-1.261-3.198 0-1.52.793-2.268 1.077-2.559.283-.292.617-.365.823-.365.206 0 .412.002.593.011.192.009.45-.073.704.536.262.628.894 2.183.972 2.342.077.159.129.344.025.552-.103.207-.154.336-.309.516-.154.181-.325.405-.464.544-.154.154-.315.322-.136.63.181.309.801 1.323 1.72 2.143 1.18 1.052 2.176 1.378 2.485 1.533.309.155.49.129.67-.077.181-.206.772-.901.978-1.21.206-.309.412-.258.695-.155.283.103 1.8.85 2.109 1.004.309.155.515.232.593.361.077.13.077.747-.176 1.459z"/>
                      </svg>
                    </div>
                    <span className="font-bold text-white tracking-wide group-hover:text-[#25D366]">087894416915</span>
                  </a>
                  <a
                    href="mailto:masjidjamisosrohadisewoyo@gmail.com"
                    className="text-white/60 hover:text-white transition-colors font-medium"
                  >
                    masjidjamisosrohadisewoyo@gmail.com
                  </a>
                </div>
              </div>

              {/* Col 2 – Program */}
              <div className="lg:pt-32">
                <h4 className="text-white font-bold mb-5 text-[11px] tracking-[0.2em] uppercase">
                  Program
                </h4>
                {["Baitullah", "Baitul Mal", "Baitul Muamalah", "Kajian Rutin", "Kelas Tahsin"].map(
                  (l) => (
                    <div key={l} className="mb-3">
                      <a
                        href="#"
                        className="text-white/45 text-sm hover:text-[#C89B3C] transition-colors duration-200"
                      >
                        {l}
                      </a>
                    </div>
                  )
                )}
              </div>

              {/* Col 3 – Tentang */}
              <div className="lg:pt-32">
                <h4 className="text-white font-bold mb-5 text-[11px] tracking-[0.2em] uppercase">
                  Tentang
                </h4>
                {["Story Kami", "Tim & Pengurus", "Laporan Keuangan", "Kemitraan", "Kontak"].map(
                  (l) => (
                    <div key={l} className="mb-3">
                      <a
                        href="#"
                        className="text-white/45 text-sm hover:text-[#C89B3C] transition-colors duration-200"
                      >
                        {l}
                      </a>
                    </div>
                  )
                )}
              </div>

              {/* Col 4 – CTA */}
              <div className="lg:pt-32">
                <h4
                  className="text-white font-bold text-2xl leading-tight mb-4"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Mari Bersama Membangun Peradaban
                </h4>
                <p className="text-white/45 text-sm mb-6 leading-relaxed">
                  Setiap kebaikan yang Anda semai hari ini akan terus berbuah untuk generasi
                  mendatang.
                </p>
                <button
                  onClick={() => handleWhatsAppDonation()}
                  className="w-full bg-[#C89B3C] hover:bg-[#b5882e] text-white font-bold py-3.5 rounded-full transition-all duration-300 text-sm tracking-widest uppercase shadow-lg shadow-[#C89B3C]/20 cursor-pointer"
                >
                  Donasi Sekarang
                </button>
              </div>
            </div>

            <div className="border-t border-white/10 pt-6 flex flex-col lg:flex-row justify-between items-center gap-3">
              <p className="text-white/25 text-xs font-medium">
                © 2026 Masjid Jami Sosrohadisewoyo. Hak cipta dilindungi.
              </p>
              <p className="text-white/18 text-xs">
                Dibangun dengan niat tulus untuk kemaslahatan umat.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
