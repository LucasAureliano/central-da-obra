import React, { createContext, useContext, useState } from 'react';

interface AuthModalContextType {
  showAuthModal: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  showGuestAlert: boolean;
  triggerGuestAlert: () => void;
  closeGuestAlert: () => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showGuestAlert, setShowGuestAlert] = useState(false);

  return (
    <AuthModalContext.Provider 
      value={{ 
        showAuthModal, 
        openAuthModal: () => setShowAuthModal(true), 
        closeAuthModal: () => setShowAuthModal(false),
        showGuestAlert,
        triggerGuestAlert: () => setShowGuestAlert(true),
        closeGuestAlert: () => setShowGuestAlert(false)
      }}
    >
      {children}
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const context = useContext(AuthModalContext);
  if (context === undefined) {
    throw new Error('useAuthModal must be used within an AuthModalProvider');
  }
  return context;
}
