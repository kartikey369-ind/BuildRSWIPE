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
    if (currentTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] px-4 sm:px-8 md:px-24 h-20 sm:h-24 flex items-center justify-between bg-transparent">
      <Link href="/">
        <motion.div
          className="font-condensed text-[20px] sm:text-[28px] font-black tracking-[4px] sm:tracking-[6px] uppercase text-foreground cursor-pointer"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          BUILDR<span className="text-green">SWIPE</span>
        </motion.div>
      </Link>

      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-4 sm:gap-6"
      >
        <button
          onClick={toggleTheme}
          className="p-2 sm:p-3 border border-border-subtle rounded-xl hover:bg-surface/50 backdrop-blur-sm transition-all text-foreground flex items-center gap-2 sm:gap-3 group"
        >
          <span className="hidden xs:block text-[9px] sm:text-[10px] font-bold tracking-[1px] sm:tracking-[2px] uppercase opacity-60 group-hover:opacity-100 transition-opacity">
            {theme === "dark" ? "Light" : "Dark"}
          </span>
          {theme === "dark" ? <Sun size={16} className="text-green sm:w-[18px] sm:h-[18px]" /> : <Moon size={16} className="text-green sm:w-[18px] sm:h-[18px]" />}
        </button>
      </motion.div>
    </nav>
  );
};
