export const Input = ({
  label,
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  required = false,
  helperText,
  icon: Icon,
  endAdornment,
  className = '',
  disabled = false,
  ...props
}) => {
  return (
    <div className="w-full space-y-1.5 text-left">
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-semibold uppercase tracking-wider text-[#102A2A]"
        >
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <div className="relative rounded-xl">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          required={required}
          className={`w-full bg-white text-[#102A2A] placeholder-slate-400 rounded-xl px-3.5 py-2.5 text-sm transition-all duration-200 border shadow-xs ${
            error
              ? 'border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
              : 'border-slate-200/90 hover:border-slate-300 focus:border-[#3B8F83] focus:ring-2 focus:ring-[#3B8F83]/20 focus:bg-white'
          } ${Icon ? 'pl-10' : ''} ${endAdornment ? 'pr-11' : ''} ${
            disabled ? 'opacity-60 cursor-not-allowed bg-slate-50' : ''
          } ${className} outline-none`}
          {...props}
        />
        {endAdornment && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {endAdornment}
          </div>
        )}
      </div>
      {error ? (
        <p className="text-xs text-rose-600 font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-slate-500">{helperText}</p>
      ) : null}
    </div>
  );
};

export default Input;
