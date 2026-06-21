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

const COLUMNS = ["Wishlist", "Applied", "Interviewing", "Tech Test", "Offer", "Rejected"];

export default function KanbanBoard() {
  const { jobs, setJobs } = useStore();
  const [activeJob, setActiveJob] = useState<Job | null>(null);

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
    const isOverColumn = COLUMNS.includes(overId as string);
    const destinationStatus = isOverColumn 
      ? overId as string 
      : jobs.find(j => j.id === overId)?.status || "";

    if (destinationStatus) {
      setJobs(jobs.map(job => 
        job.id === activeId ? { ...job, status: destinationStatus } : job
      ));
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
        {COLUMNS.map((col) => {
          const columnJobs = jobs.filter(j => j.status === col);
          return (
            <KanbanColumn key={col} title={col} id={col}>
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
      </div>

      <DragOverlay>
        {activeJob ? <JobCard job={activeJob} isOverlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}
