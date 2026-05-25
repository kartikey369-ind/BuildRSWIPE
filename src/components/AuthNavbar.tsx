"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import Link from "next/link";

export const AuthNavbar = () => {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    // Check initial theme from document attribute if exists
    const currentTheme = document.documentElement.getAttribute("data-theme") as "dark" | "light" || "dark";
    setTheme(currentTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] px-6 md:px-24 h-24 flex items-center justify-between bg-transparent">
      <Link href="/">
        <motion.div
          className="font-condensed text-[28px] font-black tracking-[6px] uppercase text-foreground cursor-pointer"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          BUILDR<span className="text-green">SWIPE</span>
        </motion.div>
      </Link>

      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-6"
      >
        <button
          onClick={toggleTheme}
          className="p-3 border border-border-subtle rounded-xl hover:bg-surface/50 backdrop-blur-sm transition-all text-foreground flex items-center gap-3 group"
        >
          <span className="text-[10px] font-bold tracking-[2px] uppercase opacity-60 group-hover:opacity-100 transition-opacity">
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </span>
          {theme === "dark" ? <Sun size={18} className="text-green" /> : <Moon size={18} className="text-green" />}
        </button>
      </motion.div>
    </nav>
  );
};
