/**
 * Copyright (c) 2026 CentralObra. All rights reserved.
 * PROPRIETARY AND CONFIDENTIAL
 * This software and its documentation are proprietary to CentralObra.
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { searchLeroyMerlin, PriceResult } from './_adapters/leroyMerlin.js';
import { searchObramax } from './_adapters/obramax.js';
import { adminAuth } from './_lib/firebase-admin.js';
import { z } from 'zod';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Configuração de CORS para permitir que o app chame esta API
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // 1. Verificação de Autenticação (Proteção da API)
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: Missing or invalid authorization token' });
    }

    const idToken = authHeader.split('Bearer ')[1];
    try {
      if (adminAuth) {
        await adminAuth.verifyIdToken(idToken);
      } else {
        // Fallback for local development if admin is not configured
        console.warn('Firebase Admin not initialized, skipping token verification');
      }
    } catch (verifyError) {
      console.error('Token verification failed:', verifyError);
      return res.status(403).json({ error: 'Forbidden: Invalid authorization token' });
    }

    // 2. Validação de Entradas (Segurança / Hardening com Zod)
    const { q, materials } = req.query;

    const InputSchema = z.object({
      q: z.string().max(100).optional(),
      materials: z.string().max(1000).optional()
    }).refine(data => data.q || data.materials, {
      message: 'Query parameter "q" or "materials" is required.'
    });

    const parsedInput = InputSchema.safeParse({ q, materials });
    if (!parsedInput.success) {
      return res.status(400).json({ error: 'Bad Request: Invalid input', details: parsedInput.error.format() });
    }

    const validMaterials = parsedInput.data.materials;
    const validQ = parsedInput.data.q;

    // 3. Timeout Control (AbortController for fetch operations inside adapters)
    // Implementação de Timeout nativo da Vercel ou controller
    
    const materialQueries = validMaterials 
      ? validMaterials.split(',').map(s => s.trim()).filter(Boolean)
      : [validQ?.trim() || ''];

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
