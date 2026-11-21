import React from 'react';

interface BrandLogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
}

export const BrandCrestSvg: React.FC<{
  className?: string;
  primaryColor?: string;
  accentColor?: string;
}> = ({
  className = 'w-8 h-8',
  primaryColor = '#0F172A',
  accentColor = '#10B981',
}) => (
  <svg
    viewBox="0 0 64 56"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Left & Right Symmetrical Twin-Wing Shield Crest with Lightning Core */}
    <path
      d="M4 10L29 19V44C21.5 39.5 14 33.5 10.5 27L4 10Z"
      fill={primaryColor}
    />
    <path
      d="M60 10L35 19V44C42.5 39.5 50 33.5 53.5 27L60 10Z"
      fill={primaryColor}
    />
    {/* Emerald Wing Highlights */}
    <path
      d="M6 12.5L26 19.8V24.2L9.5 18.2L6 12.5Z"
      fill={accentColor}
    />
    <path
      d="M58 12.5L38 19.8V24.2L54.5 18.2L58 12.5Z"
      fill={accentColor}
    />
    {/* Geometric G & S Inner Cutouts */}
    <path
      d="M15 22.5L26 26.5V34.5L19 30.5L15 22.5Z"
      fill="#FFFFFF"
      fillOpacity="0.92"
    />
    <path
      d="M49 22.5L38 26.5V34.5L45 30.5L49 22.5Z"
      fill="#FFFFFF"
      fillOpacity="0.92"
    />
    {/* Central Speed Lightning Bolt */}
    <path
      d="M33.8 18L26.5 34.5H31.8L29.2 51L38.5 31.5H33L33.8 18Z"
      fill={accentColor}
    />
  </svg>
);

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'light',
  size = 'md',
  showTagline = false,
  className = '',
}) => {
  const isDarkBg = variant === 'dark';

  const iconSizes = {
    sm: 'w-7 h-6',
    md: 'w-9 h-8',
    lg: 'w-11 h-10',
  }[size];

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg md:text-xl',
    lg: 'text-xl md:text-2xl',
  }[size];

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <BrandCrestSvg
        className={`${iconSizes} shrink-0`}
        primaryColor={isDarkBg ? '#F8FAFC' : '#0F172A'}
        accentColor={isDarkBg ? '#34D399' : '#059669'}
      />
      <div className="leading-none">
        <div
          className={`font-display font-bold tracking-tight uppercase whitespace-nowrap ${textSizes} ${
            isDarkBg ? 'text-white' : 'text-slate-950'
          }`}
        >
          <span>GEMINI </span>
          <span className={isDarkBg ? 'text-emerald-400' : 'text-emerald-600'}>
            SPORTS
          </span>
        </div>
        {showTagline && (
          <div
            className={`mt-0.5 text-[10px] font-medium tracking-[0.14em] uppercase whitespace-nowrap ${
              isDarkBg ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            Sportswear &amp; Streetwear Mfg.
          </div>
        )}
      </div>
    </div>
  );
};
