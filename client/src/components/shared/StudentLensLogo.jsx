import { useState } from 'react';

export const StudentLensIcon = ({ className = 'w-8 h-8', ...props }) => {
  const [imgError, setImgError] = useState(false);

  if (!imgError) {
    return (
      <img
        src="/brand/studentlens-icon.png"
        alt="StudentLens"
        onError={() => setImgError(true)}
        className={`object-contain shrink-0 rounded-xl ${className}`}
        {...props}
      />
    );
  }

  // High-fidelity vector fallback
  return (
    <div className={`relative flex items-center justify-center rounded-xl bg-[#102A2A] shadow-sm shrink-0 overflow-hidden ${className}`} {...props}>
      <svg viewBox="0 0 100 100" fill="none" className="w-full h-full p-1.5">
        <circle cx="50" cy="50" r="32" stroke="#3B8F83" strokeWidth="6" strokeLinecap="round" strokeDasharray="145 25" />
        <circle cx="50" cy="50" r="21" fill="#E8F5F2" fillOpacity="0.25" stroke="#E8F5F2" strokeWidth="2.5" />
        <path d="M42 36C47 36 53 40 50 50C47 60 53 64 58 64" stroke="#3B8F83" strokeWidth="5.5" strokeLinecap="round" />
        <circle cx="50" cy="50" r="5" fill="#3B8F83" />
        <circle cx="50" cy="50" r="2" fill="#FFFFFF" />
      </svg>
    </div>
  );
};

export const StudentLensLogo = ({
  variant = 'full', // 'full' | 'icon'
  className = '',
  iconClassName = 'w-8 h-8',
  textClassName = '',
  showTagline = false,
  theme = 'auto', // 'auto' | 'light' | 'dark'
  ...props
}) => {
  if (variant === 'icon') {
    return <StudentLensIcon className={`${iconClassName} ${className}`} {...props} />;
  }

  const isDark = theme === 'dark';

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`} {...props}>
      <StudentLensIcon className={iconClassName} />
      <div className="flex flex-col text-left">
        <div className={`text-xl font-bold tracking-tight leading-none ${isDark ? 'text-white' : 'text-[#102A2A]'} ${textClassName}`}>
          Student<span className="text-[#3B8F83]">Lens</span>
        </div>
        {showTagline && (
          <span className="text-[9px] font-semibold tracking-wider uppercase text-slate-500 mt-1">
            Decision-Support Platform
          </span>
        )}
      </div>
    </div>
  );
};

export default StudentLensLogo;
