import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface UserProfile {
  uid: string;
  name: string;
  archetype: string;
  trainingGoal: string[];
  workoutTime: string;
  motivation: string[];
  vibe: string;
  commitmentLevel: string;
  avatar: string;
  lastActive?: any;
  streak?: number;
}

export function calculateCompatibility(user1: UserProfile, user2: UserProfile) {
  let score = 0;
  let totalWeight = 0;

  // Ensure arrays exist
  const goals1 = user1.trainingGoal || [];
  const goals2 = user2.trainingGoal || [];
  const motivation1 = user1.motivation || [];
  const motivation2 = user2.motivation || [];

  // 1. Training Goals (Weight: 30)
  const sharedGoals = goals1.filter(g => goals2.includes(g));
  const goalScore = (sharedGoals.length / Math.max(goals1.length, goals2.length, 1)) * 30;
  score += goalScore || 0;
  totalWeight += 30;

  // 2. Workout Time (Weight: 25)
  if (user1.workoutTime && user2.workoutTime && user1.workoutTime === user2.workoutTime) {
    score += 25;
  }
  totalWeight += 25;

  // 3. Motivation (Weight: 20)
  const sharedMotivations = motivation1.filter(m => motivation2.includes(m));
  const motivationScore = (sharedMotivations.length / Math.max(motivation1.length, motivation2.length, 1)) * 20;
  score += motivationScore || 0;
  totalWeight += 20;

  // 4. Vibe (Weight: 15)
  if (user1.vibe && user2.vibe && user1.vibe === user2.vibe) {
    score += 15;
  }
  totalWeight += 15;

  // 5. Commitment (Weight: 10)
  const commitmentMap: { [key: string]: number } = {
    "Relentless": 3,
    "Dedicated": 2,
    "Consistent": 1
  };
  const c1 = commitmentMap[user1.commitmentLevel] || 0;
  const c2 = commitmentMap[user2.commitmentLevel] || 0;
  if (c1 > 0 && c2 > 0) {
    if (c1 === c2) {
      score += 10;
    } else if (Math.abs(c1 - c2) === 1) {
      score += 5;
    }
  }
  totalWeight += 10;

  const finalScore = Math.round((score / totalWeight) * 100);
  
  let alignment = "Moderate Alignment";
  if (finalScore >= 90) alignment = "Same Warrior Energy";
  else if (finalScore >= 80) alignment = "High Grind Alignment";
  else if (finalScore >= 70) alignment = "Built on Similar Discipline";

  return { score: finalScore, alignment };
}
