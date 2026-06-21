"use client";

import { useStore } from "@/store/useStore";
import { X, Calendar, Building2, MapPin, Link2, Clock, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function JobDrawer() {
  const { isJobDrawerOpen, selectedJob, setJobDrawerOpen, jobs, setJobs } = useStore();

  const handleDelete = () => {
    if (!selectedJob) return;
    if (confirm("Are you sure you want to delete this job?")) {
      setJobs(jobs.filter(j => j.id !== selectedJob.id));
      setJobDrawerOpen(false);
    }
  };

  return (
    <AnimatePresence>
      {isJobDrawerOpen && selectedJob && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setJobDrawerOpen(false)}
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
                <div className="w-12 h-12 rounded-lg bg-surface border border-border flex items-center justify-center text-text-muted">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-text-primary">{selectedJob.jobTitle}</h2>
                  <p className="text-text-secondary font-medium">{selectedJob.companyName}</p>
                </div>
              </div>
              <button 
                onClick={() => setJobDrawerOpen(false)}
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
                  <span className="text-sm font-medium px-2 py-1 bg-accent/10 text-accent rounded w-fit">
                    {selectedJob.status}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-text-muted uppercase tracking-wider font-semibold">Date Applied</span>
                  <div className="flex items-center gap-2 text-sm text-text-primary">
                    <Calendar className="w-4 h-4 text-text-muted" />
                    {selectedJob.dateApplied || "N/A"}
                  </div>
                </div>
              </div>

              {/* Status Timeline */}
              <div>
                <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">Pipeline Status</h3>
                <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                  {["Wishlist", "Applied", "Interviewing", "Tech Test", "Offer"].map((status, index) => {
                    const isCurrent = selectedJob.status === status;
                    const isPast = ["Wishlist", "Applied", "Interviewing", "Tech Test", "Offer"].indexOf(selectedJob.status) > index;
                    
                    return (
                      <div key={status} className="relative flex items-center gap-4">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center z-10 
                          ${isCurrent ? 'bg-accent border-4 border-surface shadow-[0_0_0_2px_theme(colors.accent)]' : 
                            isPast ? 'bg-success' : 'bg-surface-alt border border-border'}`}
                        >
                          {isPast && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                        <div className={`text-sm ${isCurrent ? 'font-bold text-text-primary' : 'text-text-muted'}`}>
                          {status}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Notes Section */}
              <div>
                <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">Notes & Preparation</h3>
                <textarea 
                  className="w-full h-32 bg-surface-alt border border-border rounded-lg p-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent resize-none transition-colors"
                  placeholder="Add interview notes, research, or questions for the team..."
                />
              </div>
            </div>
            
            {/* Footer */}
            <div className="p-4 border-t border-border bg-surface-alt flex gap-3">
              <button 
                onClick={handleDelete}
                className="p-2 bg-surface border border-border text-text-muted hover:text-danger hover:border-danger/50 rounded-md transition-colors"
                title="Delete Job"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <button className="flex-1 bg-surface border border-border text-text-primary hover:border-accent px-4 py-2 rounded-md font-medium transition-colors text-sm">
                Edit Details
              </button>
              <button className="flex-1 bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-md font-medium transition-colors text-sm">
                Move to Next Stage
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
