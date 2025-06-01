import React from "react";
import { cn } from "../../lib/utils";

function Skeleton({ className = "", ...props }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-gradient-to-r from-blue-100 via-blue-50 to-pink-100 shadow-inner transition-all duration-700",
        className
      )}
      {...props}
    />
  );
}

export default Skeleton;
