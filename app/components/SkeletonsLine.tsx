import React from 'react';

export function SkeletonLine({ className = '' }: { className?: string }) {
  return <div className={`shimmer rounded-md h-4 ${className}`} />;
}

export function CardSkeleton() {
  return (
    <div className="glass rounded-2xl p-5 card-glow">
      <SkeletonLine className="w-1/3 mb-3" />
      <SkeletonLine className="w-full mb-2" />
      <SkeletonLine className="w-2/3" />
    </div>
  );
}

export function TableSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="glass rounded-xl p-4 flex items-center gap-4">
          <SkeletonLine className="w-8 h-8 rounded-lg flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <SkeletonLine className="w-1/3" />
            <SkeletonLine className="w-1/2 h-3" />
          </div>
          <SkeletonLine className="w-20 h-8 rounded-lg" />
        </div>
      ))}
    </div>
  );
}

export function ChatSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <div className="shimmer rounded-2xl rounded-tr-sm h-10 w-48" />
      </div>
      <div className="flex gap-3">
        <div className="shimmer w-8 h-8 rounded-xl flex-shrink-0" />
        <div className="shimmer rounded-2xl rounded-tl-sm h-16 w-64" />
      </div>
    </div>
  );
}
