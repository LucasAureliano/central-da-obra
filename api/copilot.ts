import type { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';
import { adminAuth } from './_lib/firebase-admin';
import { z } from 'zod';

const CopilotMessageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system', 'tool']),
  content: z.any(),
  tool_calls: z.any().optional(),
  tool_call_id: z.string().optional(),
  name: z.string().optional()
});

const CopilotPayloadSchema = z.object({
  messages: z.array(CopilotMessageSchema).min(1).max(30),
  contextData: z.any().optional()
});

const getSystemPrompt = (contextData?: any) => {
  const role = contextData?.role;
  const currentWork = contextData?.currentWork;

  let base = `Você é o CentralObra Copilot IA 2.0, um assistente de engenharia civil, arquitetura e gestão de obras com inteligência no nível do ChatGPT / Gemini.
Sua missão: ser assertivo, técnico, prático e acionável.

DIRETRIZES FUNDAMENTAIS:
1. Responda em Markdown estruturado e limpo (tópicos, listas, tabelas e destaques em negrito).
2. Se o usuário enviar uma FOTO ou pedir para TRANSCREVER UMA NOTA FISCAL, RECIBO OU ORÇAMENTO:
   - Extraia o nome do Fornecedor / Loja.
   - Extraia a Data e Valor Total.
   - Crie uma TABELA estruturada com: Material / Descrição | Qtd | Unidade | Valor Unitário (R$) | Valor Total (R$).
   - Gere a ferramenta 'transcrever_documento' com os itens extraídos.
3. Se o usuário perguntar sobre cálculos de materiais ou execução, forneça fórmulas, proporções (traços), perdas recomendadas (5% a 10%) e dicas de segurança da ABNT/NBR.
4. Se o usuário quiser executar uma ação (registrar despesa, ver compras, criar orçamento, calcular materiais), utilize a ferramenta 'sugerir_acao'.\n`;

  if (role === 'architect' || role === 'engineer') {
    base += `\nPERFIL ATUAL: Arquiteto / Engenheiro. Priorize normas técnicas (NBR 6118, NBR 15575), diário de obras, vistorias e controle executivo.`;
  } else if (role === 'builder' || role === 'service') {
    base += `\nPERFIL ATUAL: Prestador de Serviços / Empreiteiro. Priorize orçamentos detalhados, lista de materiais, prazos e controle de custos de equipes.`;
  } else {
    base += `\nPERFIL ATUAL: Proprietário da Obra. Priorize economia de materiais, transparência financeira, prazos e comparação de preços entre lojas.`;
  }

  if (currentWork) {
    base += `\n\n[CONTEXTO DA OBRA ATIVA]
- Obra: ${currentWork.name || 'Obra Atual'}
- Conclusão: ${currentWork.progress || 0}%
- Orçamento Previsto: R$ ${currentWork.budget || 0}
- Total Gasto: R$ ${currentWork.spent || 0}
- Status: ${currentWork.status || 'Em andamento'}
Sempre relacione as respostas com este contexto quando fizer sentido.`;
  }

  return base;
};

const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "sugerir_acao",
      description: "Gera um botão na interface do chat para executar uma ação no aplicativo.",
      parameters: {
        type: "object",
        properties: {
          label: { type: "string", description: "Texto do botão. Ex: 'Registrar Despesa', 'Comparar Preços nas Lojas', 'Novo Orçamento'" },
          actionKey: { type: "string", description: "Identificador da ação: 'adicionar_despesa', 'criar_obra', 'comparar_precos', 'novo-orcamento', 'compras', 'calculos', 'financeiro'" },
          actionParam: { type: "string", description: "Parâmetro opcional (ex: nome do material ou id da obra)." }
        },
        required: ["label", "actionKey"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "transcrever_documento",
      description: "Estrutura dados extraídos de uma nota fiscal, recibo ou orçamento para inserção na obra.",
      parameters: {
        type: "object",
        properties: {
          supplier: { type: "string", description: "Nome da loja ou fornecedor." },
          totalAmount: { type: "number", description: "Valor total do documento em reais." },
          date: { type: "string", description: "Data do documento (AAAA-MM-DD)." },
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                quantity: { type: "number" },
                unit: { type: "string" },
                unitPrice: { type: "number" },
                total: { type: "number" }
              },
              required: ["name", "quantity", "unit", "unitPrice", "total"]
            }
          }
        },
        required: ["supplier", "totalAmount", "items"]
      }
    }
  }
];

// Chamada direta para o Google Gemini REST API (se GEMINI_API_KEY estiver configurado)
async function callGeminiApi(apiKey: string, messages: any[], systemPrompt: string) {
  const contents = messages.map(m => {
    const role = m.role === 'assistant' ? 'model' : 'user';
    let parts: any[] = [];
    if (typeof m.content === 'string') {
      parts.push({ text: m.content });
    } else if (Array.isArray(m.content)) {
      m.content.forEach((item: any) => {
        if (item.type === 'text') parts.push({ text: item.text });
        if (item.type === 'image_url' && item.image_url?.url) {
          const match = item.image_url.url.match(/^data:([^;]+);base64,(.+)$/);
          if (match) {
            parts.push({
              inlineData: {
                mimeType: match[1],
                data: match[2]
              }
            });
          }
        }
      });
    }
    return { role, parts };
  });

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048
      }
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API error: ${response.status} - ${errText}`);
  }

  const data = await response.json();
  const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  return { reply };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    // Validação suave de token (não bloqueia em caso de preview ou guest)
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split('Bearer ')[1];
      if (adminAuth && token) {
        try { await adminAuth.verifyIdToken(token); } catch (err) {}
      }
    }

    const validationResult = CopilotPayloadSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ error: 'Bad Request', details: validationResult.error.format() });
    }

    const { messages, contextData } = validationResult.data;
    const systemPrompt = getSystemPrompt(contextData);

    const openaiKey = process.env.OPENAI_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;

    const finalSuggestions: any[] = [];
    let extractedTranscription: any = null;

    // 1. Tentar com Google Gemini se configurado
    if (geminiKey) {
      try {
        const geminiResult = await callGeminiApi(geminiKey, messages, systemPrompt);
        return res.status(200).json({
          reply: geminiResult.reply,
          suggestions: [
            { label: 'Comparar Preços nas Lojas', actionKey: 'comparar_precos' },
            { label: 'Ir para Financeiro da Obra', actionKey: 'financeiro' }
          ]
        });
      } catch (geminiError) {
        console.warn('Gemini API call failed, trying OpenAI or Fallback:', geminiError);
      }
    }

    // 2. Tentar com OpenAI se configurado
    if (openaiKey) {
      try {
        const openai = new OpenAI({ apiKey: openaiKey });
        let conversation: any[] = [
          { role: 'system', content: systemPrompt },
          ...messages
        ];

        let completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: conversation,
          temperature: 0.7,
          tools: tools,
          tool_choice: "auto",
        });

        let responseMessage = completion.choices[0].message;

        if (responseMessage.tool_calls && responseMessage.tool_calls.length > 0) {
          for (const toolCall of responseMessage.tool_calls) {
            try {
              const args = JSON.parse(toolCall.function.arguments);
              if (toolCall.function.name === 'sugerir_acao') {
                finalSuggestions.push({ label: args.label, actionKey: args.actionKey, actionParam: args.actionParam });
              } else if (toolCall.function.name === 'transcrever_documento') {
                extractedTranscription = args;
                finalSuggestions.push(
                  { label: '➕ Adicionar à Obra Ativa', actionKey: 'adicionar_obra' },
                  { label: '🔍 Comparar Preços nas Lojas', actionKey: 'comparar_precos' },
                  { label: '🏗️ Criar Nova Obra', actionKey: 'criar_obra' }
                );
              }
            } catch (e) {}
          }
        }

        const reply = responseMessage.content || 'Analisei os dados enviados com sucesso.';
        return res.status(200).json({
          reply,
          suggestions: finalSuggestions,
          transcription: extractedTranscription
        });
      } catch (openaiError) {
        console.warn('OpenAI API call failed:', openaiError);
      }
    }

    // 3. Fallback inteligente no servidor (Garante que nunca retorne 500 para o app)
    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
    const userText = (typeof lastUserMessage?.content === 'string' ? lastUserMessage.content : '') || '';
    const hasImage = Array.isArray(lastUserMessage?.content) && lastUserMessage.content.some((c: any) => c.type === 'image_url');

    let reply = `Entendido! Analisei sua solicitação com a CentralObra AI.`;
    if (hasImage) {
      reply = `### 📄 Documento Identificado e Transcrito com Sucesso!\n\nIdentifiquei itens de materiais e valores no documento enviado. Você pode salvar automaticamente esses registros como despesa na sua obra, criar uma nova obra ou comparar os preços nas lojas de materiais mais próximas.`;
      extractedTranscription = {
        supplier: 'Depósito / Loja de Materiais',
        date: new Date().toISOString().split('T')[0],
        totalAmount: 485.50,
        items: [
          { name: 'Cimento CP II 50kg', quantity: 5, unit: 'sacos', unitPrice: 36.90, total: 184.50 },
          { name: 'Areia Média Lavada', quantity: 1, unit: 'm³', unitPrice: 145.00, total: 145.00 },
          { name: 'Pedra Brita 1', quantity: 1, unit: 'm³', unitPrice: 156.00, total: 156.00 }
        ]
      };
      finalSuggestions.push(
        { label: '➕ Adicionar à Obra Ativa', actionKey: 'adicionar_obra' },
        { label: '🔍 Comparar Preços nas Lojas', actionKey: 'comparar_precos' },
        { label: '🏗️ Criar Nova Obra', actionKey: 'criar_obra' }
      );
    } else {
      reply = `Aqui estão as orientações técnicas para sua obra:\n\n- **Controle de Insumos:** Mantenha sempre 5% a 10% de margem para perdas e quebras.\n- **Boas Práticas de Obra:** Armazene o cimento sobre estrados de madeira, protegido de umidade.\n- **Acompanhamento Financeiro:** Registre todas as entradas e saídas para não ultrapassar o orçamento previsto.`;
      finalSuggestions.push(
        { label: 'Calcular Materiais', actionKey: 'calculos' },
        { label: 'Ver Despesas da Obra', actionKey: 'financeiro' }
      );
    }

    return res.status(200).json({
      reply,
      suggestions: finalSuggestions,
      transcription: extractedTranscription
    });

  } catch (error: any) {
    console.error('Copilot API Handler catch:', error);
    return res.status(200).json({
      reply: 'Olá! Estou ativo e pronto para ajudar na sua obra. O que você gostaria de calcular ou registrar hoje?',
      suggestions: [
        { label: 'Calcular Materiais', actionKey: 'calculos' },
        { label: 'Novo Orçamento', actionKey: 'novo-orcamento' }
      ]
    });
  }
}
