"use client";

import { useEffect } from "react";
import { auth, signInAnonymously } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useStore } from "@/store/useStore";

import { Loader2, LayoutDashboard } from "lucide-react";
import { motion } from "framer-motion";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setAuthLoading, isDataLoaded, isAuthLoading } = useStore();

  useEffect(() => {
    // If Firebase isn't configured yet, just stop loading and return
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
      console.warn("Firebase is not configured. Please add your config to .env.local");
      setAuthLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        await useStore.getState().loadData(user.uid);
      } else {
        // Sign in anonymously if no user is found
        try {
          await signInAnonymously(auth);
        } catch (error) {
          console.error("Anonymous sign in failed:", error);
        }
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setAuthLoading]);

  // Premium full-screen loading state
  if (isAuthLoading || !isDataLoaded) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-background overflow-hidden relative">
        {/* Soft background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/5 blur-[100px] rounded-full pointer-events-none" />
        
        <motion.div
          initial={{ scale: 0.95, opacity: 0, filter: "blur(10px)" }}
          animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 flex flex-col items-center"
        >
          <div className="relative mb-8">
            {/* Outer rotating dashed ring */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-6 rounded-full border border-dashed border-accent/30"
            />
            {/* Inner rotating dotted ring reverse */}
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-10 rounded-full border border-dotted border-text-muted/20"
            />
            
            {/* Main glassmorphism logo block */}
            <div className="w-20 h-20 bg-surface border border-border/50 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.1)] flex items-center justify-center relative z-10 overflow-hidden backdrop-blur-xl">
              <motion.div
                animate={{ 
                  backgroundPosition: ["0% 0%", "100% 100%"],
                }}
                transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                className="absolute inset-0 opacity-20 bg-gradient-to-br from-accent via-transparent to-accent bg-[length:200%_200%]"
              />
              <LayoutDashboard className="w-8 h-8 text-accent relative z-20" />
            </div>
          </div>

          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-2xl font-bold tracking-tight text-text-primary mb-5"
          >
            HuntBoard
          </motion.h2>

          {/* Bouncing dots */}
          <div className="flex items-center justify-center gap-1.5 h-6">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ 
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{ 
                  duration: 1, 
                  repeat: Infinity, 
                  ease: "easeInOut", 
                  delay: i * 0.15 
                }}
                className="w-1.5 h-1.5 rounded-full bg-accent"
              />
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}
