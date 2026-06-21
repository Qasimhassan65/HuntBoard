"use client";

import { useDroppable } from "@dnd-kit/core";

import { Trash2 } from "lucide-react";

interface KanbanColumnProps {
  id: string;
  title: string;
  children: React.ReactNode;
  onDelete?: () => void;
}

export default function KanbanColumn({ id, title, children, onDelete }: KanbanColumnProps) {
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
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
          {title}
        </h3>
        {onDelete && (
          <button 
            onClick={onDelete}
            title="Delete Category"
            className="text-text-muted hover:text-danger hover:bg-danger/10 p-1 rounded transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        {children}
      </div>
    </div>
  );
}
