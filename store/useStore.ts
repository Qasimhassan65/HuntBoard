import { create } from "zustand";
import { User } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface Job {
  id: string;
  companyName: string;
  jobTitle: string;
  status: string;
  countryFlag?: string;
  techStack?: string[];
  dateApplied?: string;
  notes?: string;
  companySize?: string;
  industry?: string;
  remotePolicy?: string;
  salaryRange?: string;
  source?: string;
  jobUrl?: string;
}

export interface ContactNote {
  id: string;
  date: string;
  text: string;
}

export interface Contact {
  id: string;
  name: string;
  title: string;
  company: string;
  status: string;
  type: string;
  lastContact: string;
  email?: string;
  linkedinUrl?: string;
  notes?: ContactNote[];
}

interface AppState {
  user: User | null;
  jobs: Job[];
  jobColumns: string[];
  contacts: Contact[];
  isAuthLoading: boolean;
  isAddJobModalOpen: boolean;
  isJobDrawerOpen: boolean;
  selectedJob: Job | null;
  isAddContactModalOpen: boolean;
  isContactDrawerOpen: boolean;
  selectedContact: Contact | null;
  isAuthModalOpen: boolean;
  setUser: (user: User | null) => void;
  setJobs: (jobs: Job[]) => void;
  setJobColumns: (columns: string[]) => void;
  updateJob: (updatedJob: Job) => void;
  setContacts: (contacts: Contact[]) => void;
  updateContact: (updatedContact: Contact) => void;
  deleteContact: (id: string) => void;
  setAuthLoading: (loading: boolean) => void;
  setAddJobModalOpen: (isOpen: boolean, job?: Job | null) => void;
  setJobDrawerOpen: (isOpen: boolean, job?: Job | null) => void;
  setAddContactModalOpen: (isOpen: boolean, contact?: Contact | null) => void;
  setContactDrawerOpen: (isOpen: boolean, contact?: Contact | null) => void;
  setAuthModalOpen: (isOpen: boolean) => void;
  isDataLoaded: boolean;
  loadData: (userId: string) => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
  user: null,
  jobs: [],
  jobColumns: ["Wishlist", "Applied", "Interviewing", "Tech Test", "Offer", "Rejected"],
  contacts: [],
  isAuthLoading: true,
  isAddJobModalOpen: false,
  isJobDrawerOpen: false,
  selectedJob: null,
  isAddContactModalOpen: false,
  isContactDrawerOpen: false,
  selectedContact: null,
  setUser: (user) => set({ user }),
  setJobs: (jobs) => {
    set({ jobs });
    const user = get().user;
    if (user) {
      setDoc(doc(db, "users", user.uid), { jobs, contacts: get().contacts }, { merge: true }).catch(console.error);
    }
  },
  setJobColumns: (jobColumns) => {
    set({ jobColumns });
    const user = get().user;
    if (user) {
      setDoc(doc(db, "users", user.uid), { jobColumns }, { merge: true }).catch(console.error);
    }
  },
  updateJob: (updatedJob) => {
    const newJobs = get().jobs.map((j) => (j.id === updatedJob.id ? updatedJob : j));
    get().setJobs(newJobs);
    if (get().selectedJob?.id === updatedJob.id) {
      set({ selectedJob: updatedJob });
    }
  },
  setContacts: (contacts) => {
    set({ contacts });
    const user = get().user;
    if (user) {
      setDoc(doc(db, "users", user.uid), { jobs: get().jobs, contacts }, { merge: true }).catch(console.error);
    }
  },
  updateContact: (updatedContact) => {
    const newContacts = get().contacts.map((c) => (c.id === updatedContact.id ? updatedContact : c));
    get().setContacts(newContacts);
    // If it's the currently selected contact in the drawer, update that too
    if (get().selectedContact?.id === updatedContact.id) {
      set({ selectedContact: updatedContact });
    }
  },
  deleteContact: (id) => {
    const newContacts = get().contacts.filter((c) => c.id !== id);
    get().setContacts(newContacts);
    if (get().selectedContact?.id === id) {
      set({ isContactDrawerOpen: false, selectedContact: null });
    }
  },
  setAuthLoading: (loading) => set({ isAuthLoading: loading }),
  setAddJobModalOpen: (isOpen, job = null) => set({ isAddJobModalOpen: isOpen, selectedJob: isOpen ? job : get().selectedJob }),
  setJobDrawerOpen: (isOpen, job = null) => set({ isJobDrawerOpen: isOpen, selectedJob: job }),
  setAddContactModalOpen: (isOpen, contact = null) => set({ isAddContactModalOpen: isOpen, selectedContact: isOpen ? contact : get().selectedContact }),
  setContactDrawerOpen: (isOpen, contact = null) => set({ isContactDrawerOpen: isOpen, selectedContact: contact }),
  isAuthModalOpen: false,
  setAuthModalOpen: (isOpen) => set({ isAuthModalOpen: isOpen }),
  isDataLoaded: false,
  loadData: async (userId: string) => {
    try {
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        set({ 
          jobs: data.jobs || [], 
          contacts: data.contacts || [], 
          jobColumns: data.jobColumns || ["Wishlist", "Applied", "Interviewing", "Tech Test", "Offer", "Rejected"],
          isDataLoaded: true 
        });
      } else {
        set({ isDataLoaded: true });
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      set({ isDataLoaded: true });
    }
  },
}));
