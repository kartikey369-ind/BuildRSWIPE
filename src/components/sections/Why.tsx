"use client";

import { Section } from "../Section";
import { XCircle, CheckCircle2 } from "lucide-react";

const COMPARISONS = [
  {
    problem: "Hard to find consistent gym partners",
    solution: "Instantly match with verified athletes at your level.",
  },
  {
    problem: "Different schedules kill accountability",
    solution: "Automated schedule syncing keeps you both on track.",
  },
  {
    problem: "Casual fitness groups lack discipline",
    solution: "A closed network built exclusively for serious training.",
  },
  {
    problem: "Serious athletes need serious coordination",
    solution: "Pro-grade tools designed for training logistics.",
  },
];

export const Why = () => {
  return (
    <Section 
      id="why" 
      className="bg-background" 
      label="The Problem" 
      title={<>Why <em className="text-green not-italic">BUILDRSWIPE</em>?</>}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {COMPARISONS.map((item, i) => (
          <div 
            key={i} 
            className="group grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-0 bg-background rounded-2xl overflow-hidden border border-border-subtle"
          >
            <div className="p-8 md:p-10 flex items-start gap-6 bg-red-500/5 border-b md:border-b-0 md:border-r border-border-subtle">
              <XCircle className="w-6 h-6 text-red-500 shrink-0 mt-1" />
              <p className="text-foreground/70 font-medium text-lg text-left">{item.problem}</p>
            </div>
            <div className="p-8 md:p-10 flex items-start gap-6 bg-green/5">
              <CheckCircle2 className="w-6 h-6 text-green shrink-0 mt-1" />
              <p className="text-foreground font-bold text-lg text-left">{item.solution}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
};
