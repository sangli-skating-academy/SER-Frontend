import React, { forwardRef } from "react";
import { cn } from "../../lib/utils";

const Input = forwardRef(function Input(
  { className, type, label, name, ...props },
  ref
) {
  return (
    <div className="">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-semibold mb-1 text-black"
        >
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border bg-background px-3 py-2 text-black placeholder:text-black ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    </div>
  );
});

export default Input;
