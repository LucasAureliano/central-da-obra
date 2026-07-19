// import { apiClient } from '../../api/apiClient';
import { cacheManager } from '../../api/cacheManager';

export interface WeatherData {
  temperature: number;
  condition: 'sunny' | 'rainy' | 'cloudy' | 'storm' | 'unknown';
  precipitationProbability: number;
  humidity: number;
  windSpeed: number;
  uvIndex?: number;
}

class WeatherService {
  /**
   * Retorna os dados do clima atual usando cache para evitar requests excessivos.
   */
  async getCurrentWeather(lat: number, lon: number): Promise<WeatherData> {
    const cacheKey = `weather_${lat.toFixed(2)}_${lon.toFixed(2)}`;
    const cached = cacheManager.get<WeatherData>(cacheKey, true);
    
    if (cached) return cached;

    const WEATHER_KEY = import.meta.env.VITE_WEATHER_KEY;

    if (!WEATHER_KEY) {
      // Mock para desenvolvimento local
      await new Promise(resolve => setTimeout(resolve, 600));
      const mockData: WeatherData = {
        temperature: 24,
        condition: 'cloudy',
        precipitationProbability: 30,
        humidity: 65,
        windSpeed: 12
      };
      
      // Cache de 30 minutos
      cacheManager.set(cacheKey, mockData, 1000 * 60 * 30, true);
      return mockData;
    }

    try {
      // Chamada real OpenWeather (exemplo)
      // const res = await apiClient.get<any>(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_KEY}&units=metric`);
      // const mappedData = this.mapOpenWeatherResponse(res);
      // cacheManager.set(cacheKey, mappedData, 1000 * 60 * 30, true);
      // return mappedData;
      throw new Error('API Real não habilitada.');
    } catch (err) {
      console.warn('[WeatherService] Falha, usando fallback.', err);
      return {
        temperature: 20,
        condition: 'unknown',
        precipitationProbability: 0,
        humidity: 50,
        windSpeed: 0
      };
    }
  }
}

export const weatherService = new WeatherService();
