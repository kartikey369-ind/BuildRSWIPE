"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { auth } from "@/lib/firebase";
import { getFriendlyErrorMessage } from "@/lib/auth-errors";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, updateProfile } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Mail, Lock, User, ArrowRight, ShieldCheck, Globe, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { AuthNavbar } from "@/components/AuthNavbar";

export const dynamic = 'force-dynamic';

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      return setError("Please fill in all fields.");
    }
    if (password.length < 6) {
      return setError("Password must be at least 6 characters.");
    }
    if (password !== confirmPassword) {
      return setError("Passwords do not match.");
    }
    
    setError("");
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      router.push("/"); // Redirect to home/setup
    } catch (err: any) {
      console.error(err);
      setError(getFriendlyErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push("/");
    } catch (err: any) {
      setError(getFriendlyErrorMessage(err.code));
    }
  };

  return (
    <main className="min-h-screen bg-[#f9faf9] dark:bg-background flex items-center justify-center p-6 relative overflow-hidden selection:bg-green/30 pt-24 transition-colors duration-500">
      <AuthNavbar />
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] bg-green/[0.03] dark:bg-green/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-green/[0.02] dark:bg-green/[0.02] rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[500px] z-10"
      >
        <div className="text-center mb-10">
          <h1 className="font-condensed text-5xl md:text-6xl font-black uppercase tracking-tight text-foreground mb-3">
            Built Beyond Solo
          </h1>
          <p className="text-text-muted text-[10px] tracking-[0.3em] uppercase font-bold opacity-80">
            Join the elite fitness network
          </p>
        </div>

        <div className="bg-white dark:bg-[#0e140b]/90 border border-black/[0.04] dark:border-border-subtle/50 p-8 md:p-12 rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.12)] dark:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] backdrop-blur-3xl relative overflow-hidden">
          {/* Subtle Inner Glow for Dark Mode */}
          <div className="absolute inset-0 pointer-events-none border border-white/5 rounded-[2.5rem] dark:block hidden" />
          
          <form onSubmit={handleSignup} className="space-y-6 relative z-10">
            <Input
              label="Full Name"
              icon={<User size={18} />}
              placeholder="Athlete Name"
              required
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
            />

            <Input
              label="Email Address"
              icon={<Mail size={18} />}
              type="email"
              placeholder="athlete@performance.com"
              required
              value={email}
              autoComplete="email"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Password"
                icon={<Lock size={18} />}
                type="password"
                placeholder="••••••••"
                required
                value={password}
                autoComplete="new-password"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              />
              <Input
                label="Confirm"
                icon={<Lock size={18} />}
                type="password"
                placeholder="••••••••"
                required
                value={confirmPassword}
                autoComplete="new-password"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
              />
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="text-red-500 text-[10px] font-bold tracking-wider uppercase bg-red-500/5 p-4 rounded-xl border border-red-500/20 text-center flex items-center justify-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    {error}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <Button 
              type="submit" 
              className="w-full py-5 rounded-xl group relative overflow-hidden" 
              disabled={loading}
            >
              <span className="flex items-center justify-center gap-3 relative z-10">
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    INITIALIZING...
                  </>
                ) : (
                  <>
                    JOIN THE NETWORK
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
            </Button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-black/5 dark:border-border-subtle"></div>
              </div>
              <div className="relative flex justify-center text-[9px] font-black uppercase tracking-[0.3em]">
                <span className="bg-white dark:bg-[#0e140b] px-4 text-text-muted/60 transition-colors">Or continue with</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full bg-black/[0.02] dark:bg-surface/30 border border-black/5 dark:border-border-subtle hover:border-green hover:bg-black/[0.04] dark:hover:bg-surface transition-all rounded-xl py-4 flex items-center justify-center gap-4 text-[11px] font-bold tracking-[0.2em] uppercase group"
            >
              <Globe size={18} className="text-green group-hover:rotate-12 transition-transform" />
              Sign up with Google
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-text-muted font-medium">
            Already a member?{" "}
            <Link href="/login" className="text-green font-bold hover:text-green-bright transition-colors decoration-green/30 hover:underline underline-offset-4">
              Log in here
            </Link>
          </p>
        </div>

        <div className="mt-10 flex items-center justify-center gap-6">
          <div className="flex items-center gap-2 text-[9px] font-black tracking-[0.2em] uppercase text-text-muted/40">
            <ShieldCheck size={14} className="text-green/50" />
            Vetted Network
          </div>
          <div className="flex items-center gap-2 text-[9px] font-black tracking-[0.2em] uppercase text-text-muted/40">
            <CheckCircle2 size={14} className="text-green/50" />
            Verified Athletes
          </div>
        </div>
      </motion.div>
    </main>
  );
}
