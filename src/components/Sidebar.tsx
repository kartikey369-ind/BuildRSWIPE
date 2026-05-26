"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Hammer, 
  Swords, 
  Users2, 
  MessagesSquare, 
  UserCircle2, 
  LogOut,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

const navItems = [
  { 
    label: "Forge", 
    href: "/forge", 
    icon: Hammer, 
    tagline: "Forge your discipline" 
  },
  { 
    label: "The Arena", 
    href: "/arena", 
    icon: Swords, 
    tagline: "Find athletes built like you" 
  },
  { 
    label: "Training Syncs", 
    href: "/syncs", 
    icon: Users2, 
    tagline: "Stay beyond solo" 
  },
  { 
    label: "Locker Room", 
    href: "/locker-room", 
    icon: MessagesSquare, 
    tagline: "Accountability community" 
  },
  { 
    label: "Identity", 
    href: "/identity", 
    icon: UserCircle2, 
    tagline: "Not a boring profile" 
  },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-72 bg-white dark:bg-[#080c07] border-r border-black/[0.08] dark:border-white/5 z-50 flex flex-col pt-8 pb-10 px-6">
      {/* Brand Logo */}
      <div className="mb-12 px-2">
        <Link href="/forge">
          <motion.div
            className="font-condensed text-2xl font-black tracking-[4px] uppercase text-foreground cursor-pointer"
            whileHover={{ scale: 1.02 }}
          >
            BUILDR<span className="text-green">SWIPE</span>
          </motion.div>
        </Link>
        <p className="text-[9px] font-black uppercase tracking-[3px] text-green mt-2 opacity-80">
          Built Beyond Solo
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                className={cn(
                  "group relative flex items-center gap-4 px-4 py-4 rounded-2xl transition-all cursor-pointer",
                  isActive 
                    ? "bg-green/10 border border-green/20" 
                    : "hover:bg-surface/50 dark:hover:bg-surface-accent/30 border border-transparent"
                )}
                whileTap={{ scale: 0.98 }}
              >
                <item.icon 
                  size={22} 
                  className={cn(
                    "transition-colors",
                    isActive ? "text-green" : "text-text-muted group-hover:text-foreground"
                  )} 
                />
                <div className="flex flex-col">
                  <span className={cn(
                    "text-xs font-black uppercase tracking-widest leading-none mb-1",
                    isActive ? "text-foreground" : "text-text-muted group-hover:text-foreground"
                  )}>
                    {item.label}
                  </span>
                  <span className="text-[8px] font-bold uppercase tracking-widest text-text-muted opacity-50 group-hover:opacity-100 transition-opacity">
                    {item.tagline}
                  </span>
                </div>
                {isActive && (
                  <motion.div 
                    layoutId="sidebar-active-pill"
                    className="absolute left-[-24px] w-1 h-8 bg-green rounded-r-full"
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="pt-8 border-t border-black/[0.08] dark:border-white/5 space-y-4">
        <div className="bg-surface dark:bg-surface-accent p-4 rounded-2xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-green/20 flex items-center justify-center text-green">
            <Zap size={20} fill="currentColor" />
          </div>
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest text-text-muted">Pro Grid</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-foreground">Active Member</p>
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-3 text-text-muted hover:text-red-500 transition-colors group"
        >
          <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">Terminate Session</span>
        </button>
      </div>
    </aside>
  );
};
