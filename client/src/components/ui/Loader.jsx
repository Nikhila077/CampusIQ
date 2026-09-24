import { Loader2 } from 'lucide-react';

export const Loader = ({ size = 'md', text = 'Loading...' }) => {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="relative">
        <div className="absolute inset-0 rounded-full blur-md bg-indigo-500/30 animate-pulse"></div>
        <Loader2 className={`${sizeMap[size] || sizeMap.md} text-indigo-400 animate-spin relative z-10`} />
      </div>
      {text && <p className="text-sm font-medium text-slate-400 tracking-wide">{text}</p>}
    </div>
  );
};

export const FullPageLoader = ({ text = 'Verifying session...' }) => {
  return (
    <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center z-50">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
          <span className="font-bold text-lg text-white tracking-wider">C</span>
        </div>
        <span className="text-xl font-bold tracking-tight text-white">Campus<span className="text-indigo-400">IQ</span></span>
      </div>
      <Loader size="lg" text={text} />
    </div>
  );
};

export default Loader;
