// import { apiClient } from '../../api/apiClient';

export interface AssistantQuery {
  text: string;
  contextData?: {
    currentWorkId?: string;
    role?: string;
  };
}

export interface AssistantResponse {
  answer: string;
  suggestions: {
    label: string;
    actionKey: string;
    actionParam?: string;
  }[];
}

class AssistantService {
  async sendMessage(query: AssistantQuery): Promise<AssistantResponse> {
    try {
      const { auth } = await import('../../lib/firebase');
      const user = auth.currentUser;
      
      let token = '';
      if (user) {
        token = await user.getIdToken();
      }

      const response = await fetch('/api/copilot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: query.text }]
        })
      });

      if (!response.ok) {
        throw new Error(`API retornou status ${response.status}`);
      }

      const data = await response.json();
      
      return {
        answer: data.reply || 'Não foi possível obter uma resposta.',
        suggestions: [
          { label: 'Central de Cálculos', actionKey: 'calculos' },
          { label: 'Novo Orçamento', actionKey: 'novo-orcamento' }
        ]
      };
    } catch (err) {
      console.warn('[AssistantService] Falha na API real, usando fallback mock.', err);
      return this.mockResponse(query.text);
    }
  }

  private mockResponse(text: string): AssistantResponse {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('concreto')) {
      return {
        answer: "Entendi! Você quer calcular o traço de concreto ou materiais para fundação.",
        suggestions: [
          { label: 'Calcular Traço', actionKey: 'calculos', actionParam: 'concrete-mix' },
          { label: 'Normas', actionKey: 'biblioteca-normas', actionParam: 'concreto' }
        ]
      };
    }
    
    if (lowerText.includes('chuveiro') || lowerText.includes('elétrica')) {
      return {
        answer: "Instalações elétricas exigem atenção às normas (NBR 5410).",
        suggestions: [
          { label: 'Calculadora Elétrica', actionKey: 'calculos', actionParam: 'electrical' },
          { label: 'Consultar NBR 5410', actionKey: 'biblioteca-normas', actionParam: 'eletrica' }
        ]
      };
    }

    if (lowerText.includes('infiltração')) {
      return {
        answer: "Infiltrações podem ser causadas por falha na impermeabilização ou vazamentos.",
        suggestions: [
          { label: 'Normas de Impermeabilização', actionKey: 'biblioteca-normas', actionParam: 'impermeabilizacao' },
          { label: 'Materiais', actionKey: 'compras', actionParam: 'impermeabilizante' }
        ]
      };
    }

    return {
      answer: "Como posso ajudar na sua obra hoje?",
      suggestions: [
        { label: 'Central de Cálculos', actionKey: 'calculos' },
        { label: 'Novo Orçamento', actionKey: 'novo-orcamento' }
      ]
    };
  }
}

export const assistantService = new AssistantService();
