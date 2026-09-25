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
      'bg-[#3B8F83] hover:bg-[#327a70] text-white shadow-xs focus:ring-[#3B8F83] border border-[#3B8F83]/40',
    secondary:
      'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 focus:ring-slate-400 shadow-xs',
    outline:
      'border border-[#3B8F83] text-[#3B8F83] hover:bg-teal-50 focus:ring-[#3B8F83]',
    ghost:
      'text-slate-700 hover:text-slate-950 hover:bg-slate-100 focus:ring-slate-300',
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
