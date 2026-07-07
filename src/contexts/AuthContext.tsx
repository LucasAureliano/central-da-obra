import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut as firebaseSignOut, GoogleAuthProvider, signInWithPopup, signInAnonymously } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

export type UserRole = 'owner' | 'service' | 'architect' | 'builder' | null;

export interface UserProfile {
  uid: string;
  email: string | null;
  name: string | null;
  photoURL: string | null;
  role: UserRole;
  specialty?: string;
  createdAt: any;
  plan: string;
  hasSeenWelcome?: boolean;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isGuest: boolean;
  localGuest: boolean;
  signInWithGoogle: () => Promise<void>;
  loginAsGuest: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [localGuest, setLocalGuest] = useState(false);

  useEffect(() => {
    let unsubscribeProfile: () => void;

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          setUser(firebaseUser);
          
          if (!firebaseUser.isAnonymous) {
            const userRef = doc(db, 'users', firebaseUser.uid);
            
            // Listen to profile changes so role updates instantly
            unsubscribeProfile = onSnapshot(userRef, async (userSnap) => {
              if (!userSnap.exists()) {
                const pendingRole = localStorage.getItem('pendingRole');
                const pendingSpecialty = localStorage.getItem('pendingSpecialty');
                const newProfile: any = {
                  uid: firebaseUser.uid,
                  email: firebaseUser.email,
                  name: firebaseUser.displayName,
                  photoURL: firebaseUser.photoURL,
                  role: pendingRole || null, // Role starts with pending or null
                  createdAt: new Date(),
                  plan: 'free',
                  hasSeenWelcome: false
                };
                if (pendingSpecialty) {
                  newProfile.specialty = pendingSpecialty;
                }
                
                if (pendingRole) localStorage.removeItem('pendingRole');
                if (pendingSpecialty) localStorage.removeItem('pendingSpecialty');
                await setDoc(userRef, newProfile);
                setProfile(newProfile as UserProfile);
              } else {
                setProfile(userSnap.data() as UserProfile);
              }
              setLoading(false);
            });
            return; // onSnapshot handles loading=false
          } else {
            // Guest
            setProfile({
              uid: firebaseUser.uid,
              email: 'Visitante',
              name: 'Visitante',
              photoURL: null,
              role: (localStorage.getItem('pendingRole') as UserRole) || null,
              createdAt: new Date(),
              plan: 'free',
              hasSeenWelcome: sessionStorage.getItem('guestHasSeenWelcome') === 'true'
            });
            setLoading(false);
          }
        } else {
          setUser(null);
          setProfile(null);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error in onAuthStateChanged:", err);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) unsubscribeProfile();
    };
  }, []);

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in with Google:", error);
      throw error;
    }
  };

  const loginAsGuest = async () => {
    try {
      setLoading(true);
      // Clean up previous guest sessions
      sessionStorage.removeItem('guestHasSeenWelcome');
      await signInAnonymously(auth);
      setLocalGuest(true);
    } catch (error) {
      console.error("Error signing in anonymously:", error);
      // Fallback for when Firebase Anonymous Auth is not enabled
      setLocalGuest(true);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const isGuest = (user ? user.isAnonymous : false) || localGuest;

  return (
    <AuthContext.Provider value={{ user, profile, loading, isGuest, localGuest, signInWithGoogle, loginAsGuest, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
