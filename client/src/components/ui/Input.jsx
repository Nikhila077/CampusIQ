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
          className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
        >
          {label} {required && <span className="text-red-400">*</span>}
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
          className={`w-full bg-slate-900/90 text-slate-100 placeholder-slate-500 rounded-xl px-3.5 py-2.5 text-sm transition-all duration-200 border ${
            error
              ? 'border-red-500/80 focus:ring-2 focus:ring-red-500/30 focus:border-red-500'
              : 'border-slate-800 hover:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
          } ${Icon ? 'pl-10' : ''} ${endAdornment ? 'pr-11' : ''} ${
            disabled ? 'opacity-50 cursor-not-allowed' : ''
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
        <p className="text-xs text-red-400 font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-slate-500">{helperText}</p>
      ) : null}
    </div>
  );
};

export default Input;
