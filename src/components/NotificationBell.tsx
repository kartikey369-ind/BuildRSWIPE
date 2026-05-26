"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Check, X, UserPlus, Zap, Flame } from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  doc, 
  updateDoc, 
  setDoc, 
  serverTimestamp,
  orderBy,
  limit
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [requests, setRequests] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    // 1. Listen for pending connection requests
    const qRequests = query(
      collection(db, "connectionRequests"),
      where("receiverId", "==", user.uid),
      where("status", "==", "pending"),
      orderBy("createdAt", "desc"),
      limit(10)
    );

    const unsubRequests = onSnapshot(qRequests, (snapshot) => {
      const newRequests = snapshot.docs.map(doc => ({
        id: doc.id,
        type: "request",
        ...doc.data()
      }));
      setRequests(newRequests);
    });

    // 2. Listen for other notifications (like accepted syncs)
    const qNotifs = query(
      collection(db, "notifications"),
      where("receiverId", "==", user.uid),
      where("status", "==", "unread"),
      orderBy("createdAt", "desc"),
      limit(10)
    );

    const unsubNotifs = onSnapshot(qNotifs, (snapshot) => {
      const newNotifs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setNotifications(newNotifs);
    });

    return () => {
      unsubRequests();
      unsubNotifs();
    };
  }, []);

  useEffect(() => {
    setUnreadCount(requests.length + notifications.length);
  }, [requests, notifications]);

  const markNotifRead = async (notifId: string) => {
    try {
      await updateDoc(doc(db, "notifications", notifId), {
        status: "read"
      });
    } catch (err) {
      console.error("Error marking notification read:", err);
    }
  };

  const handleAccept = async (request: any) => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const matchId = [request.senderId, request.receiverId].sort().join("_");
      
      // 1. Create match
      await setDoc(doc(db, "matches", matchId), {
        users: [request.senderId, request.receiverId],
        timestamp: serverTimestamp(),
        lastMessage: "The grind starts now.",
        lastMessageTime: serverTimestamp()
      });

      // 2. Update request status
      await updateDoc(doc(db, "connectionRequests", request.id), {
        status: "accepted",
        acceptedAt: serverTimestamp()
      });

      // 3. Create a notification for the sender
      await setDoc(doc(db, "notifications", `accept_${request.id}`), {
        receiverId: request.senderId,
        type: "sync_accepted",
        senderName: user.displayName || "Someone",
        senderId: user.uid,
        status: "unread",
        createdAt: serverTimestamp()
      });

      router.push(`/syncs`);
      setIsOpen(false);
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

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-4 bg-surface dark:bg-surface-accent border border-border-subtle rounded-2xl text-text-muted hover:text-green transition-colors group"
      >
        <Bell size={20} className={cn(unreadCount > 0 && "animate-pulse")} />
        {unreadCount > 0 && (
          <span className="absolute top-3 right-3 w-4 h-4 bg-red-500 rounded-full border-2 border-white dark:border-background flex items-center justify-center text-[8px] font-black text-white">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-4 w-80 bg-white dark:bg-[#0e140b] border border-black/[0.08] dark:border-white/5 rounded-[2rem] shadow-2xl z-50 overflow-hidden"
            >
              <div className="p-6 border-b border-black/[0.08] dark:border-white/5 flex items-center justify-between bg-surface/50 dark:bg-surface-accent/50">
                <h3 className="font-condensed text-xl font-black uppercase tracking-widest text-foreground">Notifications</h3>
                <span className="text-[9px] font-black uppercase tracking-widest text-green">{unreadCount} Pending</span>
              </div>

              <div className="max-h-[400px] overflow-y-auto">
                {requests.length === 0 && notifications.length === 0 ? (
                  <div className="p-12 text-center space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-surface dark:bg-surface-accent border border-border-subtle flex items-center justify-center mx-auto text-text-muted opacity-20">
                      <Bell size={24} />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-text-muted opacity-60">No new notifications</p>
                  </div>
                ) : (
                  <div className="divide-y divide-black/[0.08] dark:divide-white/5">
                    {/* Connection Requests */}
                    {requests.map((request) => (
                      <div key={request.id} className="p-6 hover:bg-surface/30 dark:hover:bg-surface-accent/20 transition-colors">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-xl border-2 border-green/30 overflow-hidden shrink-0">
                            <img src={request.senderAvatar} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <p className="text-[10px] font-bold text-foreground">
                              <span className="text-green uppercase font-black tracking-widest">{request.senderName}</span>
                              <span className="text-text-muted ml-1">wants to train with you.</span>
                            </p>
                            <div className="flex gap-2 pt-2">
                              <button 
                                onClick={() => handleAccept(request)}
                                className="flex-1 py-2 bg-green rounded-lg text-dark text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-1"
                              >
                                <Check size={12} strokeWidth={3} />
                                Accept
                              </button>
                              <button 
                                onClick={() => handleDecline(request)}
                                className="flex-1 py-2 bg-surface dark:bg-surface-accent border border-border-subtle rounded-lg text-text-muted text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-1"
                              >
                                <X size={12} strokeWidth={3} />
                                Decline
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Other Notifications */}
                    {notifications.map((notif) => (
                      <div key={notif.id} className="p-6 hover:bg-surface/30 dark:hover:bg-surface-accent/20 transition-colors">
                        <div 
                          className="flex items-start gap-4 cursor-pointer"
                          onClick={() => {
                            markNotifRead(notif.id);
                            if (notif.type === "sync_accepted") router.push('/syncs');
                            setIsOpen(false);
                          }}
                        >
                          <div className="w-10 h-10 rounded-xl bg-green/10 flex items-center justify-center text-green shrink-0">
                            {notif.type === "sync_accepted" ? <Flame size={20} /> : <Bell size={20} />}
                          </div>
                          <div className="flex-1 space-y-1">
                            <p className="text-[10px] font-bold text-foreground">
                              <span className="text-green uppercase font-black tracking-widest">{notif.senderName}</span>
                              <span className="text-text-muted ml-1">accepted your sync request!</span>
                            </p>
                            <p className="text-[8px] font-black uppercase tracking-widest text-text-muted opacity-60">
                              Start the grind together.
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-4 bg-surface/50 dark:bg-surface-accent/50 text-center">
                <button 
                  onClick={() => {
                    router.push('/syncs');
                    setIsOpen(false);
                  }}
                  className="text-[9px] font-black uppercase tracking-widest text-green hover:underline"
                >
                  View all activity
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
