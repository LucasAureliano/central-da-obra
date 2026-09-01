import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';
import { adminDb, adminAuth } from './_lib/firebase-admin.js';

export interface PriceResult {
  store: string;
  price: number;
  url: string;
  name: string;
  lastUpdated: string;
}

// Fallback pricing for critical materials if Firestore catalog is missing
const STATIC_CATALOG: Record<string, PriceResult> = {
  'cimento': { store: 'Catálogo', price: 35.90, url: 'https://centralobra.com', name: 'Cimento CP II 50kg', lastUpdated: new Date().toISOString() },
  'areia': { store: 'Catálogo', price: 150.00, url: 'https://centralobra.com', name: 'Areia Média (m³)', lastUpdated: new Date().toISOString() },
  'brita': { store: 'Catálogo', price: 160.00, url: 'https://centralobra.com', name: 'Brita 1 (m³)', lastUpdated: new Date().toISOString() },
  'tijolo': { store: 'Catálogo', price: 1.20, url: 'https://centralobra.com', name: 'Tijolo 8 furos', lastUpdated: new Date().toISOString() },
  'bloco': { store: 'Catálogo', price: 3.50, url: 'https://centralobra.com', name: 'Bloco de Concreto Estrutural', lastUpdated: new Date().toISOString() },
  'aco': { store: 'Catálogo', price: 45.00, url: 'https://centralobra.com', name: 'Barra de Aço 10mm (12m)', lastUpdated: new Date().toISOString() },
  'tinta': { store: 'Catálogo', price: 250.00, url: 'https://centralobra.com', name: 'Tinta Acrílica Fosca Premium 18L', lastUpdated: new Date().toISOString() },
  'argamassa': { store: 'Catálogo', price: 20.00, url: 'https://centralobra.com', name: 'Argamassa ACIII 20kg', lastUpdated: new Date().toISOString() },
  'rejunte': { store: 'Catálogo', price: 8.50, url: 'https://centralobra.com', name: 'Rejunte Acrílico 1kg', lastUpdated: new Date().toISOString() },
  'massa_corrida': { store: 'Catálogo', price: 65.00, url: 'https://centralobra.com', name: 'Massa Corrida PVA 18L', lastUpdated: new Date().toISOString() },
  'piso': { store: 'Catálogo', price: 45.00, url: 'https://centralobra.com', name: 'Piso Cerâmico Básico (m²)', lastUpdated: new Date().toISOString() }
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: Missing or invalid authorization token' });
    }

    const idToken = authHeader.split('Bearer ')[1];
    try {
      if (adminAuth) {
        await adminAuth.verifyIdToken(idToken);
      }
    } catch (verifyError) {
      return res.status(403).json({ error: 'Forbidden: Invalid authorization token' });
    }

    const { q, materials } = req.query;

    const InputSchema = z.object({
      q: z.string().max(100).optional(),
      materials: z.string().max(1000).optional()
    }).refine(data => data.q || data.materials, {
      message: 'Query parameter "q" or "materials" is required.'
    });

    const parsedInput = InputSchema.safeParse({ q, materials });
    if (!parsedInput.success) {
      return res.status(400).json({ error: 'Bad Request: Invalid input' });
    }

    const validMaterials = parsedInput.data.materials;
    const validQ = parsedInput.data.q;
    
    const materialQueries = validMaterials 
      ? validMaterials.split(',').map(s => s.trim().toLowerCase()).filter(Boolean)
      : [validQ?.trim().toLowerCase() || ''];

    const results: Record<string, PriceResult[]> = {};

    await Promise.all(materialQueries.map(async (material) => {
      let validPrices: PriceResult[] = [];

      try {
        if (adminDb) {
          const snapshot = await adminDb.collection('material_catalog')
            .where('keywords', 'array-contains', material)
            .limit(3)
            .get();

          if (!snapshot.empty) {
            snapshot.forEach(doc => {
              const data = doc.data();
              validPrices.push({
                store: data.store || 'Catálogo Interno',
                price: Number(data.price),
                url: data.url || 'https://centralobra.com',
                name: data.name || material,
                lastUpdated: data.updatedAt || new Date().toISOString()
              });
            });
          }
        }
      } catch (e) {
        console.warn('Firestore fetch failed for catalog', e);
      }

      // If no valid prices found in Firestore, try static catalog
      if (validPrices.length === 0) {
        // Simple heuristic matching
        for (const [key, item] of Object.entries(STATIC_CATALOG)) {
          if (material.includes(key) || key.includes(material)) {
            validPrices.push(item);
          }
        }
      }
      
      if (validPrices.length > 0) {
        validPrices.sort((a, b) => a.price - b.price);
        results[material] = validPrices;
      }
    }));

    return res.status(200).json({ data: results });
  } catch (error: any) {
    console.error('Error in prices API:', error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}