// import { apiClient } from '../../api/apiClient';

export interface OCRExtractionResult {
  supplierName: string;
  date: string;
  totalValue: number;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
  }[];
}

class OCRService {
  /**
   * Envia uma imagem de nota fiscal para extração de dados inteligente.
   */
  async processInvoice(_imageFile: File): Promise<OCRExtractionResult | null> {
    // Futura integração com Google Cloud Vision ou AWS Textract via Backend
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Retorno simulado
    return {
      supplierName: "Leroy Merlin",
      date: new Date().toISOString(),
      totalValue: 154.50,
      items: [
        { description: "Cimento Votorantim", quantity: 2, unitPrice: 35.00 },
        { description: "Tinta Coral Rende Muito", quantity: 1, unitPrice: 84.50 }
      ]
    };
  }
}

export const ocrService = new OCRService();
