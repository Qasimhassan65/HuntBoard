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
}

export interface Contact {
  id: string;
  name: string;
  title: string;
  company: string;
  status: string;
  type: string;
  lastContact: string;
}

interface AppState {
  user: User | null;
  jobs: Job[];
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
  setContacts: (contacts: Contact[]) => void;
  setAuthLoading: (loading: boolean) => void;
  setAddJobModalOpen: (isOpen: boolean) => void;
  setJobDrawerOpen: (isOpen: boolean, job?: Job | null) => void;
  setAddContactModalOpen: (isOpen: boolean) => void;
  setContactDrawerOpen: (isOpen: boolean, contact?: Contact | null) => void;
  setAuthModalOpen: (isOpen: boolean) => void;
  isDataLoaded: boolean;
  loadData: (userId: string) => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
  user: null,
  jobs: [],
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
  setContacts: (contacts) => {
    set({ contacts });
    const user = get().user;
    if (user) {
      setDoc(doc(db, "users", user.uid), { jobs: get().jobs, contacts }, { merge: true }).catch(console.error);
    }
  },
  setAuthLoading: (loading) => set({ isAuthLoading: loading }),
  setAddJobModalOpen: (isOpen) => set({ isAddJobModalOpen: isOpen }),
  setJobDrawerOpen: (isOpen, job = null) => set({ isJobDrawerOpen: isOpen, selectedJob: job }),
  setAddContactModalOpen: (isOpen) => set({ isAddContactModalOpen: isOpen }),
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
        set({ jobs: data.jobs || [], contacts: data.contacts || [], isDataLoaded: true });
      } else {
        set({ isDataLoaded: true });
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      set({ isDataLoaded: true });
    }
  },
}));
