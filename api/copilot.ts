import type { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';
import { adminAuth } from './_lib/firebase-admin';
import { z } from 'zod';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const CopilotMessageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string().max(4000)
});

const CopilotPayloadSchema = z.object({
  messages: z.array(CopilotMessageSchema).min(1).max(30),
  contextData: z.any().optional()
});

const getSystemPrompt = (contextData?: any) => {
  const role = contextData?.role;
  const currentWork = contextData?.currentWork;
  const isPremium = contextData?.isPremium;

  let base = \Você é a CentralObra AI, a inteligência artificial mais avançada e completa para construção civil.
Aja exatamente como o ChatGPT: seja extremamente amigável, consultivo, prestativo e detalhista. Nunca dê respostas curtas ou superficiais. Sempre estruture suas respostas de forma impecável usando Markdown (listas, negritos, quebras de linha). Explique o 'porquê' das coisas e dê dicas extras valiosas que o usuário nem pediu.\n\;
  
  if (role === 'engineer' || role === 'architect') {
    base += \\nATENÇÃO: O usuário é um Engenheiro/Arquiteto. Converse em alto nível técnico. Aprofunde-se em normas técnicas (NBR), dimensionamentos, patologias da construção e compatibilização estrutural. Mostre que você é um especialista Sênior.\;
  } else if (role === 'builder' || role === 'service') {
    base += \\nATENÇÃO: O usuário é um Construtor/Prestador de Serviços. Dê conselhos extremamente práticos sobre canteiro de obras, gestão de equipes, redução de desperdício e como ser mais profissional para lucrar mais e fechar contratos.\;
  } else {
    base += \\nATENÇÃO: O usuário é Dono de Obra (Leigo). Seja super didático, explique termos difíceis com analogias simples. Ajude-o a não ser enganado e a controlar o dinheiro da obra com inteligência.\;
  }

  if (isPremium === false) {
    base += \\n\n[MÓDULO: PLANO FREE]
O usuário possui o plano GRATUITO. 
Forneça informações muito completas e úteis, mas avise que funções de geração de documentos (Diário de Obra Formal, Memorial Descritivo Completo, Orçamento Matador Persuasivo) requerem o Plano Premium. Explique os benefícios do plano Premium para deixá-lo com vontade de assinar.\;
  } else {
    base += \\n\n[MÓDULO: PLANO PREMIUM]
O usuário possui o plano PREMIUM. Entregue a melhor experiência possível. 
Se ele pedir relatórios, memoriais, ou propostas, gere textos profissionais, longos, persuasivos e prontos para uso. Analise orçamentos com profundidade matemática.\;
  }

  if (currentWork) {
    base += \\n\n[CONTEXTO DA OBRA ATUAL]
A obra que o usuário está focando agora se chama: \
Progresso atual: \%
Orçamento Total Planejado: R$ \
Gasto até o momento: R$ \
Use esses dados de forma proativa. Se ele perguntar 'como está minha obra?', faça uma análise financeira completa, dizendo se ele está gastando muito ou dentro da meta.\;
  } else {
    base += \\n\n[CONTEXTO DA OBRA ATUAL]
O usuário não possui nenhuma obra selecionada ou criada no momento. Se ele quiser falar sobre uma obra específica, oriente-o a criar uma obra no menu inicial.\;
  }

  base += \\n\nSempre que couber, sugira atalhos da plataforma usando a ferramenta sugerir_atalho (ex: enviar para a tela de novo orçamento).\;

  return base;
};

const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "buscar_preco_material",
      description: "Busca o preço médio atualizado de um material de construção.",
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
      name: "sugerir_atalho",
      description: "Adiciona um botão na interface do chat para navegar rapidamente para outra tela.",
      parameters: {
        type: "object",
        properties: {
          label: { type: "string" },
          actionKey: { type: "string", description: "Valores válidos: 'novo-orcamento', 'diario-tecnico', 'compras', 'planos'" }
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
      try { await adminAuth.verifyIdToken(token); } catch (err) {
        console.warn('Invalid token for Copilot API');
      }
    }

    const validationResult = CopilotPayloadSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ error: 'Bad Request', details: validationResult.error.format() });
    }

    const { messages, contextData } = validationResult.data;

    let conversation: any[] = [
      { role: 'system', content: getSystemPrompt(contextData) },
      ...messages
    ];

    if (!process.env.OPENAI_API_KEY) {
      return res.status(200).json({ reply: "A API da OpenAI não está configurada (OPENAI_API_KEY). Como simulação: Seu orçamento matador/memorial ficaria incrível se gerado com a chave configurada!", suggestions: [] });
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
            const STATIC = { 'cimento': 35.90, 'areia': 150.00, 'brita': 160.00, 'tijolo': 1.20, 'bloco': 3.50, 'tinta': 250.00, 'piso': 45.00 };
            let foundPrice = null;
            let matLower = (args.material || '').toLowerCase();
            for (const [key, p] of Object.entries(STATIC)) {
              if (matLower.includes(key)) foundPrice = p;
            }
            const resultText = foundPrice ? \Catálogo CentralObra: R$ \\ : "Preço não encontrado.";
            conversation.push({ tool_call_id: toolCall.id, role: "tool", name: toolCall.function.name, content: resultText });
          } else if (toolCall.function.name === 'sugerir_atalho') {
            const args = JSON.parse(toolCall.function.arguments);
            finalSuggestions.push({ label: args.label, actionKey: args.actionKey });
            conversation.push({ tool_call_id: toolCall.id, role: "tool", name: toolCall.function.name, content: "Atalho criado com sucesso na interface do usuário." });
          }
        } catch (err) {
          // Fallback if JSON parse fails
          conversation.push({ tool_call_id: toolCall.id, role: "tool", name: toolCall.function.name, content: "Erro ao executar ferramenta." });
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
    console.error('Copilot API error:', error.message);
    return res.status(500).json({ error: 'Internal server error processing copilot request' });
  }
}
