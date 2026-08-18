import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  signInAnonymously,
} from "firebase/auth";
import type { User } from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { browserLocalPersistence, setPersistence } from "firebase/auth";

export type UserRole = "owner" | "service" | "architect" | "engineer" | "builder" | null;

export interface DashboardPrefs {
  widgets?: string[];
  order?: string[];
  hidden?: string[];
}

export type SubscriptionStatus = 'ACTIVE' | 'TRIAL' | 'FREE' | 'PAST_DUE' | 'CANCELED' | 'EXPIRED' | 'REVOKED' | 'COMP' | 'TESTER';
export type SubscriptionSource = 'subscription' | 'admin_grant' | 'trial' | 'promo' | null;

export interface SubscriptionData {
  planId: string;
  status: SubscriptionStatus;
  source: SubscriptionSource;
  provider?: string;
  providerSubscriptionId?: string;
  startedAt?: any;
  expiresAt?: any;
  trialStartedAt?: any;
  trialEndsAt?: any;
  autoRenew: boolean;
  grantedBy?: string;
}

export interface Entitlements {
  unlimitedQuotes?: boolean;
  multipleWorks?: boolean;
  advancedReports?: boolean;
  AI?: boolean;
  clientPortal?: boolean;
  [key: string]: boolean | undefined;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  name: string | null;
  photoURL: string | null;
  role: UserRole;
  specialty?: string;
  createdAt: any;
  plan: string;
  subscription?: SubscriptionData;
  entitlements?: Entitlements;
  isAdmin?: boolean;
  hasSeenWelcome?: boolean;
  dashboardPrefs?: DashboardPrefs;
  
  // Professional / Commercial fields
  logotipo?: string;
  nomeFantasia?: string;
  razaoSocial?: string;
  cpfCnpj?: string;
  creaCau?: string;
  telefone?: string;
  whatsapp?: string;
  emailComercial?: string;
  redesSociais?: string;
  pix?: string;
  endereco?: string;
  especialidades?: string;
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
  showGuestModal: boolean;
  setShowGuestModal: (show: boolean) => void;
  guestActionName: string;
  setGuestActionName: (action: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [localGuest, setLocalGuest] = useState(false);
  
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [guestActionName, setGuestActionName] = useState('realizar esta ação');

  useEffect(() => {
    let unsubscribeProfile: () => void;



    const checkLocalGuest = () => {
      const isPWA = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
      // Disable auto-guest on standard web so visitors see the Landing Page.
      if (!isPWA && window.location.pathname === '/') return false;
      
      const localGuestUid = localStorage.getItem("localGuestUid") || sessionStorage.getItem("localGuestUid");
      if (localGuestUid) {
        const fakeUser = {
          uid: localGuestUid,
          email: "Visitante",
          displayName: "Visitante",
          isAnonymous: true,
        } as unknown as User;

        setUser(fakeUser);
        setProfile({
          uid: localGuestUid,
          email: "Visitante",
          name: "Visitante",
          photoURL: null,
          role: (localStorage.getItem("pendingRole") as UserRole) || null,
          createdAt: new Date(),
          plan: "free",
          subscription: {
            planId: "free",
            status: "FREE",
            source: null,
            autoRenew: false
          },
          entitlements: {},
          hasSeenWelcome:
            localStorage.getItem("guestHasSeenWelcome") === "true",
        });
        setLocalGuest(true);
        setLoading(false);
        return true;
      }
      return false;
    };

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          setUser(firebaseUser);

          if (!firebaseUser.isAnonymous) {
            sessionStorage.removeItem("localGuestUid");
            localStorage.removeItem("localGuestUid");
            sessionStorage.removeItem("guestHasSeenWelcome");
            setLocalGuest(false);

            const userRef = doc(db, "users", firebaseUser.uid);

            // Listen to profile changes so role updates instantly
            unsubscribeProfile = onSnapshot(userRef, async (userSnap) => {
              if (!userSnap.exists()) {
                const pendingRole = localStorage.getItem("pendingRole");
                const pendingSpecialty =
                  localStorage.getItem("pendingSpecialty");
                const newProfile: any = {
                  uid: firebaseUser.uid,
                  email: firebaseUser.email,
                  name: firebaseUser.displayName,
                  photoURL: firebaseUser.photoURL,
                  role: pendingRole || null, // Role starts with pending or null
                  createdAt: new Date(),
                  plan: "free",
                  subscription: {
                    planId: "free",
                    status: "FREE",
                    source: null,
                    autoRenew: false
                  },
                  entitlements: {},
                  hasSeenWelcome: false,
                  dashboardPrefs: {
                    widgets: [
                      "resumo",
                      "calculadoras",
                      "insights",
                      "financeiro",
                    ],
                    order: ["resumo", "calculadoras", "insights", "financeiro"],
                  },
                };
                if (pendingSpecialty) {
                  newProfile.specialty = pendingSpecialty;
                }

                if (pendingRole) localStorage.removeItem("pendingRole");
                if (pendingSpecialty)
                  localStorage.removeItem("pendingSpecialty");
                await setDoc(userRef, newProfile);
                setProfile(newProfile as UserProfile);
              } else {
                const data = userSnap.data();
                if (!data) {
                  setProfile({ uid: firebaseUser.uid, role: null } as UserProfile);
                } else {
                  setProfile(data as UserProfile);
                }
              }
              setLoading(false);
            });
            return; // onSnapshot handles loading=false
          } else {
            // Guest
            setProfile({
              uid: firebaseUser.uid,
              email: "Visitante",
              name: "Visitante",
              photoURL: null,
              role: (localStorage.getItem("pendingRole") as UserRole) || null,
              createdAt: new Date(),
              plan: "free",
              subscription: {
                planId: "free",
                status: "FREE",
                source: null,
                autoRenew: false
              },
              entitlements: {},
              hasSeenWelcome:
                sessionStorage.getItem("guestHasSeenWelcome") === "true",
              dashboardPrefs: {
                widgets: ["resumo", "calculadoras", "insights", "financeiro"],
                order: ["resumo", "calculadoras", "insights", "financeiro"],
              },
            });
            setLoading(false);
          }
        } else {
          if (!checkLocalGuest()) {
            setUser(null);
            setProfile(null);
            setLoading(false);
          }
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
      await setPersistence(auth, browserLocalPersistence);
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
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
      sessionStorage.removeItem("guestHasSeenWelcome");
      localStorage.removeItem("pendingRole");
      await signInAnonymously(auth);
      setLocalGuest(true);
    } catch (error) {
      console.error("Error signing in anonymously:", error);
      // Fallback for when Firebase Anonymous Auth is not enabled
      const localGuestUid = "guest_" + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem("localGuestUid", localGuestUid);

      const fakeUser = {
        uid: localGuestUid,
        email: "Visitante",
        displayName: "Visitante",
        isAnonymous: true,
      } as unknown as User;

      setUser(fakeUser);
      setProfile({
        uid: localGuestUid,
        email: "Visitante",
        name: "Visitante",
        photoURL: null,
        role: (localStorage.getItem("pendingRole") as UserRole) || null,
        createdAt: new Date(),
        plan: "free",
        subscription: {
          planId: "free",
          status: "FREE",
          source: null,
          autoRenew: false
        },
        entitlements: {},
        hasSeenWelcome: false,
        dashboardPrefs: {
          widgets: ["resumo", "calculadoras", "insights", "financeiro"],
          order: ["resumo", "calculadoras", "insights", "financeiro"],
        },
      });
      setLocalGuest(true);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      localStorage.removeItem("localGuestUid");
      sessionStorage.removeItem("localGuestUid");
      sessionStorage.removeItem("guestHasSeenWelcome");
      localStorage.removeItem("pendingRole");
      setLocalGuest(false);
      setUser(null);
      setProfile(null);
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const isGuest = (user ? user.isAnonymous : false) || localGuest;

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isGuest: isGuest || localGuest,
        localGuest,
        signInWithGoogle,
        loginAsGuest,
        signOut,
        showGuestModal,
        setShowGuestModal,
        guestActionName,
        setGuestActionName
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
