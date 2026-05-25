"use client";

import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";
import { forwardRef } from "react";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "solid" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "solid", size = "md", ...props }, ref) => {
    const variants = {
      solid: "bg-green text-dark hover:bg-green-bright",
      ghost: "bg-transparent text-foreground border border-border-subtle hover:bg-surface hover:border-foreground",
      outline: "bg-transparent text-foreground border border-border-subtle hover:border-foreground",
    };

    const sizes = {
      sm: "px-4 py-2 text-xs",
      md: "px-8 py-3.5 text-sm",
      lg: "px-10 py-4 text-base",
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ translateY: -2 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "font-condensed font-black tracking-widest uppercase transition-colors rounded-[2px] cursor-pointer",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
