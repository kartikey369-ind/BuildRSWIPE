"use client";

import { Section } from "../Section";
import { motion } from "framer-motion";

const PILLARS = [
  {
    tag: "01",
    title: "The Core Network",
    desc: "Founded by a closed circuit of high-performance athletes, building the future of fitness coordination.",
  },
  {
    tag: "02",
    title: "Development Phase",
    desc: "We are currently in a controlled Alpha. The platform is being stress-tested by our founding members to ensure absolute reliability.",
  },
  {
    tag: "03",
    title: "Silence is Strength",
    desc: "No public feeds, no vanity metrics. We are building the infrastructure for serious training in complete focus.",
  },
];

export const Manifesto = () => {
  return (
    <Section 
      id="manifesto" 
      className="bg-surface" 
      label="The Foundation" 
      title={<>Building in <em className="text-green not-italic">Silence</em></>}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
        {PILLARS.map((pillar, index) => (
          <motion.div 
            key={pillar.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2 }}
            className="border-l border-border-subtle pl-10 py-4"
          >
            <span className="font-condensed text-green font-black tracking-widest text-sm mb-4 block">
              {pillar.tag}
            </span>
            <h3 className="font-condensed text-2xl font-black uppercase tracking-wider text-foreground mb-4">
              {pillar.title}
            </h3>
            <p className="text-text-muted leading-relaxed text-sm">
              {pillar.desc}
            </p>
          </motion.div>
        ))}
      </div>

      
    </Section>
  );
};
