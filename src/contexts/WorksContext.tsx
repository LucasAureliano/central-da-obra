/* eslint-disable react-refresh/only-export-components, react/only-export-components */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { collection, query, where, onSnapshot, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './AuthContext';

export interface Work {
  id: string;
  name: string;
  budget?: number;
  spent?: number;
  progress?: number;
  image?: string;
  colorTheme?: string;
  address?: string;
  client?: string;
  deadline?: string;
  status?: string;
  isPrimary?: boolean;
  [key: string]: any;
}

interface PrimaryWorkStats {
  totalSpent: number;
  totalSpentCalcs: number;
  totalSpentExpenses: number;
  upcomingTasks: any[];
  daysRemaining: number | null;
  nextStage: string | null;
}

interface WorksContextType {
  works: Work[];
  activeWork: Work | null;
  setActiveWork: (work: Work | null) => void;
  primaryWork: Work | null;
  primaryWorkStats: PrimaryWorkStats | null;
  setPrimaryWork: (workId: string) => Promise<void>;
  isLoadingWorks: boolean;
}

const WorksContext = createContext<WorksContextType | undefined>(undefined);

export function WorksProvider({ children }: { children: React.ReactNode }) {
  const { user, isGuest, profile } = useAuth();
  const [works, setWorks] = useState<Work[]>([]);
  const [activeWork, setActiveWork] = useState<Work | null>(null);
  const [primaryWorkId, setPrimaryWorkIdState] = useState<string | null>(null);
  const [primaryWork, setPrimaryWorkState] = useState<Work | null>(null);
  const [isLoadingWorks, setIsLoadingWorks] = useState(true);

  // Load primaryWorkId from Firebase or localStorage on mount
  useEffect(() => {
    if (user && !isGuest) {
      // Authenticated user: read from Firestore user doc
      const userDocRef = doc(db, 'users', user.uid);
      getDoc(userDocRef).then(snap => {
        if (snap.exists() && snap.data()?.primaryWorkId) {
          setPrimaryWorkIdState(snap.data().primaryWorkId);
        }
      }).catch(console.error);
    } else {
      // Guest: read from localStorage
      const stored = localStorage.getItem('co_primary_work_id');
      if (stored) setPrimaryWorkIdState(stored);
    }
  }, [user, isGuest]);

  // Listen to works collection
  useEffect(() => {
    if (!user) {
      setWorks([]);
      setActiveWork(null);
      setPrimaryWorkState(null);
      setIsLoadingWorks(false);
      return;
    }

    setIsLoadingWorks(true);
    // Para dar suporte ao RBAC, deve-se usar um array `members` no Firestore.
    // Como transição, vamos buscar obras em que o userId seja o usuário atual ou ele esteja na lista de members
    const qWorks = query(collection(db, 'works'), where('userId', '==', user.uid));
    // Observação: Para escalabilidade com RBAC, seria ideal ter duas queries (uma para owner e outra para array-contains members)
    // ou migrar todos os 'userId' para dentro do array 'members'.
    
    const unsubscribe = onSnapshot(qWorks, (snapshot) => {
      if (snapshot.empty) {
        setWorks([]);
        setActiveWork(null);
        setPrimaryWorkState(null);
        setIsLoadingWorks(false);
        return;
      }

      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Work));
      setWorks(data);
      
      // Maintain activeWork
      setActiveWork(currentActive => {
        if (!currentActive) return data[0] || null;
        const stillExists = data.find(w => w.id === currentActive.id);
        return stillExists || data[0] || null;
      });

      setIsLoadingWorks(false);
    }, (error) => {
      console.error("Error fetching works:", error);
      setWorks([]);
      setActiveWork(null);
      setPrimaryWorkState(null);
      setIsLoadingWorks(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Resolve primaryWork from works list whenever works or primaryWorkId changes
  useEffect(() => {
    if (works.length === 0) {
      setPrimaryWorkState(null);
      return;
    }

    // Auto-select if only one work
    if (works.length === 1) {
      setPrimaryWorkState(works[0]);
      return;
    }

    // Find the designated primary
    if (primaryWorkId) {
      const found = works.find(w => w.id === primaryWorkId);
      if (found) {
        setPrimaryWorkState(found);
        return;
      }
    }

    // Fallback: no primary set or primary was deleted → null (prompt user to choose)
    // For owner profile, this triggers the selector
    if (profile?.role === 'owner') {
      setPrimaryWorkState(null);
    } else {
      // For other profiles, just use first work
      setPrimaryWorkState(works[0] || null);
    }
  }, [works, primaryWorkId, profile?.role]);

  const [primaryWorkStats, setPrimaryWorkStats] = useState<PrimaryWorkStats | null>(null);

  // Fetch stats for the primary work
  useEffect(() => {
    if (!primaryWork) {
      setPrimaryWorkStats(null);
      return;
    }

    let unsubCalcs: any = null;
    let unsubStages: any = null;

    const qCalc = query(collection(db, 'works', primaryWork.id, 'calculations'));
    unsubCalcs = onSnapshot(qCalc, (snap) => {
      let calcSpent = 0;
      snap.forEach(d => {
        calcSpent += (d.data().totalCost || 0);
      });
      setPrimaryWorkStats(prev => ({
        totalSpent: prev?.totalSpentExpenses || 0,
        totalSpentCalcs: calcSpent,
        totalSpentExpenses: prev?.totalSpentExpenses || 0,
        upcomingTasks: prev?.upcomingTasks || [],
        daysRemaining: prev?.daysRemaining || null,
        nextStage: prev?.nextStage || null
      } as any));
    });

    const qExp = query(collection(db, 'works', primaryWork.id, 'expenses'));
    let unsubExp = onSnapshot(qExp, (snap) => {
      let expSpent = 0;
      snap.forEach(d => {
        if (d.data().status !== 'Cancelado') {
          expSpent += (d.data().amount || 0);
        }
      });
      setPrimaryWorkStats(prev => ({
        totalSpent: expSpent,
        totalSpentCalcs: prev?.totalSpentCalcs || 0,
        totalSpentExpenses: expSpent,
        upcomingTasks: prev?.upcomingTasks || [],
        daysRemaining: prev?.daysRemaining || null,
        nextStage: prev?.nextStage || null
      } as any));
    });

    const qStages = query(collection(db, 'works', primaryWork.id, 'schedule_stages'));
    unsubStages = onSnapshot(qStages, (snap) => {
      let pending: any[] = [];
      let nextStageName: string | null = null;
      let finalDate: Date | null = null;
      
      const sortedStages = snap.docs.map(d => d.data()).sort((a,b) => (a.order || 0) - (b.order || 0));
      
      for (const s of sortedStages) {
        if (s.endDate) {
          const d = new Date(s.endDate);
          if (!finalDate || d > finalDate) finalDate = d;
        }
        if (!s.completed && !nextStageName) {
          nextStageName = s.title || null;
        }
        if (!s.completed) {
          pending.push({ title: s.title, stageName: s.title, isCompleted: false });
        }
      }
      
      let daysRemaining = null;
      if (finalDate) {
        const diffTime = finalDate.getTime() - new Date().getTime();
        daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
      }

      setPrimaryWorkStats(prev => ({
        totalSpent: prev?.totalSpent || 0,
        totalSpentCalcs: prev?.totalSpentCalcs || 0,
        totalSpentExpenses: prev?.totalSpentExpenses || 0,
        upcomingTasks: pending.slice(0, 3),
        daysRemaining,
        nextStage: nextStageName
      }));
    });

    return () => {
      if (unsubCalcs) unsubCalcs();
      if (unsubExp) unsubExp();
      if (unsubStages) unsubStages();
    };
  }, [primaryWork]);

  // Set primary work
  const setPrimaryWork = useCallback(async (workId: string) => {
    setPrimaryWorkIdState(workId);

    // Update the resolved primaryWork immediately
    const found = works.find(w => w.id === workId);
    if (found) setPrimaryWorkState(found);

    if (user && !isGuest) {
      // Persist to Firestore
      try {
        const userDocRef = doc(db, 'users', user.uid);
        await updateDoc(userDocRef, { primaryWorkId: workId });
      } catch (e) {
        console.error('Error saving primaryWorkId:', e);
      }
    } else {
      // Persist to localStorage
      localStorage.setItem('co_primary_work_id', workId);
    }
  }, [user, isGuest, works]);

  return (
    <WorksContext.Provider value={{ works, activeWork, setActiveWork, primaryWork, primaryWorkStats, setPrimaryWork, isLoadingWorks }}>
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
