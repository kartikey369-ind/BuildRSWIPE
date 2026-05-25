"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/Button";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] px-6 md:px-24 flex items-center justify-between transition-all duration-500 ease-out",
        scrolled ? "h-20 bg-background/90 backdrop-blur-xl border-b border-border-subtle" : "h-[100px] bg-transparent"
      )}
    >
      <motion.a
        href="#top"
        className="font-condensed text-[28px] font-black tracking-[6px] uppercase text-foreground"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        BUILDR<span className="text-green">SWIPE</span>
      </motion.a>

      <div className="hidden md:flex items-center gap-16">
        {["About", "Why", "Features", "Product"].map((item, i) => (
          <motion.a
            key={item}
            href={`#${item.toLowerCase()}`}
            className="text-[11px] font-bold tracking-[4px] uppercase text-text-muted hover:text-foreground transition-colors"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * (i + 1) }}
          >
            {item}
          </motion.a>
        ))}
      </div>

      <div className="flex items-center gap-10">
        <button
          onClick={toggleTheme}
          className="p-2 border border-border-subtle rounded-md hover:bg-surface transition-colors text-foreground"
        >
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        </button>
        <a href="#" className="hidden sm:block text-[11px] font-bold tracking-[2px] uppercase text-foreground">
          Sign In
        </a>
        <Button size="sm">Join Network</Button>
      </div>
    </nav>
  );
};
