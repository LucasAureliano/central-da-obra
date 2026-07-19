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
  /**
   * Envia uma mensagem para a inteligência artificial.
   * Utilizará fallback mockado se a API KEY não estiver configurada.
   */
  async sendMessage(query: AssistantQuery): Promise<AssistantResponse> {
    const GEMINI_KEY = import.meta.env.VITE_GEMINI_KEY;

    if (!GEMINI_KEY) {
      // Mock inteligente com atraso para simular rede
      await new Promise(resolve => setTimeout(resolve, 800));
      return this.mockResponse(query.text);
    }

    try {
      // Aqui ficaria a chamada real para o Gemini via apiClient
      // Exemplo:
      // return await apiClient.post('/api/gemini/chat', query);
      
      throw new Error('API Real ainda não implementada no backend. Usando mock.');
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
