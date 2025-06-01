import React, { forwardRef } from "react";
import { cn } from "../../lib/utils";

// Card container
const Card = forwardRef(function Card({ className = "", children, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl border border-blue-200 bg-white/90 text-gray-900 shadow-xl hover:shadow-2xl transition-shadow duration-300 group overflow-hidden animate-fade-in backdrop-blur-md",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

// Card header with animated icon slot
const CardHeader = forwardRef(function CardHeader({ className = "", icon, children, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-2 p-6 pb-2 relative", className)}
      {...props}
    >
      {icon && (
        <span className="absolute -top-8 left-6 w-14 h-14 rounded-full bg-gradient-to-tr from-blue-400 to-pink-400 shadow-lg flex items-center justify-center animate-bounce-slow">
          {icon}
        </span>
      )}
      {children}
    </div>
  );
});

// Card title with gradient text and animation
const CardTitle = forwardRef(function CardTitle({ className = "", children, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={cn(
        "text-2xl font-extrabold leading-none tracking-tight bg-gradient-to-r from-blue-500 via-blue-300 to-pink-400 bg-clip-text text-transparent animate-gradient-x drop-shadow-lg",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

// Card description
const CardDescription = forwardRef(function CardDescription({ className = "", children, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={cn("text-sm text-gray-500 animate-fade-in", className)}
      {...props}
    >
      {children}
    </div>
  );
});

// Card content
const CardContent = forwardRef(function CardContent({ className = "", children, ...props }, ref) {
  return (
    <div ref={ref} className={cn("p-6 pt-0 animate-fade-in", className)} {...props}>
      {children}
    </div>
  );
});

// Card footer
const CardFooter = forwardRef(function CardFooter({ className = "", children, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={cn("flex items-center p-6 pt-0 border-t border-blue-100 bg-gradient-to-r from-blue-50/60 to-pink-50/60 animate-fade-in", className)}
      {...props}
    >
      {children}
    </div>
  );
});

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
