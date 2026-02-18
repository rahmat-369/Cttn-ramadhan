import React, { useState, useEffect, useCallback } from "react";
import { usePrayerTimes, useNextPrayer, useRamadhanDay } from "@/hooks/usePrayerTimes";
import {
  getDailyData, saveDailyData, getTodayKey, computeProgress, getStreak,
  getMotivation, saveMotivation, type DailyData
} from "@/lib/storage";
import {
  LockIcon, CheckCircleIcon, PlusIcon, MinusIcon,
  BookIcon, ChevronDownIcon, LocationIcon, StarIcon, RefreshIcon
} from "@/components/RamadhanIcons";
import { CrescentMoonBg } from "@/components/RamadhanIcons";

// Ramadhan 1 starts Feb 19 2026 00:00 local time
const RAMADHAN_START = new Date("2026-02-19T00:00:00");

const PRAYERS = ["Subuh", "Dzuhur", "Ashar", "Maghrib", "Isya"] as const;
type Prayer = typeof PRAYERS[number];

// Pre-Ramadhan countdown component
function PreRamadhanBanner({ currentTime }: { currentTime: Date }) {
  const diff = RAMADHAN_START.getTime() - currentTime.getTime();
  if (diff <= 0) return null;

  const totalSeconds = Math.floor(diff / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const days = Math.floor(hours / 24);
  const remHours = hours % 24;

  return (
    <div className="mx-4 mb-4 glass-card rounded-3xl p-4 border border-gold/30">
      <p className="text-center text-xs text-gold/80 tracking-widest uppercase mb-2">✦ Menuju Ramadhan 1 ✦</p>
      <div className="flex justify-center gap-3">
        {days > 0 && (
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-gold" style={{ fontFamily: "Amiri, serif" }}>{String(days).padStart(2, "0")}</span>
            <span className="text-xs text-muted-foreground mt-0.5">Hari</span>
          </div>
        )}
        <div className="flex flex-col items-center">
          <span className="text-3xl font-bold text-gold" style={{ fontFamily: "Amiri, serif" }}>{String(remHours).padStart(2, "0")}</span>
          <span className="text-xs text-muted-foreground mt-0.5">Jam</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-3xl font-bold text-primary" style={{ fontFamily: "Amiri, serif" }}>{String(minutes).padStart(2, "0")}</span>
          <span className="text-xs text-muted-foreground mt-0.5">Menit</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-3xl font-bold text-foreground" style={{ fontFamily: "Amiri, serif" }}>{String(seconds).padStart(2, "0")}</span>
          <span className="text-xs text-muted-foreground mt-0.5">Detik</span>
        </div>
      </div>
      <p className="text-center text-xs text-muted-foreground mt-2">Tarawih perdana malam ini · Persiapkan hatimu 🌙</p>
    </div>
  );
}

function ProgressRing({ progress }: { progress: number }) {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - progress / 100);

  return (
    <div className="relative w-36 h-36 flex items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" width="144" height="144">
        {/* Background track */}
        <circle cx="72" cy="72" r={r} strokeWidth="10" className="stroke-muted" fill="none" />
        {/* Full progress */}
        <circle
          cx="72" cy="72" r={r}
          strokeWidth="10"
          fill="none"
          stroke="url(#progressGrad)"
          strokeDasharray={`${circ * (progress / 100)} ${circ}`}
          strokeLinecap="round"
          className="transition-all duration-700"
        />
        <defs>
          <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--gold))" />
          </linearGradient>
        </defs>
      </svg>
      <div className="text-center z-10">
        <p className="text-2xl font-bold text-foreground">{progress}%</p>
        <p className="text-xs text-muted-foreground leading-tight">Perjalanan<br/>Hari Ini</p>
      </div>
    </div>
  );
}

function PrayerTimesCard({ data, nextPrayer }: {
  data: ReturnType<typeof usePrayerTimes>["data"];
  nextPrayer: ReturnType<typeof useNextPrayer>;
}) {
  if (!data) return (
    <div className="glass-card rounded-3xl p-5 animate-pulse">
      <div className="h-4 bg-muted rounded w-1/2 mb-4" />
      {[1,2,3,4,5].map(i => <div key={i} className="h-8 bg-muted rounded mb-2" />)}
    </div>
  );

  const prayers = [
    { name: "Imsak", time: data.timings.Imsak },
    { name: "Subuh", time: data.timings.Fajr },
    { name: "Dzuhur", time: data.timings.Dhuhr },
    { name: "Ashar", time: data.timings.Asr },
    { name: "Maghrib", time: data.timings.Maghrib, label: "🌙 Buka Puasa" },
    { name: "Isya", time: data.timings.Isha },
  ];

  // Check if past Maghrib
  const now = new Date();
  const [mh, mm] = data.timings.Maghrib.split(":").map(Number);
  const isPastMaghrib = now.getHours() * 60 + now.getMinutes() > mh * 60 + mm;

  return (
    <div className="glass-card rounded-3xl p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="section-title">Jadwal Sholat</p>
        {nextPrayer && (
          <span className="text-xs px-2 py-1 rounded-full text-primary-foreground" style={{ background: "var(--gradient-green)" }}>
            {nextPrayer.name} · {nextPrayer.countdown}
          </span>
        )}
      </div>

      {isPastMaghrib && (
        <div className="text-center py-2 mb-3 rounded-2xl text-gold font-semibold text-sm" style={{ background: "hsl(var(--gold)/0.1)" }}>
          Selamat Berbuka 🌙
        </div>
      )}

      <div className="space-y-2">
        {prayers.map((p) => {
          const isNext = nextPrayer?.name === p.name || nextPrayer?.name === (p.name === "Subuh" ? "Subuh" : p.name);
          return (
            <div
              key={p.name}
              className={`flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                nextPrayer?.name === p.name
                  ? "bg-primary/10 border border-primary/30"
                  : "hover:bg-muted/50"
              }`}
            >
              <div>
                <p className="font-medium text-foreground text-sm">{p.name}</p>
                {p.label && <p className="text-xs text-muted-foreground">{p.label}</p>}
              </div>
              <p className={`font-bold text-sm ${nextPrayer?.name === p.name ? "text-primary" : "text-foreground"}`}>
                {p.time}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface SholatChecklist {
  [key: string]: boolean;
}

export default function Dashboard() {
  const today = getTodayKey();
  const [dailyData, setDailyData] = useState<DailyData>(() => getDailyData(today));
  const { data: prayerData, loading: prayerLoading } = usePrayerTimes();
  const nextPrayer = useNextPrayer(prayerData?.timings || null);
  const ramadhanDay = useRamadhanDay(prayerData?.hijri || null);
  const [motivation, setMotivation] = useState<string>(() => getMotivation() || "");
  const [muhasabahOpen, setMuhasabahOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!motivation) {
      const fallbacks = [
        "\"Sesungguhnya Allah tidak menyia-nyiakan pahala orang-orang yang berbuat baik.\" (QS 9:120)",
        "\"Dan bersabarlah kamu, sesungguhnya Allah beserta orang-orang yang sabar.\" (QS 8:46)",
        "\"Barangsiapa yang bertakwa kepada Allah, niscaya Dia akan mengadakan jalan keluar baginya.\" (QS 65:2)",
      ];
      const m = fallbacks[Math.floor(Math.random() * fallbacks.length)];
      setMotivation(m);
      saveMotivation(m);
    }
  }, [motivation]);

  const updateData = (updated: Partial<DailyData>) => {
    const newData = { ...dailyData, ...updated };
    setDailyData(newData);
    saveDailyData(newData);
  };

  const toggleSholat = (prayer: Prayer) => {
    const newSholat = { ...dailyData.sholat, [prayer]: !dailyData.sholat[prayer] };
    updateData({ sholat: newSholat });
  };

  const adjustTilawah = (delta: number) => {
    const newVal = Math.max(0, dailyData.tilawah + delta);
    updateData({ tilawah: newVal });
  };

  const adjustTadarus = (delta: number) => {
    const newVal = Math.max(0, (dailyData.tadarus ?? 0) + delta);
    updateData({ tadarus: newVal });
  };

  const progress = computeProgress(dailyData);
  const sholatDone = Object.values(dailyData.sholat).filter(Boolean).length;
  const streak = getStreak();

  // Determine which prayers are available (anti-bohong based on time)
  const isAvailable = (prayer: Prayer): boolean => {
    if (!prayerData) return false;
    const now = currentTime.getHours() * 60 + currentTime.getMinutes();
    const timeMap: Record<Prayer, string> = {
      Subuh: prayerData.timings.Fajr,
      Dzuhur: prayerData.timings.Dhuhr,
      Ashar: prayerData.timings.Asr,
      Maghrib: prayerData.timings.Maghrib,
      Isya: prayerData.timings.Isha,
    };
    const [h, m] = timeMap[prayer].split(":").map(Number);
    return now >= h * 60 + m;
  };

  const isPreRamadhan = new Date() < RAMADHAN_START;

  return (
    <div className="pb-24 animate-fade-in">
      {/* Hero section */}
      <div className="relative overflow-hidden rounded-b-3xl mb-4" style={{ background: "var(--gradient-hero)" }}>
        <div className="absolute right-0 top-0 w-40 h-40 opacity-10 text-cream">
          <CrescentMoonBg />
        </div>
        <div className="px-5 pt-6 pb-8 relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-primary-foreground/70 text-xs tracking-widest uppercase mb-1">
                {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" })}
              </p>
              {isPreRamadhan ? (
                <h2 className="text-primary-foreground text-xl font-bold" style={{ fontFamily: "Amiri, serif" }}>
                  Malam Menuju Ramadhan 🌙
                </h2>
              ) : ramadhanDay ? (
                <h2 className="text-primary-foreground text-2xl font-bold" style={{ fontFamily: "Amiri, serif" }}>
                  Ramadhan Hari ke-{ramadhanDay}
                </h2>
              ) : (
                <h2 className="text-primary-foreground text-xl font-bold" style={{ fontFamily: "Amiri, serif" }}>
                  {prayerData?.hijri
                    ? `${prayerData.hijri.day} ${prayerData.hijri.month.en} ${prayerData.hijri.year}H`
                    : "Memuat tanggal..."}
                </h2>
              )}
              {prayerData?.hijri && (
                <p className="text-primary-foreground/60 text-xs mt-0.5">
                  {prayerData.hijri.day} {prayerData.hijri.month.en} {prayerData.hijri.year} H
                </p>
              )}
              {!isPreRamadhan && ramadhanDay && (
                <p className="text-primary-foreground/60 text-xs">
                  {30 - ramadhanDay} hari menuju Idul Fitri
                </p>
              )}
            </div>
            {/* Live digital clock */}
            <div className="flex flex-col items-end gap-2">
              <div className="bg-primary-foreground/15 rounded-2xl px-3 py-1.5 text-right">
                <p className="text-primary-foreground font-bold text-2xl leading-none tabular-nums" style={{ fontFamily: "Amiri, serif" }}>
                  {currentTime.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })}
                </p>
                <p className="text-primary-foreground/60 text-xs mt-0.5">
                  {currentTime.toLocaleTimeString("id-ID", { hour12: true, hour: "2-digit", minute: "2-digit" }).includes("AM") ? "Pagi" : "Sore/Malam"}
                </p>
              </div>
              {streak > 0 && (
                <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary-foreground/20">
                  <StarIcon size={12} className="text-gold" />
                  <span className="text-primary-foreground text-xs font-bold">{streak} hari</span>
                </div>
              )}
            </div>
          </div>

          {/* Status chips */}
          <div className="flex gap-2 mt-4 flex-wrap">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${dailyData.puasa ? "bg-gold text-foreground" : "bg-primary-foreground/20 text-primary-foreground"}`}
              onClick={() => updateData({ puasa: !dailyData.puasa })}
              style={{ cursor: "pointer" }}
            >
              {dailyData.puasa ? "✓ Puasa" : "Tap: Puasa?"}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary-foreground/20 text-primary-foreground">
              Sholat {sholatDone}/5
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary-foreground/20 text-primary-foreground">
              Ngaji {dailyData.tilawah} hal
            </span>
            {(dailyData.terawih ?? false) && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gold text-foreground">
                ✓ Terawih
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Pre-Ramadhan countdown banner */}
      {isPreRamadhan && <PreRamadhanBanner currentTime={currentTime} />}

      <div className="px-4 space-y-4">
        {/* Motivation */}
        {motivation && (
          <div className="glass-card rounded-2xl p-4 border-l-4 border-gold">
            <p className="text-xs text-muted-foreground mb-1">✦ Motivasi Hari Ini</p>
            <p className="text-sm text-foreground italic">{motivation}</p>
          </div>
        )}

        {/* Progress + Prayer Times row */}
        <div className="grid grid-cols-2 gap-4">
          {/* Progress Ring */}
          <div className="glass-card rounded-3xl p-4 flex flex-col items-center gap-2">
            <ProgressRing progress={progress} />
            <div className="flex gap-2 text-xs text-center">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-muted-foreground">Sholat</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-gold" />
                <span className="text-muted-foreground">Tilawah</span>
              </div>
            </div>
          </div>

          {/* Next prayer countdown */}
          <div className="glass-card rounded-3xl p-4 flex flex-col justify-between">
            <p className="section-title">Sholat Berikutnya</p>
            {nextPrayer ? (
              <>
                <div>
                  <p className="text-2xl font-bold text-primary">{nextPrayer.countdown}</p>
                  <p className="text-sm text-foreground font-medium">{nextPrayer.name}</p>
                  <p className="text-xs text-muted-foreground">{nextPrayer.time}</p>
                </div>
                {nextPrayer.name === "Maghrib" && (
                  <div className="mt-2 text-xs text-gold font-semibold">
                    🌅 Menuju Buka Puasa
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Semua sholat hari ini sudah masuk 🌙</p>
            )}
          </div>
        </div>

        {/* Sholat Checklist */}
        <div className="glass-card rounded-3xl p-5">
          <p className="section-title mb-4">Ibadah Wajib</p>
          <div className="flex justify-around">
            {PRAYERS.map((prayer) => {
              const done = dailyData.sholat[prayer];
              const available = isAvailable(prayer) || done;
              return (
                <button
                  key={prayer}
                  onClick={() => available && toggleSholat(prayer)}
                  className={`flex flex-col items-center gap-2 p-2 rounded-2xl transition-all duration-300 ${
                    !available ? "opacity-40 cursor-not-allowed" : "active:scale-95"
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                    done
                      ? "text-primary-foreground gold-glow"
                      : available
                      ? "bg-muted text-muted-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                    style={done ? { background: "var(--gradient-green)" } : {}}
                  >
                    {!available ? <LockIcon /> : done ? <CheckCircleIcon className="text-primary-foreground" /> : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2"/>
                      </svg>
                    )}
                  </div>
                  <span className="text-xs font-medium text-foreground">{prayer}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-3 flex gap-1">
            {PRAYERS.map((p) => (
              <div key={p} className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${dailyData.sholat[p] ? "bg-primary" : "bg-muted"}`} />
            ))}
          </div>
        </div>

        {/* Tilawah */}
        <div className="glass-card rounded-3xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <BookIcon className="text-gold" />
              <p className="section-title">Tilawah Al-Qur'an</p>
            </div>
            <span className="text-xs text-muted-foreground">Target: 8 hal/hari</span>
          </div>
          <div className="flex items-center justify-center gap-6">
            <button
              onClick={() => adjustTilawah(-1)}
              className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground active:scale-95 transition-transform"
            >
              <MinusIcon />
            </button>
            <div className="text-center">
              <p className="text-4xl font-bold text-foreground">{dailyData.tilawah}</p>
              <p className="text-xs text-muted-foreground">halaman</p>
            </div>
            <button
              onClick={() => adjustTilawah(1)}
              className="w-10 h-10 rounded-full flex items-center justify-center text-primary-foreground active:scale-95 transition-transform"
              style={{ background: "var(--gradient-green)" }}
            >
              <PlusIcon />
            </button>
          </div>
          {/* Progress bar */}
          <div className="mt-4 bg-muted rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, (dailyData.tilawah / 8) * 100)}%`,
                background: "var(--gradient-gold)",
              }}
            />
          </div>
          <p className="text-center text-xs text-muted-foreground mt-1">
            {Math.round((dailyData.tilawah / 8) * 100)}% dari target harian
          </p>
        </div>

        {/* Terawih & Tadarus */}
        <div className="glass-card rounded-3xl p-5">
          <p className="section-title mb-4">Ibadah Sunnah Malam</p>
          {/* Terawih toggle */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "hsl(var(--gold)/0.15)" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-gold">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Sholat Terawih</p>
                <p className="text-xs text-muted-foreground">Sunnah muakkadah</p>
              </div>
            </div>
            <button
              onClick={() => updateData({ terawih: !(dailyData.terawih ?? false) })}
              className={`w-14 h-7 rounded-full transition-all duration-300 relative ${(dailyData.terawih ?? false) ? "" : "bg-muted"}`}
              style={(dailyData.terawih ?? false) ? { background: "var(--gradient-green)" } : {}}
            >
              <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-card shadow transition-all duration-300 ${(dailyData.terawih ?? false) ? "left-7" : "left-0.5"}`} />
            </button>
          </div>

          {/* Tadarus counter */}
          <div className="border-t border-border pt-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <BookIcon className="text-gold" />
                <p className="text-sm font-semibold text-foreground">Tadarus Malam</p>
              </div>
              <span className="text-xs text-muted-foreground">Target: 4 hal</span>
            </div>
            <div className="flex items-center justify-center gap-6">
              <button
                onClick={() => adjustTadarus(-1)}
                className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-foreground active:scale-95 transition-transform"
              >
                <MinusIcon />
              </button>
              <div className="text-center">
                <p className="text-3xl font-bold text-foreground">{dailyData.tadarus ?? 0}</p>
                <p className="text-xs text-muted-foreground">halaman</p>
              </div>
              <button
                onClick={() => adjustTadarus(1)}
                className="w-9 h-9 rounded-full flex items-center justify-center text-primary-foreground active:scale-95 transition-transform"
                style={{ background: "var(--gradient-gold)" }}
              >
                <PlusIcon />
              </button>
            </div>
            <div className="mt-3 bg-muted rounded-full h-1.5">
              <div
                className="h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, ((dailyData.tadarus ?? 0) / 4) * 100)}%`, background: "var(--gradient-gold)" }}
              />
            </div>
          </div>
        </div>

        {/* Prayer Times */}
        <PrayerTimesCard data={prayerData} nextPrayer={nextPrayer} />

        {/* Muhasabah */}
        <div className="glass-card rounded-3xl overflow-hidden">
          <button
            onClick={() => setMuhasabahOpen(!muhasabahOpen)}
            className="w-full flex items-center justify-between p-5"
          >
            <div className="flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-gold">
                <path d="M9 11l3 3L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p className="section-title">Muhasabah Harian</p>
            </div>
            <ChevronDownIcon className={`text-muted-foreground transition-transform duration-300 ${muhasabahOpen ? "rotate-180" : ""}`} />
          </button>
          {muhasabahOpen && (
            <div className="px-5 pb-5 space-y-3 animate-fade-in">
              {[
                { key: "syukur" as const, label: "Apa yang kamu syukuri hari ini?", placeholder: "Alhamdulillah..." },
                { key: "perbaikan" as const, label: "Apa yang ingin kamu perbaiki?", placeholder: "InsyaAllah besok lebih baik..." },
                { key: "highlight" as const, label: "Momen terbaik hari ini", placeholder: "Yang paling berkesan..." },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="text-xs text-muted-foreground mb-1 block">{label}</label>
                  <textarea
                    value={dailyData.muhasabah[key]}
                    onChange={(e) => {
                      const newMuhasabah = { ...dailyData.muhasabah, [key]: e.target.value };
                      updateData({ muhasabah: newMuhasabah });
                    }}
                    placeholder={placeholder}
                    rows={2}
                    className="w-full px-3 py-2 rounded-xl bg-muted text-foreground text-sm placeholder:text-muted-foreground outline-none resize-none border border-border focus:border-primary transition-colors"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Ramadhan phases */}
        {ramadhanDay && (
          <div className="glass-card rounded-3xl p-5">
            <p className="section-title mb-3">Fase Ramadhan</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Rahmat", range: "1-10", active: ramadhanDay <= 10 },
                { label: "Maghfirah", range: "11-20", active: ramadhanDay > 10 && ramadhanDay <= 20 },
                { label: "Pembebasan", range: "21-30", active: ramadhanDay > 20 },
              ].map(({ label, range, active }) => (
                <div
                  key={label}
                  className={`p-3 rounded-2xl text-center transition-all ${active ? "text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                  style={active ? { background: "var(--gradient-green)" } : {}}
                >
                  <p className="text-xs font-bold">{label}</p>
                  <p className="text-xs opacity-70">Hari {range}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
