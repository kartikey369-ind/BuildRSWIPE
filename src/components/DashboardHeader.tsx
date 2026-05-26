"use client";

import { NotificationBell } from "./NotificationBell";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { Hammer, Swords, Users2, MessagesSquare, UserCircle2 } from "lucide-react";

const getPageInfo = (pathname: string) => {
  switch (pathname) {
    case "/forge":
      return { label: "Command Center", icon: Hammer, title: "The Forge" };
    case "/arena":
      return { label: "Discovery Battleground", icon: Swords, title: "The Arena" };
    case "/syncs":
      return { label: "Training Syncs", icon: Users2, title: "Your Syncs" };
    case "/locker-room":
      return { label: "Community + Chat", icon: MessagesSquare, title: "The Locker Room" };
    case "/identity":
      return { label: "Athlete Profile", icon: UserCircle2, title: "Your Identity" };
    default:
      return { label: "Athlete Network", icon: Hammer, title: "BuildRSWIPE" };
  }
};

export const DashboardHeader = () => {
  const pathname = usePathname();
  const info = getPageInfo(pathname);

  return (
    <header className="flex items-center justify-between mb-10 pb-10 border-b border-black/[0.08] dark:border-white/5">
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-green">
          <info.icon size={18} />
          <span className="text-[10px] font-black uppercase tracking-[4px]">{info.label}</span>
        </div>
        <h1 className="font-condensed text-5xl font-black uppercase text-foreground">
          {info.title.split(' ').map((word, i) => (
            <span key={i} className={word === "Forge" || word === "Arena" || word === "Syncs" || word === "Room" || word === "Identity" ? "text-green" : ""}>
              {word}{' '}
            </span>
          ))}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <NotificationBell />
      </div>
    </header>
  );
};
