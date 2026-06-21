"use client";

import { useStore } from "@/store/useStore";
import { X, Building2, MapPin, Mail, Link as LinkIcon, MoreHorizontal } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export function ContactDrawer() {
  const { isContactDrawerOpen, selectedContact, setContactDrawerOpen } = useStore();

  return (
    <AnimatePresence>
      {isContactDrawerOpen && selectedContact && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setContactDrawerOpen(false)}
            className="fixed inset-0 bg-black/40 z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-surface border-l border-border z-50 shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-border flex justify-between items-start bg-surface-alt">
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 rounded-full bg-accent/10 border border-border flex items-center justify-center text-accent font-bold text-xl">
                  {selectedContact.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-text-primary">{selectedContact.name}</h2>
                  <p className="text-text-secondary font-medium">{selectedContact.title} at {selectedContact.company}</p>
                </div>
              </div>
              <button 
                onClick={() => setContactDrawerOpen(false)}
                className="text-text-muted hover:text-text-primary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              
              {/* Quick Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-text-muted uppercase tracking-wider font-semibold">Status</span>
                  <span className="text-sm font-medium px-2 py-1 bg-surface-alt border border-border text-text-secondary rounded w-fit">
                    {selectedContact.status}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-text-muted uppercase tracking-wider font-semibold">Last Contact</span>
                  <span className="text-sm font-medium text-text-primary">
                    {selectedContact.lastContact}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 bg-surface-alt border border-border text-text-primary hover:border-accent px-4 py-2 rounded-md font-medium transition-colors text-sm">
                  <Mail className="w-4 h-4 text-text-muted" /> Email
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 bg-surface-alt border border-border text-text-primary hover:border-[#0a66c2] px-4 py-2 rounded-md font-medium transition-colors text-sm">
                  <LinkIcon className="w-4 h-4 text-[#0a66c2]" /> LinkedIn
                </button>
              </div>

              {/* Conversation Log */}
              <div>
                <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4 flex justify-between items-center">
                  Conversation Log
                  <button className="text-accent text-xs font-medium hover:underline">+ Add Note</button>
                </h3>
                <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                  <div className="relative flex items-start gap-4">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center z-10 bg-surface border border-border mt-1">
                      <div className="w-2 h-2 rounded-full bg-accent" />
                    </div>
                    <div className="bg-surface-alt border border-border rounded-lg p-3 text-sm text-text-primary flex-1">
                      <span className="text-xs text-text-muted block mb-1">Yesterday</span>
                      Sent a quick check-in about the open role.
                    </div>
                  </div>
                  <div className="relative flex items-start gap-4">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center z-10 bg-surface border border-border mt-1" />
                    <div className="bg-surface-alt border border-border rounded-lg p-3 text-sm text-text-primary flex-1">
                      <span className="text-xs text-text-muted block mb-1">Last Week</span>
                      Initial connection request sent on LinkedIn.
                    </div>
                  </div>
                </div>
              </div>

            </div>
            
            {/* Footer */}
            <div className="p-4 border-t border-border bg-surface-alt flex gap-3">
              <button className="flex-1 bg-surface border border-border text-text-primary hover:border-accent px-4 py-2 rounded-md font-medium transition-colors text-sm">
                Edit Contact
              </button>
              <button className="flex-1 bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-md font-medium transition-colors text-sm flex items-center justify-center gap-2">
                Log New Interaction
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
