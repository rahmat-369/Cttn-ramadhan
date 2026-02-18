import React from "react";
import { HomeIcon, HistoryIcon, BarChartIcon, ChatIcon, ToolsIcon } from "@/components/RamadhanIcons";

type Page = "dashboard" | "history" | "tools" | "profile" | "stats" | "ai" | "about";

const TABS: { id: Page; label: string; Icon: React.FC<{ className?: string }> }[] = [
  { id: "dashboard", label: "Home", Icon: HomeIcon },
  { id: "history", label: "Riwayat", Icon: HistoryIcon },
  { id: "stats", label: "Statistik", Icon: BarChartIcon },
  { id: "ai", label: "AI", Icon: ChatIcon },
  { id: "tools", label: "Tools", Icon: ToolsIcon },
];

export default function BottomNav({ currentPage, onNavigate }: { currentPage: Page; onNavigate: (p: Page) => void }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 glass-card border-t border-border/50 bottom-nav">
      <div className="flex max-w-md mx-auto">
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={`nav-tab flex-1 ${currentPage === id ? "nav-tab-active" : "nav-tab-inactive"}`}
          >
            <div className={`p-1.5 rounded-xl transition-all ${currentPage === id ? "bg-primary/10" : ""}`}>
              <Icon className={currentPage === id ? "text-primary" : "text-muted-foreground"} />
            </div>
            <span className={`text-[10px] font-medium ${currentPage === id ? "text-primary" : "text-muted-foreground"}`}>{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
