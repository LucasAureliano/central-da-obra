import { auth } from '../../lib/firebase';
export interface MaterialPrice {
  id: string;
  name: string;
  unit: string;
  price: number;
  supplier: string;
  link?: string;
  lastUpdated: string;
}

const CACHE_KEY_PREFIX = 'centralobra_prices_';
const CACHE_DURATION_MS = 12 * 60 * 60 * 1000; // 12 hours

class MaterialPriceService {
  async searchMaterial(query: string): Promise<MaterialPrice[]> {
    if (!query) return [];

    const lowerQuery = query.toLowerCase().trim();
    const cacheKey = \\\\;
    const cachedStr = localStorage.getItem(cacheKey);

    if (cachedStr) {
      try {
        const cached = JSON.parse(cachedStr);
        if (Date.now() - cached.timestamp < CACHE_DURATION_MS) {
          return cached.data;
        }
      } catch (e) {
      }
    }

    try {
      let token = '';
      try {
        const user = auth.currentUser;
        if (user) {
          token = await user.getIdToken();
        }
      } catch (e) {
      }

      const response = await fetch(\/api/prices?q=\\, {
        headers: {
          'Authorization': \Bearer \\
        }
      });
      
      if (!response.ok) {
        throw new Error('Falha ao buscar preços: ' + response.status);
      }

      const result = await response.json();
      const resultsArray = result.data?.[query] || result.data?.[lowerQuery] || [];

      const formattedPrices: MaterialPrice[] = resultsArray.map((item: any, index: number) => ({
        id: \pi_\_\\,
        name: item.name,
        unit: item.unit || 'un',
        price: item.price,
        supplier: item.store || item.supplier || 'Leroy Merlin',
        link: item.url || item.link,
        lastUpdated: new Date().toISOString()
      }));

      if (formattedPrices.length > 0) {
        localStorage.setItem(cacheKey, JSON.stringify({
          timestamp: Date.now(),
          data: formattedPrices
        }));
      }

      return formattedPrices;
    } catch (error) {
      console.error('Erro no MaterialPriceService:', error);
      if (cachedStr) {
        try {
          return JSON.parse(cachedStr).data;
        } catch (e) {}
      }
      return [];
    }
  }

  async searchMultiple(queries: string[]): Promise<Record<string, MaterialPrice[]>> {
    const validQueries = queries.filter(Boolean);
    if (!validQueries.length) return {};

    const results: Record<string, MaterialPrice[]> = {};
    const missingQueries: string[] = [];

    validQueries.forEach(q => {
      const cacheKey = \\\\;
      const cachedStr = localStorage.getItem(cacheKey);
      if (cachedStr) {
        try {
          const cached = JSON.parse(cachedStr);
          if (Date.now() - cached.timestamp < CACHE_DURATION_MS) {
            results[q] = cached.data;
            return;
          }
        } catch (e) {}
      }
      missingQueries.push(q);
    });

    if (missingQueries.length === 0) return results;

    try {
      let token = '';
      try {
        const user = auth.currentUser;
        if (user) token = await user.getIdToken();
      } catch (e) {}

      const response = await fetch(\/api/prices?materials=\\, {
        headers: {
          'Authorization': \Bearer \\
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        const data = result.data || {};

        missingQueries.forEach(q => {
          const lowerQ = q.toLowerCase().trim();
          const sourceArray = data[lowerQ] || data[q];
          if (sourceArray && Array.isArray(sourceArray)) {
            const formattedPrices: MaterialPrice[] = sourceArray.map((item: any, index: number) => ({
               id: \pi_\_\\,
               name: item.name,
               unit: item.unit || 'un',
               price: item.price,
               supplier: item.store || item.supplier || 'Leroy Merlin',
               link: item.url || item.link,
               lastUpdated: new Date().toISOString()
            }));

            results[q] = formattedPrices;

            if (formattedPrices.length > 0) {
               const cacheKey = \\\\;
               localStorage.setItem(cacheKey, JSON.stringify({
                 timestamp: Date.now(),
                 data: formattedPrices
               }));
            }
          }
        });
      }
    } catch (error) {
      console.error('Erro na busca múltipla:', error);
    }

    return results;
  }
}

export const materialPriceService = new MaterialPriceService();
