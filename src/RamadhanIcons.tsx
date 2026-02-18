// Pure SVG Ramadhan-themed icons - no emoji, no icon library
import React from "react";

export const LanternIcon = ({ className = "", size = 32 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 64 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Top hook */}
    <path d="M32 4 Q32 0 28 0 Q24 0 24 4 L24 8 L40 8 L40 4 Q40 0 36 0 Q32 0 32 4Z" fill="currentColor" opacity="0.8"/>
    {/* Top cap */}
    <rect x="20" y="8" width="24" height="6" rx="3" fill="currentColor"/>
    {/* Lantern body */}
    <path d="M18 14 L46 14 L50 58 Q50 64 44 64 L20 64 Q14 64 14 58 Z" fill="currentColor" opacity="0.15"/>
    <path d="M18 14 L46 14 L50 58 Q50 64 44 64 L20 64 Q14 64 14 58 Z" stroke="currentColor" strokeWidth="2" fill="none"/>
    {/* Vertical bars */}
    <line x1="26" y1="14" x2="26" y2="64" stroke="currentColor" strokeWidth="1.5" opacity="0.6"/>
    <line x1="32" y1="14" x2="32" y2="64" stroke="currentColor" strokeWidth="1.5" opacity="0.6"/>
    <line x1="38" y1="14" x2="38" y2="64" stroke="currentColor" strokeWidth="1.5" opacity="0.6"/>
    {/* Horizontal bars */}
    <line x1="15" y1="30" x2="49" y2="30" stroke="currentColor" strokeWidth="1.5" opacity="0.6"/>
    <line x1="16" y1="46" x2="48" y2="46" stroke="currentColor" strokeWidth="1.5" opacity="0.6"/>
    {/* Inner glow / flame */}
    <ellipse cx="32" cy="40" rx="8" ry="10" fill="currentColor" opacity="0.2"/>
    <path d="M32 32 Q36 38 32 48 Q28 38 32 32Z" fill="currentColor" opacity="0.5"/>
    {/* Bottom cap */}
    <rect x="20" y="64" width="24" height="5" rx="2.5" fill="currentColor"/>
    {/* Bottom drip */}
    <path d="M29 69 Q32 76 35 69" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.6"/>
  </svg>
);

export const MoonStarIcon = ({ className = "", size = 32 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Crescent moon */}
    <path
      d="M38 8 A20 20 0 1 0 38 56 A14 14 0 1 1 38 8Z"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="1"
    />
    {/* Star 1 */}
    <path
      d="M50 12 L51.5 16.5 L56 16.5 L52.5 19.5 L54 24 L50 21 L46 24 L47.5 19.5 L44 16.5 L48.5 16.5 Z"
      fill="currentColor"
    />
    {/* Star 2 small */}
    <path
      d="M56 28 L57 31 L60 31 L57.5 33 L58.5 36 L56 34.5 L53.5 36 L54.5 33 L52 31 L55 31 Z"
      fill="currentColor"
      opacity="0.7"
    />
  </svg>
);

export const MosqueIcon = ({ className = "", size = 32 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 80 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Main dome */}
    <path d="M40 8 Q20 8 20 28 L60 28 Q60 8 40 8Z" fill="currentColor"/>
    {/* Main body */}
    <rect x="14" y="28" width="52" height="28" rx="2" fill="currentColor" opacity="0.9"/>
    {/* Door arch */}
    <path d="M34 56 L34 42 Q40 36 46 42 L46 56 Z" fill="none" stroke="currentColor" strokeWidth="1.5"/>
    {/* Side minarets */}
    <rect x="4" y="20" width="10" height="36" rx="3" fill="currentColor" opacity="0.8"/>
    <path d="M9 20 Q4 14 9 10 Q14 14 9 20Z" fill="currentColor"/>
    <rect x="66" y="20" width="10" height="36" rx="3" fill="currentColor" opacity="0.8"/>
    <path d="M71 20 Q66 14 71 10 Q76 14 71 20Z" fill="currentColor"/>
    {/* Windows */}
    <path d="M24 40 Q28 36 32 40 L32 48 L24 48 Z" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.6"/>
    <path d="M48 40 Q52 36 56 40 L56 48 L48 48 Z" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.6"/>
    {/* Ground line */}
    <line x1="0" y1="56" x2="80" y2="56" stroke="currentColor" strokeWidth="2" opacity="0.4"/>
  </svg>
);

export const StarIcon = ({ className = "", size = 16 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2 L14.5 9 L22 9 L16 13.5 L18.5 20.5 L12 16.5 L5.5 20.5 L8 13.5 L2 9 L9.5 9 Z"/>
  </svg>
);

export const CheckCircleIcon = ({ className = "" }: { className?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.15"/>
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
    <path d="M8 12 L11 15 L16 9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const LockIcon = ({ className = "" }: { className?: string }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="5" y="11" width="14" height="11" rx="2" stroke="currentColor" strokeWidth="2"/>
    <path d="M8 11V7a4 4 0 1 1 8 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const MenuIcon = ({ className = "" }: { className?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={className}>
    <line x1="4" y1="7" x2="20" y2="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="4" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="4" y1="17" x2="20" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const CloseIcon = ({ className = "" }: { className?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={className}>
    <line x1="5" y1="5" x2="19" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="19" y1="5" x2="5" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const PrayerBeadIcon = ({ className = "" }: { className?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="4" fill="currentColor"/>
    <circle cx="12" cy="4" r="2" fill="currentColor" opacity="0.5"/>
    <circle cx="12" cy="20" r="2" fill="currentColor" opacity="0.5"/>
    <circle cx="4" cy="12" r="2" fill="currentColor" opacity="0.5"/>
    <circle cx="20" cy="12" r="2" fill="currentColor" opacity="0.5"/>
  </svg>
);

export const BookIcon = ({ className = "" }: { className?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const HeartIcon = ({ className = "" }: { className?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

export const ChevronDownIcon = ({ className = "" }: { className?: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M6 9 L12 15 L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const SendIcon = ({ className = "" }: { className?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={className}>
    <line x1="22" y1="2" x2="11" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <polygon points="22 2 15 22 11 13 2 9 22 2" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.3" strokeLinejoin="round"/>
  </svg>
);

export const SunriseIcon = ({ className = "" }: { className?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M17 18a5 5 0 0 0-10 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="12" y1="2" x2="12" y2="9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="4.22" y1="10.22" x2="5.64" y2="11.64" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="1" y1="18" x2="3" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="21" y1="18" x2="23" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="18.36" y1="11.64" x2="19.78" y2="10.22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="23" y1="22" x2="1" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <polyline points="16 5 12 9 8 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const FireIcon = ({ className = "" }: { className?: string }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
  </svg>
);

export const UserIcon = ({ className = "" }: { className?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

export const BarChartIcon = ({ className = "" }: { className?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={className}>
    <line x1="18" y1="20" x2="18" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="12" y1="20" x2="12" y2="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="6" y1="20" x2="6" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const ChatIcon = ({ className = "" }: { className?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const ToolsIcon = ({ className = "" }: { className?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const HomeIcon = ({ className = "" }: { className?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={className}>
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="9 22 9 12 15 12 15 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const HistoryIcon = ({ className = "" }: { className?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={className}>
    <polyline points="1 4 1 10 7 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3.51 15a9 9 0 1 0 .49-4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="12 7 12 12 16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const InfoIcon = ({ className = "" }: { className?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
    <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const RefreshIcon = ({ className = "" }: { className?: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className={className}>
    <polyline points="23 4 23 10 17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const PlusIcon = ({ className = "" }: { className?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={className}>
    <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const MinusIcon = ({ className = "" }: { className?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={className}>
    <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const MoonIcon = ({ className = "" }: { className?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="currentColor" opacity="0.3"/>
  </svg>
);

export const BellIcon = ({ className = "" }: { className?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const LocationIcon = ({ className = "" }: { className?: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2"/>
    <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

export const WhatsAppIcon = ({ className = "", size = 20 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
  </svg>
);

export const CrescentMoonBg = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M140 30 A80 80 0 1 0 140 170 A56 56 0 1 1 140 30Z"
      fill="currentColor"
    />
    <path d="M148 20 L152 32 L164 32 L154 40 L158 52 L148 44 L138 52 L142 40 L132 32 L144 32 Z" fill="currentColor" opacity="0.6"/>
    <path d="M168 60 L170 66 L176 66 L171 70 L173 76 L168 72.5 L163 76 L165 70 L160 66 L166 66 Z" fill="currentColor" opacity="0.4"/>
  </svg>
);
