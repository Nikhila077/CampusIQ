import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  onClick,
  ...props
}) => {
  const baseStyles =
    'relative inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-60 disabled:cursor-not-allowed select-none rounded-xl active:scale-[0.98]';

  const variants = {
    primary:
      'bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 focus:ring-indigo-500 border border-indigo-400/30',
    secondary:
      'bg-slate-800/80 hover:bg-slate-700/80 text-slate-100 border border-slate-700 hover:border-slate-600 focus:ring-slate-500 shadow-sm',
    outline:
      'border border-indigo-500/40 hover:border-indigo-400 text-indigo-300 hover:text-white hover:bg-indigo-950/50 focus:ring-indigo-500',
    ghost:
      'text-slate-300 hover:text-white hover:bg-slate-800/60 focus:ring-slate-600',
    danger:
      'bg-red-600 hover:bg-red-500 text-white focus:ring-red-500 shadow-md shadow-red-600/25'
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 rounded-lg gap-1.5',
    md: 'text-sm px-4 py-2.5 rounded-xl gap-2',
    lg: 'text-base px-6 py-3 rounded-xl gap-2.5'
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {isLoading && (
        <Loader2 className="w-4 h-4 animate-spin text-current shrink-0" />
      )}
      {children}
    </button>
  );
};

export default Button;
