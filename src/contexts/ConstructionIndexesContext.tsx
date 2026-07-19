import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ConstructionIndex } from '../services/construction/ConstructionIndexesService';

interface ConstructionIndexesContextData {
  indexes: ConstructionIndex[];
  loading: boolean;
  error: string | null;
  refreshIndexes: () => Promise<void>;
}

const ConstructionIndexesContext = createContext<ConstructionIndexesContextData>({} as ConstructionIndexesContextData);

export const ConstructionIndexesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [indexes, setIndexes] = useState<ConstructionIndex[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchIndexes = async () => {
    try {
      setLoading(true);
      setError(null);
      const { constructionIndexesService } = await import('../services/construction/ConstructionIndexesService');
      const data = await constructionIndexesService.getIndexes();
      setIndexes(data);
    } catch (err: any) {
      setError(err.message || 'Falha ao buscar índices da construção');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIndexes();
  }, []);

  return (
    <ConstructionIndexesContext.Provider value={{ indexes, loading, error, refreshIndexes: fetchIndexes }}>
      {children}
    </ConstructionIndexesContext.Provider>
  );
};

export const useConstructionIndexes = () => {
  const context = useContext(ConstructionIndexesContext);
  if (!context) {
    throw new Error('useConstructionIndexes must be used within a ConstructionIndexesProvider');
  }
  return context;
};
