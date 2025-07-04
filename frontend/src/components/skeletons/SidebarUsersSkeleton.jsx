import React from 'react';
import Skeleton from './Skeleton';

const SidebarUsersSkeleton = ({ length = 10 }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length }).map((_, index) => (
        <Skeleton key={index} className="w-full p-2 flex items-center gap-3">
          <Skeleton className="size-10 rounded-full bg-neutral-900" />
          <div className="flex-1 space-y-2">
            <Skeleton className="w-3/4 h-4 bg-neutral-900 rounded" />
            <Skeleton className="w-1/2 h-3 bg-neutral-900 rounded" />
          </div>
        </Skeleton>
      ))}
    </div>
  );
};

export default SidebarUsersSkeleton;
