import type { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';
import { adminAuth } from './_lib/firebase-admin';
import { z } from 'zod';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const CopilotMessageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.any() // Can be string or array for vision
});

const CopilotPayloadSchema = z.object({
  messages: z.array(CopilotMessageSchema).min(1).max(30),
  contextData: z.any().optional()
});

const getSystemPrompt = (contextData?: any) => {
  const role = contextData?.role;
  const currentWork = contextData?.currentWork;
  const isPremium = contextData?.isPremium;

  let base = \Você é a CentralObra AI 2.0, um assistente contextual e multimodal de construção civil.
Sua missão: ENTENDER → ANALISAR → SUGERIR → EXECUTAR.
Aja como um verdadeiro copiloto integrado à obra. Se o usuário quiser fazer um orçamento, sugerir compras, registrar despesas ou fazer diário de obra, USE AS FERRAMENTAS (Tools) para gerar botões de ação na interface. Nunca invente dados que não possui.\n\;
  
  if (role === 'engineer' || role === 'architect') {
    base += \\nPERFIL: Engenheiro/Arquiteto. Priorize vistorias, diário técnico, acompanhamento, medições, normas NBR e relatórios.\;
  } else if (role === 'builder' || role === 'service') {
    base += \\nPERFIL: Prestador/Construtor. Priorize orçamentos, cronograma, equipes, produtividade e compras.\;
  } else {
    base += \\nPERFIL: Dono da Obra. Priorize controle financeiro, cálculos de material, progresso da obra e economia.\;
  }

  if (isPremium === false) {
    base += \\n[PLANO FREE]: Ajude com cálculos básicos e dúvidas. Para diários, orçamentos complexos ou financeiro avançado, avise que é um recurso Premium.\;
  } else {
    base += \\n[PLANO PREMIUM]: Acesso total. Entregue respostas ricas, completas, e orçamentos persuasivos.\;
  }

  if (currentWork) {
    base += \\n\n[CONTEXTO DA OBRA ATUAL]
Nome: \
Progresso: \%
Orçamento Total: R$ \
Gasto até o momento: R$ \
Status: \
Sempre contextualize suas respostas com esses dados. Se ele pedir para registrar despesa, forneça um botão (sugerir_acao).\;
  }

  base += \\n\nDiretrizes de Análise de Imagem:
Se o usuário enviar uma imagem, analise materiais, estado visual, ou extraia itens de notas fiscais.
Sempre inclua este aviso no final da análise de imagem: "*Essa análise é visual e preliminar. Para avaliação técnica ou estrutural, consulte um profissional habilitado.*"\;

  return base;
};

const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "buscar_preco_material",
      description: "Busca o preço de um material.",
      parameters: {
        type: "object",
        properties: {
          material: { type: "string" }
        },
        required: ["material"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "sugerir_acao",
      description: "Gera um botão na interface do chat para executar uma ação no aplicativo.",
      parameters: {
        type: "object",
        properties: {
          label: { type: "string", description: "O texto do botão. Ex: 'Registrar Despesa', 'Criar Orçamento', 'Calcular Cimento'" },
          actionKey: { type: "string", description: "Destino: 'financeiro', 'novo-orcamento', 'compras', 'calculos', 'diario-tecnico', 'cronograma'" },
          actionParam: { type: "string", description: "Parâmetro opcional. Ex: nome do material ('cimento'), ou tipo de cálculo." }
        },
        required: ["label", "actionKey"],
      },
    },
  }
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split('Bearer ')[1];
    if (adminAuth && token) {
      try { await adminAuth.verifyIdToken(token); } catch (err) { }
    }

    const validationResult = CopilotPayloadSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ error: 'Bad Request' });
    }

    const { messages, contextData } = validationResult.data;

    let conversation: any[] = [
      { role: 'system', content: getSystemPrompt(contextData) },
      ...messages
    ];

    if (!process.env.OPENAI_API_KEY) {
      return res.status(200).json({ reply: "Modo Simulação: A API da OpenAI não está configurada.", suggestions: [] });
    }

    let completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: conversation,
      temperature: 0.7,
      tools: tools,
      tool_choice: "auto",
    });

    let responseMessage = completion.choices[0].message;
    const finalSuggestions: any[] = [];

    if (responseMessage.tool_calls && responseMessage.tool_calls.length > 0) {
      conversation.push(responseMessage);
      
      for (const toolCall of responseMessage.tool_calls) {
        try {
          if (toolCall.function.name === 'buscar_preco_material') {
            const args = JSON.parse(toolCall.function.arguments);
            conversation.push({ tool_call_id: toolCall.id, role: "tool", name: toolCall.function.name, content: \Preço simulado/encontrado para \\ });
          } else if (toolCall.function.name === 'sugerir_acao') {
            const args = JSON.parse(toolCall.function.arguments);
            finalSuggestions.push({ label: args.label, actionKey: args.actionKey, actionParam: args.actionParam });
            conversation.push({ tool_call_id: toolCall.id, role: "tool", name: toolCall.function.name, content: "Atalho fornecido ao usuário." });
          }
        } catch (err) {
          conversation.push({ tool_call_id: toolCall.id, role: "tool", name: toolCall.function.name, content: "Erro." });
        }
      }

      completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: conversation,
        temperature: 0.7,
      });
      responseMessage = completion.choices[0].message;
    }

    const reply = responseMessage.content || 'Não consegui formular uma resposta neste momento.';
    return res.status(200).json({ reply, suggestions: finalSuggestions });

  } catch (error: any) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
