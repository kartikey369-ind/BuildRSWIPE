"use client";

import { Shield, Users, CheckCircle } from "lucide-react";
import { Section } from "../Section";

const PAIN_POINTS = [
  {
    icon: Shield,
    title: "Vetted Network",
    desc: "Every member is verified to ensure they are serious about their training goals and schedule commitment.",
  },
  {
    icon: Users,
    title: "Zero Friction",
    desc: "Skip the small talk. Our interface is designed for quick coordination and immediate results.",
  },
  {
    icon: CheckCircle,
    title: "High Intensity",
    desc: "Match with partners who push you to your absolute limit. Accountability is built into the core.",
  },
];

export const About = () => {
  return (
    <Section id="about" className="bg-surface" label="The Network" title={<>Built for <em className="text-green not-italic">Discipline</em></>}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
        {PAIN_POINTS.map((item) => (
          <div key={item.title} className="text-center group">
            <item.icon className="w-10 h-10 stroke-green mx-auto mb-8 transition-transform group-hover:scale-110" strokeWidth={1.5} />
            <h3 className="font-condensed text-3xl font-extrabold uppercase mb-5 tracking-wider text-foreground">{item.title}</h3>
            <p className="text-text-muted leading-relaxed text-base">{item.desc}</p>
          </div>
        ))}
      </div>
    </Section>
  );
};
