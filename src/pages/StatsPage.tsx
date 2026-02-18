import React from "react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, ResponsiveContainer, Tooltip, Legend
} from "recharts";
import { getDailyData, getStreak } from "@/lib/storage";

function getDateForDay(day: number): string {
  const stored = localStorage.getItem("ramadhan_start_date");
  const start = stored ? new Date(stored) : new Date();
  start.setDate(start.getDate() + day - 1);
  return start.toISOString().split("T")[0];
}

export default function StatsPage() {
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  const allData = days.map((day) => {
    const date = getDateForDay(day);
    const d = getDailyData(date);
    const sholatCount = Object.values(d.sholat).filter(Boolean).length;
    return {
      day: `H${day}`,
      sholat: sholatCount,
      tilawah: d.tilawah,
      puasa: d.puasa ? 1 : 0,
    };
  });

  // Filter only days with data
  const hasData = allData.some((d) => d.sholat > 0 || d.tilawah > 0);

  const totalPuasa = allData.filter((d) => d.puasa === 1).length;
  const totalTilawah = allData.reduce((a, d) => a + d.tilawah, 0);
  const avgSholat = (allData.reduce((a, d) => a + d.sholat, 0) / 30).toFixed(1);
  const streak = getStreak();

  const sholatData = allData.filter((_, i) => i < 30);
  const tilawahData = allData.filter((_, i) => i < 30);

  const puasaPieData = [
    { name: "Puasa", value: totalPuasa, color: "hsl(145, 35%, 35%)" },
    { name: "Tidak", value: 30 - totalPuasa, color: "hsl(145, 15%, 85%)" },
  ];

  return (
    <div className="pb-24 animate-fade-in px-4">
      <div className="pt-2 pb-4">
        <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: "Amiri, serif" }}>
          Statistik Ibadah
        </h2>
        <p className="text-muted-foreground text-sm">Ringkasan perjalanan Ramadhanmu</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {[
          { label: "Total Puasa", value: `${totalPuasa} hari`, icon: "🌙" },
          { label: "Total Tilawah", value: `${totalTilawah} hal`, icon: "📖" },
          { label: "Rata Sholat", value: `${avgSholat}/5`, icon: "🕌" },
          { label: "Streak Terbaik", value: `${streak} hari 🔥`, icon: "⚡" },
        ].map(({ label, value, icon }) => (
          <div key={label} className="glass-card rounded-2xl p-4">
            <p className="text-2xl mb-1">{icon}</p>
            <p className="text-xl font-bold text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      {!hasData && (
        <div className="glass-card rounded-3xl p-8 text-center mb-4">
          <p className="text-4xl mb-3">📊</p>
          <p className="text-foreground font-semibold" style={{ fontFamily: "Amiri, serif" }}>Belum Ada Data</p>
          <p className="text-muted-foreground text-sm mt-1">Mulai catat ibadahmu di Dashboard</p>
        </div>
      )}

      {hasData && (
        <>
          {/* Bar chart sholat */}
          <div className="glass-card rounded-3xl p-5 mb-4">
            <p className="section-title mb-4">Sholat per Hari</p>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={sholatData} barSize={6} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                <XAxis dataKey="day" tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} interval={4} />
                <YAxis tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} domain={[0, 5]} />
                <Tooltip
                  contentStyle={{ background: "hsl(var(--card))", border: "none", borderRadius: 12, fontSize: 12 }}
                  cursor={{ fill: "hsl(var(--muted))" }}
                />
                <Bar dataKey="sholat" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Line chart tilawah */}
          <div className="glass-card rounded-3xl p-5 mb-4">
            <p className="section-title mb-4">Tilawah per Hari (halaman)</p>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={tilawahData} margin={{ top: 0, right: 10, bottom: 0, left: -20 }}>
                <XAxis dataKey="day" tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} interval={4} />
                <YAxis tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip
                  contentStyle={{ background: "hsl(var(--card))", border: "none", borderRadius: 12, fontSize: 12 }}
                />
                <Line
                  type="monotone"
                  dataKey="tilawah"
                  stroke="hsl(var(--gold))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--gold))", r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Pie chart puasa */}
          <div className="glass-card rounded-3xl p-5 mb-4">
            <p className="section-title mb-4">Status Puasa (30 hari)</p>
            <div className="flex items-center gap-6">
              <ResponsiveContainer width={120} height={120}>
                <PieChart>
                  <Pie
                    data={puasaPieData}
                    cx={55}
                    cy={55}
                    innerRadius={35}
                    outerRadius={55}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                  >
                    {puasaPieData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3 flex-1">
                {puasaPieData.map(({ name, value, color }) => (
                  <div key={name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ background: color }} />
                      <span className="text-sm text-foreground">{name}</span>
                    </div>
                    <span className="font-bold text-foreground">{value}</span>
                  </div>
                ))}
                <p className="text-xs text-muted-foreground">
                  {Math.round((totalPuasa / 30) * 100)}% dari 30 hari
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
