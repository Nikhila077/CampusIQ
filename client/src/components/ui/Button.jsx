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
    'relative inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white disabled:opacity-50 disabled:cursor-not-allowed select-none rounded-xl cursor-pointer active:scale-[0.98] active:translate-y-0';

  const variants = {
    primary:
      'bg-[#3B8F83] hover:bg-[#327a70] text-white shadow-sm hover:shadow-md hover:-translate-y-0.5 focus:ring-[#3B8F83] border border-[#3B8F83]/30',
    secondary:
      'bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/90 hover:border-slate-300 focus:ring-slate-300 shadow-xs hover:shadow-sm hover:-translate-y-0.5',
    outline:
      'bg-transparent border border-[#3B8F83] text-[#3B8F83] hover:bg-[#E8F5F2] hover:border-[#327a70] focus:ring-[#3B8F83] hover:-translate-y-0.5 shadow-xs',
    ghost:
      'bg-transparent text-slate-700 hover:text-[#102A2A] hover:bg-slate-100/80 focus:ring-slate-300',
    danger:
      'bg-rose-600 hover:bg-rose-500 text-white focus:ring-rose-500 shadow-sm hover:shadow-md hover:-translate-y-0.5 border border-rose-700/20'
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
