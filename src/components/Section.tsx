"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface SectionProps {
  id?: string;
  className?: string;
  headerClassName?: string;
  align?: "center" | "left";
  label?: string;
  title?: string | ReactNode;
  children: ReactNode;
}

export const Section = ({ id, className, headerClassName, align = "center", label, title, children }: SectionProps) => {
  return (
    <section id={id} className={cn("py-32 px-6 md:px-24 bg-background", align === "center" ? "text-center" : "text-left", className)}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-7xl mx-auto"
      >
        {label && (
          <span className={cn("text-xs font-bold tracking-[4px] uppercase text-green mb-6 block", headerClassName)}>
            {label}
          </span>
        )}
        {title && (
          <h2 className={cn(
            "font-condensed text-[clamp(40px,6vw,80px)] font-black uppercase leading-[0.95] tracking-[-2px] text-foreground mb-20 max-w-4xl",
            align === "center" ? "mx-auto" : "mx-0",
            headerClassName
          )}>
            {title}
          </h2>
        )}
        {children}
      </motion.div>
    </section>
  );
};
