// LocalStorage data management for Ramadhan Lantern
export interface UserProfile {
  name: string;
  bio: string;
  goals: string;
  photo?: string; // base64
}

export interface DailyData {
  date: string; // YYYY-MM-DD
  puasa: boolean;
  sholat: {
    Subuh: boolean;
    Dzuhur: boolean;
    Ashar: boolean;
    Maghrib: boolean;
    Isya: boolean;
  };
  terawih: boolean;
  tadarus: number; // pages (tilawah malam/tadarus)
  tilawah: number; // pages
  muhasabah: {
    syukur: string;
    perbaikan: string;
    highlight: string;
  };
  completedAt?: string;
}

export function getProfile(): UserProfile | null {
  try {
    const raw = localStorage.getItem("ramadhan_profile");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveProfile(profile: UserProfile) {
  localStorage.setItem("ramadhan_profile", JSON.stringify(profile));
}

export function getTodayKey(): string {
  return new Date().toISOString().split("T")[0];
}

export function getDailyData(date: string): DailyData {
  try {
    const raw = localStorage.getItem(`ramadhan_day_${date}`);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    date,
    puasa: false,
    sholat: { Subuh: false, Dzuhur: false, Ashar: false, Maghrib: false, Isya: false },
    terawih: false,
    tadarus: 0,
    tilawah: 0,
    muhasabah: { syukur: "", perbaikan: "", highlight: "" },
  };
}

export function saveDailyData(data: DailyData) {
  localStorage.setItem(`ramadhan_day_${data.date}`, JSON.stringify(data));
}

export function getAllDailyData(): DailyData[] {
  const result: DailyData[] = [];
  for (let i = 1; i <= 30; i++) {
    const date = getRamadhanDate(i);
    if (date) {
      const d = getDailyData(date);
      result.push(d);
    }
  }
  return result;
}

// Get approximate Ramadhan date for day N (current year)
export function getRamadhanDate(day: number): string | null {
  // We'll store relative to stored start date or use today's approach
  const stored = localStorage.getItem("ramadhan_start_date");
  if (!stored) return null;
  const start = new Date(stored);
  start.setDate(start.getDate() + day - 1);
  return start.toISOString().split("T")[0];
}

export function setRamadhanStartDate(date: string) {
  localStorage.setItem("ramadhan_start_date", date);
}

export function computeProgress(data: DailyData): number {
  const sholatDone = Object.values(data.sholat).filter(Boolean).length;
  const sholatScore = (sholatDone / 5) * 40;       // 40%
  const tilawahScore = Math.min(data.tilawah / 8, 1) * 25; // 25%
  const puasaScore = data.puasa ? 15 : 0;            // 15%
  const terawihScore = (data.terawih ?? false) ? 10 : 0; // 10%
  const tadarusScore = Math.min((data.tadarus ?? 0) / 4, 1) * 10; // 10%
  return Math.round(sholatScore + tilawahScore + puasaScore + terawihScore + tadarusScore);
}

export function getStreak(): number {
  let streak = 0;
  let date = new Date();
  for (let i = 0; i < 30; i++) {
    date.setDate(date.getDate() - (i === 0 ? 0 : 1));
    const key = date.toISOString().split("T")[0];
    const d = getDailyData(key);
    const sholatAll = Object.values(d.sholat).every(Boolean);
    if (sholatAll) streak++;
    else break;
  }
  return streak;
}

export function getAiUsageToday(): number {
  const today = new Date().toISOString().split("T")[0];
  const raw = localStorage.getItem(`ramadhan_ai_usage_${today}`);
  return raw ? parseInt(raw) : 0;
}

export function incrementAiUsage() {
  const today = new Date().toISOString().split("T")[0];
  const current = getAiUsageToday();
  localStorage.setItem(`ramadhan_ai_usage_${today}`, String(current + 1));
}

export function getChatHistory(): Array<{ role: "user" | "ai"; content: string; time: string }> {
  try {
    const raw = localStorage.getItem("ramadhan_ai_chat_history");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveChatHistory(history: Array<{ role: "user" | "ai"; content: string; time: string }>) {
  const last20 = history.slice(-20);
  localStorage.setItem("ramadhan_ai_chat_history", JSON.stringify(last20));
}

export function getMotivation(): string | null {
  try {
    const today = new Date().toISOString().split("T")[0];
    const raw = localStorage.getItem(`ramadhan_motivation_cache_${today}`);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

export function saveMotivation(text: string) {
  const today = new Date().toISOString().split("T")[0];
  localStorage.setItem(`ramadhan_motivation_cache_${today}`, JSON.stringify(text));
}
