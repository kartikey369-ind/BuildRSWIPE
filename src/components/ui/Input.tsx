"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { InputHTMLAttributes, forwardRef, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: ReactNode;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, icon, error, ...props }, ref) => {
    return (
      <div className="space-y-2 w-full">
        {label && (
          <label className="text-[11px] font-bold tracking-[2px] uppercase text-foreground/70 dark:text-text-muted/80 ml-1 transition-colors group-focus-within:text-green">
            {label}
          </label>
        )}
        <div className="relative group">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40 dark:text-text-muted transition-colors group-focus-within:text-green">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              "w-full bg-white dark:bg-background/50 border border-black/[0.08] dark:border-border-subtle rounded-xl py-4 pr-4 text-foreground focus:border-green focus:ring-4 focus:ring-green/10 dark:focus:ring-green/5 transition-all outline-none placeholder:text-text-muted/40 shadow-sm",
              icon ? "pl-12" : "pl-4",
              error && "border-red-500/50 focus:border-red-500 focus:ring-red-500/10",
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px] font-bold tracking-wider text-red-500 uppercase ml-1"
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
