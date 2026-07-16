import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './AuthContext';

export interface Work {
  id: string;
  name: string;
  budget?: number;
  spent?: number;
  [key: string]: any;
}

interface WorksContextType {
  works: Work[];
  activeWork: Work | null;
  setActiveWork: (work: Work | null) => void;
  isLoadingWorks: boolean;
}

const WorksContext = createContext<WorksContextType | undefined>(undefined);

export function WorksProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [works, setWorks] = useState<Work[]>([]);
  const [activeWork, setActiveWork] = useState<Work | null>(null);
  const [isLoadingWorks, setIsLoadingWorks] = useState(true);

  useEffect(() => {
    if (!user) {
      setWorks([]);
      setActiveWork(null);
      setIsLoadingWorks(false);
      return;
    }

    setIsLoadingWorks(true);
    const qWorks = query(collection(db, 'works'), where('userId', '==', user.uid));
    
    const unsubscribe = onSnapshot(qWorks, (snapshot) => {
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Work));
      
      // Sort works by some logic if needed, right now we just use the order from DB
      setWorks(data);
      
      // Update activeWork if it exists in the new data, else pick the first one
      setActiveWork(currentActive => {
        if (data.length === 0) return null;
        if (!currentActive) return data[0];
        const stillExists = data.find(w => w.id === currentActive.id);
        return stillExists || data[0];
      });

      setIsLoadingWorks(false);
    }, (error) => {
      console.error("Error fetching works:", error);
      setIsLoadingWorks(false);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <WorksContext.Provider value={{ works, activeWork, setActiveWork, isLoadingWorks }}>
      {children}
    </WorksContext.Provider>
  );
}

export function useWorks() {
  const context = useContext(WorksContext);
  if (context === undefined) {
    throw new Error('useWorks must be used within a WorksProvider');
  }
  return context;
}
