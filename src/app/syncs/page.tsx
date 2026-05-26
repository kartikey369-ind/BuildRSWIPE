"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { auth, db } from "@/lib/firebase";
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  getDoc,
  orderBy,
  onSnapshot,
  setDoc,
  updateDoc,
  serverTimestamp
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { NotificationBell } from "@/components/NotificationBell";
import { 
  Users2, 
  Flame, 
  Zap,
  Loader2,
  Calendar,
  ChevronRight
} from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";
import { calculateCompatibility, UserProfile } from "@/lib/utils";

export default function Syncs() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState<any[]>([]);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // 1. Get current user
          const userDoc = await getDoc(doc(db, "users", user.uid));
          const userData = { uid: user.uid, ...userDoc.data() } as UserProfile;
          setCurrentUser(userData);

          // 2. Fetch matches where current user is a participant
          const matchesQuery = query(
            collection(db, "matches"), 
            where("users", "array-contains", user.uid),
            orderBy("timestamp", "desc")
          );
          
          const unsubMatches = onSnapshot(matchesQuery, async (snapshot) => {
            const fetchedMatches = await Promise.all(snapshot.docs.map(async (matchDoc) => {
              const matchData = matchDoc.data();
              const otherUserId = matchData.users.find((id: string) => id !== user.uid);
              
              const otherUserDoc = await getDoc(doc(db, "users", otherUserId));
              const otherUserData = { uid: otherUserId, ...otherUserDoc.data() } as UserProfile;
              
              const { score, alignment } = calculateCompatibility(userData, otherUserData);
              
              return {
                id: matchDoc.id,
                user: otherUserData,
                compatibility: score,
                alignment,
                lastMessage: matchData.lastMessage,
                timestamp: matchData.timestamp
              };
            }));
            setMatches(fetchedMatches);
          });

          // 3. Fetch pending incoming requests
          const requestsQuery = query(
            collection(db, "connectionRequests"),
            where("receiverId", "==", user.uid),
            where("status", "==", "pending"),
            orderBy("createdAt", "desc")
          );

          const unsubRequests = onSnapshot(requestsQuery, (snapshot) => {
            const requests = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
            setPendingRequests(requests);
          });

          setLoading(false);
          return () => {
            unsubMatches();
            unsubRequests();
          };
        } catch (err) {
          console.error("Error fetching syncs:", err);
          setLoading(false);
        }
      } else {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleAccept = async (request: any) => {
    try {
      const matchId = [request.senderId, request.receiverId].sort().join("_");
      await setDoc(doc(db, "matches", matchId), {
        users: [request.senderId, request.receiverId],
        timestamp: serverTimestamp(),
        lastMessage: "The grind starts now.",
        lastMessageTime: serverTimestamp()
      });
      await updateDoc(doc(db, "connectionRequests", request.id), {
        status: "accepted",
        acceptedAt: serverTimestamp()
      });
    } catch (err) {
      console.error("Error accepting request:", err);
    }
  };

  const handleDecline = async (request: any) => {
    try {
      await updateDoc(doc(db, "connectionRequests", request.id), {
        status: "declined",
        declinedAt: serverTimestamp()
      });
    } catch (err) {
      console.error("Error declining request:", err);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex flex-col items-center justify-center gap-6">
        <Loader2 size={48} className="text-green animate-spin" />
        <p className="font-condensed text-xl font-black uppercase tracking-[4px] text-text-muted">
          Loading Syncs...
        </p>
      </main>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f9faf9] dark:bg-background">
      <Sidebar />
      
      <main className="flex-1 ml-72 p-10">
        <div className="max-w-5xl mx-auto space-y-10">
          
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-green">
                <Users2 size={20} />
                <span className="text-[10px] font-black uppercase tracking-[4px]">Training Syncs</span>
              </div>
              <h1 className="font-condensed text-7xl font-black uppercase tracking-tight text-foreground leading-none">
                Your <span className="text-green">Syncs</span>
              </h1>
              <p className="text-xs font-bold text-text-muted uppercase tracking-widest opacity-60">
                Stay beyond solo. Your forged accountability partners.
              </p>
            </div>
            <NotificationBell />
          </div>

          {/* Pending Requests */}
          {pendingRequests.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 text-orange-500">
                <Flame size={20} />
                <span className="text-[10px] font-black uppercase tracking-[4px]">Pending Forge Requests</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pendingRequests.map((request) => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white dark:bg-[#0e140b]/90 border-2 border-green/20 p-6 rounded-[2rem] flex items-center gap-6"
                  >
                    <div className="w-16 h-16 rounded-2xl border-2 border-green/30 overflow-hidden shrink-0">
                      <img src={request.senderAvatar} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <h4 className="font-condensed text-2xl font-black uppercase text-foreground leading-none">{request.senderName}</h4>
                      <p className="text-[9px] font-black uppercase tracking-widest text-text-muted">{request.senderArchetype}</p>
                      <div className="flex gap-2 pt-2">
                        <button 
                          onClick={() => handleAccept(request)}
                          className="flex-1 py-2 bg-green rounded-xl text-dark text-[9px] font-black uppercase tracking-widest hover:scale-[1.02] transition-transform"
                        >
                          Accept Sync
                        </button>
                        <button 
                          onClick={() => handleDecline(request)}
                          className="flex-1 py-2 bg-surface dark:bg-surface-accent border border-border-subtle rounded-xl text-text-muted text-[9px] font-black uppercase tracking-widest hover:text-red-500 hover:border-red-500/50 transition-all"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Syncs List */}
          <div className="space-y-6">
            {matches.length > 0 ? (
              matches.map((sync) => (
                <motion.div
                  key={sync.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => router.push(`/locker-room?match=${sync.id}`)}
                  className="bg-white dark:bg-[#0e140b]/90 border border-black/[0.08] dark:border-border-subtle/50 p-8 rounded-[2.5rem] flex items-center gap-8 group hover:border-green/30 transition-all cursor-pointer"
                >
                  <div className="w-24 h-24 rounded-[2rem] bg-surface dark:bg-surface-accent border-2 border-green/30 overflow-hidden shrink-0">
                    <img src={sync.user.avatar} alt="" className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1 grid grid-cols-4 gap-8">
                    <div className="col-span-1 space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-green">{sync.user.archetype}</p>
                      <h3 className="font-condensed text-3xl font-black uppercase text-foreground leading-none">{sync.user.name}</h3>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
                        <span className="text-[9px] font-bold uppercase text-text-muted tracking-widest">Active Recently</span>
                      </div>
                    </div>

                    <div className="col-span-1 flex flex-col justify-center border-l border-black/[0.08] dark:border-white/5 pl-8">
                      <p className="text-[9px] font-black uppercase tracking-widest text-text-muted mb-2">Alignment</p>
                      <p className="text-xs font-black uppercase text-foreground">{sync.alignment}</p>
                      <p className="text-[10px] font-bold text-green mt-1">{sync.compatibility}% Sync</p>
                    </div>

                    <div className="col-span-1 flex flex-col justify-center border-l border-black/[0.08] dark:border-white/5 pl-8">
                      <p className="text-[9px] font-black uppercase tracking-widest text-text-muted mb-2">Streak Together</p>
                      <div className="flex items-center gap-2">
                        <Flame size={18} className="text-orange-500" />
                        <span className="text-2xl font-black font-condensed text-foreground">{sync.user.streak || 0}</span>
                      </div>
                    </div>

                    <div className="col-span-1 flex flex-col justify-center border-l border-black/[0.08] dark:border-white/5 pl-8">
                      <p className="text-[9px] font-black uppercase tracking-widest text-text-muted mb-2">Last Message</p>
                      <p className="text-[10px] font-black uppercase text-foreground leading-tight truncate max-w-[150px]">{sync.lastMessage}</p>
                    </div>
                  </div>

                  <div className="w-12 h-12 rounded-2xl bg-surface dark:bg-surface-accent flex items-center justify-center text-text-muted group-hover:bg-green group-hover:text-dark transition-all">
                    <ChevronRight size={24} />
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-32 space-y-6">
                <div className="w-24 h-24 rounded-[2rem] bg-surface dark:bg-surface-accent border border-border-subtle flex items-center justify-center mx-auto text-text-muted">
                  <Users2 size={40} className="opacity-20" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-condensed text-3xl font-black uppercase text-foreground">No Syncs forged yet.</h3>
                  <p className="text-xs font-bold text-text-muted uppercase tracking-widest opacity-60">Enter the Arena to find your training partners.</p>
                </div>
                <button onClick={() => router.push("/arena")} className="px-8 py-4 bg-green text-dark font-black uppercase tracking-widest text-xs rounded-2xl hover:scale-105 transition-transform">
                  Enter The Arena
                </button>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
