"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MapPin, Globe } from "lucide-react";
import clsx from "clsx";

export function KanbanCard({ job, isOverlay }: { job: any; isOverlay?: boolean }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: job.id, data: job });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={clsx(
        "bg-surface border border-border p-4 rounded-lg shadow-sm cursor-grab active:cursor-grabbing hover:border-border-active transition-colors",
        isDragging && "opacity-50",
        isOverlay && "opacity-100 scale-105 shadow-xl rotate-2"
      )}
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-semibold text-text-primary text-sm leading-tight">{job.companyName}</h4>
        {/* Placeholder for days ago */}
        <span className="text-xs text-text-muted">1d</span>
      </div>
      <p className="text-sm text-text-secondary mb-3 font-medium">{job.jobTitle}</p>
      
      <div className="flex items-center gap-3 text-xs text-text-secondary mb-3">
        {job.country && (
           <div className="flex items-center gap-1">
             <MapPin className="w-3 h-3" />
             {job.country}
           </div>
        )}
        {job.remotePolicy && (
           <div className="flex items-center gap-1">
             <Globe className="w-3 h-3" />
             {job.remotePolicy === "fully-remote" ? "Remote" : job.remotePolicy}
           </div>
        )}
      </div>

      <div className="flex gap-2 flex-wrap mt-2">
        {job.techStack?.split(",").slice(0, 3).map((tech: string) => (
          <span key={tech} className="px-2 py-1 bg-surface-alt rounded text-xs text-text-primary">
            {tech.trim()}
          </span>
        ))}
      </div>
    </div>
  );
}
