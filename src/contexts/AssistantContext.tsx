import React, { createContext, useContext, useState } from 'react';
import type { AssistantQuery, AssistantResponse } from '../services/assistant/AssistantService';

interface AssistantContextData {
  loading: boolean;
  error: string | null;
  sendMessage: (query: AssistantQuery) => Promise<AssistantResponse | null>;
}

const AssistantContext = createContext<AssistantContextData>({} as AssistantContextData);

export const AssistantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (query: AssistantQuery) => {
    try {
      setLoading(true);
      setError(null);
      const { assistantService } = await import('../services/assistant/AssistantService');
      return await assistantService.sendMessage(query);
    } catch (err: any) {
      setError(err.message || 'Falha ao comunicar com o Assistente');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AssistantContext.Provider value={{ loading, error, sendMessage }}>
      {children}
    </AssistantContext.Provider>
  );
};

export const useAssistant = () => {
  const context = useContext(AssistantContext);
  if (!context) {
    throw new Error('useAssistant must be used within an AssistantProvider');
  }
  return context;
};
