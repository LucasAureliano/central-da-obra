import React, { createContext, useContext, useState } from 'react';
import type { PortalLink } from '../services/portal/PortalService';

interface PortalContextData {
  loading: boolean;
  error: string | null;
  generateLink: (workId: string, expiresInDays?: number) => Promise<PortalLink | null>;
}

const PortalContext = createContext<PortalContextData>({} as PortalContextData);

export const PortalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateLink = async (workId: string, expiresInDays?: number) => {
    try {
      setLoading(true);
      setError(null);
      const { portalService } = await import('../services/portal/PortalService');
      return await portalService.generateClientPortalLink(workId, expiresInDays);
    } catch (err: any) {
      setError(err.message || 'Falha ao gerar link do portal');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return (
    <PortalContext.Provider value={{ loading, error, generateLink }}>
      {children}
    </PortalContext.Provider>
  );
};

export const usePortal = () => {
  const context = useContext(PortalContext);
  if (!context) {
    throw new Error('usePortal must be used within a PortalProvider');
  }
  return context;
};
