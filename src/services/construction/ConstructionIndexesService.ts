// import { apiClient } from '../../api/apiClient';
import { cacheManager } from '../../api/cacheManager';

export interface ConstructionIndex {
  name: string;
  value: number;
  date: string;
  variation: number; // percentage
}

class ConstructionIndexesService {
  /**
   * Obtém os índices da construção civil (INCC, CUB, SINAPI).
   * Implementa cache pesado, já que estes índices atualizam mensalmente.
   */
  async getIndexes(): Promise<ConstructionIndex[]> {
    const cacheKey = 'construction_indexes_v1';
    // Cache de 24 horas
    const cached = cacheManager.get<ConstructionIndex[]>(cacheKey, true);

    if (cached) return cached;

    // Simulação da chamada da API (que futuramente será conectada ao BACEN ou APIs especializadas)
    await new Promise(resolve => setTimeout(resolve, 800));

    const mockData: ConstructionIndex[] = [
      { name: 'INCC-M', value: 1102.34, date: '2026-06-01', variation: 0.32 },
      { name: 'CUB-SP', value: 1854.20, date: '2026-06-01', variation: 0.15 },
      { name: 'IPCA', value: 6542.11, date: '2026-06-01', variation: 0.21 }
    ];

    cacheManager.set(cacheKey, mockData, 1000 * 60 * 60 * 24, true);

    return mockData;
  }
}

export const constructionIndexesService = new ConstructionIndexesService();
