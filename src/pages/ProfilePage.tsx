import React, { useState, useRef } from "react";
import { getProfile, saveProfile, type UserProfile } from "@/lib/storage";
import { UserIcon } from "@/components/RamadhanIcons";

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>(() => getProfile() || { name: "", bio: "", goals: "" });
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(profile);
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("Foto maksimal 2MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const b64 = reader.result as string;
      const updated = { ...draft, photo: b64 };
      setDraft(updated);
      setProfile(updated);
      saveProfile(updated);
    };
    reader.readAsDataURL(file);
  };

  const initials = profile.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleSave = () => {
    if (draft.name.trim().length < 2) return;
    const updated = { ...draft, name: draft.name.trim() };
    setProfile(updated);
    saveProfile(updated);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="pb-24 animate-fade-in px-4">
      <div className="pt-2 pb-4">
        <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: "Amiri, serif" }}>
          Profil
        </h2>
        <p className="text-muted-foreground text-sm">Identitas perjalanan Ramadhanmu</p>
      </div>

      {/* Profile card */}
      <div className="glass-card rounded-3xl p-6 mb-4 text-center">
        {/* Avatar */}
        <div className="relative inline-block mb-4">
          <div
            className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center text-primary-foreground text-2xl font-bold cursor-pointer"
            style={!profile.photo ? { background: "var(--gradient-green)" } : {}}
            onClick={() => fileRef.current?.click()}
          >
            {profile.photo ? (
              <img src={profile.photo} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span>{initials || "M"}</span>
            )}
          </div>
          <button
            onClick={() => fileRef.current?.click()}
            className="absolute bottom-0 right-0 w-8 h-8 rounded-full text-primary-foreground flex items-center justify-center"
            style={{ background: "var(--gradient-gold)" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2"/>
              <circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
        </div>

        {!editing ? (
          <>
            <h3 className="text-xl font-bold text-foreground" style={{ fontFamily: "Amiri, serif" }}>
              {profile.name || "Musafir Ramadhan"}
            </h3>
            {profile.bio && <p className="text-muted-foreground text-sm mt-1">{profile.bio}</p>}
            {profile.goals && (
              <div className="mt-3 p-3 rounded-2xl bg-secondary/50 text-left">
                <p className="text-xs text-muted-foreground mb-1">Target Ramadhan</p>
                <p className="text-sm text-foreground">{profile.goals}</p>
              </div>
            )}
            <button
              onClick={() => { setDraft(profile); setEditing(true); }}
              className="mt-4 px-6 py-2.5 rounded-2xl text-sm font-semibold text-primary-foreground transition-all active:scale-95"
              style={{ background: "var(--gradient-green)" }}
            >
              Edit Profil
            </button>
          </>
        ) : (
          <div className="space-y-3 text-left">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Nama</label>
              <input
                type="text"
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border bg-card text-foreground outline-none focus:border-primary transition-colors"
                maxLength={30}
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Bio</label>
              <textarea
                value={draft.bio}
                onChange={(e) => setDraft({ ...draft, bio: e.target.value })}
                placeholder="Ceritakan sedikit tentang dirimu..."
                rows={2}
                className="w-full px-4 py-2.5 rounded-xl border bg-card text-foreground text-sm outline-none focus:border-primary resize-none transition-colors"
                maxLength={100}
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Target Ramadhan</label>
              <textarea
                value={draft.goals}
                onChange={(e) => setDraft({ ...draft, goals: e.target.value })}
                placeholder="Apa targetmu di Ramadhan ini?"
                rows={2}
                className="w-full px-4 py-2.5 rounded-xl border bg-card text-foreground text-sm outline-none focus:border-primary resize-none transition-colors"
                maxLength={150}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setEditing(false)}
                className="flex-1 py-2.5 rounded-xl bg-muted text-foreground font-medium text-sm"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                disabled={draft.name.trim().length < 2}
                className="flex-1 py-2.5 rounded-xl text-primary-foreground font-medium text-sm disabled:opacity-50"
                style={{ background: "var(--gradient-green)" }}
              >
                Simpan
              </button>
            </div>
          </div>
        )}

        {saved && (
          <div className="mt-3 text-sm text-primary font-medium animate-fade-in">
            ✓ Profil tersimpan!
          </div>
        )}

        {/* Remove photo */}
        {profile.photo && !editing && (
          <button
            onClick={() => {
              const updated = { ...profile, photo: undefined };
              setProfile(updated);
              saveProfile(updated);
            }}
            className="mt-2 text-xs text-muted-foreground hover:text-destructive transition-colors"
          >
            Hapus foto
          </button>
        )}
      </div>

      {/* Stats quick view */}
      <div className="glass-card rounded-3xl p-5">
        <p className="section-title mb-3">Ringkasan Profil</p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between py-2 border-b border-border">
            <span className="text-muted-foreground">Nama</span>
            <span className="font-medium text-foreground">{profile.name || "-"}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border">
            <span className="text-muted-foreground">Versi App</span>
            <span className="font-medium text-foreground">v1.0.0</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-muted-foreground">Data Tersimpan Di</span>
            <span className="font-medium text-foreground">Perangkat Ini</span>
          </div>
        </div>
      </div>
    </div>
  );
}
