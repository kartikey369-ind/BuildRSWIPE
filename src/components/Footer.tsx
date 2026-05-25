"use client";

export const Footer = () => {
  return (
    <footer className="bg-background py-32 px-6 md:px-24">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8 mb-24">
          <div className="md:col-span-5 flex flex-col items-center md:items-start text-center md:text-left">
            <div className="font-condensed text-[32px] font-black tracking-[8px] uppercase mb-8 text-foreground leading-none">
              BUILDR<span className="text-green">SWIPE</span>
            </div>
            <p className="text-text-muted text-base leading-relaxed max-w-[320px]">
              The premium fitness network for dedicated athletes. Built for performance, designed for discipline.
            </p>
          </div>

          <div className="md:col-span-3 md:col-start-7 flex flex-col items-center md:items-start text-center md:text-left">
            <h4 className="font-condensed text-sm font-bold tracking-[4px] uppercase mb-10 text-foreground">Platform</h4>
            <ul className="space-y-4">
              {["Network", "Feed", "Privacy"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-text-muted hover:text-green transition-colors text-sm">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3 flex flex-col items-center md:items-start text-center md:text-left">
            <h4 className="font-condensed text-sm font-bold tracking-[4px] uppercase mb-10 text-foreground">Connect</h4>
            <ul className="space-y-4">
              {["Instagram", "Twitter", "Discord"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-text-muted hover:text-green transition-colors text-sm">{link}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-16 border-t border-border-subtle flex flex-col md:flex-row justify-center items-center gap-8">
  <p className="text-[12px] text-text-muted tracking-[1px] uppercase">
    © 2026 BUILDRSWIPE. ALL RIGHTS RESERVED.
  </p>
</div>

      </div>
    </footer>
  );
};
