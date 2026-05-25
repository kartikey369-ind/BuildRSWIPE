"use client";

import { Button } from "../ui/Button";
import { Section } from "../Section";

export const CTA = () => {
  return (
    <Section className="py-60 border-t-0 bg-background" title={<>Join the <em className="text-green not-italic">Elite</em></>}>
      <div className="max-w-2xl mx-auto">
        <Button size="lg" className="px-16 py-6 text-xl tracking-[4px]">Start Training</Button>
      </div>
    </Section>
  );
};
