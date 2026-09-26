import React from 'react';

interface AppLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  subtitle?: string;
}

export const AppLogo: React.FC<AppLogoProps> = ({
  className = '',
  size = 'md',
  showText = false,
  subtitle,
}) => {
  const sizeMap = {
    xs: 'w-7 h-7',
    sm: 'w-9 h-9',
    md: 'w-11 h-11',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  const imgSize = sizeMap[size] || sizeMap.md;

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className={`${imgSize} shrink-0 drop-shadow-md flex items-center justify-center`}>
        <img
          src="/logo.svg"
          alt="Expense Buddy Logo"
          className="w-full h-full object-contain pointer-events-none select-none"
        />
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className="text-base sm:text-lg font-extrabold text-white tracking-tight leading-tight">
            Expense Buddy
          </span>
          {subtitle && (
            <span className="text-[10px] text-emerald-400 font-semibold tracking-wider uppercase">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
