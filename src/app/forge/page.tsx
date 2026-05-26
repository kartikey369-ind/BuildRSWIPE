"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { NotificationBell } from "@/components/NotificationBell";
import { 
  Zap, 
  Flame, 
  Target, 
  Clock, 
  Activity,
  Hammer,
  ShieldCheck,
  Trophy,
  Loader2,
  TrendingUp
} from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";

export default function Forge() {
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
            // Update last active
            await updateDoc(docRef, {
              lastActive: serverTimestamp()
            });
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
          Heating the Forge...
        </p>
      </main>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f9faf9] dark:bg-background">
      <Sidebar />
      
      <main className="flex-1 ml-72 p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-10">
          
          {/* Header */}
          <div className="flex items-end justify-between border-b border-black/[0.08] dark:border-white/5 pb-10">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-green">
                <Hammer size={20} />
                <span className="text-[10px] font-black uppercase tracking-[4px]">Command Center</span>
              </div>
              <h1 className="font-condensed text-7xl font-black uppercase tracking-tight text-foreground leading-none">
                The <span className="text-green">Forge</span>
              </h1>
              <p className="text-xs font-bold text-text-muted uppercase tracking-widest opacity-60">
                Forge your discipline. ⚔️
              </p>
            </div>
            
            <div className="flex items-center gap-8">
              <NotificationBell />
              <div className="text-right">
                <div className="flex items-center gap-2 text-green justify-end mb-2">
                  <ShieldCheck size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Athlete ID Verified</span>
                </div>
                <p className="text-[10px] font-black uppercase tracking-[4px] text-text-muted">Current Streak</p>
                <div className="font-condensed text-6xl font-black text-foreground">12</div>
              </div>
            </div>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-12 gap-8">
            
            {/* Identity & Progress (8 cols) */}
            <div className="col-span-8 space-y-8">
              
              {/* Identity Card */}
              <div className="bg-white dark:bg-[#0e140b]/90 border border-black/[0.08] dark:border-border-subtle/50 p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-green/5 rounded-full blur-[80px] -mr-32 -mt-32" />
                <div className="relative z-10 space-y-8">
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-[2rem] bg-surface dark:bg-surface-accent border-2 border-green overflow-hidden shadow-[0_0_20px_rgba(106,191,69,0.2)]">
                      <img src={profile?.avatar} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-green mb-1">Archetype Profile</p>
                      <h2 className="font-condensed text-5xl font-black uppercase text-foreground leading-none">{profile?.archetype}</h2>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-6">
                    <div className="bg-surface dark:bg-surface-accent p-6 rounded-2xl border border-border-subtle">
                      <p className="text-[9px] font-black uppercase tracking-widest text-text-muted mb-2">Training Goal</p>
                      <p className="text-xs font-bold uppercase text-foreground">{profile?.trainingGoal?.[0] || "General"}</p>
                    </div>
                    <div className="bg-surface dark:bg-surface-accent p-6 rounded-2xl border border-border-subtle">
                      <p className="text-[9px] font-black uppercase tracking-widest text-text-muted mb-2">Energy Sync</p>
                      <p className="text-xs font-bold uppercase text-foreground">{profile?.workoutTime} Warrior</p>
                    </div>
                    <div className="bg-surface dark:bg-surface-accent p-6 rounded-2xl border border-border-subtle">
                      <p className="text-[9px] font-black uppercase tracking-widest text-text-muted mb-2">Discipline</p>
                      <p className="text-xs font-bold uppercase text-foreground">{profile?.commitmentLevel}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grind Stats */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white dark:bg-[#0e140b]/90 border border-black/[0.08] dark:border-border-subtle/50 p-8 rounded-[2rem] space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="font-condensed text-2xl font-black uppercase text-foreground">Grind Stats</h4>
                    <Activity size={20} className="text-green" />
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold uppercase text-text-muted tracking-widest">Workouts Sync</span>
                      <span className="text-xs font-black text-foreground">24</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold uppercase text-text-muted tracking-widest">Shared Iron</span>
                      <span className="text-xs font-black text-foreground">12.5k lbs</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold uppercase text-text-muted tracking-widest">Grid Rank</span>
                      <span className="text-xs font-black text-green">Top 8%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-foreground text-background p-8 rounded-[2rem] space-y-6 relative overflow-hidden">
                  <div className="absolute bottom-0 right-0 w-32 h-32 bg-green/20 rounded-full blur-[40px] -mr-16 -mb-16" />
                  <div className="flex items-center justify-between relative z-10">
                    <h4 className="font-condensed text-2xl font-black uppercase">Elite Status</h4>
                    <Trophy size={20} className="text-green" />
                  </div>
                  <div className="space-y-2 relative z-10">
                    <p className="text-3xl font-black font-condensed uppercase leading-none">Vanguard <br />Athlete</p>
                    <p className="text-[9px] font-bold uppercase tracking-widest opacity-60">Badge earned: 4 days ago</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Quick Actions & Activity (4 cols) */}
            <div className="col-span-4 space-y-8">
              
              {/* Quick Actions */}
              <div className="bg-surface dark:bg-surface-accent border border-border-subtle p-8 rounded-[2.5rem] space-y-6">
                <h3 className="font-condensed text-2xl font-black uppercase text-foreground">Quick Actions</h3>
                <div className="space-y-3">
                  <button onClick={() => router.push("/arena")} className="w-full p-4 bg-green rounded-xl text-dark font-black uppercase tracking-widest text-[10px] flex items-center justify-between group">
                    Enter Arena
                    <Swords size={16} className="group-hover:rotate-12 transition-transform" />
                  </button>
                  <button onClick={() => router.push("/syncs")} className="w-full p-4 bg-white dark:bg-background border border-border-subtle rounded-xl text-foreground font-black uppercase tracking-widest text-[10px] flex items-center justify-between group">
                    Sync Partners
                    <Users2 size={16} className="group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Progress Tracker */}
              <div className="bg-white dark:bg-[#0e140b]/90 border border-black/[0.08] dark:border-border-subtle/50 p-8 rounded-[2.5rem] space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-condensed text-2xl font-black uppercase text-foreground">Progress</h3>
                  <TrendingUp size={20} className="text-green" />
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
                      <span className="text-text-muted">Warrior Level</span>
                      <span className="text-green">Lvl 14</span>
                    </div>
                    <div className="h-1.5 w-full bg-surface dark:bg-surface-accent rounded-full overflow-hidden">
                      <div className="h-full bg-green w-[70%] shadow-[0_0_10px_rgba(106,191,69,0.3)]" />
                    </div>
                  </div>
                  <p className="text-[10px] font-bold text-text-muted italic opacity-60 text-center">
                    "Discipline is the bridge between goals and accomplishment."
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

// Re-using these icons from Sidebar
import { Swords, Users2 } from "lucide-react";
