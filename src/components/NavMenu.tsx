import React, { useState } from "react";
import {
  LanternIcon, MosqueIcon, MoonStarIcon,
  MenuIcon, CloseIcon, HomeIcon, HistoryIcon,
  ToolsIcon, UserIcon, BarChartIcon, ChatIcon,
  MoonIcon, InfoIcon, FireIcon
} from "@/components/RamadhanIcons";

type Page = "dashboard" | "history" | "tools" | "profile" | "stats" | "ai" | "about";

interface NavMenuProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  darkMode: boolean;
  onToggleDark: () => void;
  onResetData: () => void;
  userName: string;
  streak: number;
}

const menuItems: { id: Page; label: string; Icon: React.FC<{ className?: string }> }[] = [
  { id: "dashboard", label: "Dashboard", Icon: HomeIcon },
  { id: "history", label: "Riwayat", Icon: HistoryIcon },
  { id: "stats", label: "Statistik", Icon: BarChartIcon },
  { id: "ai", label: "Ngobrol AI", Icon: ChatIcon },
  { id: "tools", label: "Tools", Icon: ToolsIcon },
  { id: "profile", label: "Profil", Icon: UserIcon },
  { id: "about", label: "Tentang Developer", Icon: InfoIcon },
];

export default function NavMenu({
  currentPage, onNavigate, darkMode, onToggleDark, onResetData, userName, streak
}: NavMenuProps) {
  const [open, setOpen] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetInput, setResetInput] = useState("");

  const handleNav = (page: Page) => {
    onNavigate(page);
    setOpen(false);
  };

  const handleReset = () => {
    if (resetInput === "RESET") {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <>
      {/* Header bar */}
      <header className="fixed top-0 left-0 right-0 z-40 glass-card border-b border-border/50">
        <div className="flex items-center justify-between px-4 py-3 max-w-md mx-auto">
          <div className="flex items-center gap-2">
            <LanternIcon size={28} className="text-gold" />
            <div>
              <h1 className="text-base font-bold text-primary leading-none" style={{ fontFamily: "Amiri, serif" }}>
                Ramadhan Lantern
              </h1>
              <p className="text-xs text-muted-foreground">Catatan Ibadah Harian</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {streak > 0 && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-secondary">
                <FireIcon className="text-gold" />
                <span className="text-xs font-bold text-foreground">{streak}</span>
              </div>
            )}
            <button
              onClick={() => setOpen(true)}
              className="p-2 rounded-xl hover:bg-muted transition-colors text-foreground"
            >
              <MenuIcon />
            </button>
          </div>
        </div>
      </header>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-foreground/30 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-72 z-50 flex flex-col transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
        style={{ background: "hsl(var(--sidebar-background))" }}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between p-5 border-b border-sidebar-border">
          <div>
            <p className="text-xs opacity-50 text-sidebar-foreground">Ramadhan Lantern</p>
            <p className="font-semibold text-sidebar-foreground" style={{ fontFamily: "Amiri, serif" }}>
              {userName || "Musafir"}
            </p>
          </div>
          <button onClick={() => setOpen(false)} className="text-sidebar-foreground opacity-70 hover:opacity-100">
            <CloseIcon />
          </button>
        </div>

        {/* Menu items */}
        <nav className="flex-1 overflow-y-auto py-4">
          {menuItems.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => handleNav(id)}
              className={`w-full flex items-center gap-3 px-5 py-3 text-left transition-all duration-200 ${
                currentPage === id
                  ? "bg-sidebar-accent text-sidebar-primary border-r-2 border-sidebar-primary"
                  : "text-sidebar-foreground opacity-70 hover:opacity-100 hover:bg-sidebar-accent/50"
              }`}
            >
              <Icon className="shrink-0" />
              <span className="font-medium">{label}</span>
            </button>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="p-4 border-t border-sidebar-border space-y-2">
          {/* Dark mode toggle */}
          <button
            onClick={onToggleDark}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sidebar-foreground opacity-70 hover:opacity-100 hover:bg-sidebar-accent/50 transition-all"
          >
            <MoonIcon />
            <span className="font-medium">{darkMode ? "Mode Terang" : "Mode Gelap"}</span>
            <div className={`ml-auto w-10 h-5 rounded-full transition-colors relative ${darkMode ? "bg-sidebar-primary" : "bg-sidebar-border"}`}>
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${darkMode ? "translate-x-5" : "translate-x-0.5"}`} />
            </div>
          </button>

          {/* WhatsApp channel */}
          <a
            href="https://whatsapp.com/channel/0029VbBjyjlJ93wa6hwSWa0p"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sidebar-foreground opacity-70 hover:opacity-100 hover:bg-sidebar-accent/50 transition-all"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
            </svg>
            <span className="font-medium text-sm">Join Saluran Developer</span>
          </a>

          {/* Reset */}
          <button
            onClick={() => setShowReset(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-destructive opacity-70 hover:opacity-100 hover:bg-destructive/10 transition-all"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span className="font-medium text-sm">Reset Data</span>
          </button>
        </div>
      </aside>

      {/* Reset Modal */}
      {showReset && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-foreground/40" onClick={() => { setShowReset(false); setResetInput(""); }} />
          <div className="relative glass-card rounded-3xl p-6 w-full max-w-sm animate-slide-up">
            <h3 className="text-lg font-bold text-foreground mb-2" style={{ fontFamily: "Amiri, serif" }}>
              Reset Semua Data?
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              Ketik <strong className="text-destructive">RESET</strong> untuk menghapus semua data. Tindakan ini tidak bisa dibatalkan.
            </p>
            <input
              type="text"
              value={resetInput}
              onChange={(e) => setResetInput(e.target.value)}
              placeholder="Ketik RESET"
              className="w-full px-4 py-3 rounded-xl border-2 bg-card text-foreground outline-none mb-4"
              style={{ borderColor: "hsl(var(--destructive))" }}
            />
            <div className="flex gap-3">
              <button
                onClick={() => { setShowReset(false); setResetInput(""); }}
                className="flex-1 py-3 rounded-xl bg-muted text-foreground font-medium"
              >
                Batal
              </button>
              <button
                onClick={handleReset}
                disabled={resetInput !== "RESET"}
                className="flex-1 py-3 rounded-xl bg-destructive text-destructive-foreground font-medium disabled:opacity-40"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
