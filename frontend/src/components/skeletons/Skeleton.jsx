import React from "react";

const Skeleton = ({ children, className }) => {
  return (
    <div className={`animate-pulse rounded-lg bg-neutral-800 ${className}`}>
      {children}
    </div>
  );
};

export default Skeleton;
