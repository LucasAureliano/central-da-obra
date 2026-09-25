import { useState, useRef, useEffect } from 'react';
import { Sparkles, ArrowRight, MessageSquare, Calculator, BookOpen, ShoppingCart, Lightbulb, Calendar, ClipboardList, Palette, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { takePicture } from '../../utils/nativeCamera';
import { Camera as CameraIcon, X as XIcon } from 'lucide-react';
import { useWorks } from '../../contexts/WorksContext';
import { useAuth } from '../../contexts/AuthContext';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { Crown } from 'lucide-react';
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
  const { setShowUpgradeModal } = useSubscription();
  const currentWork = profile?.role === 'owner' ? primaryWork : activeWork;
  const isPremium = profile?.subscription?.planId === 'pro' || profile?.subscription?.planId === 'business' || profile?.isAdmin;
  
  const [freeCount, setFreeCount] = useState(0);
  const [messages, setMessages] = useState<{role: 'assistant'|'user', text: string, imageUrl?: string, suggestions?: any[]}[]>([]);

  useEffect(() => {
    if (messages.length === 0) {
      const getRoleGreeting = () => {
        if (profile?.role === 'architect' || profile?.role === 'engineer') {
          return currentWork ? `Sua obra principal está em ${currentWork.progress || 0}% de conclusão. Quer registrar o diário técnico de hoje ou analisar uma foto da obra?` : `Atuo como seu mentor de engenharia e projetos. Você possui uma vistoria pendente ou deseja analisar alguma imagem?`;
        }
        if (profile?.role === 'builder') {
          return currentWork ? `A obra "${currentWork.name}" está em andamento. Existem tarefas aguardando atualização. Quer criar um novo orçamento ou calcular materiais desse serviço?` : `Você tem orçamentos aguardando resposta. Quer criar um novo orçamento?`;
        }
        if (profile?.role === 'service') {
          return `Atuo como seu parceiro em serviços. Quer calcular os materiais para o próximo serviço ou gerar um orçamento?`;
        }
        // Owner
        return currentWork ? `Como está o andamento da sua obra "${currentWork.name}"? Ela está em ${currentWork.progress || 0}% de conclusão. Há itens pendentes ou despesas para registrar?` : `Atuo como seu consultor de obras residenciais e finanças. Quer calcular materiais ou iniciar uma nova obra?`;
      };

      setMessages([{
        role: 'assistant',
        text: `Olá! Sou a CentralObra AI 2.0. ${getRoleGreeting()} O que você precisa fazer?`,
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
    
    const currentAttachment = attachment;
    const newMessages = [...messages, { role: 'user' as const, text, imageUrl: currentAttachment || undefined }];
    setMessages(newMessages);
    setQuery('');
    setAttachment(null);
    setIsTyping(true);

    try {
      const apiMessages = newMessages.map(m => {
        let content: any = m.text;
        if (m.imageUrl) {
          content = [
            { type: "text", text: m.text },
            { type: "image_url", image_url: { url: m.imageUrl } }
          ];
        }
        return { role: m.role, content };
      });
      
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
        { text: "Memorial Descritivo Mágico", isPremium: true },
        { text: "Criar Diário de Obra Formal", isPremium: true },
        { text: "Pitch de Vendas para Cliente", isPremium: true },
        { text: "Consultar NBR Básica", isPremium: false }
      ];
    } else if (role === 'builder' || role === 'service') {
      return [
        { text: "Reescrever Orçamento Matador", isPremium: true },
        { text: "Otimizar Cronograma", isPremium: true },
        { text: "Dicas de Desperdício Zero", isPremium: true },
        { text: "Calcular Material Básico", isPremium: false }
      ];
    } else {
      return [
        { text: "Doutor Financeiro (Análise)", isPremium: true },
        { text: "Analisar minha Saúde da Obra", isPremium: true },
        { text: "Ideias para Economizar", isPremium: true },
        { text: "Dúvidas sobre materiais", isPremium: false }
      ];
    }
  };
  const quickChips = getQuickChips();


  

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="screen-content" 
      style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', maxWidth: 900, margin: '0 auto', width: '100%', background: 'transparent', paddingBottom: 20 }}
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
              {msg.imageUrl && (
                <div style={{ marginBottom: 12 }}>
                  <img src={msg.imageUrl} alt="Anexo" style={{ maxWidth: '100%', borderRadius: 12, maxHeight: 200, objectFit: 'cover' }} />
                </div>
              )}
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
                  </motion.button>
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
                whileHover={{ scale: 1.05, borderColor: chip.isPremium ? '#F59E0B' : 'var(--color-primary)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (chip.isPremium && !isPremium) {
                    setShowUpgradeModal(true);
                  } else {
                    handleSend(chip.text);
                  }
                }}
                style={{
                  whiteSpace: 'nowrap',
                  padding: '10px 18px',
                  borderRadius: 20,
                  backgroundColor: chip.isPremium ? 'rgba(245, 158, 11, 0.05)' : 'var(--bg-elevated)',
                  border: chip.isPremium ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid var(--border-subtle)',
                  color: chip.isPremium ? '#F59E0B' : 'var(--text-main)',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  zIndex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                {chip.isPremium && <Crown size={14} />}
                {chip.text}
              </motion.button>
            ))}
          </div>
        )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 800, margin: '0 auto' }}>
          
          {attachment && (
            <div style={{ position: 'relative', width: 80, height: 80, borderRadius: 12, overflow: 'hidden', border: '2px solid var(--color-primary)' }}>
              <img src={attachment} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button 
                onClick={() => setAttachment(null)}
                style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.6)', color: '#FFF', border: 'none', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <XIcon size={14} />
              </button>
            </div>
          )}

          <div style={{ display: 'flex', gap: 12, alignItems: 'center', width: '100%' }}>
            <button 
              onClick={handleCamera}
              style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: 'var(--bg-elevated)', color: 'var(--text-muted)', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <CameraIcon size={20} />
            </button>
            <motion.div 
              animate={{ borderColor: query.trim() ? 'var(--color-primary)' : 'var(--border-light)', boxShadow: query.trim() ? '0 0 12px rgba(16,185,129,0.2)' : 'none' }}
              style={{ flex: 1, display: 'flex', alignItems: 'center', backgroundColor: 'var(--bg-elevated)', borderRadius: 24, padding: '8px 16px', border: '1px solid var(--border-light)', transition: 'border-color 0.2s' }}
            >
              <MessageSquare size={20} color="var(--text-muted)" style={{ marginRight: 12 }} />
              <input 
                type="text"
                placeholder="Ex: Como está o andamento da obra?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend(query)}
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-main)', fontSize: 15 }}
              />
            </motion.div>
            <button 
              onClick={() => handleSend(query)}
              disabled={!query.trim() && !attachment}
              style={{ 
                width: 44, height: 44, borderRadius: 22, 
                backgroundColor: (query.trim() || attachment) ? 'var(--color-primary)' : 'var(--bg-surface)', 
                color: (query.trim() || attachment) ? '#FFF' : 'var(--text-muted)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: 'none', cursor: (query.trim() || attachment) ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s'
              }}
            >
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function SmartAssistant(props: SmartAssistantProps) {
  return <AssistantErrorBoundary><SmartAssistantInner {...props} /></AssistantErrorBoundary>;
}








