"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { auth, db } from "@/lib/firebase";
import { 
  collection, 
  getDocs, 
  query, 
  where, 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp, 
  addDoc 
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { NotificationBell } from "@/components/NotificationBell";
import { 
  Swords, 
  MapPin, 
  Heart, 
  X, 
  Zap, 
  Loader2
} from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";
import { calculateCompatibility, UserProfile } from "@/lib/utils";

export default function Arena() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [athletes, setAthletes] = useState<(UserProfile & { compatibility: number, alignment: string })[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Fetch current user profile
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (!userDoc.exists()) {
            router.push("/profile-setup");
            return;
          }
          const userData = { uid: user.uid, ...userDoc.data() } as UserProfile;
          setCurrentUser(userData);

          // Fetch already liked/passed users to exclude them
          const likesQuery = query(collection(db, "likes"), where("from", "==", user.uid));
          const likesSnap = await getDocs(likesQuery);
          const actedUserIds = likesSnap.docs.map(doc => doc.data().to);
          actedUserIds.push(user.uid); // Also exclude self

          // Fetch all other users
          const usersSnap = await getDocs(collection(db, "users"));
          const otherUsers = usersSnap.docs
            .filter(doc => !actedUserIds.includes(doc.id))
            .map(doc => ({ uid: doc.id, ...doc.data() } as UserProfile));

          // Calculate compatibility for each
          const athletesWithComp = otherUsers.map(athlete => {
            const { score, alignment } = calculateCompatibility(userData, athlete);
            return { ...athlete, compatibility: score, alignment };
          });

          // Sort by compatibility
          athletesWithComp.sort((a, b) => b.compatibility - a.compatibility);
          
          setAthletes(athletesWithComp);
        } catch (err) {
          console.error("Error fetching arena data:", err);
        } finally {
          setLoading(false);
        }
      } else {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleLike = async () => {
    if (!currentUser || !athletes[currentIndex]) return;
    
    const targetAthlete = athletes[currentIndex];
    const requestId = `${currentUser.uid}_${targetAthlete.uid}`;

    try {
      // Create connection request
      await setDoc(doc(db, "connectionRequests", requestId), {
        senderId: currentUser.uid,
        receiverId: targetAthlete.uid,
        status: "pending",
        createdAt: serverTimestamp(),
        // Include some basic sender info for the notification
        senderName: currentUser.name,
        senderAvatar: currentUser.avatar,
        senderArchetype: currentUser.archetype
      });

      // Also save to likes for compatibility/discovery exclusion
      await setDoc(doc(db, "likes", requestId), {
        from: currentUser.uid,
        to: targetAthlete.uid,
        type: "like",
        timestamp: serverTimestamp()
      });

      setCurrentIndex(prev => prev + 1);
    } catch (err) {
      console.error("Error sending request:", err);
    }
  };

  const handlePass = async () => {
    if (!currentUser || !athletes[currentIndex]) return;
    
    const targetAthlete = athletes[currentIndex];
    const passId = `${currentUser.uid}_${targetAthlete.uid}`;

    try {
      await setDoc(doc(db, "likes", passId), {
        from: currentUser.uid,
        to: targetAthlete.uid,
        type: "pass",
        timestamp: serverTimestamp()
      });
      setCurrentIndex(prev => prev + 1);
    } catch (err) {
      console.error("Error handling pass:", err);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex flex-col items-center justify-center gap-6">
        <Loader2 size={48} className="text-green animate-spin" />
        <p className="font-condensed text-xl font-black uppercase tracking-[4px] text-text-muted">
          Entering the Arena...
        </p>
      </main>
    );
  }

  const currentAthlete = athletes[currentIndex];

  return (
    <div className="flex min-h-screen bg-[#f9faf9] dark:bg-background">
      <Sidebar />
      
      <main className="flex-1 ml-72 p-10 flex flex-col items-center">
        <div className="w-full max-w-4xl space-y-8">
          
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-green">
                <Swords size={18} />
                <span className="text-[10px] font-black uppercase tracking-[4px]">Discovery Battleground</span>
              </div>
              <h1 className="font-condensed text-5xl font-black uppercase text-foreground">The <span className="text-green">Arena</span></h1>
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest opacity-60">Find athletes built like you.</p>
            </div>
            <NotificationBell />
          </div>

          <div className="relative h-[650px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              {currentAthlete ? (
                <motion.div
                  key={currentAthlete.uid}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1.1, x: 100, rotate: 10 }}
                  className="w-full max-w-[500px] bg-white dark:bg-[#0e140b]/90 border border-black/[0.08] dark:border-border-subtle/50 rounded-[3rem] shadow-2xl overflow-hidden flex flex-col"
                >
                  {/* Image Section */}
                  <div className="relative h-[300px] bg-surface dark:bg-surface-accent">
                    <img src={currentAthlete.avatar} alt="" className="w-full h-full object-cover p-10" />
                    <div className="absolute top-6 right-6 px-4 py-2 bg-green rounded-full shadow-lg">
                      <span className="text-[10px] font-black uppercase tracking-widest text-dark">
                        {currentAthlete.compatibility}% Training Sync
                      </span>
                    </div>
                    <div className="absolute bottom-6 left-6 space-y-1">
                      <div className="flex items-center gap-2 text-white drop-shadow-lg">
                        <MapPin size={14} className="text-green" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Athlete Grid</span>
                      </div>
                      <h2 className="text-3xl font-condensed font-black uppercase text-white drop-shadow-lg">{currentAthlete.name}</h2>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-8 space-y-6 flex-1">
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-green/10 border border-green/20 rounded-full text-[9px] font-black uppercase tracking-widest text-green">
                        {currentAthlete.archetype}
                      </span>
                      <span className="px-3 py-1 bg-surface dark:bg-surface-accent border border-border-subtle rounded-full text-[9px] font-black uppercase tracking-widest text-text-muted">
                        {currentAthlete.vibe}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-left">
                      <div className="space-y-1">
                        <p className="text-[8px] font-black uppercase tracking-widest text-text-muted">Primary Goals</p>
                        <div className="flex flex-wrap gap-1">
                          {currentAthlete.trainingGoal?.map(g => (
                            <span key={g} className="text-[9px] font-bold text-foreground">{g}</span>
                          )) || <span className="text-[9px] font-bold text-text-muted">No goals set</span>}
                        </div>
                      </div>
                      <div className="space-y-1 text-right">
                        <p className="text-[8px] font-black uppercase tracking-widest text-text-muted">Discipline</p>
                        <p className="text-[10px] font-black text-green uppercase tracking-widest">{currentAthlete.commitmentLevel}</p>
                      </div>
                    </div>

                    <div className="bg-green/5 border border-green/10 p-4 rounded-2xl flex items-center gap-3">
                      <Zap size={16} className="text-green" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-foreground">
                        {currentAthlete.alignment}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between gap-4 pt-4">
                      <button 
                        onClick={handlePass}
                        className="flex-1 h-16 bg-surface dark:bg-surface-accent border border-border-subtle rounded-2xl flex items-center justify-center gap-3 text-text-muted hover:text-red-500 hover:border-red-500/50 transition-all group font-black uppercase tracking-widest text-[10px]"
                      >
                        Not My Pace
                        <X size={20} className="group-hover:rotate-90 transition-transform" />
                      </button>
                      <button 
                        onClick={handleLike}
                        className="flex-[1.5] h-16 bg-green rounded-2xl flex items-center justify-center gap-3 text-dark font-black uppercase tracking-widest text-[10px] shadow-[0_10px_30px_rgba(106,191,69,0.3)] hover:scale-[1.02] transition-transform"
                      >
                        Built Together
                        <Heart size={20} fill="currentColor" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center space-y-6"
                >
                  <div className="w-24 h-24 rounded-[3rem] bg-surface dark:bg-surface-accent border border-border-subtle flex items-center justify-center mx-auto text-text-muted">
                    <Swords size={40} className="opacity-20" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-condensed text-3xl font-black uppercase text-foreground">The Arena is quiet.</h3>
                    <p className="text-xs font-bold text-text-muted uppercase tracking-widest opacity-60">More athletes are yet to enter.</p>
                  </div>
                  <button 
                    onClick={() => router.push("/forge")}
                    className="px-8 py-4 bg-green text-dark font-black uppercase tracking-widest text-xs rounded-2xl hover:scale-105 transition-transform"
                  >
                    Return to Forge
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </main>
    </div>
  );
}
