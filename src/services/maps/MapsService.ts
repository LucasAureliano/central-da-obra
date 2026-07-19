// import { apiClient } from '../../api/apiClient';

export interface LocationData {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  lat: number;
  lng: number;
}

export interface RouteData {
  distanceText: string;
  distanceValue: number; // meters
  durationText: string;
  durationValue: number; // seconds
}

class MapsService {
  async geocodeAddress(_address: string): Promise<LocationData | null> {
    const MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY;

    if (!MAPS_KEY) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        address: "Av. Paulista, 1000",
        city: "São Paulo",
        state: "SP",
        zipCode: "01310-100",
        lat: -23.561684,
        lng: -46.655981
      };
    }

    try {
      // return await apiClient.get(...)
      throw new Error('Real maps not implemented');
    } catch (err) {
      console.warn('[MapsService] Fallback to mock', err);
      return null;
    }
  }

  async calculateRoute(_originLat: number, _originLng: number, _destLat: number, _destLng: number): Promise<RouteData | null> {
    const MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY;

    if (!MAPS_KEY) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        distanceText: "15.2 km",
        distanceValue: 15200,
        durationText: "45 min",
        durationValue: 2700
      };
    }

    try {
      throw new Error('Real maps not implemented');
    } catch (err) {
      return null;
    }
  }
}

export const mapsService = new MapsService();
