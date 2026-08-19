export interface AssistantQuery {
  messages: { role: 'user' | 'assistant'; content: string }[];
  contextData?: any;
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
          messages: query.messages,
          contextData: query.contextData
        })
      });

      if (!response.ok) {
        throw new Error(`API retornou status ${response.status}`);
      }

      const data = await response.json();
      
      return {
        answer: data.reply || 'Não foi possível obter uma resposta.',
        suggestions: data.suggestions || []
      };
    } catch (err) {
      console.warn('[AssistantService] Falha na API real.', err);
      throw err;
    }
  }
}

export const assistantService = new AssistantService();
