"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/store/useStore";
import { X, Wand2, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";

type JobFormData = {
  companyName: string;
  companySize: string;
  industry: string;
  techStack: string;
  country: string;
  remotePolicy: string;
  jobTitle: string;
  salaryRange: string;
  source: string;
  jobUrl: string;
  status: string;
};

export function AddJobModal() {
  const { isAddJobModalOpen, setAddJobModalOpen, jobs, setJobs, selectedJob, updateJob } = useStore();
  const [enrichmentInput, setEnrichmentInput] = useState("");
  const [isEnriching, setIsEnriching] = useState(false);
  const [error, setError] = useState("");
  
  const { register, handleSubmit, setValue, reset } = useForm<JobFormData>();

  // Populate form if we are editing an existing job
  useEffect(() => {
    if (isAddJobModalOpen && selectedJob) {
      setValue("companyName", selectedJob.companyName || "");
      setValue("companySize", selectedJob.companySize || "");
      setValue("industry", selectedJob.industry || "");
      // Mock other fields that aren't fully tracked yet to prevent undefined
      setValue("jobTitle", selectedJob.jobTitle || "");
      setValue("techStack", selectedJob.techStack?.join(", ") || "");
      setValue("country", selectedJob.countryFlag || "");
      setValue("remotePolicy", selectedJob.remotePolicy || "");
      setValue("salaryRange", selectedJob.salaryRange || "");
      setValue("source", selectedJob.source || "");
      setValue("jobUrl", selectedJob.jobUrl || "");
      setValue("status", selectedJob.status || "Wishlist");
    } else if (isAddJobModalOpen) {
      reset();
    }
  }, [isAddJobModalOpen, selectedJob, setValue, reset]);

  if (!isAddJobModalOpen) return null;

  const handleClose = () => {
    reset();
    setEnrichmentInput("");
    setError("");
    setAddJobModalOpen(false, null);
  };

  const handleEnrich = async () => {
    if (!enrichmentInput) return;
    
    setIsEnriching(true);
    setError("");
    
    try {
      const res = await fetch("/api/enrich", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: enrichmentInput, type: "job" }),
      });
      
      if (!res.ok) throw new Error("Failed to extract data");
      
      const data = await res.json();
      
      if (data.companyName) setValue("companyName", data.companyName);
      if (data.companySize) setValue("companySize", data.companySize);
      if (data.industry) setValue("industry", data.industry);
      if (data.techStack && Array.isArray(data.techStack)) setValue("techStack", data.techStack.join(", "));
      if (data.country) setValue("country", data.country);
      if (data.remotePolicy) setValue("remotePolicy", data.remotePolicy);
      if (data.jobTitle) setValue("jobTitle", data.jobTitle);
      if (data.salaryRange) setValue("salaryRange", data.salaryRange);
      if (data.source) setValue("source", data.source);
      
      // Attempt to identify URL
      if (enrichmentInput.startsWith("http")) {
        setValue("jobUrl", enrichmentInput);
      }
      
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsEnriching(false);
    }
  };

  const onSubmit = (data: JobFormData) => {
    if (selectedJob) {
      updateJob({
        ...selectedJob,
        companyName: data.companyName,
        companySize: data.companySize,
        industry: data.industry,
        jobTitle: data.jobTitle,
        status: data.status,
        techStack: data.techStack ? data.techStack.split(",").map(t => t.trim()).filter(Boolean) : [],
        countryFlag: data.country,
        remotePolicy: data.remotePolicy,
        salaryRange: data.salaryRange,
        source: data.source,
        jobUrl: data.jobUrl
      });
    } else {
      const newJob = {
        id: Date.now().toString(),
        companyName: data.companyName,
        companySize: data.companySize,
        industry: data.industry,
        jobTitle: data.jobTitle,
        status: data.status || "Wishlist", // Default to Wishlist column
        techStack: data.techStack ? data.techStack.split(",").map(t => t.trim()).filter(Boolean) : [],
        dateApplied: new Date().toLocaleDateString(),
        countryFlag: data.country,
        remotePolicy: data.remotePolicy,
        salaryRange: data.salaryRange,
        source: data.source,
        jobUrl: data.jobUrl,
        notes: ""
      };
      
      setJobs([...jobs, newJob]);
    }
    handleClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-surface border border-border w-full max-w-2xl rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-5 border-b border-border flex justify-between items-center">
          <h2 className="text-xl font-semibold text-text-primary">
            {selectedJob ? "Edit Job Details" : "Add New Application"}
          </h2>
          <button onClick={handleClose} className="text-text-secondary hover:text-text-primary transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto">
          {/* AI Auto-fill section - hide when editing */}
          {!selectedJob && (
            <div className="mb-6 p-4 bg-surface-alt rounded-lg border border-border-active">
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Auto-fill with AI (Paste URL or Description)
              </label>
              <div className="flex gap-2">
                <textarea
                  placeholder="Paste Job URL or the full job description here..."
                  className="flex-1 bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent min-h-[42px] max-h-[120px] resize-y"
                  value={enrichmentInput}
                  onChange={(e) => setEnrichmentInput(e.target.value)}
                  rows={1}
                />
                <button
                  type="button"
                  onClick={handleEnrich}
                  disabled={isEnriching || !enrichmentInput}
                  className="bg-accent/10 hover:bg-accent/20 text-accent px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2 disabled:opacity-50 transition-colors"
                >
                  {isEnriching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                  Extract
                </button>
              </div>
              {error && <p className="text-danger text-xs mt-2">{error}</p>}
            </div>
          )}

          <form id="add-job-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">Company Name *</label>
                <input required {...register("companyName")} className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent" />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">Job Title *</label>
                <input required {...register("jobTitle")} className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent" />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">Status</label>
                <select {...register("status")} className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent">
                  {useStore.getState().jobColumns.map(col => (
                    <option key={col} value={col}>{col}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">Location / Country</label>
                <input {...register("country")} className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent" />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">Remote Policy</label>
                <input {...register("remotePolicy")} className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-text-secondary mb-1">Tech Stack (comma separated)</label>
                <input {...register("techStack")} className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent" />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">Salary Range</label>
                <input {...register("salaryRange")} className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent" />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">Source (e.g. LinkedIn)</label>
                <input {...register("source")} className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-text-secondary mb-1">Job URL</label>
                <input {...register("jobUrl")} className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent" />
              </div>
            </div>
          </form>
        </div>

        <div className="p-5 border-t border-border flex justify-end gap-3">
          <button onClick={handleClose} className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
            Cancel
          </button>
          <button form="add-job-form" type="submit" className="bg-accent hover:bg-accent-hover text-white px-6 py-2 rounded-md text-sm font-medium transition-colors">
            {selectedJob ? "Save Changes" : "Save Job"}
          </button>
        </div>
      </div>
    </div>
  );
}
