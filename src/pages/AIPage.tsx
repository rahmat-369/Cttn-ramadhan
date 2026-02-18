import React, { useState, useEffect, useRef } from "react";
import { LanternIcon, MoonStarIcon, SendIcon } from "@/components/RamadhanIcons";
import {
  getProfile, getChatHistory, saveChatHistory,
  getAiUsageToday, incrementAiUsage, getDailyData, getTodayKey, computeProgress
} from "@/lib/storage";

interface Message {
  role: "user" | "ai";
  content: string;
  time: string;
}

const AI_LIMIT = 30;

async function fetchAI(message: string): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);
  try {
    const encoded = encodeURIComponent(message);
    const res = await fetch(`https://api-faa.my.id/faa/ai-realtime?text=${encoded}`, {
      signal: controller.signal,
    });
    clearTimeout(timer);
    const json = await res.json();
    if (json.status && json.result) return json.result;
    return "Mohon maaf, Lantern sedang tidak dapat menjawab saat ini. Semoga Allah mudahkan ibadahmu hari ini 🌙";
  } catch {
    return "Koneksi terputus. Semoga Allah selalu membimbing langkahmu di bulan Ramadhan yang mulia ini 🌙";
  }
}

// Generate contextual greeting based on current time
function getTimeGreeting(name: string): string {
  const hour = new Date().getHours();
  const displayName = name || "Saudaraku";

  // Sahur time: 01:00 - 04:30
  if (hour >= 1 && hour < 5) {
    return `Assalamu'alaikum, ${displayName} 🌙\n\nMasih terjaga di waktu sahur? Alhamdulillah, ini waktu yang penuh berkah. Bagaimana? Apakah sudah sahur tuan? Jangan lupa makan yang cukup agar kuat berpuasa seharian. Ada yang ingin kamu ceritakan atau tanyakan?`;
  }

  // Subuh & pagi: 04:30 - 11:00
  if (hour >= 5 && hour < 11) {
    return `Assalamu'alaikum, ${displayName} 🌤️\n\nSelamat pagi! Semoga Subuhmu tadi berjalan khusyuk. Semangat menjalani hari pertama puasa Ramadhan. Ada yang ingin kamu ceritakan di pagi yang penuh berkah ini?`;
  }

  // Menjelang dzuhur hingga ashar: 11:00 - 15:30
  if (hour >= 11 && hour < 16) {
    return `Assalamu'alaikum, ${displayName} ☀️\n\nBagaimana puasanya wahai hamba Allah yang mulia? Semoga tetap kuat dan istiqomah. Tinggal beberapa jam lagi menuju buka puasa. InsyaAllah kamu pasti bisa! Ada yang ingin kamu tanyakan atau ceritakan?`;
  }

  // Sore menjelang Maghrib: 15:30 - 18:30
  if (hour >= 16 && hour < 19) {
    return `Assalamu'alaikum, ${displayName} 🌅\n\nSebentar lagi waktu berbuka! Alhamdulillah sudah hampir sehari penuh berpuasa. Semoga segala ibadahmu hari ini diterima Allah SWT. Sudah siapkan takjil belum? Ada yang ingin kamu ceritakan?`;
  }

  // Waktu berbuka - Isya: 18:30 - 20:30
  if (hour >= 19 && hour < 21) {
    return `Assalamu'alaikum, ${displayName} 🌙\n\nAlhamdulillah, sudah berbuka! Bagaimana berbuka hari ini, nikmat bukan? Semoga puasamu diterima Allah SWT. Setelah ini jangan lupa sholat Isya dan Terawih ya. Ada yang ingin kamu ceritakan?`;
  }

  // Waktu Terawih & malam: 20:30 - 01:00
  return `Assalamu'alaikum, ${displayName} ✨\n\nMalam Ramadhan yang penuh berkah! Sudah sholat Terawih malam ini? Jangan lupa lanjutkan dengan tadarus Al-Qur'an. Ini waktu terbaik untuk bermunajat kepada Allah. Ada yang ingin kamu ceritakan atau renungkan malam ini?`;
}

export default function AIPage() {
  const profile = getProfile();
  const todayData = getDailyData(getTodayKey());
  const progress = computeProgress(todayData);
  const sholatDone = Object.values(todayData.sholat).filter(Boolean).length;

  const [messages, setMessages] = useState<Message[]>(() => {
    const history = getChatHistory();
    if (history.length > 0) return history;
    // Opening message based on time of day
    return [{
      role: "ai",
      content: getTimeGreeting(profile?.name || ""),
      time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    }];
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [usage, setUsage] = useState(() => getAiUsageToday());
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading || usage >= AI_LIMIT) return;

    const userMsg: Message = {
      role: "user",
      content: text,
      time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    };

    setInput("");
    setLoading(true);

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);

    // Add context
    const ramadhanDay = localStorage.getItem("ramadhan_start_date")
      ? Math.floor((Date.now() - new Date(localStorage.getItem("ramadhan_start_date")!).getTime()) / 86400000) + 1
      : null;

    const context = `[Konteks: ${ramadhanDay ? `Ramadhan hari ke-${ramadhanDay}. ` : ""}User menyelesaikan ${sholatDone} dari 5 sholat wajib dan membaca ${todayData.tilawah} halaman Al-Qur'an hari ini. Progress ibadah ${progress}%.] `;

    const aiReply = await fetchAI(context + text);
    incrementAiUsage();
    setUsage(getAiUsageToday());

    const aiMsg: Message = {
      role: "ai",
      content: aiReply,
      time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    };

    const finalMessages = [...newMessages, aiMsg];
    setMessages(finalMessages);
    saveChatHistory(finalMessages);
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen pb-20 animate-fade-in">
      {/* Header */}
      <div className="px-4 pt-2 pb-4">
        <div className="flex items-center gap-3 glass-card rounded-2xl p-4">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-primary-foreground"
            style={{ background: "var(--gradient-green)" }}>
            <LanternIcon size={22} className="text-gold" />
          </div>
          <div>
            <h2 className="font-bold text-foreground" style={{ fontFamily: "Amiri, serif" }}>
              Ngobrol dengan Lantern
            </h2>
            <p className="text-xs text-muted-foreground">Teman refleksi Ramadhanmu · {AI_LIMIT - usage} percakapan tersisa</p>
          </div>
          <div className="ml-auto">
            <div className={`w-2 h-2 rounded-full ${usage < AI_LIMIT ? "bg-primary animate-pulse" : "bg-muted"}`} />
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 space-y-3 pb-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}>
            {msg.role === "ai" && (
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mr-2 mt-1"
                style={{ background: "var(--gradient-green)" }}>
                <MoonStarIcon size={16} className="text-gold" />
              </div>
            )}
            <div className={msg.role === "user" ? "chat-bubble-user" : "chat-bubble-ai"}>
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              <p className={`text-xs mt-1 ${msg.role === "user" ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                {msg.time}
              </p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start animate-fade-in">
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mr-2"
              style={{ background: "var(--gradient-green)" }}>
              <MoonStarIcon size={16} className="text-gold" />
            </div>
            <div className="chat-bubble-ai">
              <div className="flex gap-1.5 items-center h-5">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="fixed bottom-16 left-0 right-0 px-4 pb-2">
        <div className="max-w-md mx-auto">
          {usage >= AI_LIMIT ? (
            <div className="glass-card rounded-2xl p-4 text-center">
              <p className="text-sm text-muted-foreground">Batas 30 percakapan hari ini tercapai.</p>
              <p className="text-xs text-muted-foreground mt-1">Besok kamu bisa ngobrol lagi 🌙</p>
            </div>
          ) : (
            <div className="glass-card rounded-2xl flex items-end gap-2 p-3">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Tulis pesanmu..."
                rows={1}
                className="flex-1 bg-transparent text-foreground text-sm placeholder:text-muted-foreground outline-none resize-none"
                style={{ maxHeight: "100px" }}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-primary-foreground transition-all disabled:opacity-40 active:scale-95"
                style={{ background: "var(--gradient-green)" }}
              >
                <SendIcon />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
