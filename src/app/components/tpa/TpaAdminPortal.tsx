import { useState, useEffect, useRef } from "react";
import {
  ShieldCheck,
  Lock,
  User,
  LogOut,
  FileSpreadsheet,
  Printer,
  Search,
  CheckCircle2,
  Clock,
  Trash2,
  Phone,
  Eye,
  EyeOff,
  AlertTriangle,
  Users,
  Check,
  RefreshCw,
  ExternalLink,
  X,
  ArrowLeft,
  Calendar,
  MessageCircle,
  KeyRound,
  MapPin,
  School,
  BookOpen,
  Sparkles,
  ClipboardList,
  Star,
  Cloud,
  Database,
  Download,
  Upload,
  Send,
  Plus,
  Trash,
  UserPlus,
  CheckSquare,
} from "lucide-react";
import {
  TpaRegistration,
  getTpaRegistrations,
  fetchTpaRegistrationsAsync,
  saveTpaRegistrationAsync,
  updateTpaStatusAsync,
  deleteTpaPermanentlyAsync,
  clearAllRegistrationsAsync,
  importTpaRegistrations,
  exportTpaToJson,
  exportTpaToCsv,
  exportTpaToPdf,
} from "./tpaData";

interface TpaAdminPortalProps {
  onBackToHome: () => void;
  onNavigateToPublicTpa?: () => void;
}

export default function TpaAdminPortal({
  onBackToHome,
  onNavigateToPublicTpa,
}: TpaAdminPortalProps) {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem("tpa_admin_auth") === "true";
  });

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Data state
  const [registrations, setRegistrations] = useState<TpaRegistration[]>([]);
  const [filterStatus, setFilterStatus] = useState<"Semua" | "Pending" | "ACC">("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDetail, setSelectedDetail] = useState<TpaRegistration | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TpaRegistration | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error" | "info">("success");

  // Cloud Sync state
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSource, setSyncSource] = useState<"cloud" | "cache">("cloud");
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);

  // Modal Manual Tambah Murid (Sesuai Formulir Pendaftaran)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmittingAdd, setIsSubmittingAdd] = useState(false);
  const initialNewFormData: Omit<TpaRegistration, "id" | "createdAt" | "status"> = {
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
    namaAyah: "",
    namaIbu: "",
    pekerjaanOrtu: "",
    whatsappOrtu: "",
    catatanKhusus: "",
  };
  const [newFormData, setNewFormData] = useState(initialNewFormData);

  // Modal Reset Database / Hapus Dummy
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Backup & Import Modal
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importJsonText, setImportJsonText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load data function
  const loadData = async (manualTrigger: boolean = false) => {
    const local = getTpaRegistrations();
    if (!manualTrigger && registrations.length === 0) {
      setRegistrations(local);
    }

    setIsSyncing(true);
    try {
      const result = await fetchTpaRegistrationsAsync();
      setRegistrations(result.data);
      setSyncSource(result.source);
      const nowStr = new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      setLastSyncedAt(nowStr);

      if (manualTrigger) {
        showToast(
          result.source === "cloud"
            ? `Sinkronisasi cloud berhasil (${result.data.length} murid terdaftar).`
            : "Terhubung ke cache lokal (offline).",
          "success"
        );
      }
    } catch (e) {
      console.warn("Gagal sinkronisasi data cloud:", e);
      if (manualTrigger) {
        showToast("Gagal terhubung ke server cloud. Menggunakan data lokal.", "error");
      }
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();

      // Auto-poll cloud setiap 25 detik
      const pollTimer = setInterval(() => {
        loadData(false);
      }, 25000);

      return () => clearInterval(pollTimer);
    }
  }, [isAuthenticated]);

  // Toast auto-hide
  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 3500);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const showToast = (msg: string, type: "success" | "error" | "info" = "success") => {
    setToastType(type);
    setToastMessage(msg);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsLoggingIn(true);

    await new Promise((r) => setTimeout(r, 500));

    const validUsernames = ["admin", "admin_tpa", "mjs", "dadan"];
    const validPasswords = ["tpa2026", "mjs2026", "admin123"];

    if (
      validUsernames.includes(username.trim().toLowerCase()) &&
      validPasswords.includes(password.trim())
    ) {
      sessionStorage.setItem("tpa_admin_auth", "true");
      setIsAuthenticated(true);
      loadData(true);
      showToast("Ahlan wa sahlan! Berhasil masuk ke Portal Admin TPA MJS.");
    } else {
      setLoginError("Kredensial tidak valid. Gunakan tombol 'Isi Cepat' untuk akses demo.");
    }
    setIsLoggingIn(false);
  };

  const handleAutofillDemo = () => {
    setUsername("admin");
    setPassword("tpa2026");
    setLoginError("");
  };

  const handleLogout = () => {
    sessionStorage.removeItem("tpa_admin_auth");
    setIsAuthenticated(false);
    setUsername("");
    setPassword("");
  };

  const handleStatusChange = async (id: string, newStatus: "Pending" | "ACC") => {
    const updated = await updateTpaStatusAsync(id, newStatus);
    setRegistrations(updated);

    if (selectedDetail && selectedDetail.id === id) {
      setSelectedDetail({
        ...selectedDetail,
        status: newStatus,
        approvedAt: newStatus === "ACC" ? new Date().toISOString() : undefined,
      });
    }

    if (newStatus === "ACC") {
      showToast(
        `Pendaftaran [${id}] telah di-ACC! Anda dapat mengirim surat konfirmasi ke WhatsApp wali.`,
        "success"
      );
    } else {
      showToast(`Status [${id}] dikembalikan ke Pending.`, "info");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    const id = deleteTarget.id;
    const nama = deleteTarget.namaLengkap;
    const updated = await deleteTpaPermanentlyAsync(id);
    setRegistrations(updated);
    setDeleteTarget(null);

    if (selectedDetail && selectedDetail.id === id) {
      setSelectedDetail(null);
    }
    showToast(`Data ${nama} (${id}) telah dihapus dari sistem.`, "error");
  };

  // Bersihkan seluruh data dummy / reset database
  const handleClearAllDummy = async () => {
    try {
      await clearAllRegistrationsAsync();
      setRegistrations([]);
      setIsResetConfirmOpen(false);
      showToast("Seluruh data dummy berhasil dihapus. Database kini bersih!", "success");
    } catch (e) {
      console.error("Gagal reset:", e);
      showToast("Gagal mengosongkan database.", "error");
    }
  };

  // Submit Tambah Murid Manual dari Admin (Sama persis dengan formulir pendaftaran)
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFormData.namaLengkap.trim() || !newFormData.whatsappOrtu.trim()) {
      alert("Mohon lengkapi Nama Lengkap Murid dan Nomor WhatsApp Wali Murid.");
      return;
    }

    setIsSubmittingAdd(true);
    try {
      const saved = await saveTpaRegistrationAsync(newFormData);
      setRegistrations((prev) => [saved, ...prev.filter((it) => it.id !== saved.id)]);
      setIsAddModalOpen(false);
      setNewFormData(initialNewFormData);
      showToast(`Pendaftaran ananda ${saved.namaLengkap} (${saved.id}) berhasil ditambahkan!`, "success");
    } catch (err: any) {
      console.error(err);
      alert("Gagal menambahkan pendaftaran: " + (err.message || "Error server"));
    } finally {
      setIsSubmittingAdd(false);
    }
  };

  // Helper kirim pesan resmi penerimaan murid baru ke WhatsApp wali murid
  const handleSendAccWhatsApp = (student: TpaRegistration) => {
    const cleanWa = student.whatsappOrtu.replace(/\D/g, "");
    const formattedWa = cleanWa.startsWith("0") ? "62" + cleanWa.slice(1) : cleanWa;

    const pesanAcc =
      `*PEMBERITAHUAN HASIL SELEKSI PENDAFTARAN TPA MJS QUR'ANIC TECH*\n` +
      `Masjid Jami Sosrohadisewoyo Ngawi · Tahun Ajaran 2026/2027\n` +
      `-----------------------------------------\n\n` +
      `Assalamu'alaikum Warahmatullahi Wabarakatuh.\n\n` +
      `Kepada Yth. Bapak/Ibu Wali dari Ananda:\n` +
      `• Nama Murid: *${student.namaLengkap}* (${student.namaPanggilan})\n` +
      `• No. Registrasi: *${student.id}*\n\n` +
      `Alhamdulillah, dengan penuh rasa syukur, kami menginformasikan bahwa pendaftaran Ananda dinyatakan *DITERIMA (ACC)* di program:\n` +
      `📖 Program: *${student.programPilihan}*\n\n` +
      `Jadwal temu orientasi wali murid dan pembagian sarana mengaji akan kami informasikan lebih lanjut melalui grup koordinasi.\n\n` +
      `Jika ada pertanyaan, silakan hubungi Sekretariat TPA MJS di 0878-9441-6915 (Dadan Satria).\n\n` +
      `Jazakumullah khairan katsiran atas kepercayaan Bapak/Ibu.\n` +
      `Wassalamu'alaikum Warahmatullahi Wabarakatuh.\n\n` +
      `_Pengurus & Asatidz TPA MJS Qur'anic Tech_`;

    const waUrl = `https://wa.me/${formattedWa}?text=${encodeURIComponent(pesanAcc)}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
  };

  // Helper proses import JSON
  const handleImportSubmit = async () => {
    try {
      const parsed = JSON.parse(importJsonText);
      if (!Array.isArray(parsed)) {
        alert("Format JSON tidak valid. Harus berupa array objek murid.");
        return;
      }
      const success = await importTpaRegistrations(parsed);
      if (success) {
        setRegistrations(parsed);
        setIsImportModalOpen(false);
        setImportJsonText("");
        showToast(`Berhasil memulihkan ${parsed.length} data murid dari cadangan!`, "success");
      }
    } catch (e: any) {
      alert("Gagal membaca JSON: " + e.message);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setImportJsonText(text);
    };
    reader.readAsText(file);
  };

  // Filter & Search logic
  const filteredData = registrations.filter((item) => {
    const matchesFilter = filterStatus === "Semua" ? true : item.status === filterStatus;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesFilter;

    const matchesSearch =
      item.namaLengkap.toLowerCase().includes(q) ||
      item.namaPanggilan.toLowerCase().includes(q) ||
      (item.namaAyah && item.namaAyah.toLowerCase().includes(q)) ||
      (item.namaIbu && item.namaIbu.toLowerCase().includes(q)) ||
      (item.pekerjaanOrtu && item.pekerjaanOrtu.toLowerCase().includes(q)) ||
      (item.whatsappOrtu && item.whatsappOrtu.includes(q)) ||
      (item.sekolahAsal && item.sekolahAsal.toLowerCase().includes(q)) ||
      (item.kelasSekolah && item.kelasSekolah.toLowerCase().includes(q)) ||
      (item.kemampuanNgaji && item.kemampuanNgaji.toLowerCase().includes(q)) ||
      (item.programPilihan && item.programPilihan.toLowerCase().includes(q)) ||
      (item.alamatRumah && item.alamatRumah.toLowerCase().includes(q)) ||
      (item.catatanKhusus && item.catatanKhusus.toLowerCase().includes(q)) ||
      item.id.toLowerCase().includes(q);

    return matchesFilter && matchesSearch;
  });

  const countTotal = registrations.length;
  const countPending = registrations.filter((r) => r.status === "Pending").length;
  const countAcc = registrations.filter((r) => r.status === "ACC").length;
  const accPercentage = countTotal > 0 ? Math.round((countAcc / countTotal) * 100) : 0;

  // Single Student Print Helper
  const handlePrintSingleStudent = (student: TpaRegistration) => {
    exportTpaToPdf([student], student.status);
  };

  // Format date helpers
  const formatTanggal = (isoStr: string) => {
    try {
      return new Date(isoStr).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoStr;
    }
  };

  const formatTanggalShort = (isoStr: string) => {
    try {
      return new Date(isoStr).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return isoStr;
    }
  };

  const formatTanggalLahir = (dateStr: string) => {
    try {
      const [year, month, day] = dateStr.split("-").map(Number);
      const d = new Date(year, month - 1, day);
      return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
    } catch {
      return dateStr;
    }
  };

  /* ──────────────────────────────────────────────────────────
     1. LOGIN SCREEN
     ────────────────────────────────────────────────────────── */
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#060E1A] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M30 0l8.66 5v10L30 20l-8.66-5V5zm0 40l8.66 5v10L30 60l-8.66-5V45z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#064E3B]/20 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#C89B3C]/8 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-md w-full bg-[#0B1628]/95 backdrop-blur-xl border border-white/8 rounded-3xl p-7 sm:p-9 shadow-2xl relative z-10 text-white">
          <div className="text-center mb-8">
            <div className="relative w-20 h-20 mx-auto mb-5">
              <div className="absolute inset-0 rounded-full bg-[#C89B3C]/20 blur-md" />
              <div className="relative w-20 h-20 rounded-full border-2 border-[#C89B3C]/60 p-1 bg-white shadow-xl flex items-center justify-center">
                <img
                  src="/media/image/logo.png"
                  alt="Logo Masjid Jami Sosrohadisewoyo"
                  className="w-full h-full object-contain rounded-full"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-950/80 border border-emerald-500/30 rounded-full text-[11px] font-bold text-emerald-400 mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C89B3C]" />
              <span>PORTAL ADMIN — SISTEM INFORMASI TPA</span>
            </div>

            <h1
              className="text-2xl font-bold tracking-tight text-white"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              TPA MJS Qur'anic Tech
            </h1>
            <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
              Masjid Jami Sosrohadisewoyo · Ngawi, Jawa Timur
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 text-rose-400 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                Username Petugas
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 focus:border-emerald-500/60 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/15 transition-all pl-10 placeholder:text-slate-600"
                />
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                Kata Sandi
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 focus:border-emerald-500/60 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/15 transition-all pl-10 pr-10 placeholder:text-slate-600"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-500 hover:text-white absolute right-3.5 top-1/2 -translate-y-1/2 p-1 cursor-pointer transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between bg-white/3 p-3 rounded-xl border border-white/8 text-xs">
              <div>
                <span className="text-slate-500 text-[10px] block mb-0.5">Akses Demo Pengurus:</span>
                <span className="font-mono text-[11px] text-emerald-400">admin</span>
                <span className="text-slate-600 mx-1">/</span>
                <span className="font-mono text-[11px] text-emerald-400">tpa2026</span>
              </div>
              <button
                type="button"
                onClick={handleAutofillDemo}
                className="bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-400 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
              >
                <KeyRound className="w-3.5 h-3.5 text-[#C89B3C]" />
                <span>Isi Cepat</span>
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-[#064E3B] hover:bg-[#08634b] disabled:opacity-60 disabled:cursor-wait active:scale-[0.98] text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-[#064E3B]/40 cursor-pointer flex items-center justify-center gap-2"
            >
              {isLoggingIn ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Memverifikasi…</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-[#C89B3C]" />
                  <span>Masuk ke Dashboard Admin</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/8 text-center">
            <button
              onClick={onBackToHome}
              className="text-slate-500 hover:text-white text-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Beranda Website</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ──────────────────────────────────────────────────────────
     2. DASHBOARD ADMIN TERAUTENTIKASI
     ────────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-[#F0F4F2] text-slate-800 font-sans pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-4 left-4 sm:left-auto sm:right-6 sm:max-w-md z-50 px-5 py-3.5 rounded-2xl shadow-2xl text-xs sm:text-sm flex items-center gap-3 border transition-all
            ${
              toastType === "error"
                ? "bg-slate-900 text-white border-rose-500/30"
                : toastType === "info"
                ? "bg-slate-900 text-white border-sky-500/30"
                : "bg-slate-900 text-white border-emerald-500/30"
            }`}
        >
          {toastType === "error" ? (
            <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0" />
          ) : toastType === "info" ? (
            <Clock className="w-5 h-5 text-sky-400 flex-shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          )}
          <span className="flex-1 leading-snug">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-500 hover:text-white transition-colors cursor-pointer ml-1 flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── STICKY HEADER ── */}
      <header className="bg-slate-900 text-white sticky top-0 z-40 shadow-lg border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[#C89B3C]/60 p-0.5 bg-white shadow-md flex items-center justify-center flex-shrink-0">
              <img
                src="/media/image/logo.png"
                alt="Logo MJS"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <div className="min-w-0">
              <div className="font-bold text-sm sm:text-base tracking-wide flex items-center gap-2 flex-wrap">
                <span className="truncate">PORTAL ADMIN TPA MJS</span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] bg-emerald-900/60 text-emerald-400 px-2 py-0.5 rounded-full font-mono font-bold border border-emerald-500/25">
                  <Sparkles className="w-3 h-3" />
                  QUR'ANIC TECH
                </span>
              </div>
              <div className="text-[10px] text-slate-400 truncate flex items-center gap-2">
                <span>Masjid Jami Sosrohadisewoyo Ngawi</span>
                <span className="text-slate-600">·</span>
                <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {syncSource === "cloud" ? "Cloud Real-time" : "Cache Lokal"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {onNavigateToPublicTpa && (
              <button
                onClick={onNavigateToPublicTpa}
                className="hidden md:flex items-center gap-1.5 text-xs bg-white/5 hover:bg-white/10 text-slate-300 px-3.5 py-2 rounded-xl border border-white/10 transition-colors cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5 text-teal-400" />
                <span>Halaman Publik TPA</span>
              </button>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 px-3.5 py-2 rounded-xl border border-rose-500/20 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="font-semibold">Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Cloud Connection & Status Banner */}
        <div className="mb-6 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                syncSource === "cloud"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-sm text-slate-900">
                  {syncSource === "cloud"
                    ? "Server Cloud Terhubung (Real-time)"
                    : "Penyimpanan Lokal (Offline Cache)"}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Live Auto-Sync
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Data diselaraskan 100% dengan Formulir Pendaftaran Murid Baru. Pendaftar baru otomatis muncul di sini.
                {lastSyncedAt && ` (Sinkron terakhir: ${lastSyncedAt} WIB)`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap self-start md:self-auto">
            {/* Tombol Tambah Murid Manual */}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#064E3B] hover:bg-[#08634b] text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm active:scale-95"
              title="Tambah Data Murid Baru Secara Manual (Sesuai Formulir)"
            >
              <UserPlus className="w-3.5 h-3.5 text-[#C89B3C]" />
              <span>+ Tambah Murid</span>
            </button>

            <button
              onClick={() => loadData(true)}
              disabled={isSyncing}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer active:scale-95 disabled:opacity-50"
              title="Sinkronkan data dengan server cloud sekarang"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin text-emerald-600" : ""}`} />
              <span>{isSyncing ? "Menyinkronkan..." : "Sinkronkan"}</span>
            </button>

            <button
              onClick={() => setIsImportModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
              title="Cadangan & Pemulihan Database"
            >
              <Database className="w-3.5 h-3.5 text-[#C89B3C]" />
              <span>Cadangan</span>
            </button>

            {/* Tombol Hapus Dummy / Reset Database */}
            <button
              onClick={() => setIsResetConfirmOpen(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold rounded-xl transition-all cursor-pointer border border-rose-200"
              title="Bersihkan Seluruh Data Dummy / Reset ke 0"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-500" />
              <span>Reset Data</span>
            </button>
          </div>
        </div>

        {/* Page Title + Progress */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1
              className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Manajemen Pendaftaran Murid Baru
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1.5 max-w-xl leading-relaxed">
              TPA MJS Qur'anic Tech · Masjid Jami Sosrohadisewoyo Ngawi. Seluruh kolom dan data terintegrasi 1-to-1 dengan Formulir Pendaftaran Murid.
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 flex-shrink-0 self-start">
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                Tingkat Persetujuan (ACC)
              </div>
              <div className="flex items-center gap-2">
                <div className="w-28 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 rounded-full transition-all duration-700"
                    style={{ width: `${accPercentage}%` }}
                  />
                </div>
                <span className="text-sm font-black text-slate-800">{accPercentage}%</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                {countAcc} dari {countTotal} murid disetujui
              </div>
            </div>
          </div>
        </div>

        {/* ── STAT CARDS ── */}
        <div className="grid grid-cols-3 gap-3 sm:gap-5 mb-7">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 hover:shadow-md transition-shadow">
            <div>
              <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">
                Total Pendaftar
              </span>
              <div className="text-3xl sm:text-4xl font-black text-slate-900">{countTotal}</div>
              <span className="hidden sm:block text-[11px] text-slate-400 mt-0.5">Semua murid terdaftar</span>
            </div>
            <div className="hidden sm:flex w-11 h-11 rounded-xl bg-slate-100 items-center justify-center">
              <Users className="w-5 h-5 text-slate-500" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-amber-50/60 p-4 sm:p-5 rounded-2xl border border-amber-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 hover:shadow-md transition-shadow">
            <div>
              <span className="text-[10px] sm:text-xs font-bold text-amber-700 uppercase tracking-widest block mb-1">
                Menunggu ACC
              </span>
              <div className="text-3xl sm:text-4xl font-black text-amber-600">{countPending}</div>
              <span className="hidden sm:block text-[11px] text-amber-700/70 mt-0.5">Perlu konfirmasi pengurus</span>
            </div>
            <div className="hidden sm:flex w-11 h-11 rounded-xl bg-amber-100 items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-emerald-50/60 p-4 sm:p-5 rounded-2xl border border-emerald-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 hover:shadow-md transition-shadow">
            <div>
              <span className="text-[10px] sm:text-xs font-bold text-emerald-800 uppercase tracking-widest block mb-1">
                Disetujui (ACC)
              </span>
              <div className="text-3xl sm:text-4xl font-black text-emerald-700">{countAcc}</div>
              <span className="hidden sm:block text-[11px] text-emerald-700 mt-0.5">Siap masuk kelas TPA</span>
            </div>
            <div className="hidden sm:flex w-11 h-11 rounded-xl bg-emerald-100 items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
        </div>

        {/* ── ACTION TOOLBAR ── */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
            {/* Status Filter Tabs */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl flex-shrink-0">
              {(["Semua", "Pending", "ACC"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilterStatus(tab)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    filterStatus === tab
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {tab}
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-200/80 text-slate-600 font-mono leading-none">
                    {tab === "Semua" ? countTotal : tab === "Pending" ? countPending : countAcc}
                  </span>
                </button>
              ))}
            </div>

            {/* Search Box */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Cari murid, ortu, no WA, sekolah, program, shift, alamat, catatan, atau ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all bg-slate-50 focus:bg-white"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-0.5 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Row 2: Export & Tools */}
          <div className="flex items-center gap-2 flex-wrap border-t border-slate-100 pt-3">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mr-1 hidden sm:block">
              Alat & Ekspor:
            </span>
            <button
              onClick={() => exportTpaToCsv(filteredData)}
              disabled={filteredData.length === 0}
              className="flex items-center gap-1.5 bg-[#064E3B] hover:bg-[#08634b] active:scale-95 disabled:opacity-40 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm cursor-pointer"
              title="Download format Microsoft Excel (CSV)"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
              <span>Export Excel</span>
            </button>

            <button
              onClick={() => exportTpaToPdf(filteredData, filterStatus)}
              disabled={filteredData.length === 0}
              className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 active:scale-95 disabled:opacity-40 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm cursor-pointer"
              title="Cetak laporan PDF resmi dengan Kop Takmir MJS"
            >
              <Printer className="w-4 h-4 text-rose-200" />
              <span>Cetak PDF</span>
            </button>

            <button
              onClick={() => exportTpaToJson(registrations)}
              disabled={registrations.length === 0}
              className="flex items-center gap-1.5 bg-slate-700 hover:bg-slate-800 active:scale-95 disabled:opacity-40 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-sm cursor-pointer"
              title="Cadangkan database dalam format JSON"
            >
              <Download className="w-4 h-4 text-slate-300" />
              <span>Backup JSON</span>
            </button>

            <button
              onClick={() => loadData(true)}
              disabled={isSyncing}
              className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors cursor-pointer ml-auto disabled:opacity-50"
              title="Muat Ulang / Sinkronkan Data"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? "animate-spin text-emerald-600" : ""}`} />
            </button>

            {filteredData.length > 0 && (
              <span className="text-[11px] text-slate-400">
                Menampilkan <strong className="text-slate-700">{filteredData.length}</strong> data
              </span>
            )}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════
            DESKTOP TABLE (≥ 1024px)
            Sesuai 100% dengan Atribut Formulir Pendaftaran Murid
            ══════════════════════════════════════════════════════ */}
        <div className="hidden lg:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase tracking-widest text-[10px] font-bold">
                  <th className="py-3.5 px-3 w-10 text-center">No</th>
                  <th className="py-3.5 px-4 min-w-[190px]">Calon Murid</th>
                  <th className="py-3.5 px-4 min-w-[140px]">Usia & Kelahiran</th>
                  <th className="py-3.5 px-4 min-w-[130px]">Sekolah Asal</th>
                  <th className="py-3.5 px-4 min-w-[170px]">Program Pilihan</th>
                  <th className="py-3.5 px-4 min-w-[140px]">Shift Belajar</th>
                  <th className="py-3.5 px-4 min-w-[130px]">Kemampuan Ngaji</th>
                  <th className="py-3.5 px-4 min-w-[160px]">Orang Tua / Wali</th>
                  <th className="py-3.5 px-3 text-center">Status</th>
                  <th className="py-3.5 px-4 text-center min-w-[170px]">Aksi & Operasional</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-16 text-center">
                      <div className="max-w-md mx-auto">
                        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-100 shadow-sm">
                          <ClipboardList className="w-8 h-8" />
                        </div>
                        <h4 className="font-bold text-slate-800 text-base mb-1.5">
                          {searchQuery
                            ? "Tidak ada hasil pencarian"
                            : filterStatus !== "Semua"
                            ? `Tidak ada data dengan status "${filterStatus}"`
                            : "Database Bersih — Belum Ada Pendaftar"}
                        </h4>
                        <p className="text-xs text-slate-500 mb-5 leading-relaxed">
                          {searchQuery
                            ? `Tidak ada data murid yang cocok dengan kata kunci "${searchQuery}".`
                            : filterStatus !== "Semua"
                            ? `Tidak ditemukan murid baru dengan status ${filterStatus}.`
                            : "Semua data dummy telah dihapus. Formulir pendaftaran murid baru di website telah siap menerima data pendaftar asli secara real-time."}
                        </p>
                        <div className="flex items-center justify-center gap-2 flex-wrap">
                          {searchQuery ? (
                            <button
                              onClick={() => setSearchQuery("")}
                              className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl transition-all cursor-pointer"
                            >
                              Hapus Pencarian
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={() => setIsAddModalOpen(true)}
                                className="text-xs bg-[#064E3B] hover:bg-[#08634b] text-white font-bold px-4 py-2 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-sm"
                              >
                                <UserPlus className="w-3.5 h-3.5 text-[#C89B3C]" />
                                <span>+ Tambah Murid Manual</span>
                              </button>
                              {onNavigateToPublicTpa && (
                                <button
                                  onClick={onNavigateToPublicTpa}
                                  className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                  <span>Buka Formulir Publik</span>
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                      {/* No */}
                      <td className="py-3.5 px-3 text-center text-slate-400 font-medium">{idx + 1}</td>

                      {/* Calon Murid */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 text-sm leading-tight">
                          {item.namaLengkap}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5 flex-wrap">
                          <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                            {item.id}
                          </span>
                          <span className="text-slate-300">·</span>
                          <span>
                            Panggilan: <strong className="text-slate-700">{item.namaPanggilan}</strong>
                          </span>
                          <span className="text-slate-300">·</span>
                          <span
                            className={`font-semibold ${
                              item.jenisKelamin === "Laki-laki" ? "text-sky-600" : "text-rose-500"
                            }`}
                          >
                            {item.jenisKelamin}
                          </span>
                        </div>
                      </td>

                      {/* Usia & Tempat/Tgl Lahir */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800">{item.usia} Tahun</div>
                        <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                          {item.tempatLahir ? `${item.tempatLahir}, ` : ""}
                          {item.tanggalLahir ? formatTanggalLahir(item.tanggalLahir) : "—"}
                        </div>
                      </td>

                      {/* Sekolah Asal & Kelas */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800 text-[11px] leading-snug">
                          {item.sekolahAsal || "—"}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{item.kelasSekolah}</div>
                      </td>

                      {/* Program Pilihan */}
                      <td className="py-3.5 px-4">
                        <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-900 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg leading-snug">
                          <BookOpen className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                          <span>{item.programPilihan}</span>
                        </div>
                      </td>

                      {/* Kemampuan Ngaji */}
                      <td className="py-3.5 px-4">
                        <span className="inline-block text-[11px] font-semibold text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-md">
                          {item.kemampuanNgaji}
                        </span>
                      </td>

                      {/* Orang Tua & WA */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800 text-[12px]">
                          {item.namaAyah
                            ? `Bpk. ${item.namaAyah}`
                            : item.namaIbu
                            ? `Ibu ${item.namaIbu}`
                            : "—"}
                        </div>
                        {item.pekerjaanOrtu && (
                          <div className="text-[10px] text-slate-400">{item.pekerjaanOrtu}</div>
                        )}
                        <a
                          href={`https://wa.me/${item.whatsappOrtu.replace(
                            /\D/g,
                            ""
                          )}?text=Assalamualaikum%20Bapak%2FIbu%2C%20kami%20dari%20Pengurus%20TPA%20MJS%20Qur%27anic%20Tech%20mengonfirmasi%20pendaftaran%20ananda%20*${encodeURIComponent(
                            item.namaLengkap
                          )}*.`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-emerald-700 hover:text-emerald-900 font-semibold mt-0.5 hover:underline"
                        >
                          <Phone className="w-3 h-3" />
                          <span>{item.whatsappOrtu}</span>
                        </a>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5 px-3 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold ${
                            item.status === "ACC"
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                              : "bg-amber-100 text-amber-800 border border-amber-300"
                          }`}
                        >
                          {item.status === "ACC" ? <Check className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                          {item.status}
                        </span>
                      </td>

                      {/* Aksi & Operasional */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-center gap-1.5 flex-wrap">
                          {item.status === "Pending" ? (
                            <button
                              onClick={() => handleStatusChange(item.id, "ACC")}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-colors cursor-pointer flex items-center gap-1 shadow-sm active:scale-95"
                              title="Setujui Pendaftaran (ACC)"
                            >
                              <Check className="w-3 h-3" />
                              <span>ACC</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStatusChange(item.id, "Pending")}
                              className="px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-[11px] transition-colors cursor-pointer flex items-center gap-1 shadow-sm active:scale-95"
                              title="Kembalikan ke status Pending"
                            >
                              <Clock className="w-3 h-3" />
                              <span>Pending</span>
                            </button>
                          )}

                          {item.status === "ACC" && (
                            <button
                              onClick={() => handleSendAccWhatsApp(item)}
                              className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 transition-colors cursor-pointer flex items-center gap-1"
                              title="Kirim Surat Penerimaan Resmi ke WhatsApp Wali Murid"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span className="text-[10px] font-bold">Surat WA</span>
                            </button>
                          )}

                          <button
                            onClick={() => setSelectedDetail(item)}
                            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                            title="Lihat Formulir Lengkap"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => setDeleteTarget(item)}
                            className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-500 transition-colors cursor-pointer"
                            title="Hapus Data Permanen"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════
            MOBILE / TABLET CARD VIEW (< 1024px)
            ══════════════════════════════════════════════════════ */}
        <div className="lg:hidden space-y-3 mb-8">
          {filteredData.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-slate-200">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-100 shadow-sm">
                <ClipboardList className="w-8 h-8" />
              </div>
              <p className="font-bold text-slate-800 text-base mb-1">
                {searchQuery ? "Tidak ada hasil pencarian" : "Belum Ada Pendaftar"}
              </p>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                {searchQuery
                  ? `Tidak ada murid yang cocok dengan "${searchQuery}".`
                  : "Semua data dummy telah dibersihkan. Formulir pendaftaran siap menerima murid baru."}
              </p>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="text-xs bg-[#064E3B] hover:bg-[#08634b] text-white font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-sm"
              >
                <UserPlus className="w-3.5 h-3.5 text-[#C89B3C]" />
                <span>+ Tambah Murid Manual</span>
              </button>
            </div>
          ) : (
            filteredData.map((item, idx) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
              >
                <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold flex items-center justify-center flex-shrink-0">
                      {idx + 1}
                    </span>
                    <span className="font-mono text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                      {item.id}
                    </span>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                      item.status === "ACC"
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                        : "bg-amber-100 text-amber-800 border border-amber-200"
                    }`}
                  >
                    {item.status === "ACC" ? <Check className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                    {item.status}
                  </span>
                </div>

                <div className="px-4 py-3">
                  <div className="mb-2.5">
                    <h3 className="font-bold text-base text-slate-900 leading-tight">
                      {item.namaLengkap}
                    </h3>
                    <div className="text-xs text-slate-400 mt-0.5 flex flex-wrap gap-1.5">
                      <span className="font-medium text-slate-600">{item.namaPanggilan}</span>
                      <span>·</span>
                      <span
                        className={
                          item.jenisKelamin === "Laki-laki"
                            ? "text-sky-600 font-semibold"
                            : "text-rose-500 font-semibold"
                        }
                      >
                        {item.jenisKelamin}
                      </span>
                      <span>·</span>
                      <span>{item.usia} Tahun</span>
                      {item.tempatLahir && (
                        <>
                          <span>·</span>
                          <span>{item.tempatLahir}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                    <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100">
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                        <School className="w-3 h-3" /> Sekolah
                      </div>
                      <div className="font-semibold text-slate-800 text-[11px] leading-snug">
                        {item.sekolahAsal || "—"}
                      </div>
                      <div className="text-[10px] text-slate-400">{item.kelasSekolah}</div>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100">
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                        <BookOpen className="w-3 h-3" /> Kemampuan
                      </div>
                      <div className="font-bold text-teal-700 text-[11px] leading-snug">
                        {item.kemampuanNgaji}
                      </div>
                    </div>
                  </div>

                  {/* Wali & WA */}
                  <div className="flex items-center justify-between bg-slate-50 rounded-xl p-2.5 border border-slate-100 mb-3">
                    <div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">
                        Wali Murid
                      </div>
                      <div className="font-semibold text-slate-800 text-xs">
                        {item.namaAyah ? `Bpk. ${item.namaAyah}` : item.namaIbu ? `Ibu ${item.namaIbu}` : "—"}
                      </div>
                      {item.pekerjaanOrtu && (
                        <div className="text-[10px] text-slate-400">{item.pekerjaanOrtu}</div>
                      )}
                    </div>
                    <a
                      href={`https://wa.me/${item.whatsappOrtu.replace(
                        /\D/g,
                        ""
                      )}?text=Assalamualaikum%20Bapak%2FIbu%2C%20kami%20dari%20Pengurus%20TPA%20MJS%20Qur%27anic%20Tech%20mengonfirmasi%20pendaftaran%20ananda%20*${encodeURIComponent(
                        item.namaLengkap
                      )}*.`}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold px-3 py-2 rounded-lg flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{item.whatsappOrtu}</span>
                    </a>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="px-4 pb-4 flex items-center gap-2 pt-1 border-t border-slate-100 flex-wrap">
                  {item.status === "Pending" ? (
                    <button
                      onClick={() => handleStatusChange(item.id, "ACC")}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Check className="w-4 h-4" />
                      <span>Setujui (ACC)</span>
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => handleStatusChange(item.id, "Pending")}
                        className="flex-1 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <Clock className="w-4 h-4" />
                        <span>Ke Pending</span>
                      </button>
                      <button
                        onClick={() => handleSendAccWhatsApp(item)}
                        className="bg-emerald-50 border border-emerald-300 text-emerald-700 font-bold text-xs py-2.5 px-3 rounded-xl transition-all flex items-center gap-1"
                        title="Kirim Surat Resmi ACC"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Kirim WA</span>
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => setSelectedDetail(item)}
                    className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                    title="Lihat Detail Lengkap"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setDeleteTarget(item)}
                    className="p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-500 transition-colors cursor-pointer"
                    title="Hapus Data Permanen"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ── ADMIN INFO FOOTER ── */}
        <div className="border-t border-slate-200 pt-6 mt-2 pb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-400">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full border border-[#C89B3C]/40 p-0.5 bg-white flex-shrink-0">
                <img src="/media/image/logo.png" alt="MJS" className="w-full h-full object-contain rounded-full" />
              </div>
              <div>
                <div className="font-bold text-slate-600 text-[11px]">TPA MJS Qur'anic Tech</div>
                <div className="text-[10px] mt-0.5">
                  Jl. Monginsidi No. 51, RT 011/RW 002, Pelem II, Desa Pelem, Kec. Ngawi, Kab. Ngawi, Jawa Timur
                </div>
                <div className="text-[10px] mt-0.5">
                  Admin TPA MJS: Dadan Satria (
                  <a href="https://wa.me/6287894416915" className="text-emerald-600 font-semibold hover:underline">
                    087894416915
                  </a>
                  )
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px]">Portal Admin — Sistem Informasi Murid TPA MJS</div>
              <div className="text-[10px] mt-0.5 text-slate-500">
                Penyimpanan:{" "}
                <span className="font-semibold text-emerald-700">Cloud Real-time + Local Cache</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ══════════════════════════════════════════════════════
          MODAL TAMBAH PENDAFTARAN MANUAL DARI ADMIN
          (Sesuai 100% dengan Formulir Pendaftaran Murid Baru)
          ══════════════════════════════════════════════════════ */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-2xl shadow-2xl max-h-[92vh] overflow-y-auto border border-slate-100 sm:border-none">
            <div className="sm:hidden flex justify-center pt-3 pb-1">
              <div className="w-12 h-1 rounded-full bg-slate-200" />
            </div>

            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100 sticky top-0 bg-white z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 leading-tight">
                    Tambah Pendaftaran Murid Baru
                  </h3>
                  <p className="text-xs text-slate-400">
                    Formulir resmi administrasi santri baru TPA MJS Qur'anic Tech
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-6">
              {/* Bagian 1: Data Calon Murid */}
              <div>
                <div className="flex items-center gap-2 border-b border-slate-200 pb-2 mb-4">
                  <span className="w-6 h-6 rounded-full bg-[#0F766E] text-white text-xs font-bold flex items-center justify-center">
                    1
                  </span>
                  <h4 className="font-bold text-sm text-slate-900">Data Calon Murid</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Nama Lengkap Murid <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Muhammad Faiz Al-Fatih"
                      value={newFormData.namaLengkap}
                      onChange={(e) => setNewFormData({ ...newFormData, namaLengkap: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0F766E] bg-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Nama Panggilan
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Faiz"
                      value={newFormData.namaPanggilan}
                      onChange={(e) => setNewFormData({ ...newFormData, namaPanggilan: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0F766E] bg-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Tempat Lahir
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Ngawi"
                      value={newFormData.tempatLahir}
                      onChange={(e) => setNewFormData({ ...newFormData, tempatLahir: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0F766E] bg-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Tanggal Lahir
                    </label>
                    <input
                      type="date"
                      value={newFormData.tanggalLahir}
                      onChange={(e) => setNewFormData({ ...newFormData, tanggalLahir: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0F766E] bg-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Jenis Kelamin
                    </label>
                    <select
                      value={newFormData.jenisKelamin}
                      onChange={(e) =>
                        setNewFormData({
                          ...newFormData,
                          jenisKelamin: e.target.value as "Laki-laki" | "Perempuan",
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0F766E] bg-white text-xs"
                    >
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Usia (Tahun)
                    </label>
                    <input
                      type="number"
                      min={4}
                      max={15}
                      value={newFormData.usia}
                      onChange={(e) => setNewFormData({ ...newFormData, usia: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0F766E] bg-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Sekolah Asal (TK / SD / MI)
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: SDIT Al-Ihsan Ngawi"
                      value={newFormData.sekolahAsal}
                      onChange={(e) => setNewFormData({ ...newFormData, sekolahAsal: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0F766E] bg-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Kelas di Sekolah
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Kelas 2 / TK B"
                      value={newFormData.kelasSekolah}
                      onChange={(e) => setNewFormData({ ...newFormData, kelasSekolah: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0F766E] bg-white text-xs"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Kemampuan Membaca Al-Qur'an Saat Ini
                    </label>
                    <select
                      value={newFormData.kemampuanNgaji}
                      onChange={(e) =>
                        setNewFormData({
                          ...newFormData,
                          kemampuanNgaji: e.target.value as any,
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0F766E] bg-white text-xs"
                    >
                      <option value="Belum Bisa">Belum Bisa Mengenal Huruf Hijaiyah</option>
                      <option value="Iqro Jilid 1-3">Iqro' Jilid 1 sampai 3</option>
                      <option value="Iqro Jilid 4-6">Iqro' Jilid 4 sampai 6</option>
                      <option value="Al-Qur'an Lancar">Sudah Masuk Al-Qur'an (Belajar Tajwid)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Pilihan Program Belajar
                    </label>
                    <select
                      value={newFormData.programPilihan}
                      onChange={(e) => setNewFormData({ ...newFormData, programPilihan: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0F766E] bg-white text-xs"
                    >
                      <option value="Tahsin Tajwid & Qur'anic Tech Kids">Tahsin Tajwid & Qur'anic Tech Kids</option>
                      <option value="Tahfidz Juz 30 & Adab Digital Murid">Tahfidz Juz 30 & Adab Digital Murid</option>
                      <option value="Qur'anic Tech & Multimedia Islami">Qur'anic Tech & Multimedia Islami</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Bagian 2: Data Orang Tua / Wali */}
              <div>
                <div className="flex items-center gap-2 border-b border-slate-200 pb-2 mb-4">
                  <span className="w-6 h-6 rounded-full bg-[#C89B3C] text-slate-900 text-xs font-bold flex items-center justify-center">
                    2
                  </span>
                  <h4 className="font-bold text-sm text-slate-900">Data Orang Tua / Wali</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Nama Ayah
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Budi Santoso"
                      value={newFormData.namaAyah}
                      onChange={(e) => setNewFormData({ ...newFormData, namaAyah: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0F766E] bg-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Nama Ibu
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Siti Rahmawati"
                      value={newFormData.namaIbu}
                      onChange={(e) => setNewFormData({ ...newFormData, namaIbu: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0F766E] bg-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Pekerjaan Orang Tua
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Wiraswasta / PNS / Guru"
                      value={newFormData.pekerjaanOrtu}
                      onChange={(e) => setNewFormData({ ...newFormData, pekerjaanOrtu: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0F766E] bg-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Nomor WhatsApp Aktif Wali <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Contoh: 081234567890"
                      value={newFormData.whatsappOrtu}
                      onChange={(e) => setNewFormData({ ...newFormData, whatsappOrtu: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0F766E] bg-white font-semibold text-[#0F766E] text-xs"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Alamat Lengkap Rumah
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Jl. / RT / RW / Dusun / Desa di Ngawi"
                      value={newFormData.alamatRumah}
                      onChange={(e) => setNewFormData({ ...newFormData, alamatRumah: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0F766E] bg-white text-xs resize-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Catatan Khusus / Karakter Anak
                    </label>
                    <input
                      type="text"
                      placeholder="Misal: Senang menggambar, agak pemalu di awal, dll."
                      value={newFormData.catatanKhusus}
                      onChange={(e) => setNewFormData({ ...newFormData, catatanKhusus: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0F766E] bg-white text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingAdd}
                  className="px-6 py-2.5 rounded-xl bg-[#064E3B] hover:bg-[#08634b] disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-[#064E3B]/20 cursor-pointer active:scale-95 transition-all"
                >
                  <Check className="w-4 h-4 text-[#C89B3C]" />
                  <span>{isSubmittingAdd ? "Menyimpan ke Cloud..." : "Simpan Pendaftaran Murid"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          MODAL DETAIL LENGKAP FORMULIR MURID
          (Menyajikan seluruh 17 atribut formulir + 4 sistem)
          ══════════════════════════════════════════════════════ */}
      {selectedDetail && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-2xl shadow-2xl max-h-[92vh] overflow-y-auto border border-slate-100 sm:border-none">
            <div className="sm:hidden flex justify-center pt-3 pb-1">
              <div className="w-12 h-1 rounded-full bg-slate-200" />
            </div>

            {/* Modal Header */}
            <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-slate-100 sticky top-0 bg-white z-10">
              <div className="min-w-0 pr-2">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    {selectedDetail.id}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      selectedDetail.status === "ACC"
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                        : "bg-amber-100 text-amber-800 border border-amber-200"
                    }`}
                  >
                    {selectedDetail.status === "ACC" ? (
                      <>
                        <Check className="w-3 h-3" /> Disetujui (ACC)
                      </>
                    ) : (
                      <>
                        <Clock className="w-3 h-3" /> Menunggu Konfirmasi
                      </>
                    )}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 leading-tight">
                  {selectedDetail.namaLengkap}
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Didaftarkan: {formatTanggal(selectedDetail.createdAt)}
                  {selectedDetail.approvedAt && (
                    <span className="ml-2 text-emerald-700">
                      · Di-ACC: {formatTanggalShort(selectedDetail.approvedAt)}
                    </span>
                  )}
                </p>
              </div>
              <button
                onClick={() => setSelectedDetail(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Detail Content */}
            <div className="px-6 py-5">
              {/* Program & Jadwal */}
              <div className="mb-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5" />
                  Program & Jadwal Pilihan
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  <DetailField
                    label="Program Belajar Terpilih"
                    value={selectedDetail.programPilihan || "—"}
                    className="text-emerald-800 font-bold"
                    colSpan
                  />
                  <DetailField
                    label="Kemampuan Membaca Al-Qur'an"
                    value={selectedDetail.kemampuanNgaji}
                    className="text-teal-700 font-bold"
                    colSpan
                  />
                </div>
              </div>

              {/* Data Pribadi Murid */}
              <div className="mb-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <User className="w-3.5 h-3.5" />
                  Data Pribadi Murid
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  <DetailField label="Nama Panggilan" value={selectedDetail.namaPanggilan} />
                  <DetailField
                    label="Jenis Kelamin"
                    value={selectedDetail.jenisKelamin}
                    className={
                      selectedDetail.jenisKelamin === "Laki-laki" ? "text-sky-700" : "text-rose-600"
                    }
                  />
                  <DetailField
                    label="Tempat, Tanggal Lahir"
                    value={`${selectedDetail.tempatLahir}, ${formatTanggalLahir(
                      selectedDetail.tanggalLahir
                    )}`}
                  />
                  <DetailField label="Usia" value={`${selectedDetail.usia} Tahun`} />
                  <DetailField label="Sekolah Asal" value={selectedDetail.sekolahAsal || "—"} />
                  <DetailField label="Kelas di Sekolah" value={selectedDetail.kelasSekolah} />
                </div>
              </div>

              {/* Data Orang Tua */}
              <div className="mb-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Users className="w-3.5 h-3.5" />
                  Data Orang Tua / Wali
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  <DetailField label="Nama Ayah" value={selectedDetail.namaAyah || "—"} />
                  <DetailField label="Nama Ibu" value={selectedDetail.namaIbu || "—"} />
                  <DetailField label="Pekerjaan Orang Tua" value={selectedDetail.pekerjaanOrtu || "—"} />
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1.5">
                      No. WhatsApp Wali
                    </span>
                    <a
                      href={`https://wa.me/${selectedDetail.whatsappOrtu.replace(
                        /\D/g,
                        ""
                      )}?text=Assalamualaikum%20Bapak%2FIbu%2C%20kami%20dari%20Pengurus%20TPA%20MJS%20Qur%27anic%20Tech%20mengonfirmasi%20pendaftaran%20ananda%20*${encodeURIComponent(
                        selectedDetail.namaLengkap
                      )}*.`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1.5 group"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span className="group-hover:underline">{selectedDetail.whatsappOrtu}</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full ml-1">
                        Chat WA
                      </span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Alamat & Catatan */}
              <div className="grid grid-cols-1 gap-2.5 text-xs mb-4">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Alamat Lengkap Rumah
                  </span>
                  <span className="font-medium text-slate-800 leading-relaxed text-[12px]">
                    {selectedDetail.alamatRumah || "—"}
                  </span>
                </div>
                {selectedDetail.catatanKhusus && (
                  <div className="bg-amber-50 p-3 rounded-xl border border-amber-100">
                    <span className="text-[10px] text-amber-700 font-bold uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                      <Star className="w-3 h-3" /> Catatan Khusus / Karakter Anak
                    </span>
                    <span className="font-medium text-amber-900 leading-relaxed text-[12px] italic">
                      "{selectedDetail.catatanKhusus}"
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="px-6 pb-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="flex items-center gap-2 flex-1 flex-wrap">
                <button
                  onClick={() => handlePrintSingleStudent(selectedDetail)}
                  className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-300" />
                  <span>Cetak Biodata</span>
                </button>

                {selectedDetail.status === "ACC" && (
                  <button
                    onClick={() => handleSendAccWhatsApp(selectedDetail)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Kirim Surat ACC via WA</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 justify-end">
                {selectedDetail.status === "Pending" ? (
                  <button
                    onClick={() => handleStatusChange(selectedDetail.id, "ACC")}
                    className="flex-1 sm:flex-initial bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Check className="w-4 h-4" />
                    <span>Setujui (ACC)</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleStatusChange(selectedDetail.id, "Pending")}
                    className="flex-1 sm:flex-initial bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Clock className="w-4 h-4" />
                    <span>Ke Pending</span>
                  </button>
                )}

                <button
                  onClick={() => setSelectedDetail(null)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          MODAL RESET SELURUH DATA DUMMY
          ══════════════════════════════════════════════════════ */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-sm w-full shadow-2xl border border-slate-100">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-7 h-7" />
            </div>

            <div className="text-center mb-6">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Hapus Seluruh Data Dummy?</h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Tindakan ini akan mengosongkan database pendaftaran murid di cloud dan memori perangkat.
                Database akan berada dalam kondisi bersih (0 murid) siap menerima pendaftaran baru dari formulir website.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-3 rounded-xl transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleClearAllDummy}
                className="flex-1 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold text-xs py-3 rounded-xl transition-colors cursor-pointer shadow-md shadow-rose-600/20"
              >
                Kosongkan Database
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          MODAL CADANGAN & IMPORT DATABASE (RESTORE)
          ══════════════════════════════════════════════════════ */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-base text-slate-900">Cadangan & Pulihkan Database</h3>
              </div>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Anda dapat mengunduh seluruh data murid ke file JSON atau memulihkan data dari berkas cadangan JSON yang sebelumnya disimpan.
            </p>

            <div className="space-y-4">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-3">
                <div>
                  <div className="font-bold text-xs text-slate-800">Unduh Cadangan Lengkap</div>
                  <div className="text-[11px] text-slate-400">Format JSON (berisi {registrations.length} data murid)</div>
                </div>
                <button
                  onClick={() => exportTpaToJson(registrations)}
                  disabled={registrations.length === 0}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 disabled:opacity-40 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Pulihkan / Unggah Berkas JSON Cadangan
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".json,application/json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2.5 px-4 border-2 border-dashed border-slate-200 hover:border-emerald-500 rounded-xl text-xs font-medium text-slate-600 hover:text-emerald-700 bg-slate-50 hover:bg-emerald-50/50 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Upload className="w-4 h-4 text-emerald-600" />
                  <span>Pilih File Backup (.json) dari Komputer</span>
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Atau Tempelkan (Paste) Teks JSON Di Sini
                </label>
                <textarea
                  rows={4}
                  value={importJsonText}
                  onChange={(e) => setImportJsonText(e.target.value)}
                  placeholder='[ { "id": "REG-TPA-001", "namaLengkap": "..." } ]'
                  className="w-full p-3 font-mono text-[11px] bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setIsImportModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                >
                  Batal
                </button>
                <button
                  onClick={handleImportSubmit}
                  disabled={!importJsonText.trim()}
                  className="flex-1 py-2.5 rounded-xl bg-[#064E3B] hover:bg-[#08634b] disabled:opacity-40 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>Pulihkan ke Database</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          MODAL KONFIRMASI HAPUS PERMANEN
          ══════════════════════════════════════════════════════ */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-sm w-full shadow-2xl border border-slate-100">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-5">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="text-center mb-6">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Hapus Data Permanen?</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Data calon murid{" "}
                <strong className="text-slate-900">{deleteTarget.namaLengkap}</strong>{" "}
                <span className="font-mono text-slate-500 text-xs">({deleteTarget.id})</span> akan
                dihapus dari server cloud dan memori lokal. Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm py-3 rounded-xl transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold text-sm py-3 rounded-xl transition-colors cursor-pointer shadow-md shadow-rose-600/20"
              >
                Hapus Permanen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Detail Field Helper Component ── */
function DetailField({
  label,
  value,
  className = "",
  colSpan = false,
}: {
  label: string;
  value: string;
  className?: string;
  colSpan?: boolean;
}) {
  return (
    <div className={`bg-slate-50 p-3 rounded-xl border border-slate-100 ${colSpan ? "sm:col-span-2" : ""}`}>
      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
        {label}
      </span>
      <span className={`font-bold text-slate-800 text-[12px] leading-snug ${className}`}>
        {value}
      </span>
    </div>
  );
}
