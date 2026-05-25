import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/sections/About";
import { Why } from "@/components/sections/Why";
import { Features } from "@/components/sections/Features";
import { ProductShowcase } from "@/components/sections/ProductShowcase";
import { Manifesto } from "@/components/sections/Manifesto";
import { CTA } from "@/components/sections/CTA";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <About />
      <Why />
      <Features />
      <ProductShowcase />
      <Manifesto />
      <CTA />
      <Footer />
    </main>
  );
}
