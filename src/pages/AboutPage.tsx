import React from "react";
import { WhatsAppIcon, MosqueIcon } from "@/components/RamadhanIcons";

export default function AboutPage() {
  return (
    <div className="pb-24 animate-fade-in px-4">
      <div className="pt-2 pb-4">
        <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: "Amiri, serif" }}>Tentang Developer</h2>
      </div>
      <div className="glass-card rounded-3xl p-6 text-center mb-4">
        <img
          src="https://i.top4top.io/p_3698bfuyh0.png"
          alt="Rahmat Dev"
          className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-4 border-gold"
          style={{ boxShadow: "var(--shadow-gold)" }}
          onError={(e) => { (e.target as HTMLImageElement).src = ""; }}
        />
        <h3 className="text-xl font-bold text-foreground" style={{ fontFamily: "Amiri, serif" }}>Rahmat Dev</h3>
        <p className="text-muted-foreground text-sm">Mobile Web Developer</p>
        <p className="text-xs text-muted-foreground mt-1">Creator of Ramadhan Lantern · v1.0.0 – 2026</p>

        <div className="mt-4 p-4 rounded-2xl bg-secondary/50 text-left">
          <p className="text-sm text-foreground leading-relaxed">
            Ramadhan Lantern adalah jurnal ibadah digital berbasis web yang membantu konsistensi dan refleksi selama bulan Ramadhan tanpa gamifikasi dan tanpa distraksi sosial.
          </p>
        </div>

        <a
          href="https://whatsapp.com/channel/0029VbBjyjlJ93wa6hwSWa0p"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-primary-foreground font-semibold transition-all active:scale-95"
          style={{ background: "linear-gradient(135deg, hsl(142,70%,35%) 0%, hsl(145,50%,25%) 100%)" }}
        >
          <WhatsAppIcon />
          Join Saluran WhatsApp Developer
        </a>
      </div>

      <div className="glass-card rounded-3xl p-5">
        <p className="section-title mb-3">Channel Developer</p>
        <p className="text-sm text-muted-foreground font-mono break-all">✧･ﾟ: [𝙍]𝙝𝙢𝙏 | 𝘾𝙤𝙙𝙚⚙️𝘼𝙄 𝙡 :･ﾟ✧</p>
      </div>
    </div>
  );
}
