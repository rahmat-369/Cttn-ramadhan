import React, { useState, useEffect } from "react";
import Onboarding from "@/components/Onboarding";
import NavMenu from "@/components/NavMenu";
import BottomNav from "@/components/BottomNav";
import Dashboard from "@/pages/Dashboard";
import HistoryPage from "@/pages/HistoryPage";
import StatsPage from "@/pages/StatsPage";
import AIPage from "@/pages/AIPage";
import ToolsPage from "@/pages/ToolsPage";
import ProfilePage from "@/pages/ProfilePage";
import AboutPage from "@/pages/AboutPage";
import { getProfile, getStreak } from "@/lib/storage";

type Page = "dashboard" | "history" | "tools" | "profile" | "stats" | "ai" | "about";

export default function Index() {
  const [profile, setProfile] = useState(() => getProfile());
  const [page, setPage] = useState<Page>("dashboard");
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("ramadhan_dark") === "1");

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    localStorage.setItem("ramadhan_dark", darkMode ? "1" : "0");
  }, [darkMode]);

  if (!profile) {
    return <Onboarding onComplete={() => setProfile(getProfile())} />;
  }

  const renderPage = () => {
    switch (page) {
      case "dashboard": return <Dashboard />;
      case "history": return <HistoryPage />;
      case "stats": return <StatsPage />;
      case "ai": return <AIPage />;
      case "tools": return <ToolsPage />;
      case "profile": return <ProfilePage />;
      case "about": return <AboutPage />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="page-bg max-w-md mx-auto relative">
      <NavMenu
        currentPage={page}
        onNavigate={setPage}
        darkMode={darkMode}
        onToggleDark={() => setDarkMode(!darkMode)}
        onResetData={() => {}}
        userName={profile?.name || ""}
        streak={getStreak()}
      />
      <main className="pt-[72px]">
        {renderPage()}
      </main>
      <BottomNav currentPage={page} onNavigate={setPage} />
    </div>
  );
}
