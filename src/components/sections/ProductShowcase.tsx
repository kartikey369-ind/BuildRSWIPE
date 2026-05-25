"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Section } from "../Section";
import { MessageSquare, Calendar, Flame, MapPin, CheckCircle2, Zap, Target, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const SHOWCASE_FEATURES = [
  {
    id: "matchmaking",
    title: "Precision Matchmaking",
    desc: "AI-driven intensity pairing that matches your lifting stats and training discipline.",
    icon: Target,
  },
  {
    id: "logistics",
    title: "Seamless Logistics",
    desc: "Integrated chat for coordination. No noise, just session planning and accountability.",
    icon: MessageSquare,
  },
  {
    id: "progress",
    title: "Visualized Progress",
    desc: "Monitor consistency through heatmaps and performance streaks shared with your network.",
    icon: Flame,
  }
];

export const ProductShowcase = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Section 
      id="product" 
      className="bg-background overflow-hidden" 
      label="The Experience" 
      title={<>High-Fidelity <em className="text-green not-italic">Performance</em></>}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center min-h-[600px]">
        
        {/* Left Side: Stacked Mockups (6 Cols) */}
        <div className="lg:col-span-7 relative h-[500px] w-full flex items-center justify-center">
          <AnimatePresence mode="wait">
            {activeTab === 0 && (
              <motion.div 
                key="match-card"
                initial={{ opacity: 0, x: -40, scale: 0.9, rotateY: -10 }}
                animate={{ opacity: 1, x: 0, scale: 1, rotateY: -5 }}
                exit={{ opacity: 0, x: 40, scale: 0.9, rotateY: 10 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="absolute w-[340px] bg-surface border border-border-subtle p-8 rounded-2xl shadow-2xl z-30"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 bg-green rounded-full flex items-center justify-center font-black text-dark text-2xl shadow-[0_0_20px_rgba(106,191,69,0.4)]">K</div>
                  <div>
                    <h4 className="font-condensed text-xl font-black uppercase tracking-wider text-foreground">Kartikey K.</h4>
                    <div className="flex items-center gap-2 text-text-muted text-xs uppercase tracking-widest font-bold">
                      <MapPin size={12} className="text-green" /> 0.5 KM AWAY
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center p-3 bg-background rounded-lg border border-border-subtle group-hover:border-green/30 transition-colors">
                    <span className="text-xs text-text-muted uppercase font-bold tracking-widest">Bench Press</span>
                    <span className="font-condensed text-lg font-black text-green">140 KG</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-background rounded-lg border border-border-subtle">
                    <span className="text-xs text-text-muted uppercase font-bold tracking-widest">Squat</span>
                    <span className="font-condensed text-lg font-black text-green">180 KG</span>
                  </div>
                </div>

                <button className="w-full py-4 bg-green text-dark font-condensed font-black uppercase tracking-widest rounded-lg hover:bg-green-bright transition-all hover:scale-[1.02] active:scale-[0.98]">
                  Send Match Request
                </button>
              </motion.div>
            )}

            {activeTab === 1 && (
              <motion.div 
                key="chat-card"
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -40, scale: 0.9 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="absolute w-[400px] bg-surface border border-border-subtle rounded-2xl overflow-hidden shadow-2xl z-30"
              >
                <div className="bg-surface-accent p-4 border-b border-border-subtle flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MessageSquare size={18} className="text-green" />
                    <span className="font-condensed font-black uppercase tracking-widest text-sm">Training Logistics</span>
                  </div>
                  <div className="w-2 h-2 bg-green rounded-full animate-pulse" />
                </div>
                <div className="p-6 space-y-6">
                  <div className="flex flex-col items-start gap-2 max-w-[85%]">
                    <div className="bg-background border border-border-subtle p-4 rounded-2xl rounded-tl-none text-sm text-foreground">
                      "Yo, still good for the 5 AM heavy session tomorrow?"
                    </div>
                    <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest">KARTIKEY · 8:30 PM</span>
                  </div>
                  <div className="flex flex-col items-end gap-2 ml-auto max-w-[85%]">
                    <div className="bg-green p-4 rounded-2xl rounded-tr-none text-sm text-dark font-medium shadow-[0_4px_15px_rgba(106,191,69,0.2)]">
                      "Locked in. Bringing the ammonia. See you at the rack."
                    </div>
                    <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest text-right">MUKTHA · 8:32 PM</span>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 2 && (
              <motion.div 
                key="streak-card"
                initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 1.2, rotate: 5 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="absolute w-[380px] bg-surface border border-border-subtle p-8 rounded-2xl shadow-2xl z-30"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <Flame size={28} className="text-green fill-green drop-shadow-[0_0_8px_rgba(106,191,69,0.5)]" />
                    <span className="font-condensed font-black uppercase tracking-widest text-2xl">14 DAY STREAK</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={18} className="text-text-muted" />
                    <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest">MAY 2026</span>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-3 mb-8">
                  {Array.from({ length: 14 }).map((_, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.02 }}
                      className={`aspect-square rounded-md flex items-center justify-center border transition-all ${
                        i < 13 ? 'bg-green/10 border-green/30' : 'bg-background border-border-subtle'
                      }`}
                    >
                      {i < 13 && <CheckCircle2 size={14} className="text-green" />}
                    </motion.div>
                  ))}
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div key={i+14} className="aspect-square rounded-md bg-background border border-border-subtle opacity-20" />
                  ))}
                </div>
                
                <div className="pt-6 border-t border-border-subtle">
                  <div className="flex justify-between text-[10px] font-bold tracking-[2px] uppercase text-text-muted">
                    <span>Accountability Score</span>
                    <span className="text-green">98%</span>
                  </div>
                  <div className="mt-2 h-1 w-full bg-background rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "98%" }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full bg-green"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Background Decorative Stacks (Non-active indicators) */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
            <div className="w-[340px] h-[400px] border border-white/20 rounded-2xl -rotate-6 translate-x-4" />
            <div className="absolute w-[340px] h-[400px] border border-white/20 rounded-2xl rotate-3 -translate-x-8" />
          </div>
        </div>

        {/* Right Side: Feature Points (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {SHOWCASE_FEATURES.map((feature, index) => (
            <motion.div
              key={feature.id}
              onMouseEnter={() => setActiveTab(index)}
              className={cn(
                "group relative p-8 rounded-2xl border transition-all duration-500 cursor-pointer",
                activeTab === index 
                  ? "bg-surface border-green/30 shadow-[0_10px_40px_rgba(0,0,0,0.3)]" 
                  : "bg-transparent border-transparent hover:bg-surface/30 hover:border-border-subtle"
              )}
            >
              {/* Active Indicator Line */}
              <AnimatePresence>
                {activeTab === index && (
                  <motion.div 
                    layoutId="active-indicator"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-green rounded-l-2xl"
                  />
                )}
              </AnimatePresence>

              <div className="flex items-start gap-6">
                <div className={cn(
                  "p-3 rounded-xl transition-colors duration-500",
                  activeTab === index ? "bg-green text-dark" : "bg-surface-accent text-green"
                )}>
                  <feature.icon size={24} strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={cn(
                      "font-condensed text-2xl font-black uppercase tracking-wider transition-colors",
                      activeTab === index ? "text-foreground" : "text-foreground/60"
                    )}>
                      {feature.title}
                    </h3>
                    {activeTab === index && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                        <ArrowRight size={18} className="text-green" />
                      </motion.div>
                    )}
                  </div>
                  <p className={cn(
                    "text-sm leading-relaxed transition-colors duration-500",
                    activeTab === index ? "text-text-muted" : "text-text-muted/40"
                  )}>
                    {feature.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}

          
        </div>

      </div>
    </Section>
  );
};
