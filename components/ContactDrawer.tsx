"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import { X, Building2, MapPin, Mail, Link as LinkIcon, MoreHorizontal, Trash2, Send, Check } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export function ContactDrawer() {
  const { isContactDrawerOpen, selectedContact, setContactDrawerOpen, setAddContactModalOpen, deleteContact, updateContact } = useStore();
  const [newNote, setNewNote] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim() || !selectedContact) return;

    const note = {
      id: Math.random().toString(36).substring(2, 9),
      date: new Date().toISOString().split("T")[0],
      text: newNote.trim()
    };

    const updatedContact = {
      ...selectedContact,
      notes: [note, ...(selectedContact.notes || [])]
    };

    updateContact(updatedContact);
    setNewNote("");
  };

  const handleDelete = () => {
    if (!selectedContact) return;
    if (window.confirm("Are you sure you want to delete this contact? This action cannot be undone.")) {
      deleteContact(selectedContact.id);
    }
  };

  return (
    <AnimatePresence>
      {isContactDrawerOpen && selectedContact && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setContactDrawerOpen(false)}
            className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-surface border-l border-border z-50 shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-border flex justify-between items-start bg-surface-alt relative">
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 rounded-full bg-accent/10 border border-border flex items-center justify-center text-accent font-bold text-xl shrink-0">
                  {selectedContact.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-text-primary pr-8">{selectedContact.name}</h2>
                  <p className="text-text-secondary font-medium text-sm mt-0.5">
                    {selectedContact.title} {selectedContact.company ? `at ${selectedContact.company}` : ''}
                  </p>
                </div>
              </div>
              <div className="absolute top-6 right-6 flex gap-2">
                <button 
                  onClick={handleDelete}
                  className="p-1.5 text-text-muted hover:text-danger hover:bg-danger/10 rounded-md transition-colors"
                  title="Delete Contact"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setContactDrawerOpen(false)}
                  className="p-1.5 text-text-muted hover:text-text-primary hover:bg-surface border border-transparent hover:border-border rounded-md transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              
              {/* Quick Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-text-muted uppercase tracking-wider font-semibold">Status</span>
                  <span className="text-sm font-medium px-2 py-1 bg-surface-alt border border-border text-text-secondary rounded w-fit">
                    {selectedContact.status}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-text-muted uppercase tracking-wider font-semibold">Last Contact</span>
                  <span className="text-sm font-medium text-text-primary">
                    {selectedContact.lastContact}
                  </span>
                </div>
              </div>

              {/* Actions */}
              {(selectedContact.email || selectedContact.linkedinUrl) && (
                <div className="flex gap-2">
                  {selectedContact.email && (
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(selectedContact.email!);
                        setIsCopied(true);
                        setTimeout(() => setIsCopied(false), 2000);
                      }}
                      title={selectedContact.email}
                      className="flex-1 flex items-center justify-center gap-2 bg-surface-alt border border-border text-text-primary hover:border-accent hover:bg-accent/5 px-4 py-2 rounded-md font-medium transition-colors text-sm group"
                    >
                      {isCopied ? (
                        <Check className="w-4 h-4 text-success" />
                      ) : (
                        <Mail className="w-4 h-4 text-text-muted" /> 
                      )}
                      <span className="group-hover:hidden">{isCopied ? "Copied!" : "Email"}</span>
                      {!isCopied && <span className="hidden group-hover:inline truncate max-w-[120px]">{selectedContact.email}</span>}
                    </button>
                  )}
                  {selectedContact.linkedinUrl && (
                    <a 
                      href={selectedContact.linkedinUrl.startsWith('http') ? selectedContact.linkedinUrl : `https://${selectedContact.linkedinUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 bg-surface-alt border border-border text-text-primary hover:border-[#0a66c2] hover:bg-[#0a66c2]/5 px-4 py-2 rounded-md font-medium transition-colors text-sm"
                    >
                      <LinkIcon className="w-4 h-4 text-[#0a66c2]" /> LinkedIn
                    </a>
                  )}
                </div>
              )}

              {/* Conversation Log */}
              <div>
                <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">
                  Conversation Log
                </h3>

                <form onSubmit={handleAddNote} className="mb-6 relative">
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Log a new note..."
                    className="w-full bg-surface-alt border border-border rounded-lg pl-3 pr-10 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent"
                  />
                  <button 
                    type="submit"
                    disabled={!newNote.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-text-muted hover:text-accent disabled:opacity-50 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>

                <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                  {selectedContact.notes && selectedContact.notes.length > 0 ? (
                    selectedContact.notes.map((note, idx) => (
                      <div key={note.id} className="relative flex items-start gap-4">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center z-10 bg-surface border border-border mt-1 ${idx === 0 ? 'ring-2 ring-accent/20' : ''}`}>
                          <div className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-accent' : 'bg-text-muted'}`} />
                        </div>
                        <div className="bg-surface-alt border border-border rounded-lg p-3 text-sm text-text-primary flex-1">
                          <span className="text-xs text-text-muted block mb-1">{note.date}</span>
                          {note.text}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-sm text-text-muted">
                      No conversation logs yet.
                    </div>
                  )}
                </div>
              </div>

            </div>
            
            {/* Footer */}
            <div className="p-4 border-t border-border bg-surface-alt flex gap-3">
              <button 
                onClick={() => setAddContactModalOpen(true, selectedContact)}
                className="w-full bg-surface border border-border text-text-primary hover:border-accent hover:bg-accent/5 px-4 py-2 rounded-md font-medium transition-colors text-sm"
              >
                Edit Contact Details
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
