import React, { createContext, useContext, useState } from 'react';
import type { LocationData, RouteData } from '../services/maps/MapsService';

interface MapsContextData {
  loading: boolean;
  error: string | null;
  geocodeAddress: (address: string) => Promise<LocationData | null>;
  calculateRoute: (origLat: number, origLng: number, destLat: number, destLng: number) => Promise<RouteData | null>;
}

const MapsContext = createContext<MapsContextData>({} as MapsContextData);

export const MapsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const geocodeAddress = async (address: string) => {
    try {
      setLoading(true);
      setError(null);
      const { mapsService } = await import('../services/maps/MapsService');
      return await mapsService.geocodeAddress(address);
    } catch (err: any) {
      setError(err.message || 'Falha ao buscar endereço');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const calculateRoute = async (oLat: number, oLng: number, dLat: number, dLng: number) => {
    try {
      setLoading(true);
      setError(null);
      const { mapsService } = await import('../services/maps/MapsService');
      return await mapsService.calculateRoute(oLat, oLng, dLat, dLng);
    } catch (err: any) {
      setError(err.message || 'Falha ao calcular rota');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return (
    <MapsContext.Provider value={{ loading, error, geocodeAddress, calculateRoute }}>
      {children}
    </MapsContext.Provider>
  );
};

export const useMaps = () => {
  const context = useContext(MapsContext);
  if (!context) {
    throw new Error('useMaps must be used within a MapsProvider');
  }
  return context;
};
