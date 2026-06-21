"use client";

import KanbanBoard from "@/components/KanbanBoard";
import { useStore } from "@/store/useStore";

export default function JobsPage() {
  const { setAddJobModalOpen } = useStore();

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden p-8">
      <header className="mb-6 flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Applications</h1>
          <p className="text-text-secondary">Track and manage your active job pipeline.</p>
        </div>
        <button 
          onClick={() => setAddJobModalOpen(true)}
          className="bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-md font-medium transition-colors"
        >
          + Add Job
        </button>
      </header>

      <div className="flex-1 min-h-0">
        <KanbanBoard />
      </div>
    </div>
  );
}
