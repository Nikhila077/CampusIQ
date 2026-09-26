import { Loader2 } from 'lucide-react';
import { StudentLensLogo } from '../shared/StudentLensLogo.jsx';

export const Loader = ({ size = 'md', text = 'Loading...' }) => {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="relative">
        <div className="absolute inset-0 rounded-full blur-md bg-[#3B8F83]/20 animate-pulse"></div>
        <Loader2 className={`${sizeMap[size] || sizeMap.md} text-[#3B8F83] animate-spin relative z-10`} />
      </div>
      {text && <p className="text-sm font-semibold text-slate-600 tracking-wide">{text}</p>}
    </div>
  );
};

export const FullPageLoader = ({ text = 'Loading StudentLens...' }) => {
  return (
    <div className="fixed inset-0 bg-[#F4F7F5] flex flex-col items-center justify-center z-50">
      <div className="mb-6 animate-subtle-float">
        <StudentLensLogo iconClassName="w-10 h-10" textClassName="text-2xl" />
      </div>
      <Loader size="lg" text={text} />
    </div>
  );
};

export const Skeleton = ({ className = '' }) => {
  return (
    <div
      className={`skeleton-shimmer rounded-xl ${className}`}
    />
  );
};

export const CardSkeleton = () => {
  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-6 space-y-4 shadow-xs">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <Skeleton className="h-8 w-24" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  );
};

export default Loader;
