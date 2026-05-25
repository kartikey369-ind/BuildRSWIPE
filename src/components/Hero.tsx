"use client";

import { motion } from "framer-motion";
import { Button } from "./ui/Button";
import { HeroScene } from "./HeroScene";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden text-center">
      <HeroScene />
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-[900px]"
      >
        <div className="inline-block px-5 py-2 border border-white/10 text-text-muted text-[10px] font-bold tracking-[4px] uppercase mb-10 rounded-full bg-background/50 backdrop-blur-sm">
          Exclusive Fitness Networking
        </div>
        
        <h1 className="font-condensed font-black text-[clamp(60px,10vw,120px)] leading-[0.9] tracking-[-4px] uppercase mb-8 text-foreground">
          <span>Elevate Your</span><br />
          <span className="text-green [text-shadow:0_0_20px_rgba(106,191,69,0.3)]">Training</span>
        </h1>
        
        <p className="text-xl text-text-muted leading-relaxed max-w-[600px] mx-auto mb-12">
          Connect with dedicated training partners who share your discipline. No noise, no distractions. Just elite-level coordination for serious athletes.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Button size="lg" className="w-full sm:w-auto">Join Network</Button>
          <Button 
            variant="ghost" 
            size="lg" 
            className="w-full sm:w-auto"
            onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Learn More
          </Button>
        </div>
      </motion.div>
    </section>
  );
};
