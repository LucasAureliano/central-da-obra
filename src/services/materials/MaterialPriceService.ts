// import { apiClient } from '../../api/apiClient';

export interface MaterialPrice {
  id: string;
  name: string;
  unit: string;
  price: number;
  supplier: string;
  lastUpdated: string;
}

class MaterialPriceService {
  /**
   * Busca preços de materiais em catálogos de fornecedores ou banco interno.
   */
  async searchMaterial(query: string): Promise<MaterialPrice[]> {
    // Simulação do backend proxy pesquisando na Leroy Merlin/Obramax
    await new Promise(resolve => setTimeout(resolve, 600));

    if (query.toLowerCase().includes('cimento')) {
      return [
        { id: '1', name: 'Cimento CP II 50kg', unit: 'saco', price: 35.90, supplier: 'Obramax', lastUpdated: new Date().toISOString() },
        { id: '2', name: 'Cimento CP III 50kg', unit: 'saco', price: 34.50, supplier: 'Leroy Merlin', lastUpdated: new Date().toISOString() }
      ];
    }

    return [];
  }
}

export const materialPriceService = new MaterialPriceService();
