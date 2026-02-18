import React, { useState, useEffect } from "react";
import { LanternIcon, CrescentMoonBg } from "@/components/RamadhanIcons";
import { saveProfile, setRamadhanStartDate } from "@/lib/storage";

interface OnboardingProps {
  onComplete: () => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const sanitize = (s: string) => s.replace(/[<>]/g, "").trim();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = sanitize(name);
    if (cleaned.length < 2) {
      setError("Nama minimal 2 karakter");
      return;
    }
    if (cleaned.length > 30) {
      setError("Nama maksimal 30 karakter");
      return;
    }
    setSubmitting(true);
    saveProfile({ name: cleaned, bio: "", goals: "" });
    // Ramadhan 1 starts Feb 19 2026 — fixed start date
    setRamadhanStartDate("2026-02-19");
    setTimeout(onComplete, 600);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden" style={{ background: "var(--gradient-bg)" }}>
      {/* Background crescent watermark */}
      <div className="absolute right-0 top-0 w-64 h-64 opacity-5 text-primary pointer-events-none">
        <CrescentMoonBg />
      </div>
      <div className="absolute left-0 bottom-0 w-48 h-48 opacity-5 text-gold pointer-events-none rotate-180">
        <CrescentMoonBg />
      </div>

      {/* Stars decoration */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse-gold"
            style={{
              left: `${10 + (i * 7.5) % 80}%`,
              top: `${5 + (i * 13) % 30}%`,
              animationDelay: `${i * 0.3}s`,
            }}
          >
            <svg width="6" height="6" viewBox="0 0 10 10" fill="hsl(var(--gold))" opacity="0.4">
              <polygon points="5,0 6,4 10,4 7,6.5 8,10 5,8 2,10 3,6.5 0,4 4,4"/>
            </svg>
          </div>
        ))}
      </div>

      <div className="w-full max-w-sm px-6 animate-fade-in">
        {/* Lantern */}
        <div className="flex justify-center mb-6 animate-float">
          <div className="relative">
            <div className="absolute inset-0 blur-xl opacity-40 text-gold scale-150">
              <LanternIcon size={80} />
            </div>
            <LanternIcon size={80} className="text-gold relative z-10 animate-glow" />
          </div>
        </div>

        {/* App name */}
        <div className="text-center mb-2">
          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-1">
            ✦ Selamat Datang ✦
          </p>
          <h1 className="text-3xl font-bold text-primary" style={{ fontFamily: "Amiri, serif" }}>
            Ramadhan Lantern
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Catatan Ibadah Harian Ramadhan</p>
        </div>

        {/* Greeting */}
        <div className="text-center my-6">
          <p className="text-2xl text-foreground" style={{ fontFamily: "Amiri, serif" }}>
            Assalamu'alaikum 🌙
          </p>
          <p className="text-muted-foreground text-sm mt-1">Siapa nama kamu?</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(""); }}
              placeholder="Masukkan nama kamu..."
              className="w-full px-4 py-3 rounded-2xl border-2 bg-card text-foreground placeholder:text-muted-foreground outline-none transition-all duration-200 text-center text-lg"
              style={{
                borderColor: error ? "hsl(var(--destructive))" : "hsl(var(--border))",
                boxShadow: "var(--shadow-card)",
              }}
              maxLength={30}
              autoFocus
            />
            {error && <p className="text-destructive text-xs text-center mt-1">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={submitting || name.trim().length < 2}
            className="w-full py-4 rounded-2xl text-primary-foreground font-semibold text-base transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: "var(--gradient-hero)",
              boxShadow: "var(--shadow-elevated)",
            }}
          >
            {submitting ? "Menyiapkan perjalananmu..." : "Mulai Perjalanan Ramadhan ✨"}
          </button>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Tidak perlu login · Data tersimpan lokal
        </p>
      </div>
    </div>
  );
}
