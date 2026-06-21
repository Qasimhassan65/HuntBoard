"use client";

import { Mail, Link as LinkIcon, MoreHorizontal, UserPlus, Trash2 } from "lucide-react";

import { useStore } from "@/store/useStore";

export default function NetworkingPage() {
  const { contacts, setAddContactModalOpen, setContactDrawerOpen } = useStore();

  return (
    <div className="p-8 max-w-7xl mx-auto h-screen overflow-y-auto">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Networking Pipeline</h1>
          <p className="text-text-secondary">Manage your connections, referrals, and recruiter conversations.</p>
        </div>
        <button 
          onClick={() => setAddContactModalOpen(true)}
          className="bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          Add Contact
        </button>
      </header>

      <div className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex justify-between items-center bg-surface-alt/50">
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Search contacts..." 
              className="bg-surface border border-border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-accent w-64"
            />
          </div>
          <div className="flex gap-2 text-sm">
            <button className="px-3 py-1.5 text-text-secondary hover:text-text-primary border border-transparent hover:bg-surface-alt rounded-md transition-colors">Filter</button>
            <button className="px-3 py-1.5 text-text-secondary hover:text-text-primary border border-transparent hover:bg-surface-alt rounded-md transition-colors">Sort</button>
          </div>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-surface-alt text-xs uppercase tracking-wider text-text-muted">
              <th className="p-4 font-semibold">Contact</th>
              <th className="p-4 font-semibold">Company</th>
              <th className="p-4 font-semibold">Type</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">Last Contact</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {contacts.map((contact) => (
              <tr 
                key={contact.id} 
                onClick={() => setContactDrawerOpen(true, contact)}
                className="hover:bg-surface-alt/50 transition-colors group cursor-pointer"
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center font-bold text-sm">
                      {contact.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-text-primary">{contact.name}</p>
                      <p className="text-xs text-text-secondary">{contact.title}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-sm font-medium">{contact.company}</span>
                </td>
                <td className="p-4">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-surface-alt border border-border text-text-secondary">
                    {contact.type}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      contact.status === 'Hot' ? 'bg-danger' : 
                      contact.status === 'Warm' ? 'bg-warning' : 'bg-info'
                    }`} />
                    <span className="text-sm text-text-primary">{contact.status}</span>
                  </div>
                </td>
                <td className="p-4 text-sm text-text-secondary">
                  {contact.lastContact}
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {contact.email && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigator.clipboard.writeText(contact.email!);
                        }}
                        title="Copy Email"
                        className="p-1.5 text-text-muted hover:text-accent rounded-md hover:bg-accent/10 transition-colors"
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                    )}
                    {contact.linkedinUrl && (
                      <a 
                        href={contact.linkedinUrl.startsWith('http') ? contact.linkedinUrl : `https://${contact.linkedinUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 text-text-muted hover:text-[#0a66c2] rounded-md hover:bg-[#0a66c2]/10 transition-colors"
                      >
                        <LinkIcon className="w-4 h-4" />
                      </a>
                    )}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm("Are you sure you want to delete this contact?")) {
                          useStore.getState().deleteContact(contact.id);
                        }
                      }}
                      title="Delete Contact"
                      className="p-1.5 text-text-muted hover:text-danger rounded-md hover:bg-danger/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
