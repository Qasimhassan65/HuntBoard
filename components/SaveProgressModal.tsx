"use client";

import { useStore } from "@/store/useStore";
import { auth, googleProvider } from "@/lib/firebase";
import { linkWithPopup } from "firebase/auth";
import { useState, useEffect } from "react";
import { X, ShieldCheck, Flame, LogIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function SaveProgressModal() {
  const { user, jobs, setAuthModalOpen } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [hasDismissed, setHasDismissed] = useState(false);

  // Check if we hit the 10 jobs milestone
  useEffect(() => {
    if (
      user?.isAnonymous && 
      jobs.length >= 10 && 
      !hasDismissed
    ) {
      setIsOpen(true);
    }
  }, [jobs.length, user, hasDismissed]);

  const handleSignIn = () => {
    setIsOpen(false);
    setAuthModalOpen(true);
  };

  const handleDismiss = () => {
    setHasDismissed(true);
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div 
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          className="bg-surface border border-border w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative"
        >
          <div className="absolute top-4 right-4">
            <button onClick={handleDismiss} className="text-text-muted hover:text-text-primary p-1 rounded-full hover:bg-surface-alt transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-orange-500/10 text-orange-500 rounded-full flex items-center justify-center mb-6">
              <Flame className="w-8 h-8" />
            </div>
            
            <h2 className="text-2xl font-bold text-text-primary mb-3">You're on fire! 🔥</h2>
            <p className="text-text-secondary mb-8 leading-relaxed">
              You've added 10 jobs to your pipeline. You are currently using a temporary session. 
              <span className="font-medium text-text-primary block mt-2">Sign in to permanently save your progress so you don't lose it if you clear your browser data.</span>
            </p>

            <button
              onClick={handleSignIn}
              className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 px-6 py-3.5 rounded-xl font-semibold transition-colors shadow-sm"
            >
              <LogIn className="w-5 h-5 mr-1" />
              Sign In to Save Progress
            </button>
            
            <p className="flex items-center gap-1.5 mt-5 text-xs text-text-muted">
              <ShieldCheck className="w-3.5 h-3.5" />
              We never post to your account
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
