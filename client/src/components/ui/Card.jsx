export const Card = ({
  children,
  className = '',
  title,
  subtitle,
  action,
  glow = false,
  interactive = false
}) => {
  return (
    <div
      className={`relative rounded-2xl border border-slate-200/90 bg-white p-6 transition-all duration-200 shadow-xs ${
        interactive ? 'card-lift' : ''
      } ${
        glow ? 'hover:border-[#3B8F83]/50 hover:shadow-md hover:shadow-[#3B8F83]/5' : ''
      } ${className}`}
    >
      {(title || subtitle || action) && (
        <div className="flex items-start justify-between gap-4 mb-5 pb-4 border-b border-slate-100">
          <div>
            {title && <h3 className="text-lg font-bold text-[#102A2A] tracking-tight">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-500 mt-0.5 font-normal leading-relaxed">{subtitle}</p>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

export const Badge = ({
  children,
  variant = 'default',
  className = ''
}) => {
  const variants = {
    default: 'bg-slate-100 text-slate-700 border-slate-200',
    primary: 'bg-teal-50 text-[#3B8F83] border-teal-200/80 font-semibold',
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200/80 font-semibold',
    warning: 'bg-amber-50 text-amber-800 border-amber-200/80 font-semibold',
    danger: 'bg-rose-50 text-rose-800 border-rose-200/80 font-semibold',
    teal: 'bg-[#E8F5F2] text-[#3B8F83] border-teal-200 font-semibold'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors ${
        variants[variant] || variants.default
      } ${className}`}
    >
      {children}
    </span>
  );
};

export default Card;
