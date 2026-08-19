import { useState, useRef, useEffect } from 'react';
import { Sparkles, ArrowRight, MessageSquare, Calculator, BookOpen, ShoppingCart, Lightbulb, Calendar, ClipboardList, Palette, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorks } from '../../contexts/WorksContext';
import { useAuth } from '../../contexts/AuthContext';
import { formatCurrency } from '../../utils/formatters';
import { assistantService } from '../../services/assistant/AssistantService';


export type AssistantMode = 'fast' | 'pro' | 'tutorial';

interface SmartAssistantProps {
  onNavigate: (tab: string, param?: string) => void;
}

export function SmartAssistant({ onNavigate }: SmartAssistantProps) {
  const [query, setQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { primaryWork, activeWork } = useWorks();
  const { profile } = useAuth();
  const currentWork = profile?.role === 'owner' ? primaryWork : activeWork;
  const isPremium = profile?.subscription?.planId === 'pro' || profile?.subscription?.planId === 'business' || profile?.isAdmin;
  
  const [messages, setMessages] = useState<{role: 'assistant'|'user', text: string, suggestions?: any[]}[]>([]);

  useEffect(() => {
    if (messages.length === 0) {
      const getRoleGreeting = () => {
        if (profile?.role === 'architect' || profile?.role === 'engineer') return 'Atuo como seu mentor de engenharia e projetos.';
        if (profile?.role === 'builder') return 'Atuo como seu consultor de gestão de obras e equipes.';
        if (profile?.role === 'service') return 'Atuo como seu parceiro em serviços e orçamentos.';
        return 'Atuo como seu consultor de obras residenciais e finanças.';
      };

      setMessages([{
        role: 'assistant',
        text: `Olá! Sou o Assistente Inteligente da CentralObra. ${getRoleGreeting()}${currentWork ? ` Vejo que você está focado na obra "${currentWork.name}".` : ''} Pode me dizer o que precisa em linguagem natural.`,
      }]);
    }
  }, [currentWork, messages.length, profile]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isTyping) return;
    
    setMessages(prev => [...prev, { role: 'user', text }]);
    setQuery('');
    setIsTyping(true);

    try {
      const response = await assistantService.sendMessage({
        text,
        contextData: {
          currentWorkId: currentWork?.id,
          role: profile?.role as string | undefined
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
        text: 'Desculpe, ocorreu um erro ao conectar com o Copilot. Tente novamente mais tarde.'
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const getQuickChips = () => {
    const role = profile?.role;
    if (role === 'architect' || role === 'engineer') {
      return [
        "Acessar Studio de Interiores",
        "Consultar normas NBR",
        "Agenda de visitas técnicas",
        "Diário de obra"
      ];
    } else if (role === 'builder') {
      return [
        "Relatório diário de obra",
        "Gestão de equipe",
        "Compras pendentes",
        "Como está minha obra?"
      ];
    } else if (role === 'service') {
      return [
        "Criar novo orçamento",
        "Calcular materiais (Tintas/Pisos)",
        "Divulgar meus serviços",
        "Ver minha agenda"
      ];
    } else {
      return [
        "Como está minha obra?",
        "O que falta terminar?",
        "Lista de compras",
        "Quanto já gastei?",
        "Calcular quantidade de material"
      ];
    }
  };
  const quickChips = getQuickChips();


  if (!isPremium) {
    return (
      <div className="screen-content animate-fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, height: '100%' }}>
        <div className="glass-panel" style={{ maxWidth: 400, textAlign: 'center', padding: 40, borderRadius: 24 }}>
          <div style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(139, 92, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <Sparkles size={40} color="#8B5CF6" />
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-main)', marginBottom: 12 }}>CentralObra Copilot</h2>
          <p style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 32 }}>
            Sua Inteligência Artificial especialista em engenharia e gestão de obras. Desbloqueie dicas de materiais, normas, revisão de cronograma e muito mais.
          </p>
          <button className="btn-primary" onClick={() => onNavigate('planos')} style={{ width: '100%', padding: 16, borderRadius: 16, fontWeight: 800, fontSize: 16 }}>
            Fazer Upgrade para o PRO
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="screen-content" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', maxWidth: 800, margin: '0 auto', width: '100%' }}>
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
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 20px 24px 20px', display: 'flex', flexDirection: 'column', gap: 16 }} className="hide-scrollbar">
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
        
        {/* Typing Indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ alignSelf: 'flex-start' }}
            >
              <div style={{
                padding: '14px 18px',
                borderRadius: 20,
                borderBottomLeftRadius: 4,
                backgroundColor: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                gap: 5
              }}>
                {[0, 1, 2].map(i => (
                  <motion.span
                    key={i}
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
                    style={{
                      width: 8, height: 8, borderRadius: 4,
                      backgroundColor: 'var(--text-muted)',
                      display: 'inline-block'
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="glass-panel" style={{ padding: '16px 20px', borderTop: '1px solid var(--border-subtle)', zIndex: 10, borderRadius: '24px 24px 0 0', marginTop: 'auto' }}>
        
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
