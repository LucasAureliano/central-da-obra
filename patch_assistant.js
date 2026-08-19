const fs = require('fs');

const path = 'src/components/assistant/SmartAssistant.tsx';
let code = fs.readFileSync(path, 'utf8');

// 1. Pass isPremium to the API
code = code.replace(
  /role: profile\?.role/,
  `role: profile?.role,\n            isPremium: isPremium`
);

// 2. Remove free limit block
const limitTargetRegex = /if \(!isPremium && freeCount >= 3\) \{[\s\S]*?if \(!isPremium\) setFreeCount\(prev => prev \+ 1\);/m;

code = code.replace(limitTargetRegex, `// free limit removed`);

// 3. Add intent detection logic at the start of handleSend
const handleSendTarget = `const handleSend = async () => {
    if (!query.trim()) return;

    const userMessage = query;
    setQuery('');
    
    const newMessages = [...messages, { role: 'user' as const, text: userMessage }];
    setMessages(newMessages);
    setIsTyping(true);`;

const handleSendReplacement = `const handleSend = async () => {
    if (!query.trim()) return;

    const userMessage = query;
    setQuery('');
    
    const newMessages = [...messages, { role: 'user' as const, text: userMessage }];
    setMessages(newMessages);
    setIsTyping(true);
    
    // INTENT DETECTION ENGINE
    const qLower = userMessage.toLowerCase();
    
    const intents = [
      { keywords: ['tendencia', 'tendência', 'inspira'], action: 'Tendências', reply: 'Claro! Abrindo a central de Tendências de mercado e arquitetura para você...' },
      { keywords: ['agenda', 'calendario', 'calendário'], action: 'Agenda', reply: 'Navegando para a sua Agenda Técnica. Aguarde um instante!' },
      { keywords: ['novo orçamento', 'fazer orçamento', 'criar orçamento'], action: 'Novo Orçamento', reply: 'Vamos lá! Abrindo a tela de Novo Orçamento.' },
      { keywords: ['calculadora', 'calcular', 'cálculo'], action: 'Calculadoras', reply: 'Acessando a Central de Cálculos. Tem mais de 80 opções disponíveis lá!' },
      { keywords: ['diário', 'diario', 'fotos da obra'], action: 'Diário Técnico', reply: 'Sem problemas. Abrindo o Diário Técnico da obra.' },
      { keywords: ['financeiro', 'finanças', 'custos', 'dinheiro'], action: 'Financeiro', reply: 'Acessando a gestão Financeira da sua obra.' },
      { keywords: ['material', 'materiais', 'compras', 'comprar'], action: 'Materiais', reply: 'Abrindo o portal de Gestão de Materiais e Compras.' }
    ];

    for (const intent of intents) {
      if (intent.keywords.some(kw => qLower.includes(kw))) {
        setTimeout(() => {
          setMessages(prev => [...prev, { role: 'assistant', text: intent.reply }]);
          setIsTyping(false);
          
          setTimeout(() => {
            onNavigate(intent.action);
          }, 1500);
        }, 800);
        return;
      }
    }`;

code = code.replace(handleSendTarget, handleSendReplacement);

fs.writeFileSync(path, code, 'utf8');
