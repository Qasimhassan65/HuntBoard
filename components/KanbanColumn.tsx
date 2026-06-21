"use client";

import { useDroppable } from "@dnd-kit/core";

interface KanbanColumnProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

export default function KanbanColumn({ id, title, children }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div 
      ref={setNodeRef} 
      className={`flex flex-col flex-shrink-0 w-80 bg-surface-alt border rounded-lg p-3 transition-colors ${
        isOver ? 'border-accent' : 'border-border'
      }`}
    >
      <h3 className="text-sm font-semibold text-text-secondary mb-4 uppercase tracking-wider">
        {title}
      </h3>
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        {children}
      </div>
    </div>
  );
}
