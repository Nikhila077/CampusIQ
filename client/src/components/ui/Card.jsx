export const Card = ({
  children,
  className = '',
  title,
  subtitle,
  action,
  glow = false
}) => {
  return (
    <div
      className={`relative rounded-2xl border border-slate-200/90 bg-white p-6 transition-all duration-200 shadow-xs ${
        glow ? 'hover:border-[#3B8F83]/50' : ''
      } ${className}`}
    >
      {(title || subtitle || action) && (
        <div className="flex items-start justify-between gap-4 mb-5 pb-4 border-b border-slate-100">
          <div>
            {title && <h3 className="text-lg font-bold text-[#102A2A] tracking-tight">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-600 mt-0.5">{subtitle}</p>}
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
    default: 'bg-slate-100 text-slate-800 border-slate-200',
    primary: 'bg-teal-50 text-teal-950 border-teal-200',
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    warning: 'bg-teal-50/80 text-teal-900 border-teal-300',
    danger: 'bg-red-50 text-red-800 border-red-200',
    purple: 'bg-teal-50 text-[#3B8F83] border-teal-200'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
        variants[variant] || variants.default
      } ${className}`}
    >
      {children}
    </span>
  );
};

export default Card;
