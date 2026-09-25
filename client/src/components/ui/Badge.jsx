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
    teal: 'bg-teal-50 text-[#3B8F83] border-teal-200'
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

export default Badge;
