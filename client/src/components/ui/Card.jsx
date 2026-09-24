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
      className={`relative rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl p-6 transition-all duration-200 ${
        glow ? 'shadow-xl shadow-indigo-500/5 hover:border-slate-700' : ''
      } ${className}`}
    >
      {(title || subtitle || action) && (
        <div className="flex items-start justify-between gap-4 mb-5 pb-4 border-b border-slate-800/60">
          <div>
            {title && <h3 className="text-lg font-semibold text-slate-100 tracking-tight">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
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
    default: 'bg-slate-800 text-slate-300 border-slate-700',
    primary: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    danger: 'bg-red-500/10 text-red-400 border-red-500/30',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/30'
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
