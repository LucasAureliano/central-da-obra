const fs = require('fs');
let text = fs.readFileSync('src/components/assistant/SmartAssistant.tsx', 'utf8');

const lockBlockRegex = /  if \(\!isPremium\) \{[\s\S]*?  \}\n\n  useEffect\(\(\) => \{/;
text = text.replace(lockBlockRegex, '  useEffect(() => {');

const oldHandleSendRegex = /  const handleSend = async \(text: string\) => \{[\s\S]*?\};\n/;
const newHandleSend = `  const handleSend = async (text: string) => {
    if (!text.trim() || isTyping) return;
    
    const newMessages = [...messages, { role: 'user' as const, text }];
    setMessages(newMessages);
    setQuery('');
    setIsTyping(true);

    if (!isPremium) {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          role: 'assistant',
          text: 'A Inteligência Artificial avançada, análise de projetos e consulta online de preços de mercado são ferramentas exclusivas dos planos PRO e Business. Porém, você pode explorar nossas funções gratuitas abaixo!',
          suggestions: [
            { label: 'Central de Cálculos', action: () => onNavigate('calculos'), icon: <Calculator size={16} /> },
            { label: 'Ver Planos', action: () => onNavigate('planos'), icon: <Sparkles size={16} /> }
          ]
        }]);
        setIsTyping(false);
      }, 600);
      return;
    }

    try {
      const apiMessages = newMessages.map(m => ({ role: m.role, content: m.text }));
      
      const response = await assistantService.sendMessage({
        messages: apiMessages,
        contextData: {
          currentWork: currentWork ? {
            name: currentWork.name,
            progress: currentWork.progress,
            budget: currentWork.budget,
            spent: currentWork.spent,
            status: currentWork.status
          } : null,
          role: profile?.role
        }
      });
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: response.answer,
        suggestions: response.suggestions.map((s: any) => ({
          label: s.label,
          action: () => onNavigate(s.actionKey, s.actionParam),
          icon: <Sparkles size={16} />
        }))
      }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: 'Desculpe, ocorreu um erro de conexão com a API do Copilot. Tente novamente em instantes.'
      }]);
    } finally {
      setIsTyping(false);
    }
  };
`;

text = text.replace(oldHandleSendRegex, newHandleSend);
fs.writeFileSync('src/components/assistant/SmartAssistant.tsx', text, 'utf8');
