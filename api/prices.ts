import type { VercelRequest, VercelResponse } from '@vercel/node';
import { searchLeroyMerlin, PriceResult } from './_adapters/leroyMerlin.js';
import { searchObramax } from './_adapters/obramax.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Configuração de CORS para permitir que o app chame esta API
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { q, materials } = req.query;

    if (!q && !materials) {
      return res.status(400).json({ error: 'Query parameter "q" (single) or "materials" (comma separated) is required.' });
    }

    const materialQueries = materials 
      ? (materials as string).split(',').map(s => s.trim()).filter(Boolean)
      : [(q as string).trim()];

    const results: Record<string, PriceResult[]> = {};

    // Processamento em paralelo para todos os materiais solicitados
    await Promise.all(materialQueries.map(async (material) => {
      // Busca em múltiplos fornecedores simultaneamente
      const [leroyResult, obramaxResult] = await Promise.allSettled([
        searchLeroyMerlin(material),
        searchObramax(material)
      ]);

      const validPrices: PriceResult[] = [];

      if (leroyResult.status === 'fulfilled' && leroyResult.value) {
        validPrices.push(leroyResult.value);
      }
      if (obramaxResult.status === 'fulfilled' && obramaxResult.value) {
        validPrices.push(obramaxResult.value);
      }

      // Ordenar do menor para o maior preço
      validPrices.sort((a, b) => a.price - b.price);

      results[material] = validPrices;
    }));

    return res.status(200).json({ data: results });

  } catch (error: any) {
    console.error('Error in prices API:', error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}
