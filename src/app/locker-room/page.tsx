"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { auth, db } from "@/lib/firebase";
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  serverTimestamp, 
  doc, 
  getDoc,
  updateDoc,
  limit
} from "firebase/firestore";
import { useRouter, useSearchParams } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { NotificationBell } from "@/components/NotificationBell";
import { 
  MessagesSquare, 
  Send,
  Loader2,
  Plus,
  Flame,
  Zap,
  ChevronLeft
} from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";
import { UserProfile } from "@/lib/utils";

export default function LockerRoom() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const matchId = searchParams.get("match");
  
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeMatch, setActiveMatch] = useState<any>(null);
  const [otherUser, setOtherUser] = useState<UserProfile | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        if (matchId) {
          try {
            // 1. Fetch match details
            const matchDoc = await getDoc(doc(db, "matches", matchId));
            if (matchDoc.exists()) {
              const matchData = matchDoc.data();
              setActiveMatch({ id: matchDoc.id, ...matchData });
              
              const otherUserId = matchData.users.find((id: string) => id !== user.uid);
              const otherUserDoc = await getDoc(doc(db, "users", otherUserId));
              setOtherUser({ uid: otherUserId, ...otherUserDoc.data() } as UserProfile);
              
              // 2. Subscribe to messages
              const q = query(
                collection(db, "matches", matchId, "messages"),
                orderBy("timestamp", "asc"),
                limit(50)
              );
              
              const unsubMessages = onSnapshot(q, (snapshot) => {
                const msgs = snapshot.docs.map(doc => ({
                  id: doc.id,
                  ...doc.data()
                }));
                setMessages(msgs);
                setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
              });

              setLoading(false);
              return () => unsubMessages();
            }
          } catch (err) {
            console.error("Error loading chat:", err);
            setLoading(false);
          }
        } else {
          setLoading(false);
        }
      } else {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [router, matchId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !matchId || !currentUser) return;

    const msg = newMessage.trim();
    setNewMessage("");

    try {
      await addDoc(collection(db, "matches", matchId, "messages"), {
        text: msg,
        senderId: currentUser.uid,
        timestamp: serverTimestamp()
      });

      await updateDoc(doc(db, "matches", matchId), {
        lastMessage: msg,
        lastMessageTime: serverTimestamp()
      });
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex flex-col items-center justify-center gap-6">
        <Loader2 size={48} className="text-green animate-spin" />
        <p className="font-condensed text-xl font-black uppercase tracking-[4px] text-text-muted">
          Entering the Locker Room...
        </p>
      </main>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f9faf9] dark:bg-background">
      <Sidebar />
      
      <main className="flex-1 ml-72 flex flex-col h-screen overflow-hidden">
        
        {/* Header */}
        <div className="p-8 border-b border-black/[0.08] dark:border-white/5 flex items-center justify-between bg-white dark:bg-background/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-6">
            {matchId && (
              <button onClick={() => router.push("/syncs")} className="p-3 bg-surface dark:bg-surface-accent rounded-xl text-text-muted hover:text-foreground transition-colors">
                <ChevronLeft size={20} />
              </button>
            )}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-green">
                <MessagesSquare size={18} />
                <span className="text-[10px] font-black uppercase tracking-[4px]">
                  {otherUser ? `Chat with ${otherUser.name}` : "Community + Chat"}
                </span>
              </div>
              <h1 className="font-condensed text-4xl font-black uppercase text-foreground leading-none">
                The <span className="text-green">Locker Room</span>
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-6">
            {otherUser && (
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase tracking-widest text-green">Sync Active</p>
                  <p className="text-[9px] font-bold uppercase text-text-muted">Built together since today</p>
                </div>
                <div className="w-12 h-12 rounded-2xl border-2 border-green/30 overflow-hidden">
                  <img src={otherUser.avatar} alt="" className="w-full h-full object-cover" />
                </div>
              </div>
            )}
            <NotificationBell />
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-10 space-y-6">
          {!matchId ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
              <div className="w-24 h-24 rounded-[2rem] bg-surface dark:bg-surface-accent border border-border-subtle flex items-center justify-center mx-auto text-text-muted">
                <MessagesSquare size={40} className="opacity-20" />
              </div>
              <div className="space-y-2">
                <h3 className="font-condensed text-3xl font-black uppercase text-foreground">Locker Room is silent.</h3>
                <p className="text-xs font-bold text-text-muted uppercase tracking-widest opacity-60">Select a Sync partner to start the grind.</p>
              </div>
              <button onClick={() => router.push("/syncs")} className="px-8 py-4 bg-green text-dark font-black uppercase tracking-widest text-xs rounded-2xl">
                View Syncs
              </button>
            </div>
          ) : messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-40">
              <div className="w-20 h-20 rounded-[2rem] bg-surface dark:bg-surface-accent border border-border-subtle flex items-center justify-center mx-auto">
                <Zap size={32} className="text-green" />
              </div>
              <p className="font-condensed text-2xl font-black uppercase tracking-widest">The grind starts now.</p>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-6">
              {messages.map((msg) => {
                const isMe = msg.senderId === currentUser?.uid;
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, x: isMe ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[70%] space-y-2`}>
                      <div className={`p-5 rounded-3xl text-sm font-bold ${
                        isMe 
                        ? "bg-green text-dark rounded-tr-none" 
                        : "bg-white dark:bg-[#0e140b]/90 border border-black/[0.08] dark:border-border-subtle/50 text-foreground rounded-tl-none"
                      }`}>
                        {msg.text}
                      </div>
                      <p className={`text-[8px] font-black uppercase tracking-widest text-text-muted ${isMe ? "text-right" : "text-left"}`}>
                        {msg.timestamp?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        {matchId && (
          <div className="p-8 border-t border-black/[0.08] dark:border-white/5 bg-white dark:bg-background">
            <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto space-y-4">
              {isTyping && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-green pl-4"
                >
                  <div className="flex gap-1">
                    <span className="w-1 h-1 bg-green rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1 h-1 bg-green rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1 h-1 bg-green rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  Preparing for the grind...
                </motion.div>
              )}
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Drop some motivation..."
                  value={newMessage}
                  onChange={(e) => {
                    setNewMessage(e.target.value);
                    setIsTyping(e.target.value.length > 0);
                  }}
                  className="w-full bg-surface dark:bg-surface-accent border border-border-subtle rounded-2xl py-6 px-8 pr-20 text-sm font-bold placeholder:text-text-muted/50 focus:outline-none focus:border-green/30 transition-all"
                />
                <button 
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="absolute right-4 w-12 h-12 bg-green rounded-xl flex items-center justify-center text-dark hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
                >
                  <Send size={18} />
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
