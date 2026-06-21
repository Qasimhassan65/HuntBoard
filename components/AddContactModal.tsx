"use client";

import { useStore } from "@/store/useStore";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";

type ContactFormData = {
  name: string;
  title: string;
  company: string;
  linkedinUrl: string;
  status: string;
  type: string;
};

export function AddContactModal() {
  const { isAddContactModalOpen, setAddContactModalOpen } = useStore();
  const { register, handleSubmit, reset } = useForm<ContactFormData>();

  if (!isAddContactModalOpen) return null;

  const handleClose = () => {
    reset();
    setAddContactModalOpen(false);
  };

  const onSubmit = (data: ContactFormData) => {
    console.log("Saving contact:", data);
    handleClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-surface border border-border w-full max-w-md rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-5 border-b border-border flex justify-between items-center">
          <h2 className="text-xl font-semibold text-text-primary">Add Contact</h2>
          <button onClick={handleClose} className="text-text-secondary hover:text-text-primary transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto">
          <form id="add-contact-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Full Name *</label>
              <input required {...register("name")} className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent" />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Job Title</label>
              <input {...register("title")} className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent" />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Company</label>
              <input {...register("company")} className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent" />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">LinkedIn URL</label>
              <input {...register("linkedinUrl")} className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">Status</label>
                <select {...register("status")} className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent">
                  <option value="Identified">Identified</option>
                  <option value="Connected">Connected</option>
                  <option value="Conversation">Conversation</option>
                  <option value="Warm">Warm</option>
                  <option value="Cold">Cold</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">Type</label>
                <select {...register("type")} className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent">
                  <option value="Recruiter">Recruiter</option>
                  <option value="Hiring Manager">Hiring Manager</option>
                  <option value="Referral">Referral</option>
                  <option value="Peer">Peer</option>
                </select>
              </div>
            </div>
          </form>
        </div>

        <div className="p-5 border-t border-border flex justify-end gap-3">
          <button onClick={handleClose} className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
            Cancel
          </button>
          <button form="add-contact-form" type="submit" className="bg-accent hover:bg-accent-hover text-white px-6 py-2 rounded-md text-sm font-medium transition-colors">
            Save Contact
          </button>
        </div>
      </div>
    </div>
  );
}
