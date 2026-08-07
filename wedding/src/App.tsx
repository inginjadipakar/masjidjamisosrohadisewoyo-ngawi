import { useState, useEffect, useRef } from 'react'

import logoImg from '@/imports/logo2.png'
import mosqueCouple from '@/imports/WhatsApp_Image_2026-08-06_at_10.12.05.jpeg'
import mosqueBalloons from '@/imports/WhatsApp_Image_2026-08-06_at_10.12.06.jpeg'
import brideGarden from '@/imports/WhatsApp_Image_2026-08-06_at_10.12.06__1_.jpeg'
import procession from '@/imports/WhatsApp_Image_2026-08-06_at_10.12.07.jpeg'
import coupleWalking from '@/imports/WhatsApp_Image_2026-08-06_at_10.12.08.jpeg'
import coupleBlackGold from '@/imports/WhatsApp_Image_2026-08-06_at_10.12.09.jpeg'
import coupleWhiteBrick from '@/imports/WhatsApp_Image_2026-08-06_at_10.12.09__1_.jpeg'
import coupleWhiteStone from '@/imports/WhatsApp_Image_2026-08-06_at_10.12.10.jpeg'

const ADDRESS = 'Jl. Munginsidi No. 51 RT 011 RW 002 Pelem II, Desa Pelem, Ngawi, Kabupaten Ngawi'

// ── Small SVG Islamic star ────────────────────────────────────
function Star({ size = 40, color = '#c9a84c', opacity = 1, spin = false }: {
  size?: number; color?: string; opacity?: number; spin?: boolean
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none"
      style={{ opacity, animation: spin ? 'float 8s ease-in-out infinite' : undefined }}
    >
      <polygon points="50,8 61,38 94,38 68,57 78,90 50,71 22,90 32,57 6,38 39,38"
        stroke={color} strokeWidth="1" fill="none" />
      <circle cx="50" cy="50" r="10" stroke={color} strokeWidth="0.6" fill="none" />
    </svg>
  )
}

// ── Ornament label ────────────────────────────────────────────
function Label({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <div className="ornament-line mb-5" style={{ color: '#c9a84c' }}>
      <span style={{ color: dark ? '#c9a84c' : '#b8902a' }}>{children}</span>
    </div>
  )
}

// ── Gallery image with zoom-on-hover ─────────────────────────
function GImg({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  return (
    <div className={`overflow-hidden group ${className}`}>
      <img src={src} alt={alt} loading="lazy"
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]" />
    </div>
  )
}

// ── Package card (light variant) ─────────────────────────────
function PkgCard({ name, price, features, hot = false }: {
  name: string; price: string; features: string[]; hot?: boolean
}) {
  return (
    <div className={`card-lift reveal relative overflow-hidden border ${
      hot ? 'border-[#c9a84c] bg-white' : 'border-[rgba(201,168,76,0.2)] bg-[#faf8f3]'
    } p-8`}>
      {hot && <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent" />}
      {hot && <span className="absolute top-4 right-4 text-[9px] tracking-widest bg-[#c9a84c] text-white px-2 py-0.5 uppercase">Populer</span>}
      <p className="text-[10px] tracking-[0.3em] text-[#b8902a] uppercase mb-2">{name}</p>
      <p className="font-serif text-3xl text-[#1a1710] mb-1">{price}</p>
      <p className="text-xs text-[#a0917a] mb-6">per acara</p>
      <div className="gold-line mb-6" />
      <ul className="space-y-2.5">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-[#5a5040]">
            <span className="text-[#c9a84c] shrink-0 mt-0.5">◆</span>{f}
          </li>
        ))}
      </ul>
      <button className={`mt-8 w-full py-3 text-[11px] tracking-widest uppercase transition-all duration-300 ${
        hot ? 'bg-[#c9a84c] text-white hover:bg-[#b8902a]'
            : 'border border-[#c9a84c] text-[#c9a84c] hover:bg-[rgba(201,168,76,0.08)]'
      }`}>Hubungi Kami</button>
    </div>
  )
}

// ── Nav link ──────────────────────────────────────────────────
function NavLink({ href, children, dark, onClick }: {
  href: string; children: React.ReactNode; dark?: boolean; onClick?: () => void
}) {
  const base = dark ? 'text-[#9a927e] hover:text-[#c9a84c]' : 'text-[#5a5040] hover:text-[#c9a84c]'
  return (
    <a href={href} onClick={onClick}
      className={`text-[11px] tracking-widest uppercase transition-colors duration-300 relative group ${base}`}>
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#c9a84c] transition-all duration-300 group-hover:w-full" />
    </a>
  )
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [heroDark, setHeroDark] = useState(true)
  const dotRef = useRef<HTMLDivElement>(null)
  const ringPos = useRef({ x: -100, y: -100 })
  const ringEl = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (dotRef.current) {
        dotRef.current.style.left = e.clientX + 'px'
        dotRef.current.style.top = e.clientY + 'px'
      }
      ringPos.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', onMove)

    let raf: number
    const follow = () => {
      if (ringEl.current) {
        const el = ringEl.current
        const cur = { x: parseFloat(el.style.left || '-100'), y: parseFloat(el.style.top || '-100') }
        const nx = cur.x + (ringPos.current.x - cur.x) * 0.13
        const ny = cur.y + (ringPos.current.y - cur.y) * 0.13
        el.style.left = nx + 'px'
        el.style.top = ny + 'px'
      }
      raf = requestAnimationFrame(follow)
    }
    raf = requestAnimationFrame(follow)
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf) }
  }, [])

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60)
      // hero is ~100vh — if past it, nav switches to light mode
      setHeroDark(window.scrollY < window.innerHeight * 0.8)
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.07, rootMargin: '0px 0px -50px 0px' }
    )
    document.querySelectorAll('.reveal').forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  const navItems = [
    { href: '#tentang', label: 'Tentang' },
    { href: '#ibadah', label: 'Ibadah' },
    { href: '#pernikahan', label: 'Pernikahan' },
    { href: '#undangan', label: 'Undangan Digital' },
    { href: '#galeri', label: 'Galeri' },
    { href: '#kontak', label: 'Kontak' },
  ]

  return (
    <>
      {/* Cursor */}
      <div ref={dotRef} className="cursor-dot hidden md:block" />
      <div ref={ringEl} className="cursor-ring hidden md:block" style={{ left: -100, top: -100 }} />

      {/* ══════════════════════════════════════════════
          NAV — adapts between dark (hero) and light
      ══════════════════════════════════════════════ */}
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? heroDark
            ? 'bg-[rgba(6,5,10,0.94)] backdrop-blur border-b border-[rgba(201,168,76,0.1)]'
            : 'bg-[rgba(250,248,243,0.96)] backdrop-blur border-b border-[rgba(201,168,76,0.15)] shadow-sm'
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="#" className="flex items-center">
            <img src={logoImg} alt="Masjid Jami Sosrohadisewoyo" className="h-10 md:h-12 w-auto"
              style={{ mixBlendMode: heroDark ? 'screen' : 'multiply' }} />
          </a>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((n) => (
              <NavLink key={n.href} href={n.href} dark={heroDark}>{n.label}</NavLink>
            ))}
          </div>

          {/* CTA */}
          <a href="#kontak"
            className="hidden lg:inline-flex items-center gap-2 text-[11px] tracking-widest uppercase px-5 py-2.5 border border-[#c9a84c] text-[#c9a84c] hover:bg-[#c9a84c] hover:text-white transition-all duration-300">
            Booking Venue
          </a>

          {/* Hamburger */}
          <button className={`lg:hidden p-2 ${heroDark ? 'text-[#c9a84c]' : 'text-[#1a1710]'}`}
            onClick={() => setMenuOpen(!menuOpen)}>
            <div className={`w-5 h-px bg-current transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
            <div className={`w-5 h-px bg-current my-1.5 transition-opacity duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <div className={`w-5 h-px bg-current transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
          </button>
        </div>

        {/* Mobile drawer */}
        <div className={`lg:hidden overflow-hidden transition-all duration-500 ${menuOpen ? 'max-h-96' : 'max-h-0'} ${
          heroDark ? 'bg-[rgba(6,5,10,0.97)] border-t border-[rgba(201,168,76,0.1)]'
                   : 'bg-[rgba(250,248,243,0.98)] border-t border-[rgba(201,168,76,0.15)]'
        }`}>
          <div className="px-6 py-6 flex flex-col gap-5">
            {navItems.map((n) => (
              <NavLink key={n.href} href={n.href} dark={heroDark} onClick={() => setMenuOpen(false)}>
                {n.label}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      {/* ══════════════════════════════════════════════
          HERO  ← DARK
      ══════════════════════════════════════════════ */}
      <section id="beranda" className="sect-dark relative min-h-screen flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img src={mosqueCouple} alt="Fasad geometris putih Masjid Jami Sosrohadisewoyo"
            className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#06050a] via-[rgba(6,5,10,0.45)] to-[rgba(6,5,10,0.15)]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#06050a] via-transparent to-transparent opacity-55" />
        </div>

        {/* Decorative star */}
        <div className="absolute top-28 right-12 opacity-20 hidden md:block" style={{ animation: 'float 7s ease-in-out infinite' }}>
          <Star size={100} color="#c9a84c" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 pb-20 md:pb-32 w-full">
          <div className="max-w-3xl">
            <Label dark>Ngawi, Jawa Timur</Label>
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] leading-[0.92] mb-6 reveal">
              <span className="text-[#f0ebe0]">Tempat Suci,</span><br />
              <em className="gold-shimmer not-italic">Momen Abadi</em>
            </h1>
            <p className="text-[#a09890] text-base md:text-lg max-w-xl leading-relaxed mb-10 reveal reveal-delay-1">
              Masjid Jami Sosrohadisewoyo — ruang ibadah yang khusyuk sekaligus
              venue pernikahan adat Jawa yang memesona, dengan arsitektur mashrabiya
              yang menawan di Kabupaten Ngawi.
            </p>
            <div className="flex flex-wrap gap-4 reveal reveal-delay-2">
              <a href="#pernikahan"
                className="inline-flex items-center gap-3 bg-[#c9a84c] text-white text-[11px] tracking-widest uppercase px-7 py-4 hover:bg-[#b8902a] transition-colors duration-300">
                Venue Pernikahan <span>→</span>
              </a>
              <a href="#undangan"
                className="inline-flex items-center gap-3 border border-[rgba(201,168,76,0.5)] text-[#c9a84c] text-[11px] tracking-widest uppercase px-7 py-4 hover:bg-[rgba(201,168,76,0.1)] transition-colors duration-300">
                Undangan Digital
              </a>
            </div>
          </div>
          <div className="absolute bottom-10 right-10 hidden md:flex flex-col items-center gap-2">
            <div className="w-px h-16 bg-gradient-to-b from-[#c9a84c] to-transparent" style={{ animation: 'float 2s ease-in-out infinite' }} />
            <span className="text-[9px] tracking-[0.35em] text-[#7a7068] uppercase">Scroll</span>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          TENTANG  ← LIGHT
      ══════════════════════════════════════════════ */}
      <section id="tentang" className="sect-light py-28 md:py-36">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Image */}
            <div className="reveal from-left relative">
              <div className="relative aspect-[3/4] overflow-hidden">
                <img src={mosqueBalloons} alt="Pelepasan balon di halaman masjid"
                  className="w-full h-full object-cover" />
              </div>
              {/* Stat badge */}
              <div className="absolute -bottom-6 -right-4 md:-right-8 bg-white border border-[rgba(201,168,76,0.3)] shadow-lg p-6 w-44">
                <p className="font-serif text-4xl text-[#c9a84c]">500+</p>
                <p className="text-[10px] tracking-wider text-[#a09078] uppercase mt-1 leading-tight">Pasangan Diberkahi</p>
              </div>
              {/* Corner accent */}
              <div className="absolute -top-4 -left-4 w-14 h-14 border-t-2 border-l-2 border-[#c9a84c] opacity-50" />
            </div>

            {/* Text */}
            <div>
              <Label>Didirikan 1987</Label>
              <h2 className="font-serif text-4xl md:text-5xl text-[#1a1710] leading-tight mb-5 reveal reveal-delay-1">
                Dua Jiwa dalam<br />Satu Ruang Sakral
              </h2>
              <div className="gold-line mb-8 reveal reveal-delay-2" />
              <div className="space-y-4 text-[#5a5040] leading-relaxed text-sm reveal reveal-delay-2">
                <p>
                  Masjid Jami Sosrohadisewoyo berdiri sebagai salah satu ikon arsitektur
                  Islam kontemporer di Kabupaten Ngawi — dengan fasad mashrabiya putih yang
                  mengukir cahaya menjadi bayangan geometris memukau.
                </p>
                <p>
                  Di sinilah dua momen paling bermakna berpadu: kekhusyukan ibadah harian
                  dan keagungan upacara pernikahan adat Jawa yang kaya tradisi.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-10 reveal reveal-delay-3">
                {[
                  { v: '1987', l: 'Tahun Berdiri' },
                  { v: '2.000', l: 'Kapasitas' },
                  { v: '10+', l: 'Tahun Melayani' },
                ].map((s) => (
                  <div key={s.l} className="text-center border-l border-[rgba(201,168,76,0.2)] pl-4 first:border-0 first:pl-0">
                    <p className="font-serif text-2xl text-[#c9a84c]">{s.v}</p>
                    <p className="text-[10px] tracking-wider text-[#a09078] uppercase mt-1 leading-tight">{s.l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          IBADAH  ← DARK
      ══════════════════════════════════════════════ */}
      <section id="ibadah" className="sect-dark py-28 md:py-36 relative overflow-hidden">
        {/* Faint arch motif */}
        <div className="absolute right-0 top-0 bottom-0 opacity-[0.06] pointer-events-none flex">
          {[...Array(5)].map((_, i) => (
            <svg key={i} viewBox="0 0 80 200" fill="none" className="h-full w-12">
              <path d="M8,200 L8,90 Q8,8 40,8 Q72,8 72,90 L72,200"
                stroke="#c9a84c" strokeWidth="1" fill="none" />
            </svg>
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-10 relative">
          <div className="text-center max-w-xl mx-auto mb-16">
            <div className="flex justify-center mb-5 reveal">
              <Star size={44} color="#c9a84c" opacity={0.7} spin />
            </div>
            <h2 className="font-serif text-4xl md:text-5xl text-[#f0ebe0] mb-4 reveal reveal-delay-1">
              Pusat Ibadah & Komunitas
            </h2>
            <p className="text-[#7a7068] text-sm leading-relaxed reveal reveal-delay-2">
              Lebih dari sekadar bangunan — jantung spiritual ribuan jemaah yang
              datang setiap hari untuk beribadah dan menimba ilmu agama.
            </p>
          </div>

          {/* Feature grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[rgba(201,168,76,0.07)]">
            {[
              { icon: '🕌', t: 'Shalat Berjamaah', d: 'Lima waktu shalat berjamaah dengan imam hafizh. Kapasitas 2.000 jemaah dalam suasana khidmat.', dl: '1' },
              { icon: '📿', t: 'Kajian Rutin', d: 'Program pengajian mingguan, tafsir Al-Quran, dan ceramah agama yang memperkaya pemahaman spiritual.', dl: '2' },
              { icon: '🎓', t: 'Pendidikan Islam', d: 'Madrasah dan TPQ untuk generasi muda, menanamkan nilai Islam rahmatan lil alamin.', dl: '3' },
              { icon: '💒', t: 'Akad Nikah', d: 'Prosesi ijab qabul di ruang utama masjid, dipandu penghulu bersertifikat KUA.', dl: '2' },
              { icon: '🌙', t: 'Ramadhan Berkah', d: 'Tarawih, tadarus, itikaf, dan buka puasa bersama selama bulan penuh keberkahan.', dl: '3' },
              { icon: '❤️', t: 'Layanan Sosial', d: 'Penyaluran zakat, infaq, sedekah, dan program sosial kemasyarakatan.', dl: '4' },
            ].map((item) => (
              <div key={item.t}
                className={`reveal reveal-delay-${item.dl} bg-[#06050a] p-8 group hover:bg-[#0f0d14] transition-colors duration-300`}>
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="font-serif text-xl text-[#f0ebe0] mb-3 group-hover:text-[#c9a84c] transition-colors duration-300">{item.t}</h3>
                <p className="text-sm text-[#7a7068] leading-relaxed">{item.d}</p>
              </div>
            ))}
          </div>

          {/* Prayer times */}
          <div className="mt-16 border border-[rgba(201,168,76,0.12)] p-8 md:p-10 reveal">
            <p className="text-center text-[9px] tracking-[0.35em] text-[#7a7068] uppercase mb-8">Jadwal Shalat — Ngawi</p>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-0">
              {[
                { n: 'Subuh', t: '04:28' }, { n: 'Dhuha', t: '06:12' },
                { n: 'Dzuhur', t: '11:50' }, { n: 'Ashar', t: '15:06' },
                { n: 'Maghrib', t: '17:42' }, { n: 'Isya', t: '18:56' },
              ].map((p, i) => (
                <div key={p.n}
                  className={`text-center md:border-r border-[rgba(201,168,76,0.08)] last:border-0 ${i < 3 ? 'border-b md:border-b-0 border-[rgba(201,168,76,0.06)] pb-4 md:pb-0' : ''}`}>
                  <p className="text-[9px] tracking-widest text-[#7a7068] uppercase mb-2">{p.n}</p>
                  <p className="font-serif text-2xl text-[#c9a84c]">{p.t}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          PERNIKAHAN  ← LIGHT
      ══════════════════════════════════════════════ */}
      <section id="pernikahan" className="sect-light py-28 md:py-36">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14">
            <div className="reveal from-left">
              <Label>Venue Istimewa</Label>
              <h2 className="font-serif text-4xl md:text-6xl text-[#1a1710] leading-tight">
                Pernikahan<br /><em className="gold-shimmer not-italic">Tak Terlupakan</em>
              </h2>
            </div>
            <p className="text-[#7a7068] max-w-sm text-sm leading-relaxed reveal from-right">
              Dari akad nikah yang sakral hingga resepsi adat Jawa yang megah —
              kami menyediakan ruang dan layanan yang membuat hari istimewa Anda
              menjadi kenangan seumur hidup.
            </p>
          </div>

          {/* Hero wedding image */}
          <div className="reveal mb-6 relative overflow-hidden" style={{ aspectRatio: '16/7' }}>
            <img src={coupleBlackGold} alt="Pasangan pengantin adat Jawa hitam keemasan di ballroom"
              className="w-full h-full object-cover object-top" />
            <div className="absolute inset-0 bg-gradient-to-r from-[rgba(6,5,10,0.6)] via-transparent to-transparent" />
            <div className="absolute bottom-8 left-8 md:left-12">
              <p className="font-serif text-xl md:text-3xl text-[#f0ebe0] italic">"Busana Hitam Keemasan —</p>
              <p className="font-serif text-xl md:text-3xl text-[#c9a84c] italic">Adat Jawa Penuh Wibawa"</p>
            </div>
          </div>

          {/* 4-column photo strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-16">
            <GImg src={coupleWalking} alt="Pasangan berjalan di lorong ballroom" className="aspect-[3/4] reveal reveal-delay-1" />
            <GImg src={coupleWhiteBrick} alt="Pasangan pengantin putih di dinding bata" className="aspect-[3/4] reveal reveal-delay-2" />
            <GImg src={procession} alt="Prosesi pengantin melalui gerbang bambu" className="aspect-[3/4] reveal reveal-delay-3" />
            <GImg src={brideGarden} alt="Pengantin wanita di taman samping masjid" className="aspect-[3/4] reveal reveal-delay-4" />
          </div>

          {/* Split: features + image */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-20">
            <div className="reveal from-left space-y-5">
              <h3 className="font-serif text-2xl md:text-3xl text-[#1a1710]">Ruang yang Menakjubkan</h3>
              <p className="text-[#7a7068] text-sm leading-relaxed">
                Ballroom dengan plafon bermotif geometris Islam dan chandelier mewah mampu menampung
                hingga 1.500 tamu. Setiap sudut dirancang menghadirkan keindahan memukau.
              </p>
              <ul className="space-y-2.5">
                {[
                  'Kapasitas 1.500 tamu duduk atau 2.500 standing party',
                  'Ballroom ber-AC dengan sistem audio modern',
                  'Dekorasi custom sesuai tema pernikahan',
                  'Area parkir luas untuk 300+ kendaraan',
                  'Ruang pengantin (bridal room) eksklusif',
                  'Katering halal tersertifikat',
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-[#5a5040]">
                    <span className="text-[#c9a84c] shrink-0 mt-0.5">◆</span>{f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="reveal from-right overflow-hidden min-h-[320px]">
              <img src={coupleWhiteStone} alt="Pasangan pengantin putih di depan masjid"
                className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Packages */}
          <div className="text-center mb-12 reveal">
            <Label>Pilih Paket Anda</Label>
            <h2 className="font-serif text-3xl md:text-4xl text-[#1a1710]">Paket Pernikahan & Resepsi</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <PkgCard name="Paket Akad" price="Rp 5 Jt"
              features={['Akad nikah di ruang utama masjid', 'Penghulu bersertifikat KUA', 'Dekorasi minimalis masjid', 'Dokumentasi foto 2 jam', 'Kapasitas 100 tamu']} />
            <PkgCard name="Paket Resepsi" price="Rp 25 Jt" hot
              features={['Sewa ballroom 10 jam penuh', 'Dekorasi tema adat Jawa', 'Katering 500 porsi halal', 'Sistem audio & lighting profesional', 'Wedding organizer pendamping', 'Undangan digital premium']} />
            <PkgCard name="Paket Lengkap" price="Rp 45 Jt"
              features={['Akad + resepsi full package', 'Ballroom 12 jam + outdoor area', 'Katering 1.000 porsi premium', 'Dekorasi custom eksklusif', 'Foto & video cinematic', 'Undangan digital + cetak 200 lembar', 'Honeymoon car decoration']} />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          UNDANGAN DIGITAL  ← DARK
      ══════════════════════════════════════════════ */}
      <section id="undangan" className="sect-dark py-28 md:py-36 relative overflow-hidden">
        {/* subtle star grid bg */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolygon points='30,4 36,22 54,22 41,31 46,50 30,40 14,50 19,31 6,22 24,22' stroke='%23c9a84c' stroke-width='0.6' fill='none'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px',
        }} />

        <div className="max-w-7xl mx-auto px-6 md:px-10 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Phone mockup */}
            <div className="reveal from-left order-2 lg:order-1">
              <div className="relative max-w-[260px] mx-auto">
                <div className="border border-[rgba(201,168,76,0.25)] rounded-[28px] overflow-hidden bg-[#0f0d14] p-1">
                  <div className="rounded-[22px] overflow-hidden bg-[#07060a]">
                    <div className="flex flex-col items-center justify-center p-7 text-center" style={{ aspectRatio: '9/19' }}>
                      <Star size={42} color="#c9a84c" opacity={0.9} />
                      <p className="text-[7px] tracking-[0.35em] text-[#7a7068] uppercase mt-4 mb-1">Undangan Pernikahan</p>
                      <div className="gold-line my-3 w-full" />
                      <p className="font-serif text-xl text-[#c9a84c] italic">Rizky & Siti</p>
                      <p className="text-[7px] text-[#5a5048] mt-1.5">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
                      <div className="gold-line my-3 w-full" />
                      <div className="bg-[#1a1620] rounded-md p-3 w-full mt-2">
                        <p className="text-[7px] tracking-wider text-[#7a7068] uppercase">Sabtu, 14 Februari 2026</p>
                        <p className="text-[9px] text-[#c9a84c] mt-1">09.00 — 13.00 WIB</p>
                        <p className="text-[7px] text-[#5a5048] mt-1">Masjid Jami Sosrohadisewoyo, Ngawi</p>
                      </div>
                      <button className="mt-4 w-full bg-[#c9a84c] text-[#06050a] text-[7px] py-2 tracking-widest uppercase rounded">
                        Konfirmasi Kehadiran
                      </button>
                      <div className="flex justify-center gap-2.5 mt-4">
                        {['📍','📅','🎵','📸'].map((ic) => (
                          <div key={ic} className="w-6 h-6 rounded-full border border-[rgba(201,168,76,0.2)] flex items-center justify-center text-[9px]">{ic}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 rounded-[28px] bg-[#c9a84c] opacity-[0.07] blur-2xl -z-10 scale-110" />
              </div>
            </div>

            {/* Text */}
            <div className="order-1 lg:order-2">
              <Label dark>Layanan Digital</Label>
              <h2 className="font-serif text-4xl md:text-5xl text-[#f0ebe0] leading-tight mb-5 reveal reveal-delay-1">
                Undangan Digital<br /><em className="gold-shimmer not-italic">Elegan & Modern</em>
              </h2>
              <div className="gold-line mb-8 reveal reveal-delay-2" />
              <p className="text-[#7a7068] leading-relaxed mb-8 text-sm reveal reveal-delay-2">
                Pembuatan undangan pernikahan digital yang menggabungkan estetika Islam
                kontemporer dengan kemudahan teknologi. Bagikan ke seluruh tamu dalam hitungan detik.
              </p>
              <div className="space-y-3 mb-10">
                {[
                  { t: 'Desain Eksklusif', d: '20+ template premium terinspirasi motif Islam & batik Jawa' },
                  { t: 'RSVP Otomatis', d: 'Konfirmasi kehadiran tamu real-time dengan rekap data' },
                  { t: 'Fitur Lengkap', d: 'Peta, musik, galeri foto, countdown, ucapan doa' },
                  { t: 'Berbagi Mudah', d: 'Link unik siap dibagikan via WhatsApp, Instagram, email' },
                ].map((item, i) => (
                  <div key={item.t}
                    className={`reveal reveal-delay-${i + 2} flex items-start gap-4 p-4 border border-[rgba(201,168,76,0.08)] hover:border-[rgba(201,168,76,0.25)] transition-colors duration-300`}>
                    <span className="text-[#c9a84c] shrink-0 mt-0.5">✦</span>
                    <div>
                      <p className="text-sm text-[#f0ebe0] mb-0.5">{item.t}</p>
                      <p className="text-xs text-[#7a7068]">{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-4 reveal reveal-delay-5">
                <a href="#kontak"
                  className="inline-flex items-center gap-2 bg-[#c9a84c] text-white text-[11px] tracking-widest uppercase px-7 py-4 hover:bg-[#b8902a] transition-colors duration-300">
                  Pesan Sekarang
                </a>
                <span className="text-xs text-[#7a7068]"><span className="text-[#c9a84c]">✓</span> Mulai Rp 350.000</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          GALERI  ← LIGHT (cream)
      ══════════════════════════════════════════════ */}
      <section id="galeri" className="sect-cream py-28 md:py-36">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="text-center mb-14">
            <Label>Kenangan Abadi</Label>
            <h2 className="font-serif text-4xl md:text-5xl text-[#1a1710] reveal reveal-delay-1">Galeri Pernikahan</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            <div className="col-span-2 row-span-2 reveal">
              <GImg src={coupleBlackGold} alt="Pengantin adat Jawa hitam keemasan" className="h-full min-h-[380px]" />
            </div>
            <GImg src={coupleWhiteStone} alt="Pasangan putih di depan masjid" className="aspect-square reveal reveal-delay-1" />
            <GImg src={coupleWhiteBrick} alt="Pasangan putih di dinding bata" className="aspect-square reveal reveal-delay-2" />
            <GImg src={coupleWalking} alt="Pasangan berjalan di aisle" className="aspect-square reveal reveal-delay-2" />
            <GImg src={brideGarden} alt="Pengantin di taman" className="aspect-square reveal reveal-delay-3" />
            <div className="col-span-2 reveal reveal-delay-3">
              <GImg src={procession} alt="Prosesi adat Jawa" className="aspect-[2/1]" />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          TESTIMONI  ← DARK
      ══════════════════════════════════════════════ */}
      <section id="testimoni" className="sect-dark py-28 md:py-36">
        <div className="max-w-5xl mx-auto px-6 md:px-10 text-center">
          <Label dark>Kata Mereka</Label>
          <h2 className="font-serif text-3xl md:text-4xl text-[#f0ebe0] mb-16 reveal reveal-delay-1">Kesan Para Pasangan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { q: 'Hari pernikahan kami menjadi luar biasa berkat keindahan arsitektur masjid ini. Fasad putih geometrisnya menjadi latar foto yang tidak ternilai.', n: 'Alya & Fariz', d: 'Maret 2025', dl: '1' },
              { q: 'Tim pengelola masjid sangat membantu dari awal hingga akhir. Undangan digital yang mereka buat juga mendapat pujian dari semua tamu.', n: 'Nisa & Hendra', d: 'Juni 2025', dl: '2' },
              { q: 'Suasana ballroom dengan plafon geometris dan chandelier memberikan kesan mewah dan sakral yang sempurna untuk resepsi adat Jawa kami.', n: 'Ratih & Dimas', d: 'Oktober 2025', dl: '3' },
            ].map((t) => (
              <div key={t.n}
                className={`reveal reveal-delay-${t.dl} border border-[rgba(201,168,76,0.1)] p-8 text-left hover:border-[rgba(201,168,76,0.3)] transition-colors duration-300`}>
                <div className="font-serif text-3xl text-[#c9a84c] mb-4">"</div>
                <p className="text-[#7a7068] text-sm leading-relaxed italic mb-6">{t.q}</p>
                <div className="gold-line mb-4" />
                <p className="text-[#f0ebe0] text-sm">{t.n}</p>
                <p className="text-[9px] tracking-wider text-[#5a5048] uppercase mt-1">{t.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          KONTAK  ← LIGHT
      ══════════════════════════════════════════════ */}
      <section id="kontak" className="sect-light py-28 md:py-36">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Info */}
            <div>
              <Label>Hubungi Kami</Label>
              <h2 className="font-serif text-4xl md:text-5xl text-[#1a1710] leading-tight mb-6 reveal reveal-delay-1">
                Wujudkan<br />Pernikahan Impian Anda
              </h2>
              <p className="text-[#7a7068] leading-relaxed mb-10 text-sm reveal reveal-delay-2">
                Tim kami siap membantu merencanakan hari istimewa Anda dari A sampai Z.
                Hubungi kami untuk konsultasi gratis dan penawaran terbaik.
              </p>
              <div className="space-y-6 mb-10 reveal reveal-delay-2">
                {[
                  { ic: '📍', l: 'Alamat', v: ADDRESS },
                  { ic: '📞', l: 'Telepon / WhatsApp', v: '+62 812-3456-7890' },
                  { ic: '📧', l: 'Email', v: 'info@masjidjami-sosrohadisewoyo.id' },
                  { ic: '🕐', l: 'Jam Operasional', v: 'Senin–Minggu, 08.00–20.00 WIB' },
                ].map((item) => (
                  <div key={item.l} className="flex items-start gap-4">
                    <span className="text-xl shrink-0 mt-0.5">{item.ic}</span>
                    <div>
                      <p className="text-[9px] tracking-wider text-[#a09078] uppercase mb-1">{item.l}</p>
                      <p className="text-[#1a1710] text-sm">{item.v}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-5 reveal reveal-delay-3">
                {['Instagram', 'WhatsApp', 'YouTube', 'TikTok'].map((s) => (
                  <a key={s} href="#"
                    className="text-[10px] tracking-wider text-[#a09078] uppercase hover:text-[#c9a84c] transition-colors duration-300">{s}</a>
                ))}
              </div>
            </div>

            {/* Form */}
            <div className="reveal from-right">
              <div className="border border-[rgba(201,168,76,0.2)] bg-white p-8 md:p-10 shadow-sm">
                <p className="text-[9px] tracking-[0.35em] text-[#a09078] uppercase mb-8">Formulir Pemesanan</p>
                <div className="space-y-5">
                  {[
                    { l: 'Nama Lengkap', t: 'text', p: 'Nama calon mempelai' },
                    { l: 'Nomor WhatsApp', t: 'tel', p: '+62 812-xxxx-xxxx' },
                    { l: 'Tanggal Acara', t: 'date', p: '' },
                    { l: 'Email', t: 'email', p: 'nama@email.com' },
                  ].map((f) => (
                    <div key={f.l}>
                      <label className="block text-[9px] tracking-widest text-[#a09078] uppercase mb-2">{f.l}</label>
                      <input type={f.t} placeholder={f.p}
                        className="w-full border border-[rgba(201,168,76,0.2)] text-[#1a1710] text-sm px-4 py-3 focus:border-[#c9a84c] transition-colors duration-300 bg-[#faf8f3]" />
                    </div>
                  ))}
                  <div>
                    <label className="block text-[9px] tracking-widest text-[#a09078] uppercase mb-2">Layanan</label>
                    <select className="w-full border border-[rgba(201,168,76,0.2)] text-[#5a5040] text-sm px-4 py-3 focus:border-[#c9a84c] transition-colors duration-300 bg-[#faf8f3] appearance-none">
                      <option>Pilih layanan...</option>
                      <option>Paket Akad Nikah</option>
                      <option>Paket Resepsi</option>
                      <option>Paket Lengkap</option>
                      <option>Undangan Digital</option>
                      <option>Konsultasi Gratis</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] tracking-widest text-[#a09078] uppercase mb-2">Pesan</label>
                    <textarea rows={4} placeholder="Ceritakan impian pernikahan Anda..."
                      className="w-full border border-[rgba(201,168,76,0.2)] text-[#1a1710] text-sm px-4 py-3 focus:border-[#c9a84c] transition-colors duration-300 bg-[#faf8f3] resize-none" />
                  </div>
                  <button className="w-full bg-[#c9a84c] text-white text-[11px] tracking-widest uppercase py-4 hover:bg-[#b8902a] transition-colors duration-300 mt-2">
                    Kirim Permintaan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FOOTER  ← DARK
      ══════════════════════════════════════════════ */}
      <footer className="sect-dark border-t border-[rgba(201,168,76,0.1)] py-12">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <a href="#" className="flex items-center">
              <img src={logoImg} alt="Masjid Jami Sosrohadisewoyo"
                className="h-10 w-auto" style={{ mixBlendMode: 'screen' }} />
            </a>
            <div className="flex flex-wrap justify-center gap-6">
              {navItems.map((n) => (
                <NavLink key={n.href} href={n.href} dark>{n.label}</NavLink>
              ))}
            </div>
            <p className="text-[9px] text-[#3a3830] tracking-wider">© 2026 Masjid Jami Sosrohadisewoyo</p>
          </div>
          <div className="text-center mt-10">
            <div className="gold-line mb-5" />
            <p className="font-serif text-sm italic text-[#7a7068]">
              بَارَكَ اللَّهُ لَكُمَا وَبَارَكَ عَلَيْكُمَا وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ
            </p>
            <p className="text-[9px] text-[#3a3830] mt-2 tracking-wider">
              "Semoga Allah memberkahi kalian berdua dan mengumpulkan kalian dalam kebaikan"
            </p>
            <p className="text-[9px] text-[#3a3830] mt-1 tracking-wider">{ADDRESS}</p>
          </div>
        </div>
      </footer>
    </>
  )
}
