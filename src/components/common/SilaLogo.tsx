import React from 'react';

interface Props {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'full' | 'compact' | 'horizontal';
  showSubtitle?: boolean;
  showTagline?: boolean;
  light?: boolean;
}

export const SilaLogo: React.FC<Props> = ({
  className = '',
  size = 'md',
  variant = 'horizontal',
  showSubtitle = true,
  showTagline = false,
  light = true,
}) => {
  const iconSize = size === 'lg' ? 44 : size === 'sm' ? 28 : 36;

  // Icon symbol: Two connected flowing paths / linked nodes uniting flight and lodging (SILA = connection)
  const IconSymbol = (
    <div
      className="relative flex items-center justify-center shrink-0 rounded-xl bg-gradient-to-br from-teal-500 via-teal-700 to-slate-900 shadow-md ring-1 ring-white/20"
      style={{ width: iconSize, height: iconSize }}
    >
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-[82%] h-[82%]"
      >
        <defs>
          {/* Gradients matching midnight navy, turquoise, and desert gold / warm sand */}
          <linearGradient id="sila-path-flight" x1="6" y1="32" x2="34" y2="8" gradientUnits="userSpaceOnUse">
            <stop stopColor="#38bdf8" />
            <stop offset="0.5" stopColor="#2dd4bf" />
            <stop offset="1" stopColor="#fbbf24" />
          </linearGradient>
          <linearGradient id="sila-path-hotel" x1="34" y1="8" x2="10" y2="32" gradientUnits="userSpaceOnUse">
            <stop stopColor="#f59e0b" />
            <stop offset="0.6" stopColor="#14b8a6" />
            <stop offset="1" stopColor="#0f766e" />
          </linearGradient>
        </defs>

        {/* Flight Trajectory Arc (Left-to-Right ascending flight path) */}
        <path
          d="M7 31 C 12 25, 17 14, 25 11"
          stroke="url(#sila-path-flight)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Connection Link / Ligature Arch (The SILA "صِلَة" connection) */}
        <path
          d="M25 11 C 32 8, 35 15, 30 22 C 26 27, 19 28, 14 30"
          stroke="url(#sila-path-hotel)"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeDasharray="0.5 0.5"
        />

        {/* Flight Origin Node (Aircraft departure) */}
        <circle cx="7" cy="31" r="2.5" fill="#38bdf8" />
        <circle cx="7" cy="31" r="1.2" fill="#ffffff" />

        {/* Dynamic Flight Node / Aircraft glyph */}
        <path
          d="M24 8 L27 12 L22 13 Z"
          fill="#fbbf24"
        />

        {/* Central Intersection Link (SILA core node) */}
        <circle cx="25" cy="11" r="3" fill="#2dd4bf" />
        <circle cx="25" cy="11" r="1.5" fill="#0f172a" />

        {/* Destination Hotel / Stay Node (Lodging anchor) */}
        <rect x="27.5" y="22" width="6" height="7" rx="1.5" fill="#f8fafc" />
        <rect x="29" y="24" width="1.2" height="1.5" rx="0.3" fill="#0f766e" />
        <rect x="31" y="24" width="1.2" height="1.5" rx="0.3" fill="#0f766e" />
        <rect x="29.5" y="26.5" width="2" height="2.5" fill="#0f766e" />

        {/* Flow connection trail */}
        <path
          d="M13 29 C 18 29, 23 27, 28 25"
          stroke="#ffffff"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeOpacity="0.7"
        />
      </svg>
    </div>
  );

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {IconSymbol}

      <div className="flex flex-col">
        {/* Compact bilingual brand lockup */}
        <div className="flex items-baseline gap-2">
          <span
            className={`font-black tracking-tight font-display ${
              size === 'lg' ? 'text-2xl' : size === 'sm' ? 'text-base' : 'text-xl'
            } ${light ? 'text-white' : 'text-slate-900'}`}
          >
            SILA
          </span>
          <span
            className={`font-bold font-sans text-teal-400 select-none ${
              size === 'lg' ? 'text-lg' : size === 'sm' ? 'text-xs' : 'text-sm'
            }`}
            dir="rtl"
            lang="ar"
            title="صِلَة: رابط وانسجام بين الطيران والفنادق"
          >
            صِلَة
          </span>
        </div>

        {/* Product Subtitle */}
        {showSubtitle && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={`text-[11px] leading-tight font-medium ${
                light ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              Flight-to-Hotel Decision Intelligence
            </span>
            <span
              className={`hidden xl:inline text-[10.5px] font-sans ${
                light ? 'text-teal-300/80' : 'text-teal-700'
              }`}
              dir="rtl"
              lang="ar"
            >
              منصة ذكاء ربط الرحلات بالطلب الفندقي
            </span>
          </div>
        )}

        {/* Primary Tagline */}
        {showTagline && (
          <p
            className={`text-[10px] mt-0.5 tracking-wide leading-tight ${
              light ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            From flights to stays. From data to decisions.
          </p>
        )}
      </div>
    </div>
  );
};
