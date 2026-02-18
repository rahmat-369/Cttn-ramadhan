import React, { useState } from "react";
import { usePrayerTimes } from "@/hooks/usePrayerTimes";
import { BellIcon, LocationIcon, RefreshIcon } from "@/components/RamadhanIcons";
import { MosqueIcon } from "@/components/RamadhanIcons";

export default function ToolsPage() {
  const { data, useAuto, city, setManualCity, setAutoLocation } = usePrayerTimes();
  const [cityInput, setCityInput] = useState(city || "");
  const [noteText, setNoteText] = useState(() => localStorage.getItem("ramadhan_global_note") || "");
  const [noteSaved, setNoteSaved] = useState(false);

  const handleCitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cityInput.trim()) setManualCity(cityInput.trim());
  };

  const saveNote = () => {
    localStorage.setItem("ramadhan_global_note", noteText);
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2000);
  };

  // 30-day schedule data
  const prayers30 = data
    ? [
        { name: "Imsak", time: data.timings.Imsak },
        { name: "Subuh", time: data.timings.Fajr },
        { name: "Dzuhur", time: data.timings.Dhuhr },
        { name: "Ashar", time: data.timings.Asr },
        { name: "Maghrib", time: data.timings.Maghrib },
        { name: "Isya", time: data.timings.Isha },
      ]
    : [];

  return (
    <div className="pb-24 animate-fade-in px-4">
      <div className="pt-2 pb-4">
        <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: "Amiri, serif" }}>
          Tools
        </h2>
        <p className="text-muted-foreground text-sm">Pengaturan & alat bantu ibadah</p>
      </div>

      {/* Location setting */}
      <div className="glass-card rounded-3xl p-5 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <LocationIcon className="text-primary" />
          <p className="section-title">Mode Lokasi</p>
        </div>

        <div className="flex gap-2 mb-4">
          <button
            onClick={setAutoLocation}
            className={`flex-1 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
              useAuto ? "text-primary-foreground" : "bg-muted text-foreground"
            }`}
            style={useAuto ? { background: "var(--gradient-green)" } : {}}
          >
            Otomatis (GPS)
          </button>
          <button
            onClick={() => {/* already manual mode by form submit */}}
            className={`flex-1 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
              !useAuto ? "text-primary-foreground" : "bg-muted text-foreground"
            }`}
            style={!useAuto ? { background: "var(--gradient-green)" } : {}}
          >
            Manual Kota
          </button>
        </div>

        <form onSubmit={handleCitySubmit} className="flex gap-2">
          <input
            type="text"
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
            placeholder="Contoh: Jakarta, Surabaya, Bandung"
            className="flex-1 px-4 py-2.5 rounded-2xl border bg-card text-foreground text-sm outline-none focus:border-primary transition-colors"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-2xl text-primary-foreground text-sm font-medium"
            style={{ background: "var(--gradient-green)" }}
          >
            Set
          </button>
        </form>
      </div>

      {/* Today's schedule */}
      {data && (
        <div className="glass-card rounded-3xl p-5 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <MosqueIcon size={20} className="text-primary" />
            <p className="section-title">Jadwal Sholat Hari Ini</p>
          </div>
          <div className="space-y-2">
            {prayers30.map(({ name, time }) => (
              <div key={name} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                <span className="text-foreground font-medium text-sm">{name}</span>
                <span className="text-foreground font-bold">{time}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Global note */}
      <div className="glass-card rounded-3xl p-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <p className="section-title">Catatan Ramadhan</p>
          <button
            onClick={saveNote}
            className="text-xs px-3 py-1.5 rounded-xl text-primary-foreground font-medium"
            style={{ background: "var(--gradient-green)" }}
          >
            {noteSaved ? "Tersimpan ✓" : "Simpan"}
          </button>
        </div>
        <textarea
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="Tulis catatan, doa, atau niat Ramadhanmu di sini..."
          rows={5}
          className="w-full bg-muted rounded-2xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none resize-none"
        />
      </div>

      {/* Phases reference */}
      <div className="glass-card rounded-3xl p-5">
        <p className="section-title mb-4">Fase 10 Hari Ramadhan</p>
        <div className="space-y-3">
          {[
            { title: "10 Hari Pertama", sub: "Hari 1–10", label: "Rahmat", desc: "Masa turunnya rahmat Allah yang berlimpah. Perbanyak doa dan istighfar.", color: "var(--gradient-green)" },
            { title: "10 Hari Kedua", sub: "Hari 11–20", label: "Maghfirah", desc: "Masa ampunan. Fokus taubat dan perbaiki hubungan dengan Allah & manusia.", color: "var(--gradient-gold)" },
            { title: "10 Hari Ketiga", sub: "Hari 21–30", label: "Pembebasan", desc: "Masa dibebaskan dari api neraka. Tingkatkan ibadah, cari Lailatul Qadr.", color: "linear-gradient(135deg, hsl(145,35%,25%) 0%, hsl(43,89%,45%) 100%)" },
          ].map(({ title, sub, label, desc, color }) => (
            <div key={label} className="p-4 rounded-2xl bg-muted/50">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-primary-foreground text-xs font-bold shrink-0" style={{ background: color }}>
                  {sub.split("–")[0].replace("Hari ", "")}–{sub.split("–")[1]}
                </div>
                <div>
                  <p className="font-bold text-foreground text-sm">{label}</p>
                  <p className="text-xs text-muted-foreground">{title}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
