// Hooks for prayer times and Hijri date
import { useState, useEffect, useCallback } from "react";

export interface PrayerTimes {
  Imsak: string;
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

export interface HijriDate {
  day: string;
  month: { en: string; ar: string; number: number };
  year: string;
}

export interface PrayerData {
  timings: PrayerTimes;
  hijri: HijriDate;
}

const TIMEOUT_MS = 8000;

function subtractMinutes(timeStr: string, minutes: number): string {
  const [h, m] = timeStr.split(":").map(Number);
  const total = h * 60 + m - minutes;
  const newH = Math.floor(((total % 1440) + 1440) % 1440 / 60);
  const newM = ((total % 1440) + 1440) % 1440 % 60;
  return `${String(newH).padStart(2, "0")}:${String(newM).padStart(2, "0")}`;
}

export function usePrayerTimes() {
  const [data, setData] = useState<PrayerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [city, setCity] = useState<string>(() => localStorage.getItem("ramadhan_city") || "");
  const [useAuto, setUseAuto] = useState<boolean>(() => localStorage.getItem("ramadhan_location_mode") !== "manual");

  const fetchByCoords = useCallback(async (lat: number, lng: number) => {
    const today = new Date().toISOString().split("T")[0];
    const cacheKey = `ramadhan_prayer_cache_${today}_${lat.toFixed(2)}_${lng.toFixed(2)}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setData(parsed);
        setLoading(false);
        return;
      } catch {}
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(
        `https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lng}&method=11`,
        { signal: controller.signal }
      );
      clearTimeout(timer);
      const json = await res.json();
      const timings = json.data.timings;
      const hijriRaw = json.data.date.hijri;
      const imsak = subtractMinutes(timings.Fajr, 10);
      const result: PrayerData = {
        timings: { ...timings, Imsak: imsak },
        hijri: {
          day: hijriRaw.day,
          month: hijriRaw.month,
          year: hijriRaw.year,
        },
      };
      localStorage.setItem(cacheKey, JSON.stringify(result));
      setData(result);
    } catch (e: any) {
      const last = localStorage.getItem(cacheKey);
      if (last) setData(JSON.parse(last));
      else setError("Gagal memuat jadwal sholat");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchByCity = useCallback(async (cityName: string) => {
    const today = new Date().toISOString().split("T")[0];
    const cacheKey = `ramadhan_prayer_cache_${today}_city_${cityName}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setData(parsed);
        setLoading(false);
        return;
      } catch {}
    }
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(
        `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(cityName)}&country=Indonesia&method=11`,
        { signal: controller.signal }
      );
      clearTimeout(timer);
      const json = await res.json();
      const timings = json.data.timings;
      const hijriRaw = json.data.date.hijri;
      const imsak = subtractMinutes(timings.Fajr, 10);
      const result: PrayerData = {
        timings: { ...timings, Imsak: imsak },
        hijri: {
          day: hijriRaw.day,
          month: hijriRaw.month,
          year: hijriRaw.year,
        },
      };
      localStorage.setItem(cacheKey, JSON.stringify(result));
      setData(result);
    } catch {
      const last = localStorage.getItem(cacheKey);
      if (last) setData(JSON.parse(last));
      else setError("Gagal memuat jadwal sholat untuk kota ini");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!useAuto && city) {
      fetchByCity(city);
    } else if (useAuto) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchByCoords(pos.coords.latitude, pos.coords.longitude),
        () => {
          // fallback to Jakarta
          fetchByCoords(-6.2088, 106.8456);
        }
      );
    } else {
      fetchByCoords(-6.2088, 106.8456);
    }
  }, [useAuto, city, fetchByCoords, fetchByCity]);

  const setManualCity = (c: string) => {
    localStorage.setItem("ramadhan_city", c);
    localStorage.setItem("ramadhan_location_mode", "manual");
    setCity(c);
    setUseAuto(false);
    setLoading(true);
  };

  const setAutoLocation = () => {
    localStorage.setItem("ramadhan_location_mode", "auto");
    setUseAuto(true);
    setLoading(true);
  };

  return { data, loading, error, city, useAuto, setManualCity, setAutoLocation };
}

export function useRamadhanDay(hijri: HijriDate | null) {
  if (!hijri) return null;
  if (hijri.month.en === "Ramadan") return parseInt(hijri.day);
  return null;
}

// Countdown to next prayer
export function useNextPrayer(timings: PrayerTimes | null) {
  const [nextPrayer, setNextPrayer] = useState<{ name: string; time: string; countdown: string } | null>(null);

  useEffect(() => {
    if (!timings) return;
    const prayers = [
      { name: "Imsak", time: timings.Imsak },
      { name: "Subuh", time: timings.Fajr },
      { name: "Syuruq", time: timings.Sunrise },
      { name: "Dzuhur", time: timings.Dhuhr },
      { name: "Ashar", time: timings.Asr },
      { name: "Maghrib", time: timings.Maghrib },
      { name: "Isya", time: timings.Isha },
    ];

    const tick = () => {
      const now = new Date();
      const nowMins = now.getHours() * 60 + now.getMinutes();

      let found = null;
      for (const p of prayers) {
        const [h, m] = p.time.split(":").map(Number);
        const pMins = h * 60 + m;
        if (pMins > nowMins) {
          const diff = pMins - nowMins;
          const hrs = Math.floor(diff / 60);
          const mins = diff % 60;
          const countdown = hrs > 0 ? `${hrs}j ${mins}m` : `${mins} menit`;
          found = { name: p.name, time: p.time, countdown };
          break;
        }
      }
      setNextPrayer(found);
    };

    tick();
    const interval = setInterval(tick, 60000);
    return () => clearInterval(interval);
  }, [timings]);

  return nextPrayer;
}
