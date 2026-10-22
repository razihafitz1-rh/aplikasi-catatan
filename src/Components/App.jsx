
import { useState, useEffect, useRef } from "react";
import {
  Home,
  User,
  Clock,
  Settings,
  Search,
  Trash2,
  LogOut,
  Quote,
  BookOpen,
  ChevronRight,
  Bell,
  ArrowLeft,
  Check,
  CalendarDays,
  AlertTriangle,
  X,
} from "lucide-react";

const MOODS = ["Senang", "Tenang", "Biasa", "Sedih", "Marah"];

const INITIAL_NOTES = [
  {
    id: 1,
    date: "HARI INI",
    time: "20.15",
    mood: "Tenang",
    title: "Hari yang melelahkan",
    content:
      "Hari ini capek banget. Banyak tugas menumpuk dan aku merasa terburu-buru terus. Tapi aku mau coba istirahat sebentar dan tidak memaksakan diri.",
  },
  {
    id: 2,
    date: "HARI INI",
    time: "08.30",
    mood: "Senang",
    title: "Kopi pagi yang enak",
    content:
      "Mood bagus setelah olahraga ringan. Kopi hari ini rasanya pas, menemani kerjaan pagi dengan lancar.",
  },
  {
    id: 3,
    date: "KEMARIN",
    time: "21.40",
    mood: "Sedih",
    title: "Rindu rumah",
    content:
      "Kangen suasana rumah dan masakan ibu. Semoga cepat ada waktu untuk pulang ke kampung halaman.",
  },
];

const cardClass =
  "rounded-xl border border-[#303746] bg-[#171b24] transition-all duration-300 hover:border-[#444]";

const inputClass =
  "w-full rounded-lg border border-[#303746] bg-[#11151c] px-4 py-3 text-sm text-gray-100 outline-none placeholder:text-gray-600 transition-all duration-300 hover:border-[#444] focus:border-orange-400 focus:ring-2 focus:ring-orange-400/10";

function useSavedNotes() {
  const [notes, setNotes] = useState(() => {
    try {
      const saved = localStorage.getItem("journal_notes_saas");
      return saved ? JSON.parse(saved) : INITIAL_NOTES;
    } catch {
      return INITIAL_NOTES;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("journal_notes_saas", JSON.stringify(notes));
    } catch (error) {
      console.error("Gagal menyimpan catatan:", error);
    }
  }, [notes]);

  return [notes, setNotes];
}

/* =========================
   ORANGE CURSOR GLOW
========================= */

function CursorGlow() {
  const ref = useRef(null);
  const target = useRef({ x: -300, y: -300 });
  const position = useRef({ x: -300, y: -300 });

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let frame;

    const move = (event) => {
      target.current = {
        x: event.clientX,
        y: event.clientY,
      };
    };

    const animate = () => {
      position.current.x +=
        (target.current.x - position.current.x) * 0.08;

      position.current.y +=
        (target.current.y - position.current.y) * 0.08;

      if (ref.current) {
        ref.current.style.transform =
          `translate3d(${position.current.x}px, ${position.current.y}px, 0) translate(-50%, -50%)`;
      }

      frame = requestAnimationFrame(animate);
    };

    window.addEventListener("pointermove", move, { passive: true });
    frame = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-0 h-[250px] w-[250px] rounded-full blur-[100px]"
      style={{
        background: "rgba(249, 115, 22, 0.12)",
        willChange: "transform",
      }}
    />
  );
}

/* =========================
   REUSABLE COMPONENTS
========================= */

function Avatar({ size = "h-10 w-10" }) {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className={`${size} flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#39445a] bg-[#202633]`}
    >
      {!imageError ? (
        <img
          src={`${import.meta.env.BASE_URL}hoshinokun.jpg`}
          alt="Avatar Razi Hafitz"
          className="h-full w-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <User size={size.includes("24") ? 36 : 20} className="text-gray-400" />
      )}
    </div>
  );
}

function PageTitle({ title, subtitle, children }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 text-sm text-gray-400">{subtitle}</p>
        )}
      </div>
      {children}
    </div>
  );
}

function MoodBadge({ mood }) {
  return (
    <span className="inline-flex w-fit items-center rounded-md border border-[#343d50] bg-[#11151c] px-3 py-1 text-xs font-medium text-gray-300">
      {mood}
    </span>
  );
}

function EmptyState({ title, description }) {
  return (
    <div className="flex min-h-[230px] flex-col items-center justify-center rounded-xl border border-dashed border-[#343d50] bg-[#151922] px-6 text-center">
      <BookOpen size={30} className="mb-4 text-orange-400" />
      <h3 className="font-semibold text-white">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-gray-500">
        {description}
      </p>
    </div>
  );
}

/* =========================
   SIDEBAR
========================= */

function Sidebar({ currentView, setCurrentView }) {
  const items = [
    { id: "home", label: "Beranda", icon: Home },
    { id: "history", label: "Riwayat", icon: Clock },
    { id: "profile", label: "Profil Statistik", icon: User },
    { id: "settings", label: "Pengaturan", icon: Settings },
  ];

  return (
    <aside className="flex h-full w-[250px] shrink-0 flex-col border-r border-[#29303d] bg-[#0e1117] px-4 py-6">
      <button
        onClick={() => setCurrentView("home")}
        className="mb-10 flex items-center gap-3 rounded-lg px-2 py-1 text-left transition-all duration-300 hover:opacity-80"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500 text-white shadow-lg shadow-orange-500/15">
          <BookOpen size={21} />
        </span>
        <span className="text-base font-bold text-white">
          Catatan Pribadi
        </span>
      </button>

      <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[.2em] text-gray-600">
        Menu utama
      </p>

      <nav className="flex-1 space-y-1">
        {items.map(({ id, label, icon: Icon }) => {
          const active = currentView === id;

          return (
            <button
              key={id}
              onClick={() => setCurrentView(id)}
              aria-current={active ? "page" : undefined}
              className={`group flex w-full items-center gap-3 rounded-lg border px-3 py-3 text-sm transition-all duration-300 hover:scale-[1.01] ${
                active
                  ? "border-orange-500/25 bg-orange-500/10 font-semibold text-orange-300"
                  : "border-transparent text-gray-400 hover:border-[#444] hover:bg-[#191f2b] hover:text-white"
              }`}
            >
              <Icon size={18} />
              {label}
              {active && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-orange-400" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Profil hanya berisi avatar, username, dan status */}
      <button
        onClick={() => setCurrentView("profile")}
        className="mt-6 flex items-center gap-3 rounded-xl border border-[#2c3443] bg-[#171b24] p-3 text-left transition-all duration-300 hover:scale-[1.01] hover:border-[#444] hover:bg-[#1d2431]"
      >
        <Avatar />

        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-bold text-white">
            Razi Hafitz
          </span>
          <span className="mt-1 inline-flex rounded-md bg-orange-500/10 px-2 py-0.5 text-[10px] font-semibold text-orange-300">
            he/him
          </span>
        </span>
      </button>
    </aside>
  );
}

/* =========================
   HOME
========================= */

function HomeView({
  notes,
  setNotes,
  setCurrentView,
  setSelectedNote,
}) {
  const [mood, setMood] = useState("Tenang");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const moodCounts = notes.reduce((result, note) => {
    result[note.mood] = (result[note.mood] || 0) + 1;
    return result;
  }, {});

  const mainMood =
    Object.keys(moodCounts).sort(
      (a, b) => moodCounts[b] - moodCounts[a]
    )[0] || "Belum ada";

  const save = (event) => {
    event.preventDefault();

    if (!title.trim() || !content.trim()) {
      window.alert("Judul dan isi catatan tidak boleh kosong!");
      return;
    }

    const now = new Date();

    const note = {
      id: Date.now(),
      date: now.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
      time: now.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
      mood,
      title: title.trim(),
      content: content.trim(),
    };

    setNotes((previous) => [note, ...previous]);
    setTitle("");
    setContent("");
    setMood("Tenang");
  };

  return (
    <div className="mx-auto w-full max-w-[1500px] p-5 sm:p-8">
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-2 text-sm text-gray-400">
          <span className="h-2 w-2 rounded-full bg-orange-400" />
          Ruang pribadimu
        </div>
        <h1 className="text-2xl font-bold text-white sm:text-3xl">
          Halo, Silahkan menuliskan perasaan kamu hari ini:)
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Luangkan waktu untuk mencatat cerita hari ini.
        </p>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(300px,1fr)]">
        <div className="flex min-w-0 flex-col gap-6">
          <form
            onSubmit={save}
            className={`${cardClass} flex min-h-[470px] flex-col p-5 sm:p-8`}
          >
            <div className="mb-7 flex flex-wrap gap-2">
              {MOODS.map((item) => (
                <button
                  type="button"
                  key={item}
                  onClick={() => setMood(item)}
                  className={`rounded-md border px-4 py-2 text-xs font-semibold transition-all duration-300 hover:scale-[1.01] ${
                    mood === item
                      ? "border-orange-400 bg-orange-500 text-white shadow-lg shadow-orange-500/15"
                      : "border-[#343d50] bg-[#11151c] text-gray-400 hover:border-[#444] hover:text-white"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Judul catatan hari ini..."
              maxLength={160}
              className="mb-5 w-full border-b border-[#303746] bg-transparent pb-4 text-xl font-bold text-white outline-none transition placeholder:text-gray-600 focus:border-orange-400 sm:text-2xl"
            />

            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="Tuliskan cerita, perasaan, atau hal menarik hari ini..."
              className="min-h-[180px] flex-1 resize-y bg-transparent text-sm leading-7 text-gray-300 outline-none placeholder:text-gray-600"
            />

            <div className="mt-6 border-t border-[#2b3240] pt-5">
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:scale-[1.01] hover:bg-orange-400 hover:shadow-lg hover:shadow-orange-500/20 active:scale-[0.99]"
              >
                <Check size={17} />
                SIMPAN CATATAN
              </button>
            </div>
          </form>

          <div
            className={`${cardClass} flex items-start gap-4 p-5 sm:p-6`}
          >
            <div className="rounded-lg border border-[#34415a] bg-[#111925] p-3 text-orange-300">
              <Quote size={22} />
            </div>
            <div>
              <p className="text-sm leading-7 text-gray-300">
                "Jika kamu merasa lelah, istirahatlah sejenak. Kamu tidak
                harus menyelesaikan semuanya sekaligus."
              </p>
              <p className="mt-3 text-xs text-gray-500">
                Pengingat untuk diri sendiri
              </p>
            </div>
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-6">
          <div className="grid grid-cols-2 gap-4">
            <div className={`${cardClass} p-5`}>
              <p className="text-xs text-gray-500">Total catatan</p>
              <h2 className="mt-3 text-3xl font-bold text-white">
                {notes.length}
              </h2>
              <p className="mt-2 text-xs text-gray-500">
                Catatan tersimpan
              </p>
            </div>

            <div className={`${cardClass} p-5`}>
              <p className="text-xs text-gray-500">Mood utama</p>
              <h2 className="mt-3 truncate text-xl font-bold text-orange-300">
                {mainMood}
              </h2>
              <p className="mt-2 text-xs text-gray-500">Semua catatan</p>
            </div>
          </div>

          <div className={`${cardClass} p-5 sm:p-6`}>
            <h3 className="font-bold text-white">Distribusi Mood</h3>
            <p className="mb-6 mt-1 text-xs text-gray-500">
              Ringkasan semua catatanmu
            </p>

            {notes.length === 0 ? (
              <p className="py-6 text-sm text-gray-500">
                Belum ada data.
              </p>
            ) : (
              <div className="space-y-4">
                {MOODS.map((item) => {
                  const count = moodCounts[item] || 0;

                  return (
                    <div key={item}>
                      <div className="mb-2 flex justify-between text-xs">
                        <span className="text-gray-300">{item}</span>
                        <span className="text-gray-500">{count}</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-[#303746]">
                        <div
                          className="h-full rounded-full bg-orange-400 transition-all duration-500"
                          style={{
                            width: `${(count / notes.length) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className={`${cardClass} p-5 sm:p-6`}>
            <div className="mb-5 flex items-center justify-between gap-3">
              <h3 className="font-bold text-white">Catatan Terakhir</h3>
              <button
                onClick={() => setCurrentView("history")}
                className="flex items-center gap-1 text-xs text-gray-400 transition hover:text-orange-300"
              >
                Lihat semua <ChevronRight size={15} />
              </button>
            </div>

            {notes.length === 0 ? (
              <p className="py-5 text-sm text-gray-500">
                Belum ada catatan.
              </p>
            ) : (
              <div className="space-y-3">
                {notes.slice(0, 3).map((note) => (
                  <button
                    key={note.id}
                    onClick={() => {
                      setSelectedNote(note);
                      setCurrentView("detail");
                    }}
                    className="w-full rounded-lg border border-[#2a303d] bg-[#11151c] p-4 text-left transition-all duration-300 hover:border-[#444] hover:bg-[#1b2230]"
                  >
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <MoodBadge mood={note.mood} />
                      <span className="text-xs text-gray-500">
                        {note.time}
                      </span>
                    </div>
                    <h4 className="truncate text-sm font-semibold text-white">
                      {note.title}
                    </h4>
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-gray-500">
                      {note.content}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================
   HISTORY
========================= */

function HistoryView({
  notes,
  setCurrentView,
  setSelectedNote,
  handleDelete,
}) {
  const [search, setSearch] = useState("");
  const [filterMood, setFilterMood] = useState("Semua");

  const filtered = notes.filter((note) => {
    const matchesSearch =
      `${note.title} ${note.content}`
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesMood =
      filterMood === "Semua" || note.mood === filterMood;

    return matchesSearch && matchesMood;
  });

  const groups = filtered.reduce((result, note) => {
    const key = note.date || "TANGGAL TIDAK DIKETAHUI";
    (result[key] ||= []).push(note);
    return result;
  }, {});

  return (
    <div className="mx-auto w-full max-w-[1500px] p-5 sm:p-8">
      <PageTitle
        title="Riwayat Catatan"
        subtitle="Jelajahi, cari, dan kelola semua cerita pribadimu."
      />

      <div className="mb-8 flex flex-col gap-4">
        <div className="relative w-full max-w-md">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
          />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Cari judul atau isi catatan..."
            className={`${inputClass} pl-11`}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {["Semua", ...MOODS].map((item) => (
            <button
              key={item}
              onClick={() => setFilterMood(item)}
              className={`shrink-0 rounded-lg border px-4 py-2.5 text-xs font-semibold transition-all duration-300 hover:scale-[1.01] ${
                filterMood === item
                  ? "border-orange-400 bg-orange-500 text-white"
                  : "border-[#303746] bg-[#171b24] text-gray-400 hover:border-[#444] hover:text-white"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <p className="text-xs text-gray-500">
          Menampilkan {filtered.length} dari {notes.length} catatan
        </p>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="Tidak ada catatan ditemukan"
          description="Coba kata kunci lain, pilih mood berbeda, atau buat catatan baru."
        />
      ) : (
        <div>
          {Object.entries(groups).map(([date, items], index) => (
            <section
              key={date}
              className={index === 0 ? "pt-0" : "mt-8 pt-6"}
            >
              {/* Jarak ekstra sebelum KEMARIN dan tanggal berikutnya */}
              <div className="mb-5 flex items-center gap-3">
                <CalendarDays size={15} className="text-orange-300" />

                <h2 className="text-xs font-bold uppercase tracking-[.18em] text-gray-400">
                  {date}
                </h2>

                <span className="rounded-md bg-[#242a36] px-2 py-1 text-[10px] text-gray-400">
                  {items.length}
                </span>

                <div className="h-px flex-1 bg-[#2b3240]" />
              </div>

              {/* Kartu dalam satu baris memiliki tinggi seragam */}
              <div className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 2xl:grid-cols-3">
                {items.map((note) => (
                  <article
                    key={note.id}
                    className={`${cardClass} group relative flex h-full min-h-[245px] flex-col hover:-translate-y-0.5 hover:scale-[1.01] hover:shadow-lg hover:shadow-black/20`}
                  >
                    <button
                      onClick={() => {
                        setSelectedNote(note);
                        setCurrentView("detail");
                      }}
                      className="flex h-full min-w-0 flex-1 flex-col justify-between p-5 pr-14 text-left"
                    >
                      <div>
                        <div className="mb-4 flex items-center justify-between gap-3">
                          <MoodBadge mood={note.mood} />
                          <span className="shrink-0 text-xs text-gray-500">
                            {note.time}
                          </span>
                        </div>

                        <h3 className="line-clamp-2 min-h-[3.5rem] text-base font-bold leading-7 text-white transition-colors group-hover:text-orange-300">
                          {note.title}
                        </h3>

                        <p className="mt-2 line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-gray-400">
                          {note.content}
                        </p>
                      </div>

                      <div className="mt-5 flex items-center justify-between border-t border-[#2b3240] pt-4">
                        <span className="text-xs text-gray-500">
                          Baca catatan
                        </span>
                        <ChevronRight
                          size={16}
                          className="text-gray-500 transition group-hover:translate-x-1 group-hover:text-orange-300"
                        />
                      </div>
                    </button>

                    <button
                      onClick={() => handleDelete(note.id)}
                      aria-label={`Hapus catatan ${note.title}`}
                      title="Hapus catatan"
                      className="absolute right-4 top-4 rounded-md border border-transparent p-2 text-gray-500 transition-all duration-300 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
                    >
                      <Trash2 size={16} />
                    </button>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

/* =========================
   PROFILE
========================= */

function ProfileView({ notes }) {
  const counts = notes.reduce((result, note) => {
    result[note.mood] = (result[note.mood] || 0) + 1;
    return result;
  }, {});

  const mainMood =
    Object.keys(counts).sort(
      (a, b) => counts[b] - counts[a]
    )[0] || "Belum ada";

  return (
    <div className="mx-auto w-full max-w-[1200px] p-5 sm:p-8">
      <PageTitle
        title="Profil & Statistik"
        subtitle="Lihat ringkasan perjalanan jurnalmu."
      />

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <div
          className={`${cardClass} flex flex-col items-center p-8 text-center`}
        >
          <Avatar size="h-24 w-24" />

          <h2 className="mt-5 text-xl font-bold text-white">
            Razi Hafitz
          </h2>

          <span className="mt-2 rounded-md bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-300">
            he/him
          </span>

          <div className="mt-8 grid w-full grid-cols-2 divide-x divide-[#303746] rounded-lg border border-[#303746] bg-[#11151c] p-5">
            <div>
              <p className="text-2xl font-bold text-white">
                {notes.length}
              </p>
              <p className="mt-2 text-[10px] uppercase tracking-wider text-gray-500">
                Catatan
              </p>
            </div>

            <div className="min-w-0 px-2">
              <p className="truncate text-lg font-bold text-orange-300">
                {mainMood}
              </p>
              <p className="mt-2 text-[10px] uppercase tracking-wider text-gray-500">
                Mood utama
              </p>
            </div>
          </div>
        </div>

        <div className={`${cardClass} p-6 sm:p-8`}>
          <h3 className="text-lg font-bold text-white">Analitik Mood</h3>
          <p className="mt-1 text-sm text-gray-500">
            Distribusi berdasarkan catatan yang tersimpan.
          </p>

          {notes.length === 0 ? (
            <div className="mt-8">
              <EmptyState
                title="Belum ada statistik"
                description="Mood akan muncul setelah kamu menyimpan catatan."
              />
            </div>
          ) : (
            <div className="mt-8 space-y-6">
              {MOODS.map((mood) => {
                const count = counts[mood] || 0;
                const percent = (count / notes.length) * 100;

                return (
                  <div key={mood}>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm text-gray-300">{mood}</span>
                      <span className="text-xs text-gray-500">
                        {count} catatan · {Math.round(percent)}%
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-[#303746]">
                      <div
                        className="h-full rounded-full bg-orange-400 transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================
   SETTINGS
========================= */

function SettingsView({ setCurrentView, clearAllNotes }) {
  const [reminder, setReminder] = useState(true);
  const [time, setTime] = useState("20:00");

  return (
    <div className="mx-auto w-full max-w-[900px] p-5 sm:p-8">
      <PageTitle
        title="Pengaturan"
        subtitle="Atur preferensi aplikasi Catatan Pribadi."
      />

      <section className="mb-8">
        <h2 className="mb-4 text-xs font-bold uppercase tracking-[.18em] text-gray-500">
          Preferensi
        </h2>

        <div className={`${cardClass} overflow-hidden`}>
          <div className="flex items-center justify-between gap-4 border-b border-[#2b3240] p-5 sm:p-6">
            <div className="flex items-center gap-4">
              <Bell size={20} className="shrink-0 text-orange-300" />
              <div>
                <p className="text-sm font-semibold text-white">
                  Pengingat Harian
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Preferensi pengingat untuk menulis jurnal.
                </p>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={reminder}
              aria-label="Pengingat harian"
              onClick={() => setReminder((value) => !value)}
              className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-300 ${
                reminder ? "bg-orange-500" : "bg-[#404756]"
              }`}
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all duration-300 ${
                  reminder ? "left-6" : "left-1"
                }`}
              />
            </button>
          </div>

          <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <p className="text-sm font-semibold text-white">
                Waktu Pengingat
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Atur waktu preferensi pengingat.
              </p>
            </div>

            <input
              type="time"
              value={time}
              onChange={(event) => setTime(event.target.value)}
              disabled={!reminder}
              className={`${inputClass} max-w-[180px] disabled:opacity-40`}
            />
          </div>
        </div>

        <p className="mt-3 text-xs leading-relaxed text-gray-500">
          Ini hanya preferensi antarmuka. Notifikasi otomatis belum
          diimplementasikan.
        </p>
      </section>

      <section>
        <h2 className="mb-4 text-xs font-bold uppercase tracking-[.18em] text-gray-500">
          Data & Akun
        </h2>

        <div className={`${cardClass} overflow-hidden`}>
          <button
            onClick={clearAllNotes}
            className="flex w-full items-center justify-between gap-4 border-b border-[#2b3240] p-5 text-left transition-all duration-300 hover:bg-red-500/5 sm:p-6"
          >
            <span>
              <span className="block text-sm font-semibold text-red-400">
                Hapus Semua Catatan
              </span>
              <span className="mt-1 block text-xs text-gray-500">
                Hapus seluruh riwayat jurnal yang tersimpan.
              </span>
            </span>
            <Trash2 size={19} className="shrink-0 text-red-400" />
          </button>

          <button
            onClick={() => setCurrentView("login")}
            className="flex w-full items-center justify-between gap-4 p-5 text-left transition-all duration-300 hover:bg-[#202735] sm:p-6"
          >
            <span>
              <span className="block text-sm font-semibold text-white">
                Keluar Akun
              </span>
              <span className="mt-1 block text-xs text-gray-500">
                Kembali ke layar masuk demo.
              </span>
            </span>
            <LogOut size={19} className="shrink-0 text-gray-400" />
          </button>
        </div>
      </section>
    </div>
  );
}

/* =========================
   NOTE DETAIL
========================= */

function DetailView({ note, setCurrentView, handleDelete }) {
  if (!note) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center p-8 text-center">
        <BookOpen size={32} className="mb-4 text-orange-400" />
        <p className="text-white">Catatan tidak ditemukan.</p>
        <button
          onClick={() => setCurrentView("history")}
          className="mt-5 rounded-lg bg-orange-500 px-5 py-3 text-sm font-bold text-white transition-all duration-300 hover:bg-orange-400"
        >
          Kembali ke Riwayat
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1000px] p-5 sm:p-8">
      <button
        onClick={() => setCurrentView("history")}
        className="mb-8 inline-flex items-center gap-2 rounded-lg border border-[#303746] bg-[#171b24] px-4 py-3 text-sm text-gray-300 transition-all duration-300 hover:border-[#444] hover:text-white"
      >
        <ArrowLeft size={17} />
        Kembali ke Riwayat
      </button>

      <article
        className={`${cardClass} relative overflow-hidden p-6 sm:p-10 lg:p-12`}
      >
        <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-orange-500/0 via-orange-400 to-orange-500/0" />

        <div className="mb-6 flex flex-wrap items-center gap-3">
          <MoodBadge mood={note.mood} />
          <span className="text-xs text-gray-500">
            {note.date} · {note.time}
          </span>
        </div>

        <h1 className="break-words text-2xl font-bold leading-tight text-white sm:text-4xl">
          {note.title}
        </h1>

        <div className="mb-8 mt-6 h-1 w-16 rounded-full bg-orange-400" />

        <p className="whitespace-pre-wrap break-words text-sm leading-8 text-gray-300 sm:text-base">
          {note.content}
        </p>

        <div className="mt-10 flex justify-end border-t border-[#303746] pt-6">
          <button
            onClick={() => handleDelete(note.id)}
            className="inline-flex items-center gap-2 rounded-lg border border-red-500/20 px-4 py-3 text-sm text-red-400 transition-all duration-300 hover:bg-red-500/10"
          >
            <Trash2 size={16} />
            Hapus Catatan
          </button>
        </div>
      </article>
    </div>
  );
}

/* =========================
   LOGIN DEMO
========================= */

function LoginView({ onLogin }) {
  const [email, setEmail] = useState("razi@email.com");
  const [password, setPassword] = useState("password");
  const [error, setError] = useState("");

  const submit = (event) => {
    event.preventDefault();

    if (!email.trim() || !password) {
      setError("Email dan password harus diisi.");
      return;
    }

    setError("");
    onLogin();
  };

  return (
    <div className="relative z-10 flex min-h-full w-full items-center justify-center p-5 sm:p-8">
      <div className="grid w-full max-w-[1000px] overflow-hidden rounded-2xl border border-[#303746] bg-[#12161e] shadow-2xl md:min-h-[600px] md:grid-cols-2">
        <div className="relative hidden flex-col justify-center overflow-hidden border-r border-[#303746] bg-[#171c26] p-10 md:flex lg:p-14">
          <div className="absolute -left-20 top-10 h-64 w-64 rounded-full bg-orange-500/10 blur-[100px]" />

          <div className="relative z-10">
            <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-xl bg-orange-500 text-white">
              <BookOpen size={30} />
            </div>

            <h1 className="text-4xl font-bold leading-tight text-white lg:text-5xl">
              Catatan
              <br />
              Pribadi.
            </h1>

            <p className="mt-5 max-w-sm text-sm leading-7 text-gray-400">
              Tempat untuk menuangkan pikiran, mencatat kenangan, dan
              memahami dirimu dengan lebih baik.
            </p>

            <div className="mt-10 h-px w-20 bg-orange-400" />

            <p className="mt-4 text-xs text-gray-500">
              Your thoughts, your private space.
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-14">
          <div className="mb-8 md:hidden">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500 text-white">
              <BookOpen size={23} />
            </div>
            <h1 className="text-2xl font-bold text-white">
              Catatan Pribadi
            </h1>
          </div>

          <h2 className="text-2xl font-bold text-white">
            Selamat datang!
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Masuk untuk melanjutkan ke ruang jurnalmu.
          </p>

          <form onSubmit={submit} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-xs font-semibold text-gray-400">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className={inputClass}
                autoComplete="username"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold text-gray-400">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className={inputClass}
                autoComplete="current-password"
                required
              />
            </div>

            {error && (
              <p role="alert" className="text-sm text-red-400">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full rounded-lg bg-orange-500 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-orange-400 hover:shadow-lg hover:shadow-orange-500/20"
            >
              MASUK
            </button>
          </form>

          <p className="mt-6 text-center text-xs leading-5 text-gray-600">
            Mode demo · Form ini belum menggunakan autentikasi server.
          </p>
        </div>
      </div>
    </div>
  );
}

/* =========================
   ANIMATED CONFIRM MODAL
========================= */

function ConfirmModal({ config, onCancel, onConfirm }) {
  useEffect(() => {
    if (!config) return;

    const onKeyDown = (event) => {
      if (event.key === "Escape") onCancel();
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [config, onCancel]);

  if (!config) return null;

  const isNotice = config.kind === "notice";

  return (
    <div
      className="confirm-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        className="confirm-modal"
      >
        <button
          className="confirm-close"
          onClick={onCancel}
          aria-label="Tutup dialog"
        >
          <X size={17} />
        </button>

        <div className="confirm-symbol">
          {isNotice ? <Bell size={24} /> : <AlertTriangle size={24} />}
        </div>

        <div className="confirm-eyebrow">
          SYSTEM / CONFIRMATION
        </div>

        <h2 id="confirm-title">{config.title}</h2>
        <p>{config.message}</p>

        <div className="confirm-actions">
          {!isNotice && (
            <button className="confirm-cancel" onClick={onCancel}>
              Batal
            </button>
          )}

          <button
            className="confirm-danger"
            onClick={isNotice ? onCancel : onConfirm}
          >
            {!isNotice && <Trash2 size={15} />}
            {config.confirmLabel || (isNotice ? "Mengerti" : "Hapus")}
          </button>
        </div>
      </section>
    </div>
  );
}

/* =========================
   MAIN APP
========================= */

export default function App() {
  const [currentView, setCurrentView] = useState("login");
  const [selectedNote, setSelectedNote] = useState(null);
  const [notes, setNotes] = useSavedNotes();
  const [confirmConfig, setConfirmConfig] = useState(null);

  const handleDeleteNote = (id) => {
    const note = notes.find((item) => item.id === id);
    if (!note) return;

    setConfirmConfig({
      kind: "single",
      id,
      title: "Hapus catatan ini?",
      message: `“${note.title}” akan dihapus permanen dari jurnalmu. Tindakan ini tidak dapat dibatalkan.`,
      confirmLabel: "Hapus catatan",
    });
  };

  const handleClearNotes = () => {
    if (notes.length === 0) {
      setConfirmConfig({
        kind: "notice",
        title: "Jurnal masih kosong",
        message: "Belum ada catatan yang bisa dihapus.",
        confirmLabel: "Mengerti",
      });
      return;
    }

    setConfirmConfig({
      kind: "all",
      title: "Hapus semua catatan?",
      message: `Kamu akan menghapus ${notes.length} catatan dari jurnal. Tindakan ini tidak dapat dibatalkan.`,
      confirmLabel: "Hapus semuanya",
    });
  };

  const cancelConfirmation = () => {
    setConfirmConfig(null);
  };

  const confirmAction = () => {
    if (!confirmConfig) return;

    const action = confirmConfig;

    if (action.kind === "single") {
      setNotes((previous) =>
        previous.filter((note) => note.id !== action.id)
      );

      if (currentView === "detail") {
        setSelectedNote(null);
        setCurrentView("history");
      }
    } else if (action.kind === "all") {
      setNotes([]);
      setSelectedNote(null);

      if (currentView === "detail") {
        setCurrentView("history");
      }
    }

    setConfirmConfig(null);
  };

  return (
    <div className="relative flex h-screen h-[100dvh] w-full overflow-hidden bg-[#121212] font-sans antialiased text-white selection:bg-orange-400/30">
      <style>{`
        *, *::before, *::after {
          box-sizing: border-box;
        }

        html, body, #root {
          width: 100%;
          height: 100%;
          margin: 0;
          background: #121212;
        }

        body {
          overflow: hidden;
        }

        button, input, textarea {
          font: inherit;
        }

        button {
          cursor: pointer;
        }

        .app-scroll {
          scrollbar-width: thin;
          scrollbar-color: #3b4353 transparent;
          overscroll-behavior: contain;
        }

        .app-scroll::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }

        .app-scroll::-webkit-scrollbar-track {
          background: transparent;
        }

        .app-scroll::-webkit-scrollbar-thumb {
          background: #3b4353;
          border-radius: 999px;
        }

        .page-enter {
          animation: pageEnter 220ms ease-out both;
        }

        @keyframes pageEnter {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .confirm-overlay {
          position: fixed;
          inset: 0;
          z-index: 100;
          display: grid;
          place-items: center;
          padding: 20px;
          background: rgb(3 5 9 / 72%);
          backdrop-filter: blur(7px);
          animation: confirmFadeIn 160ms ease-out both;
        }

        .confirm-modal {
          position: relative;
          width: min(100%, 430px);
          padding: 28px;
          color: #f3f4f6;
          background: linear-gradient(145deg, #191e28, #11151c);
          border: 1px solid #343d50;
          border-top: 2px solid #f97316;
          border-radius: 7px;
          box-shadow:
            0 24px 90px rgb(0 0 0 / 55%),
            0 0 35px rgb(249 115 22 / 9%);
          animation: confirmPopIn 240ms cubic-bezier(.2,.8,.2,1) both;
        }

        .confirm-close {
          position: absolute;
          top: 12px;
          right: 12px;
          display: grid;
          place-items: center;
          width: 32px;
          height: 32px;
          color: #8c95a5;
          background: #202633;
          border: 1px solid #343d50;
          border-radius: 5px;
          transition:
            color 160ms,
            background 160ms,
            transform 160ms;
        }

        .confirm-close:hover {
          color: #fff;
          background: #30394b;
          transform: rotate(5deg);
        }

        .confirm-symbol {
          display: grid;
          place-items: center;
          width: 52px;
          height: 52px;
          margin-bottom: 20px;
          color: #fb923c;
          background: rgb(249 115 22 / 11%);
          border: 1px solid rgb(249 115 22 / 35%);
          border-radius: 6px;
          animation: confirmPulse 2s ease-in-out infinite;
        }

        .confirm-eyebrow {
          margin-bottom: 9px;
          color: #fb923c;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1.7px;
        }

        .confirm-modal h2 {
          margin: 0 30px 10px 0;
          color: #f8fafc;
          font-size: 23px;
          font-weight: 750;
          letter-spacing: -.5px;
        }

        .confirm-modal p {
          margin: 0 0 25px;
          color: #a0a8b7;
          font-size: 13px;
          line-height: 1.8;
          overflow-wrap: anywhere;
        }

        .confirm-actions {
          display: flex;
          justify-content: flex-end;
          flex-wrap: wrap;
          gap: 10px;
        }

        .confirm-actions button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 39px;
          padding: 0 14px;
          border: 1px solid transparent;
          border-radius: 5px;
          font-size: 12px;
          font-weight: 700;
          transition:
            background 160ms,
            border-color 160ms,
            transform 160ms,
            box-shadow 160ms;
        }

        .confirm-cancel {
          color: #d1d5db;
          background: #242b37;
          border-color: #394354 !important;
        }

        .confirm-cancel:hover {
          background: #30394a;
        }

        .confirm-danger {
          color: white;
          background: #ea580c;
          border-color: #f97316 !important;
        }

        .confirm-danger:hover {
          background: #f97316;
          box-shadow: 0 4px 18px rgb(249 115 22 / 24%);
          transform: translateY(-1px);
        }

        @keyframes confirmFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes confirmPopIn {
          from {
            opacity: 0;
            transform: translateY(14px) scale(.97);
            filter: blur(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }

        @keyframes confirmPulse {
          0%, 100% {
            box-shadow: 0 0 0 rgb(249 115 22 / 0%);
          }
          50% {
            box-shadow: 0 0 20px rgb(249 115 22 / 15%);
          }
        }

        button:focus-visible,
        input:focus-visible,
        textarea:focus-visible {
          outline: 2px solid #fb923c;
          outline-offset: 3px;
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: .01ms !important;
            transition-duration: .01ms !important;
            scroll-behavior: auto !important;
          }

          .confirm-overlay,
          .confirm-modal,
          .confirm-symbol {
            animation: none;
          }
        }

        @media (max-width: 767px) {
          .sidebar-desktop {
            display: none;
          }
        }
      `}</style>

      <CursorGlow />

      {currentView === "login" ? (
        <main className="relative z-10 h-full min-h-0 w-full overflow-y-auto app-scroll">
          <LoginView onLogin={() => setCurrentView("home")} />
        </main>
      ) : (
        <>
          <div className="sidebar-desktop relative z-10 h-full shrink-0">
            <Sidebar
              currentView={currentView}
              setCurrentView={setCurrentView}
            />
          </div>

          <main className="relative z-10 flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-[#121212]">
            <div
              key={currentView}
              className="page-enter app-scroll min-h-0 flex-1 overflow-x-hidden overflow-y-auto"
            >
              {currentView === "home" && (
                <HomeView
                  notes={notes}
                  setNotes={setNotes}
                  setCurrentView={setCurrentView}
                  setSelectedNote={setSelectedNote}
                />
              )}

              {currentView === "history" && (
                <HistoryView
                  notes={notes}
                  setCurrentView={setCurrentView}
                  setSelectedNote={setSelectedNote}
                  handleDelete={handleDeleteNote}
                />
              )}

              {currentView === "profile" && (
                <ProfileView notes={notes} />
              )}

              {currentView === "settings" && (
                <SettingsView
                  setCurrentView={setCurrentView}
                  clearAllNotes={handleClearNotes}
                />
              )}

              {currentView === "detail" && (
                <DetailView
                  note={selectedNote}
                  setCurrentView={setCurrentView}
                  handleDelete={handleDeleteNote}
                />
              )}
            </div>
          </main>
        </>
      )}

      <ConfirmModal
        config={confirmConfig}
        onCancel={cancelConfirmation}
        onConfirm={confirmAction}
      />
    </div>
  );
}
