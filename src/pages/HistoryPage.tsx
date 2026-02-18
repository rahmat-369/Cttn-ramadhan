import React, { useState } from "react";
import { getDailyData, getTodayKey, getAllDailyData, computeProgress } from "@/lib/storage";

function getDateForDay(day: number): string {
  const stored = localStorage.getItem("ramadhan_start_date");
  if (!stored) {
    // fallback: use today minus (30-day) approach
    const d = new Date();
    d.setDate(d.getDate() - (30 - day));
    return d.toISOString().split("T")[0];
  }
  const start = new Date(stored);
  start.setDate(start.getDate() + day - 1);
  return start.toISOString().split("T")[0];
}

function getDotColor(day: number): string {
  const date = getDateForDay(day);
  const data = getDailyData(date);
  const sholatDone = Object.values(data.sholat).filter(Boolean).length;
  if (sholatDone === 5 && data.puasa) return "gold";
  if (sholatDone >= 3) return "green";
  // Check if any data
  const hasData = sholatDone > 0 || data.tilawah > 0 || data.puasa;
  return hasData ? "muted" : "empty";
}

export default function HistoryPage() {
  const [selectedDay, setSelectedDay] = useState<number>(() => {
    const stored = localStorage.getItem("ramadhan_start_date");
    if (!stored) return 1;
    const start = new Date(stored);
    const today = new Date();
    const diff = Math.floor((today.getTime() - start.getTime()) / 86400000) + 1;
    return Math.max(1, Math.min(30, diff));
  });

  const selectedDate = getDateForDay(selectedDay);
  const dayData = getDailyData(selectedDate);
  const progress = computeProgress(dayData);
  const sholatDone = Object.values(dayData.sholat).filter(Boolean).length;

  const isToday = selectedDate === getTodayKey();

  return (
    <div className="pb-24 animate-fade-in px-4">
      <div className="pt-2 pb-4">
        <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: "Amiri, serif" }}>
          Riwayat Ibadah
        </h2>
        <p className="text-muted-foreground text-sm">30 hari perjalanan Ramadhanmu</p>
      </div>

      {/* Horizontal date picker */}
      <div className="glass-card rounded-3xl p-4 mb-4">
        <p className="section-title mb-3">Pilih Hari</p>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
            const dotColor = getDotColor(day);
            const isSelected = selectedDay === day;
            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`flex flex-col items-center gap-1 min-w-[48px] py-2 px-1 rounded-2xl transition-all duration-200 ${
                  isSelected ? "text-primary-foreground" : "text-foreground hover:bg-muted"
                }`}
                style={isSelected ? { background: "var(--gradient-green)" } : {}}
              >
                <span className="text-sm font-bold">{day}</span>
                <div className={`w-2 h-2 rounded-full ${
                  dotColor === "gold" ? "bg-gold" :
                  dotColor === "green" ? "bg-primary" :
                  dotColor === "muted" ? "bg-muted-foreground/50" :
                  "bg-muted"
                }`} />
              </button>
            );
          })}
        </div>
        {/* Legend */}
        <div className="flex gap-4 mt-2">
          {[
            { color: "bg-gold", label: "Lengkap" },
            { color: "bg-primary", label: "Hampir" },
            { color: "bg-muted-foreground/50", label: "Parsial" },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${color}`} />
              <span className="text-xs text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Selected day detail */}
      <div className="glass-card rounded-3xl p-5 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-foreground" style={{ fontFamily: "Amiri, serif" }}>
              Ramadhan Hari ke-{selectedDay}
            </h3>
            <p className="text-xs text-muted-foreground">
              {new Date(selectedDate + "T00:00:00").toLocaleDateString("id-ID", {
                weekday: "long", day: "numeric", month: "long"
              })}
              {isToday && <span className="ml-2 text-gold font-semibold">• Hari Ini</span>}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">{progress}%</p>
            <p className="text-xs text-muted-foreground">progress</p>
          </div>
        </div>

        {/* Sholat status */}
        <div className="mb-4">
          <p className="section-title mb-2">Sholat ({sholatDone}/5)</p>
          <div className="flex gap-2">
            {(["Subuh", "Dzuhur", "Ashar", "Maghrib", "Isya"] as const).map((p) => (
              <div
                key={p}
                className={`flex-1 py-2 rounded-xl text-center text-xs font-medium ${
                  dayData.sholat[p] ? "text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
                style={dayData.sholat[p] ? { background: "var(--gradient-green)" } : {}}
              >
                {p.substring(0, 3)}
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-muted rounded-2xl p-3 text-center">
            <p className="text-xl font-bold text-foreground">{dayData.puasa ? "✓" : "–"}</p>
            <p className="text-xs text-muted-foreground">Puasa</p>
          </div>
          <div className="bg-muted rounded-2xl p-3 text-center">
            <p className="text-xl font-bold text-foreground">{dayData.tilawah}</p>
            <p className="text-xs text-muted-foreground">Hal. Ngaji</p>
          </div>
          <div className="bg-muted rounded-2xl p-3 text-center">
            <p className="text-xl font-bold text-foreground">{sholatDone}</p>
            <p className="text-xs text-muted-foreground">Sholat</p>
          </div>
        </div>

        {/* Muhasabah preview */}
        {(dayData.muhasabah.syukur || dayData.muhasabah.highlight) && (
          <div className="mt-4 p-3 rounded-2xl bg-secondary/50">
            <p className="text-xs text-muted-foreground mb-1">Catatan Muhasabah</p>
            {dayData.muhasabah.syukur && (
              <p className="text-sm text-foreground">💚 {dayData.muhasabah.syukur}</p>
            )}
            {dayData.muhasabah.highlight && (
              <p className="text-sm text-foreground">⭐ {dayData.muhasabah.highlight}</p>
            )}
          </div>
        )}
      </div>

      {/* Calendar grid */}
      <div className="glass-card rounded-3xl p-5">
        <p className="section-title mb-4">Kalender 30 Hari</p>
        <div className="grid grid-cols-6 gap-2">
          {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
            const dotColor = getDotColor(day);
            const isSelected = day === selectedDay;
            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`aspect-square rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-200 ${
                  dotColor === "gold" ? "text-foreground" :
                  dotColor === "green" ? "text-primary-foreground" :
                  dotColor === "muted" ? "bg-muted text-muted-foreground" :
                  "bg-muted/50 text-muted-foreground"
                } ${isSelected ? "ring-2 ring-primary ring-offset-1" : ""}`}
                style={
                  dotColor === "gold" ? { background: "hsl(var(--gold))" } :
                  dotColor === "green" ? { background: "hsl(var(--primary))" } : {}
                }
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
