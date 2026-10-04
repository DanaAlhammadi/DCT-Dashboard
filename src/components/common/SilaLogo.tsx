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
      className="relative flex items-center justify-center shrink-0 rounded-xl bg-[#0A2E4D] shadow-md border border-[#D4AF37]/30"
      style={{ width: iconSize, height: iconSize }}
    >
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-[82%] h-[82%]"
      >
        <defs>
          <linearGradient id="sila-path-brand" x1="6" y1="32" x2="34" y2="8" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0E6B6E" />
            <stop offset="1" stopColor="#D4AF37" />
          </linearGradient>
        </defs>

        {/* Continuous Flow Trajectory (Data to decision connection) */}
        <path
          d="M8 30 C 14 24, 18 14, 26 12"
          stroke="url(#sila-path-brand)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Intertwined Bridge Arch */}
        <path
          d="M26 12 C 33 10, 35 18, 30 24 C 25 28, 18 29, 13 30"
          stroke="#D4AF37"
          strokeWidth="2"
          strokeLinecap="round"
          strokeOpacity="0.8"
        />

        {/* Origin Node */}
        <circle cx="8" cy="30" r="2.5" fill="#0E6B6E" />
        <circle cx="8" cy="30" r="1.2" fill="#F4F1EA" />

        {/* Apex Decision Node */}
        <circle cx="26" cy="12" r="3" fill="#D4AF37" />
        <circle cx="26" cy="12" r="1.5" fill="#0A2E4D" />

        {/* Institutional Stay Node */}
        <rect x="27.5" y="22" width="6" height="7" rx="1.5" fill="#F4F1EA" />
        <rect x="29" y="24" width="1.2" height="1.5" rx="0.3" fill="#0A2E4D" />
        <rect x="31" y="24" width="1.2" height="1.5" rx="0.3" fill="#0A2E4D" />
        <rect x="29.5" y="26.5" width="2" height="2.5" fill="#0E6B6E" />
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
            } ${light ? 'text-white' : 'text-[#0A2E4D]'}`}
          >
            SILA
          </span>
          <span
            className={`font-bold font-sans ${light ? 'text-[#D4AF37]' : 'text-[#0E6B6E]'} select-none ${
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
                light ? 'text-white/80' : 'text-[#0A2E4D]/70'
              }`}
            >
              Flight-to-Hotel Decision Intelligence
            </span>
            <span
              className={`hidden xl:inline text-[10.5px] font-sans ${
                light ? 'text-[#D4AF37]' : 'text-[#0E6B6E]'
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
              light ? 'text-white/60' : 'text-[#0A2E4D]/60'
            }`}
          >
            From flights to stays. From data to decisions.
          </p>
        )}
      </div>
    </div>
  );
};
