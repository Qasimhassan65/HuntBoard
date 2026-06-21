"use client";

import { useStore } from "@/store/useStore";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

type ContactFormData = {
  name: string;
  title: string;
  company: string;
  email: string;
  linkedinUrl: string;
  status: string;
  type: string;
};

export function AddContactModal() {
  const { isAddContactModalOpen, setAddContactModalOpen, contacts, setContacts, selectedContact, updateContact } = useStore();
  const { register, handleSubmit, reset, setValue } = useForm<ContactFormData>();

  // Populate form if we are editing an existing contact
  useEffect(() => {
    if (isAddContactModalOpen && selectedContact) {
      setValue("name", selectedContact.name || "");
      setValue("title", selectedContact.title || "");
      setValue("company", selectedContact.company || "");
      setValue("email", selectedContact.email || "");
      setValue("linkedinUrl", selectedContact.linkedinUrl || "");
      setValue("status", selectedContact.status || "Identified");
      setValue("type", selectedContact.type || "Recruiter");
    } else if (isAddContactModalOpen) {
      reset();
    }
  }, [isAddContactModalOpen, selectedContact, setValue, reset]);

  if (!isAddContactModalOpen) return null;

  const handleClose = () => {
    reset();
    // When closing, if we were editing, we should clear the selected contact from the modal state.
    // The drawer might still be open behind it, but we let useStore handle that.
    setAddContactModalOpen(false, null);
  };

  const onSubmit = (data: ContactFormData) => {
    if (selectedContact) {
      // Edit mode
      updateContact({
        ...selectedContact,
        name: data.name,
        title: data.title,
        company: data.company,
        email: data.email,
        linkedinUrl: data.linkedinUrl,
        status: data.status,
        type: data.type,
      });
    } else {
      // Add mode
      const newContact = {
        id: Math.random().toString(36).substring(2, 9),
        name: data.name,
        title: data.title,
        company: data.company,
        email: data.email,
        linkedinUrl: data.linkedinUrl,
        status: data.status || "Identified",
        type: data.type || "Recruiter",
        lastContact: new Date().toISOString().split("T")[0],
        notes: [],
      };
      setContacts([...contacts, newContact]);
    }
    
    handleClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-surface border border-border w-full max-w-md rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-5 border-b border-border flex justify-between items-center">
          <h2 className="text-xl font-semibold text-text-primary">
            {selectedContact ? "Edit Contact" : "Add Contact"}
          </h2>
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
              <label className="block text-xs font-medium text-text-secondary mb-1">Email Address</label>
              <input type="email" {...register("email")} className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent" />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">LinkedIn URL</label>
              <input type="url" {...register("linkedinUrl")} className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent" />
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
            {selectedContact ? "Save Changes" : "Save Contact"}
          </button>
        </div>
      </div>
    </div>
  );
}
