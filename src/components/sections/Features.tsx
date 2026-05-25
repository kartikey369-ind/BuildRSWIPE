"use client";

import { Zap, Clock, Target, MessageSquare, BarChart3, ShieldCheck } from "lucide-react";
import { Section } from "../Section";

const FEATURES = [
  {
    icon: Zap,
    title: "Smart Matchmaking",
    desc: "AI-driven matching that pairs you with athletes of similar intensity and physical discipline.",
  },
  {
    icon: Clock,
    title: "Schedule Sync",
    desc: "Seamlessly align your training windows. Never miss a session due to scheduling friction again.",
  },
  {
    icon: Target,
    title: "Goal-Based Pairing",
    desc: "Whether it's powerlifting or endurance, match with partners chasing the exact same milestones.",
  },
  {
    icon: MessageSquare,
    title: "Training Chat",
    desc: "Dedicated logistics channel for session planning. No distractions, just coordination.",
  },
  {
    icon: BarChart3,
    title: "Progress Tracking",
    desc: "Monitor your collective growth. Visualized streaks and performance metrics for every partner.",
  },
  {
    icon: ShieldCheck,
    title: "Elite Verification",
    desc: "Every member is vetted. Join a network where every athlete is as committed as you are.",
  },
];

export const Features = () => {
  return (
    <Section 
      id="features" 
      className="bg-surface" 
      label="Platform" 
      title={<>Engineered for <em className="text-green not-italic">Performance</em></>}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
        {FEATURES.map((item) => (
          <div key={item.title} className="bg-surface p-12 md:p-16 text-center hover:bg-surface-accent transition-colors rounded-2xl">
            <item.icon className="w-12 h-12 stroke-green mx-auto mb-10" strokeWidth={1} />
            <h3 className="font-condensed text-[32px] font-extrabold uppercase mb-6 tracking-wider text-foreground">{item.title}</h3>
            <p className="text-text-muted leading-relaxed text-base">{item.desc}</p>
          </div>
        ))}
      </div>
    </Section>
  );
};
