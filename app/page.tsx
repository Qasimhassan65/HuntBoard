"use client";

import { Bell, Briefcase, Users, Flame, ChevronRight } from "lucide-react";
import { useStore } from "@/store/useStore";

export default function Home() {
  const { jobs, contacts, setAddJobModalOpen } = useStore();

  const appliedCount = jobs.filter(j => j.status === 'Applied').length;
  const interviewingCount = jobs.filter(j => j.status === 'Interviewing').length;
  const offersCount = jobs.filter(j => j.status === 'Offer').length;
  const totalJobs = jobs.length;
  const totalContacts = contacts.length;

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Dashboard</h1>
          <p className="text-text-secondary">Welcome back. Here's your pipeline overview.</p>
        </div>
        <button 
          onClick={() => setAddJobModalOpen(true)}
          className="bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-md font-medium transition-colors"
        >
          + Add Job
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Goal Rings Placeholder */}
        <div className="bg-surface rounded-xl border border-border p-5 col-span-2 flex flex-col justify-center items-center h-48">
           <h3 className="text-lg font-medium mb-4 self-start">Daily Goals</h3>
           <div className="flex gap-12 w-full justify-center">
             <div className="text-center">
               <div className="w-24 h-24 rounded-full border-4 border-surface-alt flex items-center justify-center mb-2 mx-auto relative">
                 <span className="text-xl font-bold text-accent">{totalJobs}/10</span>
                 <svg className="absolute top-0 left-0 w-full h-full transform -rotate-90">
                    <circle cx="48" cy="48" r="46" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-surface-alt" />
                 </svg>
               </div>
               <p className="text-sm text-text-secondary font-medium">Jobs Added</p>
             </div>
             <div className="text-center">
                <div className="w-24 h-24 rounded-full border-4 border-surface-alt flex items-center justify-center mb-2 mx-auto relative">
                 <span className="text-xl font-bold text-accent">{totalContacts}/10</span>
                 <svg className="absolute top-0 left-0 w-full h-full transform -rotate-90">
                    <circle cx="48" cy="48" r="46" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-surface-alt" />
                 </svg>
               </div>
               <p className="text-sm text-text-secondary font-medium">Connections</p>
             </div>
           </div>
        </div>

        {/* Pipeline Snapshot */}
        <div className="bg-surface rounded-xl border border-border p-5 flex flex-col h-48">
          <h3 className="text-lg font-medium mb-4">Pipeline</h3>
          <div className="flex-1 flex flex-col justify-between">
            <div className="flex justify-between items-center text-sm">
              <span className="text-text-secondary">Applied</span>
              <span className="font-semibold text-text-primary">{appliedCount}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-text-secondary">Interviewing</span>
              <span className="font-semibold text-text-primary">{interviewingCount}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-text-secondary">Offers</span>
              <span className="font-semibold text-success">{offersCount}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Follow-ups */}
        <div className="bg-surface rounded-xl border border-border p-5 min-h-[300px]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Bell className="w-5 h-5 text-warning" />
              Action Needed
            </h3>
            <button className="text-sm text-text-secondary hover:text-text-primary transition-colors flex items-center">
              View all <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
          <div className="flex flex-col items-center justify-center h-[200px] text-text-muted">
             <Flame className="w-8 h-8 mb-2 opacity-50" />
             <p className="text-sm">You're all caught up!</p>
          </div>
        </div>

        {/* Weekly Stats */}
        <div className="bg-surface rounded-xl border border-border p-5 min-h-[300px]">
          <h3 className="text-lg font-medium mb-4">Activity (7 Days)</h3>
          <div className="flex items-end justify-between h-[180px] mt-4 px-2">
             {[1,2,3,4,5,6,7].map(i => (
               <div key={i} className="flex flex-col items-center gap-2">
                 <div className="w-8 bg-surface-alt rounded-t-sm h-full flex items-end">
                   {/* Placeholder bar */}
                 </div>
                 <span className="text-xs text-text-muted">Day {i}</span>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}

