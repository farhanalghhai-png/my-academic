import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Menu, Search, Bell, Sun, Moon, Bot, Send, X, Plus, Trash2, Check,
  Home, BookOpen, GraduationCap, CalendarDays, ClipboardCheck,
  Wallet, FileText, Printer, User, Star, MessageSquare,
  ChevronRight, ChevronDown, Sparkles, AlertTriangle, Download, Copy,
  Settings2, UserCog, Lock,
} from "lucide-react";
import logoAsset from "@/assets/unikom-logo.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "My Academic UNIKOM — Portal Akademik" },
      { name: "description", content: "Portal akademik mahasiswa UNIKOM — KRS, jadwal, nilai, pembayaran, dan asisten AI." },
      { property: "og:title", content: "My Academic UNIKOM" },
      { property: "og:description", content: "Portal akademik modern untuk mahasiswa UNIKOM." },
    ],
  }),
  component: Index,
});

type ViewKey =
  | "beranda" | "krs" | "nilai" | "jadwal" | "presensi"
  | "pembayaran" | "transkrip" | "kpu" | "profil" | "evaluasi";

const VIEW_META: Record<ViewKey, { label: string; group: string; icon: any }> = {
  beranda: { label: "Beranda", group: "Dashboard", icon: Home },
  krs: { label: "Rencana Studi (KRS)", group: "Akademik", icon: BookOpen },
  nilai: { label: "Nilai & KHS", group: "Akademik", icon: GraduationCap },
  jadwal: { label: "Jadwal Kuliah", group: "Akademik", icon: CalendarDays },
  presensi: { label: "Presensi", group: "Akademik", icon: ClipboardCheck },
  pembayaran: { label: "Status Pembayaran", group: "Administrasi", icon: Wallet },
  transkrip: { label: "Transkrip & Kurikulum", group: "Administrasi", icon: FileText },
  kpu: { label: "Cetak KPU", group: "Administrasi", icon: Printer },
  profil: { label: "Profil & Biodata", group: "Layanan", icon: User },
  evaluasi: { label: "Evaluasi Dosen", group: "Layanan", icon: Star },
};

function Index() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [role, setRole] = useState<"senior" | "baru">("senior");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [view, setView] = useState<ViewKey>("beranda");
  const [megaOpen, setMegaOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [tourStep, setTourStep] = useState(0);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    if (role === "baru") setTourStep(0);
  }, [role]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMegaOpen(false);
        if (tourStep > 0) setTourStep(0);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [tourStep]);

  const navigate = (v: ViewKey) => {
    setView(v);
    setMegaOpen(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <TopNavbar
        onToggleSidebar={() => setSidebarOpen((s) => !s)}
        view={view}
        megaOpen={megaOpen}
        setMegaOpen={setMegaOpen}
        navigate={navigate}
        theme={theme}
        setTheme={setTheme}
      />

      <div className="flex pt-16">
        <Sidebar open={sidebarOpen} view={view} setView={setView} />
        <main
          className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"}`}
        >
          <div className="mx-auto max-w-7xl px-8 py-10">
            <ViewRenderer
              view={view}
              role={role}
              tourStep={tourStep}
              setTourStep={setTourStep}
              navigate={navigate}
              openChat={() => setChatOpen(true)}
            />
          </div>
        </main>
      </div>

      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="group fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl shadow-primary/30 ring-1 ring-primary/20 transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-primary/40"
          aria-label="Buka asisten AI"
        >
          <Bot className="h-6 w-6 transition-transform group-hover:rotate-6" />
          <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-success ring-2 ring-card" />
          </span>
        </button>
      )}
      <ChatPanel open={chatOpen} onClose={() => setChatOpen(false)} />

      <ControllerWidget
        role={role}
        setRole={(r) => {
          setRole(r);
          if (r === "baru") {
            setView("beranda");
            setTourStep(0);
          }
        }}
      />
    </div>
  );
}

/* ---------------- TOP NAVBAR ---------------- */
function TopNavbar({
  onToggleSidebar, view, megaOpen, setMegaOpen, navigate, theme, setTheme,
}: {
  onToggleSidebar: () => void;
  view: ViewKey;
  megaOpen: boolean;
  setMegaOpen: (b: boolean) => void;
  navigate: (v: ViewKey) => void;
  theme: "light" | "dark";
  setTheme: (t: "light" | "dark") => void;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!megaOpen) return;
    const onClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setMegaOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [megaOpen, setMegaOpen]);

  const meta = VIEW_META[view];

  return (
    <header className="fixed inset-x-0 top-0 z-40 h-16 border-b border-border bg-card/80 backdrop-blur-xl">
      <div className="flex h-full items-center gap-4 px-6">
        <button
          onClick={onToggleSidebar}
          className="rounded-lg p-2 text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-3">
          <img src={logoAsset.url} alt="UNIKOM" className="h-9 w-9 object-contain" />
          <div className="hidden md:block">
            <div className="text-sm font-bold tracking-tight">MY ACADEMIC</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>Dashboard</span>
              <ChevronRight className="h-3 w-3" />
              <span className="text-foreground">{meta.label}</span>
            </div>
          </div>
        </div>

        {/* Quick Search — perfect capsule, very light gray */}
        <div ref={wrapperRef} className="relative mx-auto w-full max-w-xl">
          <div
            className="flex h-11 cursor-text items-center gap-3 rounded-full bg-muted/70 px-5 transition focus-within:bg-muted focus-within:ring-2 focus-within:ring-primary/30 hover:bg-muted"
            onClick={() => setMegaOpen(true)}
          >
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari menu, mata kuliah, fitur…"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              onFocus={() => setMegaOpen(true)}
            />
            <kbd className="hidden rounded bg-background/80 px-1.5 py-0.5 text-[10px] text-muted-foreground sm:inline">⌘K</kbd>
          </div>

          {megaOpen && <MegaMenu navigate={navigate} />}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="rounded-lg p-2 text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
            aria-label="Toggle tema"
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5 text-muted-foreground" />
            ) : (
              <Sun className="h-5 w-5 text-foreground" />
            )}
          </button>
          <button className="rounded-lg p-2 text-muted-foreground transition hover:bg-accent hover:text-accent-foreground" aria-label="Riwayat">
            <CalendarDays className="h-5 w-5" />
          </button>
          <button className="relative rounded-lg p-2 text-muted-foreground transition hover:bg-accent hover:text-accent-foreground" aria-label="Notifikasi">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive ring-2 ring-card" />
          </button>
          <div className="flex items-center gap-2 rounded-full border border-border bg-background px-2 py-1">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary to-unikom-blue text-xs font-semibold text-primary-foreground">U</div>
            <span className="hidden pr-2 text-xs font-medium md:inline">Username</span>
            <ChevronDown className="hidden h-3 w-3 pr-1 text-muted-foreground md:inline" />
          </div>
        </div>
      </div>
    </header>
  );
}

function MegaMenu({ navigate }: { navigate: (v: ViewKey) => void }) {
  const cols: { title: string; items: { key: ViewKey; label: string }[] }[] = [
    { title: "Akademik", items: [
      { key: "beranda", label: "Beranda" },
      { key: "krs", label: "Rencana Studi (KRS)" },
      { key: "nilai", label: "Nilai & KHS" },
      { key: "jadwal", label: "Jadwal Kuliah" },
      { key: "presensi", label: "Presensi" },
    ]},
    { title: "Administrasi", items: [
      { key: "pembayaran", label: "Status Pembayaran" },
      { key: "transkrip", label: "Transkrip & Kurikulum" },
      { key: "kpu", label: "Cetak KPU" },
    ]},
    { title: "Layanan", items: [
      { key: "profil", label: "Profil & Biodata" },
      { key: "evaluasi", label: "Evaluasi Dosen" },
      { key: "beranda", label: "Helpdesk AI" },
    ]},
  ];
  return (
    <div className="absolute left-0 right-0 top-[calc(100%+12px)] z-50 rounded-3xl border border-border/60 bg-popover p-8 shadow-2xl shadow-foreground/5 ring-1 ring-black/5">
      <div className="grid grid-cols-3 gap-10">
        {cols.map((col) => (
          <div key={col.title}>
            <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">{col.title}</div>
            <ul className="space-y-1.5">
              {col.items.map((it, i) => {
                const Icon = VIEW_META[it.key].icon;
                return (
                  <li key={i}>
                    <button
                      onClick={() => navigate(it.key)}
                      className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-popover-foreground transition hover:bg-accent hover:text-accent-foreground"
                    >
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted/70 text-muted-foreground transition group-hover:bg-primary/15 group-hover:text-primary">
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      {it.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-6 flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
        <span>Tekan <kbd className="rounded bg-muted px-1.5 py-0.5">Esc</kbd> untuk menutup</span>
        <span className="flex items-center gap-1"><Sparkles className="h-3 w-3" /> Powered by UNIKOM AI</span>
      </div>
    </div>
  );
}

/* ---------------- SIDEBAR ---------------- */
function Sidebar({
  open, view, setView,
}: { open: boolean; view: ViewKey; setView: (v: ViewKey) => void }) {
  const groups: { title: string; items: ViewKey[] }[] = [
    { title: "UMUM", items: ["beranda", "profil"] },
    { title: "AKADEMIK", items: ["krs", "nilai", "jadwal", "presensi", "transkrip"] },
    { title: "ADMINISTRASI", items: ["pembayaran", "kpu"] },
    { title: "LAINNYA", items: ["evaluasi"] },
  ];
  return (
    <aside
      className={`fixed bottom-0 left-0 top-16 z-30 border-r border-border bg-card transition-all duration-300 ${open ? "w-64" : "w-20"}`}
    >
      <nav className="flex h-full flex-col gap-6 overflow-y-auto p-3">
        {groups.map((g) => (
          <div key={g.title}>
            {open && (
              <div className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                {g.title}
              </div>
            )}
            <ul className="space-y-1">
              {g.items.map((k) => {
                const Icon = VIEW_META[k].icon;
                const active = view === k;
                return (
                  <li key={k}>
                    <button
                      onClick={() => setView(k)}
                      title={VIEW_META[k].label}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                        active
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      } ${open ? "" : "justify-center"}`}
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      {open && <span className="truncate">{VIEW_META[k].label}</span>}
                      {open && k === "krs" && <Badge tone="primary">KRS</Badge>}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}

/* ---------------- VIEW RENDERER ---------------- */
function ViewRenderer(props: {
  view: ViewKey;
  role: "senior" | "baru";
  tourStep: number;
  setTourStep: (n: number) => void;
  navigate: (v: ViewKey) => void;
  openChat: () => void;
}) {
  const { view } = props;
  switch (view) {
    case "beranda": return <Beranda {...props} />;
    case "krs": return <KRS openChat={props.openChat} />;
    case "nilai": return <Nilai />;
    case "jadwal": return <Jadwal />;
    case "presensi": return <Presensi />;
    case "pembayaran": return <Pembayaran />;
    case "transkrip": return <Transkrip />;
    case "kpu": return <KPU />;
    case "profil": return <Profil />;
    case "evaluasi": return <Evaluasi />;
  }
}

function PageHeader({ title, subtitle, badge }: { title: string; subtitle?: string; badge?: React.ReactNode }) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <div>
        <div className="mb-2 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Home className="h-3.5 w-3.5" />
          <span>Beranda</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {badge}
    </div>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-border bg-card p-6 ${className}`}>{children}</div>;
}

/* -------- VIEW 1: BERANDA -------- */
function Beranda({
  role, tourStep, setTourStep,
}: { role: "senior" | "baru"; tourStep: number; setTourStep: (n: number) => void }) {
  if (role === "baru") {
    const guides = [
      { icon: FileText, tone: "primary", title: "Cara Isi KRS", body: "Panduan langkah demi langkah memilih dan memvalidasi mata kuliah untuk semester pertama." },
      { icon: CalendarDays, tone: "warning", title: "Cek Jadwal Kuliah", body: "Ketahui cara membaca jadwal, mencari ruang kelas, dan mengelola kalender akademik Anda." },
      { icon: GraduationCap, tone: "success", title: "Akses Materi E-Learning", body: "Tutorial mengakses silabus, mengunduh materi dosen, dan mengumpulkan tugas via portal." },
    ] as const;
    const toneBg: Record<string, string> = {
      primary: "bg-primary/10 text-primary",
      warning: "bg-warning/20 text-warning-foreground",
      success: "bg-success/15 text-success",
    };

    return (
      <>
        <div className="mb-2 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Home className="h-3.5 w-3.5" /><span>Beranda</span>
        </div>

        {/* Hero Welcome */}
        <div className="relative mb-8 overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-card p-8">
          <Badge tone="primary"><span className="text-base">ⓘ</span> Status: Aktif · Semester 1</Badge>
          <h1 className="mt-4 max-w-2xl text-3xl font-bold tracking-tight">Selamat datang, Mahasiswa Baru!</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Ini adalah portal akademik Anda. Sebagai langkah awal, mari pelajari fitur-fitur penting yang akan membantu kelancaran perkuliahan Anda di semester pertama ini.
          </p>
        </div>

        {/* Guide cards */}
        <div className="mb-3 flex items-end justify-between">
          <h2 className="flex items-center gap-2 text-lg font-bold"><BookOpen className="h-5 w-5 text-primary" /> Panduan Mahasiswa Baru</h2>
          <button className="text-xs font-semibold text-primary hover:underline">Lihat Semua →</button>
        </div>
        <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-3">
          {guides.map((g, i) => (
            <Card key={i} className="flex flex-col">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${toneBg[g.tone]}`}>
                <g.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-base font-bold">{g.title}</h3>
              <p className="mt-1.5 flex-1 text-sm text-muted-foreground">{g.body}</p>
              <button className="mt-5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90">Mulai Panduan</button>
            </Card>
          ))}
        </div>

        {/* Agenda + Akses Cepat */}
        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <h2 className="mb-3 flex items-center gap-2 text-base font-bold">🚩 Agenda Penting Semester 1</h2>
            <Card className="!p-5">
              <ol className="relative space-y-5 border-l-2 border-border pl-6">
                {[
                  { icon: Check, tone: "success", date: "1 - 5 Agustus 2024", title: "Masa Orientasi Kampus", body: "Pengenalan lingkungan dan sistem akademik universitas." },
                  { icon: BookOpen, tone: "primary", date: "10 - 15 Agustus 2024", title: "Pengisian KRS Online", body: "Batas waktu persetujuan KRS oleh Dosen Pembimbing Akademik.", cta: "Isi KRS Sekarang" },
                ].map((a, i) => (
                  <li key={i} className="relative">
                    <span className={`absolute -left-[34px] flex h-6 w-6 items-center justify-center rounded-full ring-4 ring-card ${a.tone==="success"?"bg-success text-success-foreground":"bg-primary text-primary-foreground"}`}>
                      <a.icon className="h-3.5 w-3.5" />
                    </span>
                    <div className="text-[11px] font-semibold text-primary">{a.date}</div>
                    <div className="mt-1 text-sm font-bold">{a.title}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{a.body}</div>
                    {a.cta && (
                      <button className="mt-3 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition hover:opacity-90">{a.cta}</button>
                    )}
                  </li>
                ))}
              </ol>
            </Card>
          </div>
          <div>
            <h2 className="mb-3 flex items-center gap-2 text-base font-bold">⚡ Akses Cepat</h2>
            <div className="space-y-3">
              {[
                { icon: Download, tone: "primary", label: "Buku Panduan Akademik", body: "" },
                { icon: AlertTriangle, tone: "danger", label: "Helpdesk IT", body: "Kendala teknis portal" },
              ].map((q, i) => (
                <button key={i} className="flex w-full items-center gap-4 rounded-2xl border border-border bg-card p-4 text-left transition hover:border-primary/40 hover:shadow-md">
                  <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${q.tone==="primary"?"bg-primary/10 text-primary":"bg-destructive/10 text-destructive"}`}>
                    <q.icon className="h-5 w-5" />
                  </span>
                  <div className="flex-1">
                    <div className="text-sm font-semibold">{q.label}</div>
                    {q.body && <div className="text-xs text-muted-foreground">{q.body}</div>}
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Onboarding wizard overlay (Step 1) */}
        {tourStep === 0 && (
          <div className="fixed left-6 top-1/2 z-50 w-full max-w-sm -translate-y-1/2 rounded-2xl border border-border bg-card p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="text-sm font-bold">Langkah 1: Dashboard Utama</div>
              <div className="text-xs text-muted-foreground">1 dari 5</div>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Ini adalah halaman utamamu. Di sini kamu bisa melihat ringkasan akademik, progress studi, dan panduan langkah-langkah yang perlu dilakukan.
            </p>
            <div className="mt-5 flex items-center justify-between">
              <button onClick={() => setTourStep(-1)} className="rounded-lg border border-border px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-accent">Lewati</button>
              <button onClick={() => setTourStep(1)} className="rounded-lg bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90">Lanjut →</button>
            </div>
          </div>
        )}
        {tourStep > 0 && <TourOverlay step={tourStep} setStep={setTourStep} />}
      </>
    );
  }

  // ---- SENIOR DASHBOARD ----
  const steps = [
    { label: "Isi KRS", state: "done" as const },
    { label: "Persetujuan", state: "done" as const },
    { label: "Pilih Kelas", state: "locked" as const },
    { label: "Aktif Kuliah", state: "todo" as const },
  ];
  const shortcuts = [
    { icon: BookOpen, label: "Rencana Studi", tone: "primary" },
    { icon: GraduationCap, label: "Riwayat Nilai", tone: "success" },
    { icon: CalendarDays, label: "Jadwal Kuliah", tone: "warning" },
    { icon: ClipboardCheck, label: "Kehadiran", tone: "violet" },
  ];
  const toneIconBg: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/15 text-success",
    warning: "bg-warning/20 text-warning-foreground",
    violet: "bg-accent text-accent-foreground",
  };
  const metrics = [
    { label: "IPK Saat Ini", value: "3.42", sub: "dari 4.00", icon: GraduationCap },
    { label: "SKS Ditempuh", value: "96", sub: "dari 144 SKS", icon: BookOpen },
    { label: "Semester", value: "VI", sub: "● Aktif", icon: CalendarDays },
    { label: "MK Semester Ini", value: "7", sub: "20 SKS", icon: ClipboardCheck },
  ];

  return (
    <>
      <div className="mb-2 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Home className="h-3.5 w-3.5" /><span>Beranda</span>
      </div>
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Selamat datang, Username <span className="inline-block">👋</span></h1>
          <p className="mt-1.5 text-sm text-muted-foreground">Semester 20252 — 2025/2026 Genap · Teknik Informatika S1</p>
        </div>
        <Badge tone="primary">Semester VI</Badge>
      </div>

      {/* Stepper Card */}
      <Card className="mb-6">
        <div className="mb-1 flex items-center gap-2 text-sm font-bold text-primary">
          <Sparkles className="h-4 w-4" /> Alur perwalian semester ini
        </div>
        <p className="text-xs text-muted-foreground">Ikuti langkah berikut untuk menyelesaikan proses akademik semester genap.</p>
        <div className="mt-6 flex items-center">
          {steps.map((s, i) => (
            <div key={i} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center">
                <div className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold ring-4 ring-card ${
                  s.state === "done" ? "bg-primary text-primary-foreground" :
                  s.state === "locked" ? "bg-muted text-muted-foreground" :
                  "border-2 border-primary bg-card text-primary"
                }`}>
                  {s.state === "done" ? <Check className="h-5 w-5" /> :
                   s.state === "locked" ? <Lock className="h-4 w-4" /> :
                   i + 1}
                </div>
                <div className={`mt-2 whitespace-nowrap text-xs font-semibold ${s.state==="done"?"text-primary":s.state==="locked"?"text-muted-foreground":"text-foreground"}`}>{s.label}</div>
              </div>
              {i < steps.length - 1 && (
                <div className={`mx-2 mb-6 h-0.5 flex-1 ${i < 1 ? "bg-primary" : "bg-border"}`} />
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Warning banner */}
      <div className="mb-8 flex items-center gap-3 rounded-xl border border-warning/40 bg-warning/15 px-5 py-4 text-sm">
        <AlertTriangle className="h-5 w-5 shrink-0 text-warning-foreground" />
        <span>Masa studi Anda tersisa <strong>9 semester</strong>. Pastikan progress akademik sesuai rencana.</span>
      </div>

      {/* Shortcuts */}
      <div className="mb-3 text-sm font-bold">Akses cepat</div>
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {shortcuts.map((s, i) => (
          <button key={i} className="group flex flex-col items-start gap-4 rounded-2xl border border-border bg-card p-5 text-left transition hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${toneIconBg[s.tone]}`}>
              <s.icon className="h-5 w-5" />
            </div>
            <div className="text-sm font-semibold">{s.label}</div>
          </button>
        ))}
      </div>

      {/* Metric Cards — big bold numbers + translucent icon top-right */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {metrics.map((m, i) => (
          <div key={i} className="relative overflow-hidden rounded-2xl border border-border bg-card p-5">
            <m.icon className="absolute -right-2 -top-2 h-20 w-20 text-foreground/[0.04]" strokeWidth={1.5} />
            <div className="relative">
              <div className="text-xs font-medium text-muted-foreground">{m.label}</div>
              <div className="mt-2 text-4xl font-extrabold tracking-tight">{m.value}</div>
              <div className="mt-1 text-[11px] text-muted-foreground">{m.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function TourOverlay({ step, setStep }: { step: number; setStep: (n: number) => void }) {
  if (step < 0) return null;
  const steps = [
    { title: "Langkah 2: Quick Search Bar", body: "Gunakan search bar di atas untuk membuka menu apapun dengan cepat — KRS, jadwal, hingga helpdesk AI." },
    { title: "Langkah 3: Sidebar Navigasi", body: "Sidebar kiri mengelompokkan menu berdasarkan Umum, Akademik, Administrasi, dan Lainnya." },
    { title: "Langkah 4: Asisten AI", body: "Tombol mengambang di kanan bawah membuka asisten AI 24/7 untuk membantu perwalian Anda." },
  ];
  const cur = steps[step - 1];
  if (!cur) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-background/70 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <Badge tone="primary">Langkah {step + 1} dari 5</Badge>
          <button onClick={() => setStep(-1)} className="rounded p-1 text-muted-foreground hover:bg-accent">
            <X className="h-4 w-4" />
          </button>
        </div>
        <h3 className="mt-4 text-xl font-bold">{cur.title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{cur.body}</p>
        <div className="mt-6 flex justify-between">
          <button onClick={() => setStep(-1)} className="rounded-lg border border-border px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-accent">Lewati</button>
          {step < 3 ? (
            <button onClick={() => setStep(step + 1)} className="rounded-lg bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90">Lanjut →</button>
          ) : (
            <button onClick={() => setStep(-1)} className="rounded-lg bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90">Selesai</button>
          )}
        </div>
      </div>
    </div>
  );
}

function Badge({ children, tone = "default" }: { children: React.ReactNode; tone?: "default" | "primary" | "success" | "warning" | "danger" }) {
  const tones: Record<string, string> = {
    default: "bg-muted text-muted-foreground",
    primary: "bg-primary/10 text-primary",
    success: "bg-success/15 text-success",
    warning: "bg-warning/20 text-warning-foreground",
    danger: "bg-destructive/10 text-destructive",
  };
  return <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${tones[tone]}`}>{children}</span>;
}

/* -------- VIEW 2: KRS -------- */
function KRS({ openChat }: { openChat: () => void }) {
  const all = useMemo(() => ([
    { day: "Senin", code: "MK101", name: "Mata Kuliah A", sks: 3, time: "08:00–10:30" },
    { day: "Senin", code: "MK102", name: "Mata Kuliah B", sks: 3, time: "13:00–15:30", selected: true },
    { day: "Selasa", code: "MK103", name: "Mata Kuliah C", sks: 3, time: "08:00–10:30", selected: true },
    { day: "Selasa", code: "MK104", name: "Mata Kuliah D", sks: 3, time: "13:00–15:30", conflict: true },
    { day: "Rabu", code: "MK105", name: "Mata Kuliah E", sks: 2, time: "10:00–12:00", selected: true },
    { day: "Kamis", code: "MK106", name: "Mata Kuliah F", sks: 3, time: "08:00–10:30" },
    { day: "Jumat", code: "MK107", name: "Mata Kuliah G", sks: 2, time: "10:00–12:00", selected: true },
  ]), []);
  const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];
  const [day, setDay] = useState("Senin");
  const [selected, setSelected] = useState<string[]>(all.filter(c => c.selected).map(c => c.code));
  const [conflict, setConflict] = useState(false);
  const totalSks = all.filter(c => selected.includes(c.code)).reduce((a, c) => a + c.sks, 0);
  const max = 24;
  const pct = Math.min(100, (totalSks / max) * 100);
  const circumference = 2 * Math.PI * 52;

  const add = (code: string) => {
    const c = all.find(x => x.code === code)!;
    if (c.conflict) { setConflict(true); return; }
    if (!selected.includes(code)) setSelected([...selected, code]);
  };
  const remove = (code: string) => setSelected(selected.filter(s => s !== code));

  return (
    <>
      <PageHeader title="Kartu Rencana Studi" subtitle="Pilih mata kuliah sesuai jadwal dan batas SKS." />
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <Card>
          <div className="mb-5 flex flex-wrap gap-2">
            {days.map(d => (
              <button key={d} onClick={() => setDay(d)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                  day === d ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"
                }`}>{d}</button>
            ))}
          </div>
          <ul className="divide-y divide-border/60">
            {all.filter(c => c.day === day).map(c => {
              const isSelected = selected.includes(c.code);
              return (
                <li key={c.code} className="flex items-center gap-4 py-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-xs font-mono font-bold text-primary">{c.code.slice(-2)}</div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold">{c.name}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{c.code} · {c.sks} SKS · {c.time}</div>
                  </div>
                  {isSelected ? (
                    <button
                      onClick={() => remove(c.code)}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-destructive/30 text-destructive transition hover:bg-destructive hover:text-destructive-foreground"
                      aria-label="Hapus"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => add(c.code)}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/30 text-primary transition hover:bg-primary hover:text-primary-foreground"
                      aria-label="Tambah"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  )}
                </li>
              );
            })}
          </ul>

          {conflict && (
            <div className="mt-4 flex items-start gap-3 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
              <div className="flex-1">
                <div className="font-semibold">⚠️ Jadwal bentrok!</div>
                <div className="mt-1">Mata kuliah ini bersamaan dengan Mata Kuliah B. Silakan buka Panel AI kanan bawah untuk opsi alternatif.</div>
                <button onClick={openChat} className="mt-2 text-xs font-semibold underline">Buka Asisten AI →</button>
              </div>
              <button onClick={() => setConflict(false)}><X className="h-4 w-4" /></button>
            </div>
          )}
        </Card>

        <div className="space-y-6">
          <Card>
            <div className="flex flex-col items-center">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">SKS Terpilih</div>
              <div className="relative my-4 h-40 w-40">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="52" fill="none" stroke="var(--muted)" strokeWidth="12" />
                  <circle cx="60" cy="60" r="52" fill="none" stroke="var(--primary)" strokeWidth="12" strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - (circumference * pct) / 100}
                    className="transition-all duration-500" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-4xl font-extrabold">{totalSks}</div>
                  <div className="text-xs text-muted-foreground">/ {max} SKS</div>
                </div>
              </div>
              <div className="text-[11px] text-muted-foreground">Batas maksimum sesuai IPK</div>
            </div>
          </Card>
          <Card>
            <div className="mb-3 text-sm font-semibold">Mata Kuliah Dipilih</div>
            <ul className="divide-y divide-border/60">
              {all.filter(c => selected.includes(c.code)).map(c => (
                <li key={c.code} className="flex items-center gap-3 py-3">
                  <div className="flex-1 text-sm">
                    <div className="font-medium">{c.name}</div>
                    <div className="text-xs text-muted-foreground">{c.sks} SKS · {c.day}</div>
                  </div>
                  <button onClick={() => remove(c.code)} className="flex h-8 w-8 items-center justify-center rounded-full text-destructive transition hover:bg-destructive/10">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </>
  );
}

/* -------- VIEW 3: NILAI -------- */
function Nilai() {
  const rows = [
    { code: "MK201", name: "Mata Kuliah A", sks: 3, grade: "A" },
    { code: "MK202", name: "Mata Kuliah B", sks: 3, grade: "B+" },
    { code: "MK203", name: "Mata Kuliah C", sks: 3, grade: "A-" },
    { code: "MK204", name: "Mata Kuliah D", sks: 3, grade: "A" },
    { code: "MK205", name: "Mata Kuliah E", sks: 2, grade: "B" },
  ];
  const gradeTone = (g: string) =>
    g.startsWith("A") ? "success" : g.startsWith("B") ? "primary" : "warning";
  return (
    <>
      <PageHeader title="Nilai & KHS" subtitle="Rekap nilai per semester." />
      <div className="mb-6 flex gap-3">
        <select className="rounded-full border border-border bg-card px-4 py-2 text-sm">
          <option>2025/2026 - Ganjil</option>
          <option>2024/2025 - Genap</option>
        </select>
      </div>
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {[{l:"IPS",v:"3.62"},{l:"IPK",v:"3.42"},{l:"SKS Semester",v:"14"},{l:"SKS Total",v:"96"}].map((m,i)=>(
          <div key={i} className="rounded-2xl border border-border bg-card p-5">
            <div className="text-xs text-muted-foreground">{m.l}</div>
            <div className="mt-2 text-3xl font-extrabold tracking-tight">{m.v}</div>
          </div>
        ))}
      </div>
      <Card>
        <div className="grid grid-cols-[80px_1fr_60px_80px] gap-4 border-b border-border pb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          <div>Kode</div><div>Mata Kuliah</div><div>SKS</div><div className="text-right">Nilai</div>
        </div>
        <ul className="divide-y divide-border/60">
          {rows.map(r => (
            <li key={r.code} className="grid grid-cols-[80px_1fr_60px_80px] items-center gap-4 py-4 text-sm">
              <div className="font-mono text-xs text-muted-foreground">{r.code}</div>
              <div className="font-medium">{r.name}</div>
              <div className="text-muted-foreground">{r.sks}</div>
              <div className="text-right"><Badge tone={gradeTone(r.grade) as any}>{r.grade}</Badge></div>
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}

/* -------- VIEW 4: JADWAL -------- */
function Jadwal() {
  const days = ["Senin","Selasa","Rabu","Kamis","Jumat"];
  const schedule: Record<string, { time: string; name: string; room: string; lecturer: string }[]> = {
    Senin: [{time:"08:00–10:30",name:"Mata Kuliah A",room:"R.4203",lecturer:"Dosen 1"},{time:"13:00–15:30",name:"Mata Kuliah B",room:"Lab 4",lecturer:"Dosen 2"}],
    Selasa: [{time:"08:00–10:30",name:"Mata Kuliah C",room:"R.4201",lecturer:"Dosen 3"}],
    Rabu: [{time:"10:00–12:00",name:"Mata Kuliah E",room:"R.4105",lecturer:"Dosen 4"}],
    Kamis: [],
    Jumat: [{time:"10:00–12:00",name:"Mata Kuliah G",room:"R.Aula",lecturer:"Dosen 5"}],
  };
  return (
    <>
      <PageHeader title="Jadwal Kuliah" subtitle="Timeline mingguan mata kuliah Anda." />
      <div className="grid gap-4 md:grid-cols-5">
        {days.map(d => (
          <div key={d} className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{d}</div>
            {schedule[d].length === 0 && <Card className="!p-4 text-xs text-muted-foreground">— Tidak ada kelas</Card>}
            {schedule[d].map((c, i) => (
              <div key={i} className="rounded-2xl border border-border bg-gradient-to-br from-primary/5 to-card p-4">
                <div className="text-[11px] font-semibold text-primary">{c.time}</div>
                <div className="mt-1 text-sm font-semibold">{c.name}</div>
                <div className="mt-2 text-xs text-muted-foreground">📍 {c.room}</div>
                <div className="text-xs text-muted-foreground">👤 {c.lecturer}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

/* -------- VIEW 5: PRESENSI -------- */
function Presensi() {
  const items = [
    { name: "Mata Kuliah A", pct: 93, m: "13/14" },
    { name: "Mata Kuliah B", pct: 100, m: "14/14" },
    { name: "Mata Kuliah C", pct: 78, m: "11/14" },
    { name: "Mata Kuliah E", pct: 86, m: "12/14" },
    { name: "Mata Kuliah G", pct: 71, m: "10/14" },
  ];
  return (
    <>
      <PageHeader title="Presensi / Kehadiran" subtitle="Rekap kehadiran semester berjalan." />
      <div className="space-y-3">
        {items.map((it, i) => (
          <Card key={i}>
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm font-semibold">{it.name}</div>
              <div className="flex items-center gap-3">
                {it.pct < 80 && <Badge tone="danger">Di bawah 80%</Badge>}
                <div className="text-sm font-bold">{it.pct}%</div>
                <div className="text-xs text-muted-foreground">{it.m} Pertemuan</div>
              </div>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className={`h-full rounded-full transition-all ${it.pct < 80 ? "bg-destructive" : "bg-success"}`}
                style={{ width: `${it.pct}%` }}
              />
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}

/* -------- VIEW 6: TRANSKRIP -------- */
function Transkrip() {
  const [open, setOpen] = useState<number | null>(1);
  const semesters = [1,2,3,4,5,6,7,8];
  const sample = [
    { code:"MK101", name:"Mata Kuliah A", sks:3, grade:"A" },
    { code:"MK102", name:"Mata Kuliah B", sks:3, grade:"B+" },
    { code:"MK103", name:"Mata Kuliah C", sks:4, grade:"A-" },
  ];
  return (
    <>
      <PageHeader title="Transkrip & Kurikulum" subtitle="Riwayat akademik per semester." />
      <div className="space-y-3">
        {semesters.map(s => (
          <Card key={s} className="!p-0 overflow-hidden">
            <button
              onClick={() => setOpen(open === s ? null : s)}
              className="flex w-full items-center justify-between p-5 text-left hover:bg-accent/30"
            >
              <div>
                <div className="text-sm font-semibold">Semester {s}</div>
                <div className="text-xs text-muted-foreground">{s <= 6 ? "Selesai · IPS 3.5" : "Belum ditempuh"}</div>
              </div>
              <ChevronDown className={`h-5 w-5 transition-transform ${open === s ? "rotate-180" : ""}`} />
            </button>
            {open === s && s <= 6 && (
              <div className="border-t border-border p-5">
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {sample.map(c => (
                    <div key={c.code} className="rounded-xl bg-muted/50 p-3">
                      <div className="text-xs font-mono text-muted-foreground">{c.code}</div>
                      <div className="mt-1 text-sm font-medium">{c.name}</div>
                      <div className="mt-2 flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">{c.sks} SKS</span>
                        <Badge tone="success">{c.grade}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </>
  );
}

/* -------- VIEW 7: PEMBAYARAN -------- */
function Pembayaran() {
  return (
    <>
      <PageHeader title="Status Pembayaran" subtitle="Tagihan dan riwayat pembayaran." />
      <Card className="mb-6 bg-gradient-to-br from-success/10 to-card">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tagihan Aktif</div>
            <div className="mt-1 text-3xl font-extrabold">Rp 0</div>
            <div className="mt-1 text-xs text-muted-foreground">Semester Ganjil 2025/2026</div>
          </div>
          <Badge tone="success">✓ LUNAS</Badge>
        </div>
      </Card>
      <div className="space-y-3">
        {[1,2,3].map(i => (
          <Card key={i}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold">Tagihan Semester {7-i}</div>
                <div className="mt-1 text-xs text-muted-foreground">VA: 8809 1234 5678 90{i}</div>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-md border-2 border-success px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-success">Paid</span>
                <button className="rounded-lg p-2 text-muted-foreground hover:bg-accent" title="Salin VA"><Copy className="h-4 w-4" /></button>
                <button className="rounded-lg p-2 text-muted-foreground hover:bg-accent" title="Unduh"><Download className="h-4 w-4" /></button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}

/* -------- VIEW 8: KPU -------- */
function KPU() {
  return (
    <>
      <PageHeader title="Kartu Peserta Ujian (KPU)" subtitle="Pratinjau dan unduh kartu ujian Anda." />
      <Card className="mx-auto max-w-2xl">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <div className="text-xs uppercase text-muted-foreground">Universitas Komputer Indonesia</div>
            <div className="mt-1 text-lg font-bold">Kartu Peserta Ujian</div>
          </div>
          <img src={logoAsset.url} alt="UNIKOM" className="h-14 w-14" />
        </div>
        <div className="mt-5 grid grid-cols-[120px_1fr] gap-5">
          <div className="aspect-[3/4] rounded-lg bg-gradient-to-br from-primary/20 to-accent flex items-center justify-center text-4xl font-bold text-primary">U</div>
          <div className="space-y-2 text-sm">
            <Row k="Nama" v="Username" />
            <Row k="NIM" v="10123001" />
            <Row k="Program Studi" v="Teknik Informatika" />
            <Row k="Semester" v="VI (Enam)" />
          </div>
        </div>
        <div className="mt-5 rounded-xl bg-muted/50 p-4">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tata Tertib</div>
          <ul className="space-y-2 text-sm">
            {["Hadir 15 menit sebelum ujian dimulai.","Wajib membawa KPU dan KTM.","Berpakaian rapi dan sopan.","Dilarang membawa alat komunikasi."].map((t,i)=>(
              <li key={i} className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 text-success" />
                {t}
              </li>
            ))}
          </ul>
        </div>
        <button className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90">
          <Download className="h-4 w-4" /> Unduh & Cetak KPU (PDF)
        </button>
      </Card>
    </>
  );
}
function Row({k,v}:{k:string;v:string}) {
  return <div className="flex"><div className="w-32 text-muted-foreground">{k}</div><div className="font-medium">: {v}</div></div>;
}

/* -------- VIEW 9: PROFIL -------- */
function Profil() {
  const [tab, setTab] = useState<"diri"|"kontak"|"ortu">("diri");
  const fields: Record<string, [string,string][]> = {
    diri: [["Nama Lengkap","Username"],["NIM","10123001"],["Tempat Lahir","Bandung"],["Tanggal Lahir","12 Mei 2003"],["Jenis Kelamin","Laki-laki"]],
    kontak: [["Email","username@mahasiswa.unikom.ac.id"],["No. HP","+62 812-xxxx-xxxx"],["Alamat","Jl. Dipati Ukur No.112, Bandung"]],
    ortu: [["Nama Ayah","Wali 1"],["Pekerjaan Ayah","Wiraswasta"],["Nama Ibu","Wali 2"],["No. HP Ortu","+62 811-xxxx-xxxx"]],
  };
  const tabs = [{k:"diri",l:"Data Diri"},{k:"kontak",l:"Kontak"},{k:"ortu",l:"Orang Tua"}] as const;
  return (
    <>
      <PageHeader title="Profil & Biodata" subtitle="Informasi pribadi Anda." badge={<button className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90">Ajukan Perubahan Data</button>} />
      <Card>
        <div className="mb-6 flex gap-1 border-b border-border">
          {tabs.map(t => (
            <button key={t.k} onClick={() => setTab(t.k)}
              className={`relative px-4 py-3 text-sm font-medium transition ${tab===t.k ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>
              {t.l}
              {tab===t.k && <div className="absolute inset-x-0 bottom-0 h-0.5 bg-primary" />}
            </button>
          ))}
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {fields[tab].map(([k,v]) => (
            <div key={k}>
              <label className="text-xs font-medium text-muted-foreground">{k}</label>
              <input readOnly value={v} className="mt-1.5 w-full rounded-xl border border-border bg-muted/40 px-4 py-2.5 text-sm" />
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

/* -------- VIEW 10: EVALUASI -------- */
function Evaluasi() {
  const lecturers = [
    { name: "Dosen 1", course: "Mata Kuliah A" },
    { name: "Dosen 2", course: "Mata Kuliah B" },
    { name: "Dosen 3", course: "Mata Kuliah C" },
  ];
  const questions = [
    "Penguasaan materi perkuliahan",
    "Kejelasan penyampaian materi",
    "Ketepatan waktu kehadiran",
    "Interaksi & responsivitas",
  ];
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [answers, setAnswers] = useState<Record<string, number>>({});
  return (
    <>
      <PageHeader title="Evaluasi Dosen" subtitle="Berikan penilaian untuk dosen pengampu Anda." />
      <div className="space-y-5">
        {lecturers.map(l => (
          <Card key={l.name}>
            <div className="flex items-center gap-4 border-b border-border/60 pb-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-unikom-blue text-sm font-bold text-primary-foreground">
                {l.name.split(" ").map(s=>s[0]).slice(0,2).join("")}
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold">{l.name}</div>
                <div className="text-xs text-muted-foreground">{l.course}</div>
              </div>
              <div className="flex gap-1">
                {[1,2,3,4,5].map(n => (
                  <button key={n} onClick={() => setRatings({...ratings, [l.name]: n})}>
                    <Star className={`h-7 w-7 transition ${(ratings[l.name]||0) >= n ? "fill-unikom-gold text-unikom-gold" : "text-muted-foreground/40"}`} />
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-2 divide-y divide-border/60">
              {questions.map((q, qi) => {
                const key = `${l.name}|${qi}`;
                return (
                  <div key={qi} className="flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between">
                    <div className="text-sm">{q}</div>
                    <div className="flex gap-2">
                      {[1,2,3,4,5].map(n => {
                        const active = answers[key] === n;
                        return (
                          <button key={n} onClick={() => setAnswers({...answers, [key]: n})}
                            className={`h-9 w-9 rounded-full border text-xs font-semibold transition ${active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:border-primary/40"}`}>
                            {n}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}

/* ---------------- CHATBOT ---------------- */
type ChatMsg = { from: "ai" | "user"; text: string };
function ChatPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<ChatMsg[]>([
    { from: "ai", text: "Halo! Saya asisten akademik UNIKOM. Ada yang bisa saya bantu? 😊" },
    { from: "ai", text: "Coba tanyakan: cara isi KRS, cek nilai, atau jadwal kuliah." },
  ]);
  const [input, setInput] = useState("");
  const [showChips, setShowChips] = useState(true);
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const chips = [
    { q: "Cara isi KRS", a: "Untuk mengisi KRS, buka menu Rencana Studi di sidebar kiri. Pilih mata kuliah sesuai jadwal dan batas SKS Anda." },
    { q: "Cek nilai semester", a: "Buka menu Nilai & KHS untuk melihat rekap nilai per semester serta IPK kumulatif Anda." },
    { q: "Jadwal bentrok", a: "Bentrok dapat diatasi dengan memilih kelas paralel di KRS. Hapus kelas yang bentrok lalu pilih sesi alternatif." },
  ];

  const respond = (q: string, custom = false) => {
    setMessages(m => [...m, { from: "user", text: q }]);
    setShowChips(false);
    setTyping(true);
    setTimeout(() => {
      const match = chips.find(c => c.q.toLowerCase() === q.toLowerCase());
      const reply = match
        ? match.a
        : custom
          ? `Terima kasih atas pertanyaannya. Untuk "${q}", silakan cek menu terkait di sidebar — atau saya bisa pandu lebih lanjut jika Anda jelaskan kebutuhan secara spesifik.`
          : "Mohon ulangi pertanyaan Anda.";
      setMessages(m => [...m, { from: "ai", text: reply }]);
      setTyping(false);
    }, 500);
  };

  const send = () => {
    const t = input.trim();
    if (!t) return;
    setInput("");
    respond(t, true);
  };

  return (
    <div className={`fixed right-0 top-0 z-50 flex h-screen w-full max-w-md flex-col border-l border-border bg-card shadow-2xl transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}>
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-primary px-5 text-primary-foreground">
        <div className="flex items-center gap-2.5">
          <MessageSquare className="h-5 w-5" />
          <div className="text-sm font-semibold">Asisten Akademik</div>
        </div>
        <button onClick={onClose} className="rounded-lg p-1.5 transition hover:bg-white/10"><X className="h-5 w-5" /></button>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-5 py-5">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
              m.from === "user"
                ? "rounded-br-md bg-primary text-primary-foreground"
                : "rounded-bl-md bg-muted text-foreground"
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-md bg-muted px-4 py-3 text-sm">
              <span className="inline-flex gap-1">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" style={{animationDelay:"0s"}} />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" style={{animationDelay:"0.15s"}} />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" style={{animationDelay:"0.3s"}} />
              </span>
            </div>
          </div>
        )}
        {showChips && (
          <div className="mt-3 flex flex-wrap gap-2">
            {chips.map(c => (
              <button key={c.q} onClick={() => respond(c.q)}
                className="rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-foreground transition hover:border-primary hover:bg-primary/10 hover:text-primary">
                {c.q}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="shrink-0 border-t border-border bg-card p-4">
        <div className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && send()}
            placeholder="Ketik pertanyaan…"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <button onClick={send} className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground transition hover:opacity-90">
            <Send className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-2 text-center text-[10px] text-muted-foreground">🔒 AI · Data tidak disimpan</div>
      </div>
    </div>
  );
}

/* ---------------- CONTROLLER WIDGET ---------------- */
function ControllerWidget({
  role, setRole,
}: {
  role: "senior"|"baru"; setRole: (r: "senior"|"baru") => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="fixed right-4 top-20 z-50">
      <button onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-xs font-semibold shadow-lg hover:bg-accent">
        <Settings2 className="h-4 w-4" /> Prototype
      </button>
      {open && (
        <div className="mt-2 w-64 rounded-2xl border border-border bg-card p-4 shadow-xl">
          <div>
            <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Role</div>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setRole("senior")}
                className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-xs transition ${role==="senior"?"border-primary bg-primary/10 text-primary":"border-border text-muted-foreground hover:bg-accent"}`}>
                <UserCog className="h-3.5 w-3.5" /> Senior
              </button>
              <button onClick={() => setRole("baru")}
                className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-xs transition ${role==="baru"?"border-primary bg-primary/10 text-primary":"border-border text-muted-foreground hover:bg-accent"}`}>
                <Sparkles className="h-3.5 w-3.5" /> Baru
              </button>
            </div>
            <div className="mt-2 text-[10px] text-muted-foreground">Switching to "Baru" resets onboarding tour.</div>
          </div>
        </div>
      )}
    </div>
  );
}
