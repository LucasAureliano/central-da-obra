
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
  /**
   * Busca preços de materiais reais através do nosso BFF no Vercel Functions.
   * Utiliza cache local para não estourar limites de API ou abusar da rede.
   */
  async searchMaterial(query: string): Promise<MaterialPrice[]> {
    if (!query) return [];

    const cacheKey = `${CACHE_KEY_PREFIX}${query.toLowerCase().trim()}`;
    const cachedStr = localStorage.getItem(cacheKey);

    if (cachedStr) {
      try {
        const cached = JSON.parse(cachedStr);
        if (Date.now() - cached.timestamp < CACHE_DURATION_MS) {
          return cached.data;
        }
      } catch (e) {
        // Cache corrompido, ignora
      }
    }

    try {
      // Usamos a URL absoluta para funcionar no localhost sem proxy do Vite e evitar Vercel Protection em previews
      const response = await fetch(`https://centralobra-black.vercel.app/api/prices?q=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error('Falha ao buscar preços: ' + response.status);
      }

      const result = await response.json();
      const resultsArray = result.data?.[query] || result.data?.[query.toLowerCase()] || [];

      // Converte o formato do backend para o formato do MaterialPrice
      const formattedPrices: MaterialPrice[] = resultsArray.map((item: any, index: number) => ({
        id: `api_${index}_${Date.now()}`,
        name: item.name,
        unit: item.unit,
        price: item.price,
        supplier: item.supplier,
        link: item.link,
        lastUpdated: new Date().toISOString()
      }));

      // Salva no cache
      if (formattedPrices.length > 0) {
        localStorage.setItem(cacheKey, JSON.stringify({
          timestamp: Date.now(),
          data: formattedPrices
        }));
      }

      return formattedPrices;
    } catch (error) {
      console.error('Erro no MaterialPriceService:', error);
      // Fallback pra não quebrar a aplicação
      // Se tiver cache vencido, usamos ele
      if (cachedStr) {
        try {
          return JSON.parse(cachedStr).data;
        } catch (e) {}
      }
      return [];
    }
  }

  /**
   * Busca preços para múltiplos materiais simultaneamente.
   */
  async searchMultiple(queries: string[]): Promise<Record<string, MaterialPrice[]>> {
    const validQueries = queries.filter(Boolean);
    if (!validQueries.length) return {};

    const results: Record<string, MaterialPrice[]> = {};
    const missingQueries: string[] = [];

    // Checa cache primeiro
    validQueries.forEach(q => {
      const cacheKey = `${CACHE_KEY_PREFIX}${q.toLowerCase().trim()}`;
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

    // Busca os que faltaram
    try {
      const response = await fetch(`https://centralobra-black.vercel.app/api/prices?materials=${encodeURIComponent(missingQueries.join(','))}`);
      if (response.ok) {
        const result = await response.json();
        const data = result.data || {};

        Object.keys(data).forEach(q => {
          const formattedPrices: MaterialPrice[] = data[q].map((item: any, index: number) => ({
             id: `api_${index}_${Date.now()}`,
             name: item.name,
             unit: item.unit,
             price: item.price,
             supplier: item.supplier,
             link: item.link,
             lastUpdated: new Date().toISOString()
          }));

          results[q] = formattedPrices;

          if (formattedPrices.length > 0) {
             const cacheKey = `${CACHE_KEY_PREFIX}${q.toLowerCase().trim()}`;
             localStorage.setItem(cacheKey, JSON.stringify({
               timestamp: Date.now(),
               data: formattedPrices
             }));
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

