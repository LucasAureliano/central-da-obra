import { useState, useRef, useEffect } from 'react';
import { Sparkles, ArrowRight, MessageSquare, Calculator, BookOpen, ShoppingCart, Lightbulb, Calendar, ClipboardList, Palette, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { takePicture } from '../../utils/nativeCamera';
import { Camera as CameraIcon, X as XIcon } from 'lucide-react';
import { useWorks } from '../../contexts/WorksContext';
import { useAuth } from '../../contexts/AuthContext';
import { formatCurrency } from '../../utils/formatters';
import { assistantService } from '../../services/assistant/AssistantService';


export type AssistantMode = 'fast' | 'pro' | 'tutorial';

interface SmartAssistantProps {
  onNavigate: (tab: string, param?: string) => void;
}


import React from 'react';
class AssistantErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: any}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return <div style={{padding: 20, color: 'red'}}>Erro no Assistente: {this.state.error?.message}</div>;
    }
    return this.props.children;
  }
}
export function SmartAssistantInner({ onNavigate }: SmartAssistantProps) {
  const [query, setQuery] = useState('');
  const [attachment, setAttachment] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const { primaryWork, activeWork } = useWorks();
  const { profile } = useAuth();
  const currentWork = profile?.role === 'owner' ? primaryWork : activeWork;
  const isPremium = profile?.subscription?.planId === 'pro' || profile?.subscription?.planId === 'business' || profile?.isAdmin;
  
  const [freeCount, setFreeCount] = useState(0);
  const [messages, setMessages] = useState<{role: 'assistant'|'user', text: string, imageUrl?: string, suggestions?: any[]}[]>([]);

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

  
  const handleCamera = async (e: any) => {
    e.preventDefault();
    try {
      const base64 = await takePicture();
      if (base64) {
        setAttachment(base64);
      } else {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
          const file = (e.target as any).files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = () => setAttachment(reader.result as string);
            reader.readAsDataURL(file);
          }
        };
        input.click();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSend = async (text: string) => {
    if (!text.trim() || isTyping) return;
    
    const newMessages = [...messages, { role: 'user' as const, text }];
    setMessages(newMessages);
    setQuery('');
    const currentAttachment = attachment;
    setAttachment(null);
    setIsTyping(true);

    // free limit removed

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
          role: profile?.role,
            isPremium: isPremium
        }
      });
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: response.answer,
        suggestions: (response.suggestions || []).map((s: any) => ({
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


  

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="screen-content" 
      style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', maxWidth: 800, margin: '0 auto', width: '100%', overflow: 'hidden' }}
    >
      <div style={{ position: 'absolute', top: -100, right: -100, width: 300, height: 300, background: 'radial-gradient(circle, var(--color-primary-alpha) 0%, transparent 70%)', filter: 'blur(40px)', zIndex: 0, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: 100, left: -100, width: 250, height: 250, background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)', filter: 'blur(40px)', zIndex: 0, pointerEvents: 'none' }} />
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
      <div style={{ position: 'absolute', top: '20%', right: -50, width: 200, height: 200, background: 'var(--color-primary-alpha)', filter: 'blur(80px)', zIndex: 0, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '30%', left: -50, width: 200, height: 200, background: 'rgba(59, 130, 246, 0.1)', filter: 'blur(80px)', zIndex: 0, pointerEvents: 'none' }} />
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
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.02, x: 5, boxShadow: '0 8px 24px rgba(59, 130, 246, 0.15)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={sug.action}
                    className="card-premium-interactive glow-effect"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '14px 18px',
                      borderRadius: 16,
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--color-primary-alpha)',
                      color: 'var(--text-main)',
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: 'pointer',
                      textAlign: 'left',
                      position: 'relative',
                      overflow: 'hidden'
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
                      backgroundColor: 'var(--color-primary)',
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
              <motion.button 
                key={idx}
                whileHover={{ scale: 1.05, borderColor: 'var(--color-primary)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSend(chip)}
                style={{
                  whiteSpace: 'nowrap',
                  padding: '10px 18px',
                  borderRadius: 20,
                  backgroundColor: 'var(--bg-elevated)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-main)',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  zIndex: 1
                }}
              >
                {chip}
              </motion.button>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: 12, alignItems: 'center', maxWidth: 800, margin: '0 auto' }}>
          <motion.div 
            animate={{ borderColor: query.trim() ? 'var(--color-primary)' : 'var(--border-light)', boxShadow: query.trim() ? '0 0 12px rgba(16,185,129,0.2)' : 'none' }}
            style={{ flex: 1, display: 'flex', alignItems: 'center', backgroundColor: 'var(--bg-elevated)', borderRadius: 24, padding: '8px 16px', border: '1px solid var(--border-light)', transition: 'border-color 0.2s' }}
          >
            <MessageSquare size={20} color="var(--text-muted)" style={{ marginRight: 12 }} />
            <input 
              type="text"
              placeholder="O que você deseja fazer?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(query)}
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-main)', fontSize: 15 }}
            />
          </motion.div>
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
    </motion.div>
  );
}

export function SmartAssistant(props: SmartAssistantProps) {
  return <AssistantErrorBoundary><SmartAssistantInner {...props} /></AssistantErrorBoundary>;
}
