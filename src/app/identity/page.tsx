"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { NotificationBell } from "@/components/NotificationBell";
import { 
  UserCircle2, 
  Settings2,
  Trophy,
  Target,
  Flame,
  Zap,
  Loader2,
  Edit3,
  ShieldCheck
} from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";

export default function Identity() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setProfile(docSnap.data());
          } else {
            router.push("/profile-setup");
          }
        } catch (err) {
          console.error("Error fetching profile:", err);
        } finally {
          setLoading(false);
        }
      } else {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex flex-col items-center justify-center gap-6">
        <Loader2 size={48} className="text-green animate-spin" />
        <p className="font-condensed text-xl font-black uppercase tracking-[4px] text-text-muted">
          Accessing Identity...
        </p>
      </main>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f9faf9] dark:bg-background">
      <Sidebar />
      
      <main className="flex-1 ml-72 p-10 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-10">
          
          {/* Header */}
          <div className="flex items-end justify-between border-b border-black/[0.08] dark:border-white/5 pb-10">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-green">
                <UserCircle2 size={20} />
                <span className="text-[10px] font-black uppercase tracking-[4px]">Athlete Profile</span>
              </div>
              <h1 className="font-condensed text-7xl font-black uppercase tracking-tight text-foreground leading-none">
                Your <span className="text-green">Identity</span>
              </h1>
              <p className="text-xs font-bold text-text-muted uppercase tracking-widest opacity-60">
                Not just a profile. Your forged athlete identity.
              </p>
            </div>
            
            <div className="flex items-center gap-6">
              <NotificationBell />
              <button 
                onClick={() => router.push("/profile-setup")}
                className="flex items-center gap-2 px-6 py-3 bg-surface dark:bg-surface-accent border border-border-subtle rounded-2xl text-[10px] font-black uppercase tracking-widest text-foreground hover:border-green/50 transition-all"
              >
                <Edit3 size={14} />
                Edit Setup
              </button>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-8">
            {/* Left Column - Core Info */}
            <div className="col-span-7 space-y-8">
              {/* Identity Card */}
              <div className="bg-white dark:bg-[#0e140b]/90 border border-black/[0.08] dark:border-border-subtle/50 p-12 rounded-[3rem] relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-green/5 rounded-full blur-[80px] -mr-32 -mt-32" />
                <div className="relative z-10 space-y-8">
                  <div className="flex items-center gap-8">
                    <div className="w-32 h-32 rounded-[2.5rem] bg-surface dark:bg-surface-accent border-2 border-green overflow-hidden shadow-[0_0_30px_rgba(106,191,69,0.2)]">
                      <img src={profile?.avatar} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-green">
                        <ShieldCheck size={16} />
                        <span className="text-[9px] font-black uppercase tracking-widest">Verified Athlete</span>
                      </div>
                      <h2 className="font-condensed text-6xl font-black uppercase text-foreground leading-none">{profile?.name}</h2>
                      <p className="text-sm font-bold text-text-muted uppercase tracking-[2px]">{profile?.archetype}</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-text-muted mb-3">The Bio</p>
                      <p className="text-sm font-medium text-foreground/80 leading-relaxed italic">
                        "{profile?.bio || "No bio forged yet. Edit your profile to add your athlete manifesto."}"
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-surface dark:bg-surface-accent p-6 rounded-2xl border border-border-subtle">
                        <p className="text-[8px] font-black uppercase tracking-widest text-text-muted mb-2">Vibe</p>
                        <p className="text-xs font-black uppercase text-foreground">{profile?.vibe || "Silent Grinder"}</p>
                      </div>
                      <div className="bg-surface dark:bg-surface-accent p-6 rounded-2xl border border-border-subtle">
                        <p className="text-[8px] font-black uppercase tracking-widest text-text-muted mb-2">Commitment</p>
                        <p className="text-xs font-black uppercase text-green">{profile?.commitmentLevel}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Motivation & Commitment */}
              <div className="bg-white dark:bg-[#0e140b]/90 border border-black/[0.08] dark:border-border-subtle/50 p-10 rounded-[3rem] space-y-6">
                <h3 className="font-condensed text-3xl font-black uppercase text-foreground">Motivation</h3>
                <div className="flex flex-wrap gap-3">
                  {profile?.motivation?.map((m: string) => (
                    <div key={m} className="px-5 py-3 bg-green/5 border border-green/10 rounded-xl flex items-center gap-3">
                      <Zap size={14} className="text-green" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-foreground">{m}</span>
                    </div>
                  )) || <p className="text-xs text-text-muted uppercase font-bold tracking-widest">No motivation triggers selected.</p>}
                </div>
              </div>
            </div>

            {/* Right Column - Badges & Goals */}
            <div className="col-span-5 space-y-8">
              {/* Progress Badges */}
              <div className="bg-foreground text-background p-10 rounded-[3rem] space-y-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-green/20 rounded-full blur-[60px] -mr-24 -mt-24" />
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-condensed text-3xl font-black uppercase">Progress Badges</h3>
                    <Trophy size={24} className="text-green" />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="aspect-square rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center group hover:border-green/50 transition-all cursor-pointer">
                        <Trophy size={24} className="text-white/20 group-hover:text-green transition-colors" />
                      </div>
                    ))}
                  </div>
                  <p className="text-[9px] font-bold uppercase tracking-widest opacity-40 text-center">More badges unlocking soon</p>
                </div>
              </div>

              {/* Goals */}
              <div className="bg-white dark:bg-[#0e140b]/90 border border-black/[0.08] dark:border-border-subtle/50 p-10 rounded-[3rem] space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="font-condensed text-3xl font-black uppercase text-foreground">Current Goals</h3>
                  <Target size={24} className="text-green" />
                </div>
                <div className="space-y-4">
                  {profile?.trainingGoal?.map((goal: string) => (
                    <div key={goal} className="p-5 bg-surface dark:bg-surface-accent rounded-2xl border border-border-subtle flex items-center justify-between group hover:border-green/30 transition-all">
                      <span className="text-[11px] font-black uppercase tracking-widest text-foreground">{goal}</span>
                      <div className="w-2 h-2 rounded-full bg-green shadow-[0_0_10px_rgba(106,191,69,0.5)]" />
                    </div>
                  )) || <p className="text-xs text-text-muted uppercase font-bold tracking-widest">No goals defined.</p>}
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
