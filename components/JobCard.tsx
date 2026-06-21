"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Job, useStore } from "@/store/useStore";
import { Building2 } from "lucide-react";

interface JobCardProps {
  job: Job;
  isOverlay?: boolean;
}

export default function JobCard({ job, isOverlay = false }: JobCardProps) {
  const { setJobDrawerOpen } = useStore();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: job.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={isOverlay ? undefined : setNodeRef}
      style={isOverlay ? undefined : style}
      {...attributes}
      {...listeners}
      onClick={() => setJobDrawerOpen(true, job)}
      className={`bg-surface border border-border rounded-lg p-4 cursor-grab active:cursor-grabbing hover:border-accent transition-colors ${
        isOverlay ? 'shadow-xl scale-105 border-accent' : ''
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-surface-alt flex items-center justify-center text-text-muted">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-text-primary leading-tight">{job.companyName}</h4>
            <p className="text-xs text-text-secondary">{job.jobTitle}</p>
          </div>
        </div>
        {job.countryFlag && <span className="text-sm">{job.countryFlag}</span>}
      </div>
      
      {job.techStack && job.techStack.length > 0 && (
        <div className="flex gap-1 mt-3 flex-wrap">
          {job.techStack.map(tech => (
            <span key={tech} className="px-2 py-0.5 bg-surface-alt border border-border rounded text-[10px] text-text-secondary font-medium">
              {tech}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
