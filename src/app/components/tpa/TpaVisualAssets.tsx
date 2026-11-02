import React from "react";

/* ──────────────────────────────────────────────────────────
   1. ICON 3D CLAY/JUMBO ASSETS (TRANSPARENT CUTOUTS — NO BG / NO FRAME)
   ────────────────────────────────────────────────────────── */

interface IconProps {
  className?: string;
  size?: number;
}

/** 1. Tahsin & Tajwid Sanad — 3D Quran on Rehal (Transparent Cutout) */
export const IconTahsin3D: React.FC<IconProps> = ({ className = "", size = 64 }) => (
  <div
    className={`relative flex items-center justify-center transition-transform duration-300 hover:scale-110 ${className}`}
    style={{ width: size, height: size }}
  >
    <img
      src="/media/tpa/icon_3d_tahsin.png"
      alt="Ikon 3D Tahsin Al-Qur'an"
      className="w-full h-full object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.12)]"
    />
  </div>
);

/** 2. Tahfidz Juz 30 — 3D Crescent Moon, Star & Emerald Tasbih (Transparent Cutout) */
export const IconTahfidz3D: React.FC<IconProps> = ({ className = "", size = 64 }) => (
  <div
    className={`relative flex items-center justify-center transition-transform duration-300 hover:scale-110 ${className}`}
    style={{ width: size, height: size }}
  >
    <img
      src="/media/tpa/icon_3d_tahfidz.png"
      alt="Ikon 3D Tahfidz Juz 30"
      className="w-full h-full object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.12)]"
    />
  </div>
);

/** 3. Qur'anic Tech Kids — 3D Kid-Friendly Laptop with Code & Sprout (Transparent Cutout) */
export const IconTech3D: React.FC<IconProps> = ({ className = "", size = 64 }) => (
  <div
    className={`relative flex items-center justify-center transition-transform duration-300 hover:scale-110 ${className}`}
    style={{ width: size, height: size }}
  >
    <img
      src="/media/tpa/icon_3d_tech.png"
      alt="Ikon 3D Qur'anic Tech"
      className="w-full h-full object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.12)]"
    />
  </div>
);

/** 4. Adab & Karakter Santri — 3D Clay Heart wearing Indonesian Peci & Emerald Laurel */
export const IconAdab3D: React.FC<IconProps> = ({ className = "", size = 64 }) => (
  <div
    className={`relative flex items-center justify-center transition-transform duration-300 hover:scale-110 ${className}`}
    style={{ width: size, height: size }}
  >
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.12)]">
      <defs>
        <linearGradient id="heartGrad" x1="20" y1="20" x2="80" y2="90" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF6B6B" />
          <stop offset="0.5" stopColor="#EE5253" />
          <stop offset="1" stopColor="#C82333" />
        </linearGradient>
        <linearGradient id="peciGrad" x1="35" y1="10" x2="65" y2="35" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2D3436" />
          <stop offset="1" stopColor="#1E272E" />
        </linearGradient>
        <linearGradient id="goldTrim" x1="35" y1="30" x2="65" y2="30" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F9CA24" />
          <stop offset="1" stopColor="#F0932B" />
        </linearGradient>
        <radialGradient id="highlight" cx="40" cy="40" r="30" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" stopOpacity="0.45" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      <path
        d="M50 82C50 82 18 64 18 42C18 30 27 22 38 22C44 22 48 26 50 30C52 26 56 22 62 22C73 22 82 30 82 42C82 64 50 82 50 82Z"
        fill="url(#heartGrad)"
      />
      <circle cx="34" cy="34" r="8" fill="url(#highlight)" />
      <circle cx="66" cy="34" r="6" fill="url(#highlight)" />

      <path
        d="M36 24C36 15 42 11 50 11C58 11 64 15 64 24H36Z"
        fill="url(#peciGrad)"
      />
      <rect x="35" y="22" width="30" height="3" rx="1.5" fill="url(#goldTrim)" />

      <path d="M14 62C12 56 16 50 20 48C20 54 18 60 14 62Z" fill="#10B981" />
      <path d="M86 62C88 56 84 50 80 48C80 54 82 60 86 62Z" fill="#10B981" />
      <path d="M22 74C18 70 20 64 25 64C26 69 24 73 22 74Z" fill="#059669" />
      <path d="M78 74C82 70 80 64 75 64C74 69 76 73 78 74Z" fill="#059669" />
    </svg>
  </div>
);

/** 5. 01 Amati — 3D Stylized Clay Magnifying Glass with Glowing Star */
export const IconAmati3D: React.FC<IconProps> = ({ className = "", size = 56 }) => (
  <div
    className={`relative flex items-center justify-center transition-transform duration-300 hover:scale-110 ${className}`}
    style={{ width: size, height: size }}
  >
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.12)]">
      <defs>
        <linearGradient id="lensRim" x1="15" y1="15" x2="65" y2="65" gradientUnits="userSpaceOnUse">
          <stop stopColor="#34D399" />
          <stop offset="1" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="handle" x1="55" y1="55" x2="85" y2="85" gradientUnits="userSpaceOnUse">
          <stop stopColor="#C89B3C" />
          <stop offset="1" stopColor="#92400E" />
        </linearGradient>
      </defs>
      <rect x="58" y="55" width="12" height="34" rx="6" transform="rotate(-45 58 55)" fill="url(#handle)" />
      <circle cx="42" cy="42" r="28" fill="url(#lensRim)" />
      <circle cx="42" cy="42" r="22" fill="#E6FFFA" fillOpacity="0.85" />
      <path
        d="M42 28L45 37L54 37L47 43L50 52L42 46L34 52L37 43L30 37L39 37Z"
        fill="#F59E0B"
      />
      <path d="M30 32C34 26 44 24 50 26" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
    </svg>
  </div>
);

/** 6. 02 Coba — 3D Stylized Science Flask with Sparkling Gears */
export const IconCoba3D: React.FC<IconProps> = ({ className = "", size = 56 }) => (
  <div
    className={`relative flex items-center justify-center transition-transform duration-300 hover:scale-110 ${className}`}
    style={{ width: size, height: size }}
  >
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.12)]">
      <defs>
        <linearGradient id="flaskLiquid" x1="20" y1="45" x2="80" y2="85" gradientUnits="userSpaceOnUse">
          <stop stopColor="#38BDF8" />
          <stop offset="1" stopColor="#0284C7" />
        </linearGradient>
        <linearGradient id="flaskGlass" x1="30" y1="15" x2="70" y2="85" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E0F2FE" stopOpacity="0.8" />
          <stop offset="1" stopColor="#BAE6FD" stopOpacity="0.4" />
        </linearGradient>
      </defs>
      <path
        d="M44 20H56V38L78 72C82 78 78 86 70 86H30C22 86 18 78 22 72L44 38V20Z"
        fill="url(#flaskGlass)"
        stroke="#0284C7"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <path
        d="M26 73L38 52C44 54 56 50 62 52L74 73C76 77 74 82 68 82H32C26 82 24 77 26 73Z"
        fill="url(#flaskLiquid)"
      />
      <circle cx="45" cy="65" r="4" fill="#ffffff" fillOpacity="0.8" />
      <circle cx="55" cy="58" r="3" fill="#ffffff" fillOpacity="0.8" />
      <circle cx="48" cy="40" r="2.5" fill="#38BDF8" />
      <circle cx="68" cy="30" r="3" fill="#FBBF24" />
      <circle cx="28" cy="40" r="2.5" fill="#F472B6" />
    </svg>
  </div>
);

/** 7. 03 Tanya — 3D Stylized Question Mark turning into Glowing Lightbulb */
export const IconTanya3D: React.FC<IconProps> = ({ className = "", size = 56 }) => (
  <div
    className={`relative flex items-center justify-center transition-transform duration-300 hover:scale-110 ${className}`}
    style={{ width: size, height: size }}
  >
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.12)]">
      <defs>
        <linearGradient id="bulbGrad" x1="30" y1="15" x2="70" y2="65" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FDE047" />
          <stop offset="1" stopColor="#F59E0B" />
        </linearGradient>
        <linearGradient id="baseGrad" x1="40" y1="65" x2="60" y2="82" gradientUnits="userSpaceOnUse">
          <stop stopColor="#94A3B8" />
          <stop offset="1" stopColor="#475569" />
        </linearGradient>
      </defs>
      <path d="M50 8V14M18 40H24M76 40H82M27 20L32 25M73 20L68 25" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" />
      <path
        d="M32 40C32 30.06 40.06 22 50 22C59.94 22 68 30.06 68 40C68 47 64 52 60 56V65H40V56C36 52 32 47 32 40Z"
        fill="url(#bulbGrad)"
      />
      <path
        d="M46 32C46 29.8 47.8 28 50 28C52.2 28 54 29.8 54 32C54 35 50 36 50 39M50 44V45"
        stroke="#B45309"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <rect x="42" y="65" width="16" height="5" rx="1.5" fill="url(#baseGrad)" />
      <rect x="44" y="71" width="12" height="4" rx="1.5" fill="url(#baseGrad)" />
      <path d="M46 76H54" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
    </svg>
  </div>
);

/** 8. 04 Temukan — 3D Stylized Treasure Compass with Emerald Prism */
export const IconTemukan3D: React.FC<IconProps> = ({ className = "", size = 56 }) => (
  <div
    className={`relative flex items-center justify-center transition-transform duration-300 hover:scale-110 ${className}`}
    style={{ width: size, height: size }}
  >
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.12)]">
      <defs>
        <linearGradient id="compassDial" x1="20" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F472B6" />
          <stop offset="1" stopColor="#DB2777" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="34" fill="#FDF2F8" stroke="url(#compassDial)" strokeWidth="4" />
      <circle cx="50" cy="50" r="28" stroke="#FCE7F3" strokeWidth="2" strokeDasharray="4 4" />
      <polygon points="50,22 55,46 50,44 45,46" fill="#DB2777" />
      <polygon points="50,78 55,54 50,56 45,54" fill="#9CA3AF" />
      <polygon points="78,50 54,55 56,50 54,45" fill="#F472B6" />
      <polygon points="22,50 46,55 44,50 46,45" fill="#D1D5DB" />
      <circle cx="50" cy="50" r="5" fill="#10B981" />
      <circle cx="48" cy="48" r="1.5" fill="#ffffff" />
    </svg>
  </div>
);

/* ──────────────────────────────────────────────────────────
   2. ANIMATED JUMBO CHARACTER COMPONENTS (MENYATU DENGAN WEB — TANPA FRAME / TANPA BG)
   ────────────────────────────────────────────────────────── */

/** Boy Murid Character: Cutout PNG Transparan Tanpa Frame / Tanpa Background */
export const JumboBoyCharacter: React.FC<{
  speech?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}> = ({
  speech = "Assalamualaikum Ayah & Bunda! Yuk kenalan sama TPA MJS di Jl. Monginsidi, Pelem, Ngawi!",
  size = "md",
  className = "",
}) => {
  const sizeMap = {
    sm: "w-28 h-36 sm:w-36 sm:h-44",
    md: "w-44 h-56 sm:w-56 sm:h-72",
    lg: "w-60 h-76 sm:w-72 sm:h-92",
  };

  return (
    <div className={`relative flex flex-col items-center group pointer-events-auto ${className}`}>
      {/* Speech Bubble Melayang Halus di Atas Murid */}
      {speech && (
        <div className="mb-2 max-w-[260px] sm:max-w-[320px] bg-white rounded-2xl p-3 sm:p-4 shadow-xl border border-emerald-300 text-slate-800 text-xs sm:text-sm font-medium leading-relaxed relative animate-jumbo-bounce select-none">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-emerald-700 font-bold text-xs uppercase tracking-wider flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
              Murid Cilik MJS
            </span>
            <span className="text-amber-500 text-xs font-semibold">✨ Hafidz Cilik MJS</span>
          </div>
          <p className="font-sans text-slate-700">{speech}</p>
          {/* Bubble tail */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-b border-r border-emerald-300 transform rotate-45" />
        </div>
      )}

      {/* KARAKTER MURID MENYATU DENGAN HALAMAN (TANPA FRAME, TANPA BG) */}
      <div className={`relative ${sizeMap[size]} animate-jumbo-float flex items-end justify-center`}>
        {/* Soft Ambient Ground Shadow di Bawah Kaki */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-3/4 h-5 rounded-full bg-black/20 blur-md pointer-events-none transform scale-y-50" />

        {/* Gambar Cutout Transparan PNG Tanpa Frame Kotak */}
        <img
          src="/media/tpa/murid_faiz_mjs.png"
          alt="Murid Cilik MJS Faiz - Hafidz Cilik"
          className="w-full h-full object-contain filter drop-shadow-[0_16px_28px_rgba(0,0,0,0.22)] transform group-hover:scale-105 transition-transform duration-300 select-none pointer-events-auto"
        />

        {/* Badge Lencana Nama Melayang Bebas di Bawah */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#064E3B] text-emerald-100 text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full shadow-lg border border-[#C89B3C] whitespace-nowrap">
          Murid Faiz • Hafidz Cilik
        </div>
      </div>
    </div>
  );
};

/** Girl Murid Character: Cutout PNG Transparan Tanpa Frame / Tanpa Background */
export const JumboGirlCharacter: React.FC<{
  speech?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}> = ({
  speech = "Bismillah! Di TPA MJS, belajar ngaji itu asyik, tartil, dan punya banyak teman sholeh!",
  size = "md",
  className = "",
}) => {
  const sizeMap = {
    sm: "w-28 h-36 sm:w-36 sm:h-44",
    md: "w-44 h-56 sm:w-56 sm:h-72",
    lg: "w-60 h-76 sm:w-72 sm:h-92",
  };

  return (
    <div className={`relative flex flex-col items-center group pointer-events-auto ${className}`}>
      {/* Speech Bubble */}
      {speech && (
        <div className="mb-2 max-w-[260px] sm:max-w-[320px] bg-white rounded-2xl p-3 sm:p-4 shadow-xl border border-emerald-300 text-slate-800 text-xs sm:text-sm font-medium leading-relaxed relative animate-jumbo-bounce select-none">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[#0F766E] font-bold text-xs uppercase tracking-wider flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
              Murid Cilik MJS
            </span>
            <span className="text-[#C89B3C] text-xs font-semibold">📖 Generasi Qur'ani</span>
          </div>
          <p className="font-sans text-slate-700">{speech}</p>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-b border-r border-emerald-300 transform rotate-45" />
        </div>
      )}

      {/* KARAKTER MURID MENYATU DENGAN HALAMAN (TANPA FRAME, TANPA BG) */}
      <div className={`relative ${sizeMap[size]} animate-jumbo-float-slow flex items-end justify-center`}>
        {/* Soft Ambient Ground Shadow di Bawah Karakter */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-3/4 h-5 rounded-full bg-teal-900/25 blur-md pointer-events-none transform scale-y-50" />

        {/* Gambar Cutout Transparan PNG Tanpa Frame Kotak */}
        <img
          src="/media/tpa/murid_aisyah_mjs.png"
          alt="Murid Cilik MJS Aisyah"
          className="w-full h-full object-contain filter drop-shadow-[0_16px_28px_rgba(0,0,0,0.22)] transform group-hover:scale-105 transition-transform duration-300 select-none pointer-events-auto"
        />

        {/* Lencana Nama Melayang Bebas di Bawah */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#0F766E] text-teal-100 text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full shadow-lg border border-teal-300 whitespace-nowrap">
          Murid Aisyah • MJS
        </div>
      </div>
    </div>
  );
};

/** Widescreen Feature Scene with Interactive Character Dialogue (MENYATU DENGAN WEB — TANPA FRAME / TANPA BG) */
export const JumboFeatureGroupScene: React.FC<{
  onCtaClick?: () => void;
  className?: string;
}> = ({ onCtaClick, className = "" }) => {
  return (
    <div className={`relative flex flex-col items-center justify-center my-6 group pointer-events-auto ${className}`}>
      {/* Speech Bubbles Melayang Bebas di Kiri dan Kanan Tanpa Kotak Wadah */}
      <div className="w-full max-w-4xl flex flex-col sm:flex-row justify-between items-center sm:items-end gap-3 sm:gap-6 mb-3 sm:-mb-6 z-20 px-4">
        {/* Balon Dialog Faiz di Kiri */}
        <div className="max-w-[280px] bg-white rounded-2xl p-3 sm:p-4 shadow-xl border border-emerald-300 text-slate-800 text-xs sm:text-sm font-medium leading-relaxed relative animate-jumbo-bounce select-none">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
            <span className="text-emerald-800 font-bold text-xs uppercase tracking-wider">Murid Faiz</span>
            <span className="text-amber-500 text-[11px] font-semibold">• Hafidz Cilik</span>
          </div>
          <p className="font-sans text-slate-700 text-xs sm:text-sm leading-snug">
            "Alhamdulillah, di TPA MJS ngajinya tartil bersanad dan seru bareng robot cerdas!"
          </p>
          <div className="hidden sm:block absolute -bottom-2 left-10 w-4 h-4 bg-white border-b border-r border-emerald-300 transform rotate-45" />
        </div>

        {/* Balon Dialog Aisyah di Kanan */}
        <div className="max-w-[280px] bg-white rounded-2xl p-3 sm:p-4 shadow-xl border border-teal-300 text-slate-800 text-xs sm:text-sm font-medium leading-relaxed relative animate-jumbo-bounce select-none">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse inline-block" />
            <span className="text-teal-800 font-bold text-xs uppercase tracking-wider">Murid Aisyah</span>
            <span className="text-teal-600 text-[11px] font-semibold">• Qur'anic Tech</span>
          </div>
          <p className="font-sans text-slate-700 text-xs sm:text-sm leading-snug">
            "Belajar logika dan adab teknologi sejak dini, hati tetap terpaut ke masjid!"
          </p>
          <div className="hidden sm:block absolute -bottom-2 right-10 w-4 h-4 bg-white border-b border-r border-teal-300 transform rotate-45" />
        </div>
      </div>

      {/* KARAKTER UTAMA 3D TRIO: CUTOUT TRANSPARAN MENYATU DENGAN HALAMAN (TANPA FRAME, TANPA BG) */}
      <div className="relative w-full max-w-3xl flex flex-col items-center justify-center animate-jumbo-float">
        {/* Soft Ambient Ground Shadow Lembut di Bawah Karakter */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-4/5 h-10 rounded-full bg-emerald-950/20 blur-xl pointer-events-none transform scale-y-50" />

        {/* Gambar Cutout Transparan PNG Trio Murid & Robot — TANPA FRAME / KOTAK */}
        <img
          src="/media/tpa/jumbo_santri_group.png"
          alt="Murid Cilik MJS Faiz, Robot Asisten, dan Murid Cilik Aisyah — Animasi Film Jumbo"
          className="w-full max-h-[460px] sm:max-h-[520px] object-contain filter drop-shadow-[0_20px_35px_rgba(6,78,59,0.25)] select-none pointer-events-auto transform group-hover:scale-102 transition-transform duration-500"
        />

        {/* Lencana Identitas Melayang di Bawah Karakter */}
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:gap-3 z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#064E3B] text-emerald-100 text-xs font-bold shadow-lg border border-[#C89B3C]">
            <span className="w-2 h-2 rounded-full bg-[#34D399] animate-ping" />
            <span>Karakter Murid Cilik MJS Ngawi</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#C89B3C] text-slate-950 text-xs font-bold shadow-lg border border-amber-300">
            <span>✨</span>
            <span>Gaya Animasi 3D Film Jumbo Nusantara</span>
          </div>
        </div>

        {/* Tombol Aksi Cepat jika disediakan */}
        {onCtaClick && (
          <div className="mt-6 text-center z-10">
            <button
              onClick={onCtaClick}
              className="bg-[#FF6B1A] hover:bg-[#E55A0A] active:scale-95 text-white font-bold text-xs sm:text-sm px-8 py-3.5 rounded-full shadow-xl hover:shadow-2xl transition-all flex items-center gap-2.5 mx-auto cursor-pointer"
            >
              <span>🌟 Daftarkan Putra-Putri Tercinta</span>
              <span className="text-amber-200">→</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
