"use client";

import { useEffect } from "react";
import { auth, signInAnonymously } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useStore } from "@/store/useStore";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setAuthLoading } = useStore();

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

  return <>{children}</>;
}
