"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { AuthNavbar } from "@/components/AuthNavbar";
import { 
  Zap, 
  Flame, 
  Target, 
  Clock, 
  MapPin, 
  Users, 
  Heart, 
  ChevronRight,
  Loader2,
  Trophy,
  Activity
} from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";

export default function Dashboard() {
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
          Entering Arena...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f9faf9] dark:bg-background transition-colors duration-500 pt-24 pb-12 px-6">
      <AuthNavbar />
      
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-green">
              <Activity size={20} />
              <span className="text-[10px] font-black uppercase tracking-[4px]">Live Grid Status: Active</span>
            </div>
            <h1 className="font-condensed text-5xl md:text-7xl font-black uppercase tracking-tight text-foreground leading-none">
              The <span className="text-green">Arena</span>
            </h1>
          </div>
          <div className="bg-surface dark:bg-surface-accent border border-border-subtle p-6 rounded-3xl flex items-center gap-6 shadow-xl">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-green shadow-[0_0_15px_rgba(106,191,69,0.3)]">
              <img src={profile?.avatar} alt="" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-1">Authenticated Athlete</p>
              <h3 className="font-condensed text-2xl font-black uppercase text-foreground">{profile?.name}</h3>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Identity Card */}
            <div className="bg-white dark:bg-[#0e140b]/90 border border-black/[0.08] dark:border-border-subtle/50 p-8 md:p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-green/5 rounded-full blur-[80px] -mr-32 -mt-32" />
              
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-green/10 rounded-full border border-green/20">
                    <Zap size={14} className="text-green" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-foreground">Training Identity</span>
                  </div>
                  <h2 className="font-condensed text-6xl font-black uppercase text-foreground leading-none">
                    {profile?.archetype}
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {profile?.trainingGoal?.map((goal: string) => (
                      <span key={goal} className="px-4 py-2 bg-surface dark:bg-surface-accent border border-border-subtle rounded-xl text-[10px] font-bold uppercase tracking-widest text-text-muted">
                        {goal}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="text-center md:text-right space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-[4px] text-text-muted">Today's Streak</p>
                  <div className="font-condensed text-8xl font-black text-green leading-none">
                    12
                  </div>
                  <p className="text-xs font-bold text-foreground/60 uppercase tracking-widest">Days Relentless</p>
                </div>
              </div>
            </div>

            {/* Potential Matches */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-condensed text-3xl font-black uppercase tracking-tight text-foreground">Potential Matches Nearby</h3>
                <button className="text-[10px] font-black uppercase tracking-widest text-green hover:underline">View All Grid</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-surface dark:bg-surface-accent border border-border-subtle p-6 rounded-[2rem] flex items-center justify-between group hover:border-green/50 transition-all cursor-pointer">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 rounded-2xl bg-background border border-border-subtle overflow-hidden relative">
                        <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${i === 1 ? 'Jack' : 'Luna'}`} alt="" className="w-full h-full object-cover" />
                        <div className="absolute bottom-1 right-1 w-3 h-3 bg-green rounded-full border-2 border-background" />
                      </div>
                      <div>
                        <h4 className="font-condensed text-xl font-black uppercase text-foreground">{i === 1 ? "The Warrior" : "The Endurer"}</h4>
                        <div className="flex items-center gap-2 text-text-muted">
                          <MapPin size={12} />
                          <span className="text-[10px] font-bold uppercase tracking-widest">0.8 miles away</span>
                        </div>
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-green/10 flex items-center justify-center text-green group-hover:bg-green group-hover:text-dark transition-all">
                      <Heart size={20} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column (4 cols) */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-surface dark:bg-surface-accent border border-border-subtle p-8 rounded-[2rem] space-y-4">
                <div className="flex items-center justify-between">
                  <Target size={24} className="text-green" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-green">High</span>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-1">Commitment Level</p>
                  <h4 className="font-condensed text-3xl font-black uppercase text-foreground">{profile?.commitmentLevel}</h4>
                </div>
              </div>

              <div className="bg-surface dark:bg-surface-accent border border-border-subtle p-8 rounded-[2rem] space-y-4">
                <div className="flex items-center justify-between">
                  <Clock size={24} className="text-green" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-green">Synced</span>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-1">Energy Sync</p>
                  <h4 className="font-condensed text-3xl font-black uppercase text-foreground">{profile?.workoutTime} Warrior</h4>
                </div>
              </div>
            </div>

            {/* Who Liked Your Grind */}
            <div className="bg-foreground text-background p-8 rounded-[2.5rem] space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green/20 rounded-full blur-[40px] -mr-16 -mt-16" />
              <div className="space-y-2 relative z-10">
                <h3 className="font-condensed text-3xl font-black uppercase leading-none">Who Liked <br />Your Grind</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">8 new athletes pinged you</p>
              </div>
              <div className="flex -space-x-4 relative z-10">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-12 h-12 rounded-full border-4 border-foreground bg-surface overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${i + 10}`} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
                <div className="w-12 h-12 rounded-full border-4 border-foreground bg-green text-dark flex items-center justify-center text-xs font-black">
                  +4
                </div>
              </div>
              <button className="w-full py-4 bg-green rounded-xl text-dark font-black uppercase tracking-widest text-xs group">
                <span className="flex items-center justify-center gap-2">
                  View Interactions
                  <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </div>

            {/* Arena Leaderboard Preview */}
            <div className="bg-surface dark:bg-surface-accent border border-border-subtle p-8 rounded-[2.5rem] space-y-6">
              <div className="flex items-center gap-3">
                <Trophy size={20} className="text-green" />
                <h3 className="font-condensed text-2xl font-black uppercase text-foreground">Arena Elite</h3>
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map((rank) => (
                  <div key={rank} className="flex items-center justify-between border-b border-border-subtle pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center gap-4">
                      <span className="font-condensed text-xl font-black text-text-muted">0{rank}</span>
                      <span className="text-xs font-bold uppercase tracking-widest text-foreground">Athlete_{rank}42</span>
                    </div>
                    <span className="text-[10px] font-black text-green">2.4k XP</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
