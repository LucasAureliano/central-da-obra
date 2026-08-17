import { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';
import { adminAuth, adminDb } from './_lib/firebase-admin.js';

import { z } from 'zod';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Zod Schema to validate incoming payload and prevent Wallet Exhaustion Attacks
const CopilotMessageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string().min(1).max(2000) // max 2000 chars per message
});

const CopilotPayloadSchema = z.object({
  messages: z.array(CopilotMessageSchema).min(1).max(20), // max 20 messages per request
  userRole: z.string().optional()
});

// System prompt tailored for Civil Engineering & Construction
const getSystemPrompt = (role?: string) => {
  const base = `Você é o Copilot da Obra, um assistente especializado em Engenharia Civil e Gestão de Obras para a plataforma CentralObra.\nSua missão é ajudar engenheiros, arquitetos, mestres de obras e proprietários a resolver problemas do dia a dia da obra, esclarecer dúvidas técnicas e oferecer melhores práticas.\nResponda sempre de forma clara, técnica quando necessário, e acessível.\nVocê não deve fornecer projetos estruturais para execução sem o carimbo de um engenheiro habilitado; ofereça orientações e aconselhe sempre a consulta de um RT (Responsável Técnico) para decisões críticas.`;
  
  if (role === 'engineer' || role === 'architect') {
    return `${base}\n\nATENÇÃO: O usuário atual é um Engenheiro ou Arquiteto. Atue como seu mentor de engenharia, ajudando a revisar normas, cálculos avançados, dimensionamentos e compatibilização de projetos.`;
  }
  if (role === 'builder') {
    return `${base}\n\nATENÇÃO: O usuário atual é um Construtor/Empreiteiro. Atue como seu consultor de gestão de obras, auxiliando com cronogramas, equipes, logística de materiais e controle de custos no canteiro de obras.`;
  }
  if (role === 'owner') {
    return `${base}\n\nATENÇÃO: O usuário atual é o Proprietário da Obra. Atue como seu consultor de obras residenciais e finanças, explicando termos técnicos de forma simples, ajudando a controlar o orçamento e garantindo transparência no progresso.`;
  }
  if (role === 'service') {
    return `${base}\n\nATENÇÃO: O usuário atual é um Prestador de Serviços/Fornecedor. Atue como seu parceiro comercial e técnico, focando em elaboração de orçamentos precisos, fidelização de clientes e recomendações de materiais.`;
  }
  return base;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 1. Validate Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid authorization header' });
    }

    const token = authHeader.split('Bearer ')[1];
    let decodedToken;
    
    if (adminAuth) {
      try {
        decodedToken = await adminAuth.verifyIdToken(token);
      } catch (err) {
        console.error('Invalid token', err);
        return res.status(403).json({ error: 'Unauthorized: Invalid token' });
      }
    } else {
      // Allow fallback for local testing if admin isn't properly configured (optional)
      if (process.env.NODE_ENV !== 'development') {
        return res.status(500).json({ error: 'Firebase Admin not initialized properly' });
      }
      console.warn('Firebase Admin not initialized, bypassing auth check in development');
    }

    // 2. Extract and Validate messages from the body using Zod
    const validationResult = CopilotPayloadSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Bad Request: Invalid payload structure or size limit exceeded', 
        details: validationResult.error.format() 
      });
    }

    const { messages, userRole } = validationResult.data;

    // 3. Prepare the conversation for OpenAI
    const conversation = [
      { role: 'system', content: getSystemPrompt(userRole) },
      ...messages
    ];

    // 4. Call OpenAI API
    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({ 
        error: 'OpenAI API is not configured', 
        message: 'Mock response: Configuração de IA ausente no backend.' 
      });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: conversation as any,
      temperature: 0.7,
      max_tokens: 1000,
    });

    const reply = completion.choices[0]?.message?.content || 'Não foi possível gerar uma resposta.';

    // 5. Optional: Save query log in Firestore for analytics/history
    if (adminDb && decodedToken) {
      try {
        await adminDb.collection('copilot_logs').add({
          userId: decodedToken.uid,
          prompt: messages[messages.length - 1]?.content,
          timestamp: new Date(),
        });
      } catch (dbErr) {
        console.error('Could not log copilot usage', dbErr);
      }
    }

    return res.status(200).json({ reply });

  } catch (error) {
    console.error('Copilot API error:', error);
    return res.status(500).json({ error: 'Internal server error processing copilot request' });
  }
}
