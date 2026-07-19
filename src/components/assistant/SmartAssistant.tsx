import { useState, useRef, useEffect } from 'react';
import { Sparkles, ArrowRight, MessageSquare, Calculator, BookOpen, ShoppingCart, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';

export type AssistantMode = 'fast' | 'pro' | 'tutorial';

interface SmartAssistantProps {
  onNavigate: (tab: string, param?: string) => void;
}

export function SmartAssistant({ onNavigate }: SmartAssistantProps) {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{role: 'assistant'|'user', text: string, suggestions?: any[]}[]>([
    {
      role: 'assistant',
      text: 'Olá! Sou o Assistente Inteligente da CentralObra. O que você deseja fazer hoje?',
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, { role: 'user', text }]);
    setQuery('');

    // Process logic (Simulated NLP for now)
    setTimeout(() => {
      const lowerText = text.toLowerCase();
      let responseText = "Não entendi muito bem. Você pode reformular?";
      let suggestions: any[] = [];

      if (lowerText.includes('concreto') || lowerText.includes('cimento') || lowerText.includes('traço')) {
        responseText = "Entendi! Você quer calcular o traço de concreto ou materiais para fundação. O que exatamente precisa?";
        suggestions = [
          { label: 'Calcular Traço de Concreto', action: () => onNavigate('calculos', 'concrete-mix'), icon: <Calculator size={16} /> },
          { label: 'Ver Normas sobre Concreto', action: () => onNavigate('biblioteca-normas', 'concreto'), icon: <BookOpen size={16} /> },
          { label: 'Preços de Cimento', action: () => onNavigate('compras', 'cimento'), icon: <ShoppingCart size={16} /> }
        ];
      } else if (lowerText.includes('piso') || lowerText.includes('porcelanato') || lowerText.includes('revestimento')) {
        responseText = "Perfeito, vamos trabalhar com pisos e revestimentos. Posso abrir a calculadora para você ou buscar tendências de interiores.";
        suggestions = [
          { label: 'Calcular Piso/Porcelanato', action: () => onNavigate('calculos', 'floor'), icon: <Calculator size={16} /> },
          { label: 'Ver Studio de Interiores', action: () => onNavigate('studio-interiores'), icon: <Lightbulb size={16} /> }
        ];
      } else if (lowerText.includes('pintura') || lowerText.includes('tinta') || lowerText.includes('parede')) {
        responseText = "Certo, assunto é pintura. Deseja calcular a quantidade de tinta ou adicionar uma despesa com materiais?";
        suggestions = [
          { label: 'Calcular Tinta', action: () => onNavigate('calculos', 'paint'), icon: <Calculator size={16} /> },
          { label: 'Adicionar Despesa', action: () => onNavigate('financeiro'), icon: <ShoppingCart size={16} /> }
        ];
      } else if (lowerText.includes('elétrica') || lowerText.includes('chuveiro') || lowerText.includes('disjuntor') || lowerText.includes('fio')) {
        responseText = "Instalações elétricas exigem atenção às normas (NBR 5410). Aqui estão os atalhos mais rápidos:";
        suggestions = [
          { label: 'Calculadora Elétrica', action: () => onNavigate('calculos', 'electrical'), icon: <Calculator size={16} /> },
          { label: 'Consultar NBR 5410', action: () => onNavigate('biblioteca-normas', 'eletrica'), icon: <BookOpen size={16} /> },
          { label: 'Projeto Luminotécnico', action: () => onNavigate('calculos', 'lighting'), icon: <Lightbulb size={16} /> }
        ];
      } else if (lowerText.includes('orçamento') || lowerText.includes('orçar') || lowerText.includes('proposta')) {
        responseText = "Vamos preparar um orçamento. Nosso sistema inteligente irá sugerir materiais baseados no serviço escolhido.";
        suggestions = [
          { label: 'Criar Novo Orçamento', action: () => onNavigate('novo-orcamento'), icon: <BookOpen size={16} /> }
        ];
      } else if (lowerText.includes('obra') || lowerText.includes('nova obra')) {
        responseText = "Vamos gerenciar suas obras! Você pode criar uma nova ou gerenciar as existentes.";
        suggestions = [
          { label: 'Minhas Obras', action: () => onNavigate('obras'), icon: <BookOpen size={16} /> }
        ];
      } else {
        responseText = "Desculpe, ainda estou aprendendo. Mas aqui estão alguns atalhos que podem ajudar:";
        suggestions = [
          { label: 'Central de Cálculos', action: () => onNavigate('calculos'), icon: <Calculator size={16} /> },
          { label: 'Biblioteca Técnica', action: () => onNavigate('biblioteca-normas'), icon: <BookOpen size={16} /> },
          { label: 'Financeiro', action: () => onNavigate('financeiro'), icon: <ShoppingCart size={16} /> }
        ];
      }

      setMessages(prev => [...prev, { role: 'assistant', text: responseText, suggestions }]);
    }, 600);
  };

  const quickChips = [
    "Calcular concreto",
    "Criar orçamento",
    "Instalar chuveiro",
    "Consultar norma",
    "Calcular piso"
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: 'var(--bg-base)' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: 12, position: 'sticky', top: 0, zIndex: 10, borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'var(--color-primary-alpha)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Sparkles size={22} />
        </div>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.2 }}>Assistente Inteligente</h2>
          <p style={{ fontSize: 13, color: 'var(--color-primary)', fontWeight: 600 }}>Sempre pronto para ajudar</p>
        </div>
      </div>

      {/* Chat Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 20px 100px 20px', display: 'flex', flexDirection: 'column', gap: 16 }} className="hide-scrollbar">
        {messages.map((msg, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ 
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '85%',
              display: 'flex',
              flexDirection: 'column',
              gap: 8
            }}
          >
            <div style={{ 
              padding: '12px 16px', 
              borderRadius: 20, 
              borderBottomRightRadius: msg.role === 'user' ? 4 : 20,
              borderBottomLeftRadius: msg.role === 'assistant' ? 4 : 20,
              backgroundColor: msg.role === 'user' ? 'var(--color-primary)' : 'var(--bg-elevated)',
              color: msg.role === 'user' ? '#FFF' : 'var(--text-main)',
              fontSize: 15,
              lineHeight: 1.5,
              border: msg.role === 'assistant' ? '1px solid var(--border-subtle)' : 'none',
              boxShadow: msg.role === 'user' ? '0 4px 12px rgba(59, 130, 246, 0.3)' : '0 4px 12px rgba(0,0,0,0.05)'
            }}>
              {msg.text}
            </div>

            {/* Render Suggestions if Assistant */}
            {msg.suggestions && msg.suggestions.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
                {msg.suggestions.map((sug, idx) => (
                  <button
                    key={idx}
                    onClick={sug.action}
                    className="card-premium-interactive"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '12px 16px',
                      borderRadius: 16,
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--color-primary-alpha)',
                      color: 'var(--text-main)',
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <div style={{ color: 'var(--color-primary)' }}>{sug.icon}</div>
                    <span style={{ flex: 1 }}>{sug.label}</span>
                    <ArrowRight size={16} color="var(--text-muted)" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="glass-panel" style={{ position: 'fixed', bottom: 70, left: 0, right: 0, padding: '16px 20px', paddingBottom: '16px', borderTop: '1px solid var(--border-subtle)', zIndex: 10 }}>
        
        {/* Quick Chips */}
        {messages.length === 1 && (
          <div style={{ display: 'flex', overflowX: 'auto', gap: 8, paddingBottom: 16, margin: '0 -20px', paddingLeft: 20, paddingRight: 20 }} className="hide-scrollbar">
            {quickChips.map((chip, idx) => (
              <button 
                key={idx}
                onClick={() => handleSend(chip)}
                style={{
                  whiteSpace: 'nowrap',
                  padding: '8px 16px',
                  borderRadius: 20,
                  backgroundColor: 'var(--bg-elevated)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-main)',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {chip}
              </button>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: 12, alignItems: 'center', maxWidth: 800, margin: '0 auto' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', backgroundColor: 'var(--bg-elevated)', borderRadius: 24, padding: '8px 16px', border: '1px solid var(--border-light)' }}>
            <MessageSquare size={20} color="var(--text-muted)" style={{ marginRight: 12 }} />
            <input 
              type="text"
              placeholder="O que você deseja fazer?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(query)}
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-main)', fontSize: 15 }}
            />
          </div>
          <button 
            onClick={() => handleSend(query)}
            disabled={!query.trim()}
            style={{ 
              width: 44, height: 44, borderRadius: 22, 
              backgroundColor: query.trim() ? 'var(--color-primary)' : 'var(--bg-surface)', 
              color: query.trim() ? '#FFF' : 'var(--text-muted)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: 'none', cursor: query.trim() ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s'
            }}
          >
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
