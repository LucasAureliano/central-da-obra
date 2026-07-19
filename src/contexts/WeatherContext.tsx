import React, { createContext, useContext, useState } from 'react';
import type { WeatherData } from '../services/weather/WeatherService';

interface WeatherContextData {
  weather: WeatherData | null;
  loading: boolean;
  error: string | null;
  fetchWeather: (lat: number, lon: number) => Promise<void>;
}

const WeatherContext = createContext<WeatherContextData>({} as WeatherContextData);

export const WeatherProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async (lat: number, lon: number) => {
    try {
      setLoading(true);
      setError(null);
      const { weatherService } = await import('../services/weather/WeatherService');
      const data = await weatherService.getCurrentWeather(lat, lon);
      setWeather(data);
    } catch (err: any) {
      setError(err.message || 'Falha ao buscar clima');
    } finally {
      setLoading(false);
    }
  };

  return (
    <WeatherContext.Provider value={{ weather, loading, error, fetchWeather }}>
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};
