"use client";

import { useStore, Job } from "@/store/useStore";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useState } from "react";
import KanbanColumn from "./KanbanColumn";
import JobCard from "./JobCard";

export default function KanbanBoard() {
  const { jobs, setJobs, jobColumns, setJobColumns } = useStore();
  const [activeJob, setActiveJob] = useState<Job | null>(null);
  const [newCategory, setNewCategory] = useState("");
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const draggedJob = jobs.find((job) => job.id === active.id);
    if (draggedJob) setActiveJob(draggedJob);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveJob(null);
    const { active, over } = event;
    
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    // Check if dropping over a column or a card
    const isOverColumn = jobColumns.includes(overId as string);
    const destinationStatus = isOverColumn 
      ? overId as string 
      : jobs.find(j => j.id === overId)?.status || "";

    if (destinationStatus) {
      setJobs(jobs.map(job => 
        job.id === activeId ? { ...job, status: destinationStatus } : job
      ));
    }
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategory.trim() && !jobColumns.includes(newCategory.trim())) {
      setJobColumns([...jobColumns, newCategory.trim()]);
      setNewCategory("");
      setIsAddingCategory(false);
    }
  };

  const handleDeleteCategory = (colToDelete: string) => {
    if (jobColumns.length <= 1) {
      alert("You must have at least one category.");
      return;
    }
    
    if (window.confirm(`Are you sure you want to delete the "${colToDelete}" category? All jobs in this category will be moved to the "${jobColumns[0]}" category.`)) {
      // Reassign jobs to the first column (if we're deleting the first column, assign to the second)
      const fallbackCol = jobColumns[0] === colToDelete ? jobColumns[1] : jobColumns[0];
      
      setJobs(jobs.map(job => 
        job.status === colToDelete ? { ...job, status: fallbackCol } : job
      ));
      
      setJobColumns(jobColumns.filter(c => c !== colToDelete));
    }
  };

  return (
    <DndContext 
      sensors={sensors} 
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 h-full overflow-x-auto pb-4">
        {jobColumns.map((col) => {
          const columnJobs = jobs.filter(j => j.status === col);
          return (
            <KanbanColumn 
              key={col} 
              title={col} 
              id={col}
              onDelete={() => handleDeleteCategory(col)}
            >
              <SortableContext items={columnJobs.map(j => j.id)}>
                <div className="flex flex-col gap-3 min-h-[100px]">
                  {columnJobs.map(job => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              </SortableContext>
            </KanbanColumn>
          );
        })}
        
        {/* Add Category Button / Input */}
        <div className="w-[300px] shrink-0 pt-1">
          {isAddingCategory ? (
            <form onSubmit={handleAddCategory} className="bg-surface border border-border rounded-xl p-3 shadow-sm">
              <input
                autoFocus
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onBlur={() => {
                  if (!newCategory.trim()) setIsAddingCategory(false);
                }}
                placeholder="Category name..."
                className="w-full bg-surface-alt border border-border rounded-md px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent mb-2"
              />
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-accent text-white text-xs font-medium py-1.5 rounded hover:bg-accent-hover transition-colors">
                  Add
                </button>
                <button type="button" onClick={() => setIsAddingCategory(false)} className="flex-1 bg-surface-alt text-text-secondary text-xs font-medium py-1.5 rounded hover:bg-border transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <button 
              onClick={() => setIsAddingCategory(true)}
              className="w-full h-12 flex items-center justify-center gap-2 border-2 border-dashed border-border rounded-xl text-text-muted hover:text-text-primary hover:border-accent hover:bg-accent/5 transition-colors font-medium text-sm"
            >
              + Add Category
            </button>
          )}
        </div>
      </div>

      <DragOverlay>
        {activeJob ? <JobCard job={activeJob} isOverlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}
