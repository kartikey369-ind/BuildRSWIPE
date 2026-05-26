"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { AuthNavbar } from "@/components/AuthNavbar";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { 
  Flame, 
  Target, 
  Clock, 
  Dumbbell, 
  MapPin, 
  Smile, 
  ChevronRight, 
  ChevronLeft,
  CheckCircle2,
  Zap,
  ShieldCheck,
  Award,
  Loader2,
  RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";
import { onAuthStateChanged } from "firebase/auth";

type Step = 1 | 2 | 3 | 4 | 5;

export default function ProfileSetup() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [checkingProfile, setCheckingProfile] = useState(true);
  const [showReveal, setShowReveal] = useState(false);
  const [calculatedArchetype, setCalculatedArchetype] = useState("");
  const [existingProfile, setExistingProfile] = useState<any>(null);
  const [error, setError] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    location: "",
    bio: "",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Felix", 
    workoutType: "",
    trainingGoal: [] as string[],
    experienceLevel: "",
    commitmentLevel: "",
    trainingVibe: "",
    workoutTime: "",
    motivation: [] as string[],
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setFormData(prev => ({ ...prev, name: user.displayName || "" }));
        
        // Check if profile already exists
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data();
            // Populate form with existing data for "Rebuild" flow
            setFormData({
              name: data.name || user.displayName || "",
              age: data.age || "",
              location: data.location || "",
              bio: data.bio || "",
              avatar: data.avatar || "https://api.dicebear.com/7.x/adventurer/svg?seed=Felix",
              workoutType: data.workoutType || "",
              trainingGoal: data.trainingGoal || [],
              experienceLevel: data.experienceLevel || "",
              commitmentLevel: data.commitmentLevel || "",
              trainingVibe: data.trainingVibe || "",
              workoutTime: data.workoutTime || "",
              motivation: data.motivation || [],
            });

            if (data.setupComplete) {
              setCalculatedArchetype(data.archetype || "The Warrior");
              setShowReveal(true);
            }
          }
        } catch (err) {
          console.error("Error checking profile:", err);
        } finally {
          setCheckingProfile(false);
        }
      } else {
        // Not logged in, send to login
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const progress = (step / 5) * 100;

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 5) as Step);
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1) as Step);

  const toggleMultiSelect = (field: "trainingGoal" | "motivation", value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((item) => item !== value)
        : [...prev[field], value],
    }));
  };

  const handleFinish = async () => {
    setLoading(true);
    setError("");
    try {
      if (!auth.currentUser) throw new Error("No user authenticated");

      // Calculate Training Archetype
      let archetype = "The Warrior";
      const goals = formData.trainingGoal;
      const motivation = formData.motivation;
      const type = formData.workoutType;

      const isEndurance = goals.includes("Endurance") || type === "Running";
      const isStrength = goals.includes("Strength") || goals.includes("Build Muscle") || type === "Gym";
      const isRelentless = formData.commitmentLevel === "Relentless" || formData.commitmentLevel === "Dedicated";
      const isAdventure = motivation.includes("Adventure");

      if (isEndurance && isAdventure) {
        archetype = "The Climber";
      } else if (isRelentless) {
        archetype = "The Relentless";
      } else if (isStrength && isEndurance) {
        archetype = "The Warrior";
      } else if (isStrength) {
        archetype = "The Builder";
      } else if (isEndurance) {
        archetype = "The Endurer";
      } else {
        archetype = "The Warrior";
      }

      await setDoc(doc(db, "users", auth.currentUser.uid), {
        ...formData,
        archetype,
        setupComplete: true,
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      setCalculatedArchetype(archetype);
      setShowReveal(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (showReveal) {
    const archetypeIcons: Record<string, string> = {
      "The Builder": "🏗️",
      "The Endurer": "🏔️",
      "The Warrior": "⚔️",
      "The Climber": "🧗",
      "The Relentless": "🔥"
    };

    return (
      <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center overflow-hidden">
        <AuthNavbar />
        
        {/* Animated Background Pulse */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1] 
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-green/20 rounded-full blur-[120px]" 
          />
        </div>

        <div className="z-10 space-y-12 max-w-2xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <p className="font-condensed text-xl font-black uppercase tracking-[8px] text-green animate-pulse">
              Identity Locked
            </p>
            <h1 className="font-condensed text-6xl md:text-8xl font-black uppercase tracking-tight text-foreground leading-none">
              You are <br />
              <motion.span 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                className="text-green block mt-4"
              >
                {calculatedArchetype}
              </motion.span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.8, type: "spring", stiffness: 100 }}
            className="text-[120px] md:text-[180px] leading-none drop-shadow-[0_0_30px_rgba(106,191,69,0.4)]"
          >
            {archetypeIcons[calculatedArchetype] || "⚔️"}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="pt-12 flex flex-col items-center gap-6"
          >
            <Button 
              onClick={() => router.push("/forge")} 
              className="px-12 py-6 rounded-2xl group relative overflow-hidden shadow-[0_20px_50px_rgba(106,191,69,0.3)] w-full md:w-auto"
            >
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="flex items-center gap-4 text-xl font-black uppercase tracking-widest relative z-10">
                Enter Arena
                <ChevronRight size={24} className="group-hover:translate-x-2 transition-transform" />
              </span>
            </Button>

            <button 
              onClick={() => {
                setShowReveal(false);
                setStep(1);
              }}
              className="text-[10px] font-black uppercase tracking-[3px] text-text-muted hover:text-green transition-colors flex items-center gap-2 py-2"
            >
              <RefreshCw size={12} />
              Rebuild Training Identity
            </button>
          </motion.div>
        </div>
      </main>
    );
  }

  if (checkingProfile) {
    return (
      <main className="min-h-screen bg-background flex flex-col items-center justify-center gap-6">
        <Loader2 size={48} className="text-green animate-spin" />
        <p className="font-condensed text-xl font-black uppercase tracking-[4px] text-text-muted animate-pulse">
          Retrieving Identity...
        </p>
      </main>
    );
  }


  return (
    <main className="min-h-screen bg-[#f9faf9] dark:bg-background transition-colors duration-500 pt-24 pb-12 selection:bg-green/30">
      <AuthNavbar />
      
      <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Sidebar: Progress & Branding (4 cols) */}
        <div className="lg:col-span-4 space-y-10 lg:sticky lg:top-32">
          <div>
            <h1 className="font-condensed text-5xl font-black uppercase tracking-tight text-foreground leading-none mb-4">
              Build Your <br /><span className="text-green">Training Identity</span>
            </h1>
            <p className="text-text-muted text-xs tracking-widest uppercase font-bold opacity-70">
              Built Beyond Solo starts here.
            </p>
          </div>

          {/* Commitment Meter / Progress Bar */}
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <span className="text-[10px] font-black uppercase tracking-[3px] text-foreground/60">
                Solo → Connected
              </span>
              <span className="text-green font-condensed text-2xl font-black">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="h-2 w-full bg-surface dark:bg-surface-accent rounded-full overflow-hidden border border-border-subtle">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-green shadow-[0_0_15px_rgba(106,191,69,0.4)]"
              />
            </div>
            <p className="text-[10px] font-bold text-text-muted/60 italic">
              You’re {Math.round(progress)}% Built Beyond Solo
            </p>
          </div>

          <div className="hidden lg:block space-y-6 pt-10 border-t border-border-subtle">
            <div className="flex items-center gap-4 group">
              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center border transition-all", step >= 1 ? "bg-green border-green text-dark" : "border-border-subtle text-text-muted")}>
                {step > 1 ? <CheckCircle2 size={20} /> : "01"}
              </div>
              <span className={cn("text-xs font-black uppercase tracking-widest", step === 1 ? "text-foreground" : "text-text-muted")}>Basics</span>
            </div>
            <div className="flex items-center gap-4">
              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center border transition-all", step >= 2 ? "bg-green border-green text-dark" : "border-border-subtle text-text-muted")}>
                {step > 2 ? <CheckCircle2 size={20} /> : "02"}
              </div>
              <span className={cn("text-xs font-black uppercase tracking-widest", step === 2 ? "text-foreground" : "text-text-muted")}>Training Goals</span>
            </div>
            <div className="flex items-center gap-4">
              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center border transition-all", step >= 3 ? "bg-green border-green text-dark" : "border-border-subtle text-text-muted")}>
                {step > 3 ? <CheckCircle2 size={20} /> : "03"}
              </div>
              <span className={cn("text-xs font-black uppercase tracking-widest", step === 3 ? "text-foreground" : "text-text-muted")}>Commitment</span>
            </div>
            <div className="flex items-center gap-4">
              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center border transition-all", step >= 4 ? "bg-green border-green text-dark" : "border-border-subtle text-text-muted")}>
                {step > 4 ? <CheckCircle2 size={20} /> : "04"}
              </div>
              <span className={cn("text-xs font-black uppercase tracking-widest", step === 4 ? "text-foreground" : "text-text-muted")}>Energy & Sync</span>
            </div>
            <div className="flex items-center gap-4">
              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center border transition-all", step >= 5 ? "bg-green border-green text-dark" : "border-border-subtle text-text-muted")}>
                {step === 5 && loading ? <Zap size={20} className="animate-pulse" /> : "05"}
              </div>
              <span className={cn("text-xs font-black uppercase tracking-widest", step === 5 ? "text-foreground" : "text-text-muted")}>Motivation</span>
            </div>
          </div>
        </div>

        {/* Right Content Area (8 cols) */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-background dark:bg-[#0e140b]/90 border border-black/[0.08] dark:border-border-subtle/50 p-8 md:p-12 rounded-[2.5rem] shadow-sm dark:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] min-h-[500px] flex flex-col"
            >
              
              {/* Step 1: Basics */}
              {step === 1 && (
                <div className="space-y-8 flex-1">
                  <div className="space-y-2">
                    <h2 className="font-condensed text-3xl font-black uppercase text-foreground">The Foundation</h2>
                    <p className="text-text-muted text-sm font-medium">Let the network know who you are.</p>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[11px] font-bold tracking-[2px] uppercase text-text-muted ml-1">Choose Your Training Identity</label>
                    <div className="flex flex-wrap gap-6">
                      {[
                        { name: "The Grinder", seed: "Felix" },
                        { name: "The Sprinter", seed: "Aneka" },
                        { name: "The Titan", seed: "Max" },
                        { name: "The Pro", seed: "Jasper" },
                        { name: "The Ace", seed: "Bella" }
                      ].map((avatar) => {
                        const url = `https://api.dicebear.com/7.x/adventurer/svg?seed=${avatar.seed}`;
                        return (
                          <motion.button
                            key={avatar.seed}
                            whileHover={{ scale: 1.1, rotate: 2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setFormData({...formData, avatar: url});
                            }}
                            className={cn(
                              "relative w-20 h-20 rounded-2xl overflow-hidden transition-all border-2",
                              formData.avatar === url 
                                ? "border-green ring-4 ring-green/20 scale-110 z-10" 
                                : "border-border-subtle opacity-40 hover:opacity-100"
                            )}
                          >
                            <img 
                              src={url} 
                              alt="" 
                              className="w-full h-full object-cover bg-surface-accent"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${avatar.name}`;
                              }}
                            />
                            {formData.avatar === url && (
                              <motion.div 
                                layoutId="avatar-check"
                                className="absolute inset-0 bg-green/10 flex items-center justify-center"
                              >
                                <CheckCircle2 size={24} className="text-green drop-shadow-md" />
                              </motion.div>
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                    <p className="text-[10px] font-bold text-text-muted/60 uppercase tracking-widest ml-1">
                      Animated avatars for your network presence
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input 
                      label="Athlete Name" 
                      placeholder="Kartikey" 
                      value={formData.name} 
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                    <Input 
                      label="Age" 
                      type="number" 
                      placeholder="24" 
                      value={formData.age}
                      onChange={(e) => setFormData({...formData, age: e.target.value})}
                    />
                  </div>
                  <Input 
                    label="Location" 
                    icon={<MapPin size={18} />} 
                    placeholder="New York, NY" 
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                  />
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold tracking-[2px] uppercase text-foreground/70 dark:text-text-muted/80 ml-1">Brief Bio</label>
                    <textarea 
                      className="w-full h-32 bg-white dark:bg-background/50 border border-border-subtle dark:border-border-subtle rounded-xl p-4 text-foreground focus:border-green focus:ring-4 focus:ring-green/10 dark:focus:ring-green/5 transition-all outline-none placeholder:text-text-muted/40 resize-none"
                      placeholder="Serious lifter looking for accountability partners..."
                      value={formData.bio}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Training Goals */}
              {step === 2 && (
                <div className="space-y-8 flex-1">
                  <div className="space-y-2">
                    <h2 className="font-condensed text-3xl font-black uppercase text-foreground">Mission Profile</h2>
                    <p className="text-text-muted text-sm font-medium">Select your primary objectives.</p>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {[
                      "Build Muscle", "Lose Fat", "Endurance", 
                      "Strength", "Athletic Performance", "Mobility", "General Fitness"
                    ].map((goal) => (
                      <button
                        key={goal}
                        onClick={() => toggleMultiSelect("trainingGoal", goal)}
                        className={cn(
                          "p-4 rounded-2xl border text-xs font-black uppercase tracking-widest transition-all text-center flex flex-col items-center gap-3 group",
                          formData.trainingGoal.includes(goal)
                            ? "bg-green border-green text-dark shadow-[0_8px_20px_rgba(106,191,69,0.3)]"
                            : "bg-surface/50 border-border-subtle text-text-muted hover:border-green/50"
                        )}
                      >
                        <Target size={20} className={cn("transition-transform group-hover:scale-110", formData.trainingGoal.includes(goal) ? "text-dark" : "text-green")} />
                        {goal}
                      </button>
                    ))}
                  </div>
                  <div className="space-y-4 pt-6 border-t border-border-subtle">
                    <label className="text-[11px] font-bold tracking-[2px] uppercase text-text-muted ml-1">Workout Type</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {["Gym", "Running", "Calisthenics", "Mixed"].map((type) => (
                        <button
                          key={type}
                          onClick={() => setFormData({...formData, workoutType: type})}
                          className={cn(
                            "px-4 py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all",
                            formData.workoutType === type
                              ? "bg-foreground text-background border-foreground shadow-md"
                              : "border-border-subtle text-text-muted hover:border-foreground/30"
                          )}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4 pt-6 border-t border-border-subtle">
                    <label className="text-[11px] font-bold tracking-[2px] uppercase text-text-muted ml-1">Experience Level</label>
                    <div className="flex flex-wrap gap-3">
                      {["Novice", "Intermediate", "Advanced", "Elite"].map((lvl) => (
                        <button
                          key={lvl}
                          onClick={() => setFormData({...formData, experienceLevel: lvl})}
                          className={cn(
                            "px-6 py-3 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all",
                            formData.experienceLevel === lvl
                              ? "bg-foreground text-background border-foreground"
                              : "border-border-subtle text-text-muted hover:border-foreground/30"
                          )}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Commitment Meter */}
              {step === 3 && (
                <div className="space-y-8 flex-1">
                  <div className="space-y-2">
                    <h2 className="font-condensed text-3xl font-black uppercase text-foreground">Commitment Level</h2>
                    <p className="text-text-muted text-sm font-medium">How relentless is your discipline?</p>
                  </div>
                  <div className="space-y-6 py-10">
                    {["Casual", "Consistent", "Dedicated", "Relentless"].map((level, i) => (
                      <button
                        key={level}
                        onClick={() => setFormData({...formData, commitmentLevel: level})}
                        className={cn(
                          "w-full p-6 rounded-2xl border flex items-center justify-between group transition-all",
                          formData.commitmentLevel === level
                            ? "bg-green/10 border-green shadow-[0_8px_30px_rgba(106,191,69,0.1)]"
                            : "bg-surface/30 border-border-subtle hover:border-green/30"
                        )}
                      >
                        <div className="flex items-center gap-6">
                          <div className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center font-black transition-colors",
                            formData.commitmentLevel === level ? "bg-green text-dark" : "bg-surface-accent text-green"
                          )}>
                            {i + 1}
                          </div>
                          <div className="text-left">
                            <h4 className={cn("font-condensed text-xl font-black uppercase tracking-wider transition-colors", formData.commitmentLevel === level ? "text-foreground" : "text-text-muted")}>
                              {level}
                            </h4>
                            <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest opacity-60">
                              {level === "Casual" && "Flexible training as time permits"}
                              {level === "Consistent" && "Routine-focused with regular sessions"}
                              {level === "Dedicated" && "Strict schedule and goal tracking"}
                              {level === "Relentless" && "Extreme discipline, zero missed sessions"}
                            </p>
                          </div>
                        </div>
                        {formData.commitmentLevel === level && (
                          <CheckCircle2 size={24} className="text-green" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4: Training Energy & Schedule */}
              {step === 4 && (
                <div className="space-y-8 flex-1">
                  <div className="space-y-2">
                    <h2 className="font-condensed text-3xl font-black uppercase text-foreground">Energy & Sync</h2>
                    <p className="text-text-muted text-sm font-medium">What pushes you best?</p>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[11px] font-bold tracking-[2px] uppercase text-text-muted ml-1">Training Vibe</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        "High intensity motivator", "Silent focused grinder", 
                        "Competitive partner", "Chill disciplined partner"
                      ].map((vibe) => (
                        <button
                          key={vibe}
                          onClick={() => setFormData({...formData, trainingVibe: vibe})}
                          className={cn(
                            "p-5 rounded-2xl border text-xs font-black uppercase tracking-widest transition-all text-left flex items-center gap-4",
                            formData.trainingVibe === vibe
                              ? "bg-green border-green text-dark shadow-[0_8px_20px_rgba(106,191,69,0.3)]"
                              : "bg-surface/50 border-border-subtle text-text-muted hover:border-green/50"
                          )}
                        >
                          <Smile size={20} className={cn(formData.trainingVibe === vibe ? "text-dark" : "text-green")} />
                          {vibe}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4 pt-6">
                    <label className="text-[11px] font-bold tracking-[2px] uppercase text-text-muted ml-1">Best Workout Time</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { label: "Sunrise Grind", icon: "🌅", val: "morning" },
                        { label: "Midday Push", icon: "☀️", val: "midday" },
                        { label: "Evening Iron", icon: "🌆", val: "evening" },
                        { label: "Night Warrior", icon: "🌙", val: "night" }
                      ].map((t) => (
                        <button
                          key={t.val}
                          onClick={() => setFormData({...formData, workoutTime: t.val})}
                          className={cn(
                            "p-4 rounded-2xl border text-[9px] font-black uppercase tracking-widest transition-all text-center flex flex-col gap-2",
                            formData.workoutTime === t.val
                              ? "bg-foreground text-background border-foreground shadow-lg"
                              : "bg-surface/30 border-border-subtle text-text-muted hover:border-foreground/30"
                          )}
                        >
                          <span className="text-2xl">{t.icon}</span>
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Motivation */}
              {step === 5 && (
                <div className="space-y-8 flex-1">
                  <div className="space-y-2">
                    <h2 className="font-condensed text-3xl font-black uppercase text-foreground">Why Do You Train?</h2>
                    <p className="text-text-muted text-sm font-medium">Add emotional matching to your profile.</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {[
                      "Discipline", "Confidence", "Health", "Competition", 
                      "Mental Strength", "Adventure", "Recovery", "Growth"
                    ].map((m) => (
                      <button
                        key={m}
                        onClick={() => toggleMultiSelect("motivation", m)}
                        className={cn(
                          "px-6 py-4 rounded-2xl border text-xs font-black uppercase tracking-widest transition-all flex items-center gap-3",
                          formData.motivation.includes(m)
                            ? "bg-green border-green text-dark shadow-[0_8px_20px_rgba(106,191,69,0.3)]"
                            : "bg-surface/50 border-border-subtle text-text-muted hover:border-green/50"
                        )}
                      >
                        <Award size={18} className={cn(formData.motivation.includes(m) ? "text-dark" : "text-green")} />
                        {m}
                      </button>
                    ))}
                  </div>

                  {error && (
                    <div className="text-red-500 text-[10px] font-bold tracking-wider uppercase bg-red-500/5 p-4 rounded-xl border border-red-500/20 text-center">
                      {error}
                    </div>
                  )}

                  <div className="bg-green/5 border border-green/20 p-6 rounded-2xl space-y-3">
                    <div className="flex items-center gap-3 text-green">
                      <ShieldCheck size={20} />
                      <span className="text-[10px] font-black uppercase tracking-[3px]">Verified Setup</span>
                    </div>
                    <p className="text-xs text-text-muted/80 leading-relaxed">
                      Completing this identity setup unlocks high-fidelity matching and compatibility scores with athletes in your local grid.
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation Footer */}
              <div className="mt-12 pt-8 border-t border-border-subtle flex items-center justify-between">
                <button
                  onClick={prevStep}
                  disabled={step === 1}
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[3px] text-text-muted hover:text-foreground transition-colors disabled:opacity-0"
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>

                {step < 5 ? (
                  <Button onClick={nextStep} className="px-10 py-5 rounded-2xl group">
                    <span className="flex items-center gap-3">
                      Continue
                      <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Button>
                ) : (
                  <Button 
                    onClick={handleFinish} 
                    disabled={loading}
                    className="px-10 py-5 rounded-2xl group shadow-[0_15px_40px_rgba(106,191,69,0.3)]"
                  >
                    <span className="flex items-center gap-3">
                      {loading ? "SAVING IDENTITY..." : "FINISH BUILD"}
                      {!loading && <CheckCircle2 size={18} className="group-hover:scale-110 transition-transform" />}
                    </span>
                  </Button>
                )}
              </div>

            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
