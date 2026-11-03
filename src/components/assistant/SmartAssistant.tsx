import { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, ArrowRight, MessageSquare, Calculator, ShoppingCart, 
  Trash2, Copy, Check, FileText, Camera as CameraIcon, X as XIcon, 
  Building2, Store, Plus, CheckCircle2, AlertCircle, ExternalLink, Crown 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { takePicture } from '../../utils/nativeCamera';
import { useWorks } from '../../contexts/WorksContext';
import { useAuth } from '../../contexts/AuthContext';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { assistantService } from '../../services/assistant/AssistantService';
import type { TranscribedDocument } from '../../services/assistant/AssistantService';
import { materialPriceService } from '../../services/materials/MaterialPriceService';
import type { MaterialPrice } from '../../services/materials/MaterialPriceService';
import { db } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import React from 'react';

export type AssistantMode = 'fast' | 'pro' | 'tutorial';

interface SmartAssistantProps {
  onNavigate: (tab: string, param?: string) => void;
}

interface ChatMessage {
  role: 'assistant' | 'user';
  text: string;
  imageUrl?: string;
  suggestions?: any[];
  transcription?: TranscribedDocument;
  priceComparison?: Record<string, MaterialPrice[]>;
}

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
      return (
        <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-main)' }}>
          <h3>Recarregando Assistente Inteligente...</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 8 }}>{this.state.error?.message}</p>
          <button 
            onClick={() => this.setState({ hasError: false, error: null })} 
            className="btn-primary" 
            style={{ marginTop: 16, padding: '8px 20px', borderRadius: 12 }}
          >
            Tentar Novamente
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export function SmartAssistantInner({ onNavigate }: SmartAssistantProps) {
  const [query, setQuery] = useState('');
  const [attachment, setAttachment] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingStatus, setTypingStatus] = useState<string>('Pensando...');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  
  // Work selection modal state
  const [targetTranscription, setTargetTranscription] = useState<TranscribedDocument | null>(null);
  const [isWorkModalOpen, setIsWorkModalOpen] = useState(false);
  const [selectedWorkId, setSelectedWorkId] = useState<string>('');
  const [isSavingToWork, setIsSavingToWork] = useState(false);

  const { works, primaryWork, activeWork } = useWorks();
  const { user, profile } = useAuth();
  const { setShowUpgradeModal } = useSubscription();

  const currentWork = profile?.role === 'owner' ? primaryWork : activeWork;
  const isPremium = profile?.subscription?.planId === 'pro' || profile?.subscription?.planId === 'business' || profile?.isAdmin;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length === 0) {
      const getRoleGreeting = () => {
        if (profile?.role === 'architect' || profile?.role === 'engineer') {
          return currentWork 
            ? `Sua obra "${currentWork.name}" está em ${currentWork.progress || 0}% de conclusão. Quer registrar um diário técnico, consultar normas NBR ou transcrever uma nota fiscal/orçamento?` 
            : `Atuo como seu mentor de engenharia e projetos. Você pode me enviar fotos de notas fiscais, orçamentos ou plantas para transcrever diretamente!`;
        }
        if (profile?.role === 'builder' || profile?.role === 'service') {
          return currentWork 
            ? `A obra "${currentWork.name}" está ativa. Quer criar um novo orçamento, transcrever uma nota de fornecedor ou calcular materiais nas lojas mais próximas?` 
            : `Atuo como seu copiloto de serviços e orçamentos. Envie uma foto de nota fiscal ou cupom para extrair os valores diretamente!`;
        }
        // Owner
        return currentWork 
          ? `Como está a obra "${currentWork.name}"? Ela está em ${currentWork.progress || 0}% de conclusão. Você pode enviar fotos de notas de compras para eu cadastrar automaticamente nas despesas!` 
          : `Sou seu copiloto de obras e economia! Posso transcrever notas fiscais de compras, calcular materiais e encontrar os menores preços nas lojas mais próximas.`;
      };

      setMessages([{
        role: 'assistant',
        text: `Olá! Sou a **CentralObra AI 2.0**. ${getRoleGreeting()}\n\nComo posso ajudar você agora?`,
        suggestions: [
          { label: '📷 Transcrever Nota / Orçamento', action: () => handleCameraUpload('Transcreva esta nota fiscal e extraia os itens com valores para minha obra.'), icon: <FileText size={16} /> },
          { label: '📐 Calculadoras de Materiais', action: () => onNavigate('calculos'), icon: <Calculator size={16} /> },
          { label: '💰 Comparar Preços nas Lojas', action: () => handleSend('Quais são os preços de cimento, areia e brita nas lojas mais próximas?'), icon: <Store size={16} /> }
        ]
      }]);
    }
  }, [currentWork, messages.length, profile]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const resizeImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const max_size = 900;
          if (width > height && width > max_size) {
            height *= max_size / width;
            width = max_size;
          } else if (height > max_size) {
            width *= max_size / height;
            width = max_size;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.82));
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleCameraUpload = async (presetPrompt?: string) => {
    try {
      const base64 = await takePicture();
      if (base64) {
        setAttachment(base64);
        if (presetPrompt) setQuery(presetPrompt);
      } else {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = async (e) => {
          const file = (e.target as any).files[0];
          if (file) {
            const resizedBase64 = await resizeImage(file);
            setAttachment(resizedBase64);
            if (presetPrompt) setQuery(presetPrompt);
          }
        };
        input.click();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend ?? query).trim();
    if ((!text && !attachment) || isTyping) return;

    const currentAttachment = attachment;
    const userMessage: ChatMessage = {
      role: 'user',
      text: text || 'Por favor, analise a imagem e transcreva os itens.',
      imageUrl: currentAttachment || undefined
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setQuery('');
    setAttachment(null);
    setIsTyping(true);

    if (currentAttachment) {
      setTypingStatus('Transcrevendo documento e analisando itens...');
    } else if (text.toLowerCase().includes('preco') || text.toLowerCase().includes('preço')) {
      setTypingStatus('Consultando preços nas lojas de materiais mais próximas...');
    } else {
      setTypingStatus('Pensando na melhor solução técnica...');
    }

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

      const assistantMsg: ChatMessage = {
        role: 'assistant',
        text: response.answer,
        transcription: response.transcription,
        suggestions: (response.suggestions || []).map((s: any) => ({
          label: s.label,
          action: () => handleActionClick(s.actionKey, s.actionParam, response.transcription),
          icon: getActionIcon(s.actionKey)
        }))
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: 'Desculpe, ocorreu uma instabilidade momentânea. Por favor, tente novamente.',
        suggestions: [
          { label: 'Tentar Novamente', action: () => handleSend(text), icon: <Sparkles size={16} /> }
        ]
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const getActionIcon = (actionKey: string) => {
    switch (actionKey) {
      case 'adicionar_obra': return <Plus size={16} />;
      case 'criar_obra': return <Building2 size={16} />;
      case 'comparar_precos': return <Store size={16} />;
      case 'calculos': return <Calculator size={16} />;
      case 'compras': return <ShoppingCart size={16} />;
      default: return <Sparkles size={16} />;
    }
  };

  const handleActionClick = (actionKey: string, actionParam?: string, transcription?: TranscribedDocument) => {
    if (actionKey === 'adicionar_obra') {
      if (transcription) {
        setTargetTranscription(transcription);
        if (works.length > 0) {
          setSelectedWorkId(currentWork?.id || works[0].id);
          setIsWorkModalOpen(true);
        } else {
          toast.error('Nenhuma obra cadastrada. Crie uma obra primeiro!');
          onNavigate('obras', 'nova');
        }
      }
      return;
    }

    if (actionKey === 'criar_obra') {
      onNavigate('obras', 'nova');
      return;
    }

    if (actionKey === 'comparar_precos') {
      if (transcription?.items && transcription.items.length > 0) {
        handleCompareTranscriptionPrices(transcription);
      } else {
        onNavigate('calculos');
      }
      return;
    }

    if (actionKey === 'transcrever') {
      handleCameraUpload('Transcreva esta nota fiscal/orçamento e extraia os itens com valores.');
      return;
    }

    onNavigate(actionKey, actionParam);
  };

  // Comparação de preços em lojas próximas para os itens transcritos
  const handleCompareTranscriptionPrices = async (transcription: TranscribedDocument) => {
    toast.loading('Consultando preços nas lojas mais próximas...', { id: 'price-comp' });
    try {
      const names = transcription.items.map(it => it.name);
      const results = await materialPriceService.searchMultiple(names);

      toast.success('Preços comparados com sucesso!', { id: 'price-comp' });

      // Atualiza a última mensagem com o resultado da comparação
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last && last.role === 'assistant') {
          return [
            ...prev.slice(0, -1),
            { ...last, priceComparison: results }
          ];
        }
        return prev;
      });
    } catch (e) {
      toast.error('Não foi possível consultar os preços no momento.', { id: 'price-comp' });
    }
  };

  // Salvar itens da transcrição diretamente no Firestore como Despesas e Lista de Compras
  const handleSaveTranscriptionToWork = async () => {
    if (!targetTranscription || !selectedWorkId || !user) return;

    setIsSavingToWork(true);
    try {
      const targetWork = works.find(w => w.id === selectedWorkId) || currentWork;
      const supplier = targetTranscription.supplier || 'Loja de Materiais';

      // 1. Injeta cada item como uma despesa individual na obra
      const expensePromises = targetTranscription.items.map(item => {
        return addDoc(collection(db, 'works', selectedWorkId, 'expenses'), {
          title: item.name,
          amount: item.total,
          category: 'Materiais',
          quantity: item.quantity,
          unit: item.unit,
          unitPrice: item.unitPrice,
          supplier: supplier,
          date: Timestamp.now(),
          createdAt: serverTimestamp(),
          status: 'Pago',
          workId: selectedWorkId,
          source: 'transcricao_ia'
        });
      });

      // 2. Injeta também na lista de compras como itens concluídos
      const shoppingPromises = targetTranscription.items.map(item => {
        return addDoc(collection(db, 'works', selectedWorkId, 'shopping'), {
          name: item.name,
          quantity: item.quantity,
          unit: item.unit,
          unitPrice: item.unitPrice,
          supplier: supplier,
          isPurchased: true,
          addedAt: serverTimestamp()
        });
      });

      await Promise.all([...expensePromises, ...shoppingPromises]);

      toast.success(`🎉 ${targetTranscription.items.length} itens adicionados à obra "${targetWork?.name || ''}"!`);
      setIsWorkModalOpen(false);
      setTargetTranscription(null);

      // Feedback no chat
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: `✅ **Lançamento Concluído com Sucesso!**\n\nTodos os **${targetTranscription.items.length} itens** da nota no valor total de **R$ ${targetTranscription.totalAmount?.toFixed(2)}** foram registrados na obra **"${targetWork?.name}"** nas seções de **Financeiro** e **Compras**.`,
        suggestions: [
          { label: 'Ver Despesas da Obra', action: () => onNavigate('financeiro'), icon: <CheckCircle2 size={16} /> },
          { label: 'Ver Lista de Compras', action: () => onNavigate('compras'), icon: <ShoppingCart size={16} /> }
        ]
      }]);
    } catch (error) {
      console.error('Erro ao salvar transcrição:', error);
      toast.error('Erro ao salvar os itens na obra.');
    } finally {
      setIsSavingToWork(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast.success('Copiado para a área de transferência!');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const clearChat = () => {
    setMessages([]);
    toast.success('Conversa reiniciada.');
  };

  const quickChips = [
    { text: "📷 Transcrever Nota / Orçamento", isSpecial: true },
    { text: "Traço de concreto para laje", isPremium: false },
    { text: "Quantos tijolos por m²?", isPremium: false },
    { text: "Rendimento de tinta por lata", isPremium: false },
    { text: "Ideias para economizar na obra", isPremium: true }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="screen-content" 
      style={{ position: 'relative', display: 'flex', flexDirection: 'column', maxWidth: 920, margin: '0 auto', width: '100%', minHeight: '100%', background: 'transparent' }}
    >
      {/* Background radial glows */}
      <div style={{ position: 'absolute', top: -80, right: -80, width: 320, height: 320, background: 'radial-gradient(circle, var(--color-primary-alpha) 0%, transparent 70%)', filter: 'blur(45px)', zIndex: 0, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: 120, left: -80, width: 280, height: 280, background: 'radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, transparent 70%)', filter: 'blur(45px)', zIndex: 0, pointerEvents: 'none' }} />

      {/* Header Estilo ChatGPT / Gemini */}
      <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 20, borderBottom: '1px solid var(--border-subtle)', backdropFilter: 'blur(16px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <motion.div 
            whileHover={{ scale: 1.08, rotate: 10 }}
            style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: 'var(--color-primary-alpha)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px var(--color-primary-glow)' }}
          >
            <Sparkles size={22} />
          </motion.div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h2 style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>CentralObra AI 2.0</h2>
              <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 12, backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10B981', fontWeight: 800, letterSpacing: 0.5 }}>
                ONLINE
              </span>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0, marginTop: 2 }}>
              {currentWork ? `Obra ativa: ${currentWork.name}` : 'Copiloto de Engenharia e Finanças'}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button 
            onClick={clearChat}
            title="Limpar conversa"
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', borderRadius: 10, background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
          >
            <Trash2 size={14} />
            <span className="desktop-only">Nova Conversa</span>
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 20px 24px 20px', display: 'flex', flexDirection: 'column', gap: 20 }} className="hide-scrollbar">
        {messages.map((msg, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            style={{ 
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: msg.role === 'user' ? '85%' : '100%',
              width: msg.role === 'assistant' ? '100%' : 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 10
            }}
          >
            <div style={{ 
              padding: msg.role === 'user' ? '12px 18px' : '20px', 
              borderRadius: 22, 
              borderBottomRightRadius: msg.role === 'user' ? 4 : 22,
              borderBottomLeftRadius: msg.role === 'assistant' ? 4 : 22,
              backgroundColor: msg.role === 'user' ? 'var(--color-primary)' : 'var(--bg-elevated)',
              color: msg.role === 'user' ? '#FFF' : 'var(--text-main)',
              fontSize: 15,
              lineHeight: 1.6,
              border: msg.role === 'assistant' ? '1px solid var(--border-subtle)' : 'none',
              boxShadow: msg.role === 'user' ? '0 6px 18px var(--color-primary-glow)' : '0 4px 16px rgba(0,0,0,0.06)',
              position: 'relative'
            }}>
              {msg.imageUrl && (
                <div style={{ marginBottom: 14 }}>
                  <img 
                    src={msg.imageUrl} 
                    alt="Documento Anexado" 
                    style={{ maxWidth: '100%', maxHeight: 280, borderRadius: 14, objectFit: 'contain', border: '1px solid rgba(255,255,255,0.15)', display: 'block' }} 
                  />
                </div>
              )}

              {/* Render formatado com Markdown básico */}
              <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {msg.text}
              </div>

              {/* Botão de copiar para mensagens da IA */}
              {msg.role === 'assistant' && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--border-subtle)' }}>
                  <button
                    onClick={() => copyToClipboard(msg.text, i)}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: 12, cursor: 'pointer', padding: '4px 8px', borderRadius: 6 }}
                  >
                    {copiedIndex === i ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
                    {copiedIndex === i ? 'Copiado!' : 'Copiar'}
                  </button>
                </div>
              )}
            </div>

            {/* CARTÃO ESTRUTURADO DE TRANSCRIÇÃO (Se houver documento extraído) */}
            {msg.transcription && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel"
                style={{ 
                  padding: 20, 
                  borderRadius: 20, 
                  border: '1px solid rgba(16, 185, 129, 0.35)', 
                  backgroundColor: 'rgba(16, 185, 129, 0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(16, 185, 129, 0.2)', paddingBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FileText size={20} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                        {msg.transcription.type === 'orcamento' ? 'Orçamento Identificado' : 'Nota Fiscal / Cupom Fiscal'}
                      </h4>
                      <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>
                        {msg.transcription.supplier || 'Fornecedor de Materiais'}
                      </p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block' }}>Valor Total</span>
                    <span style={{ fontSize: 18, fontWeight: 900, color: '#10B981' }}>
                      R$ {msg.transcription.totalAmount?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {/* Tabela de itens transcritos */}
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', textAlign: 'left' }}>
                        <th style={{ padding: '8px 6px' }}>Item</th>
                        <th style={{ padding: '8px 6px', textAlign: 'center' }}>Qtd</th>
                        <th style={{ padding: '8px 6px', textAlign: 'right' }}>Unit. (R$)</th>
                        <th style={{ padding: '8px 6px', textAlign: 'right' }}>Total (R$)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {msg.transcription.items.map((it, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                          <td style={{ padding: '8px 6px', fontWeight: 600, color: 'var(--text-main)' }}>{it.name}</td>
                          <td style={{ padding: '8px 6px', textAlign: 'center', color: 'var(--text-muted)' }}>{it.quantity} {it.unit}</td>
                          <td style={{ padding: '8px 6px', textAlign: 'right', color: 'var(--text-muted)' }}>{it.unitPrice.toFixed(2)}</td>
                          <td style={{ padding: '8px 6px', textAlign: 'right', fontWeight: 700, color: 'var(--color-primary)' }}>{it.total.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* BOTÕES DE AÇÃO DIRETA */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10, marginTop: 4 }}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleActionClick('adicionar_obra', undefined, msg.transcription)}
                    className="btn-primary"
                    style={{ padding: '12px 16px', borderRadius: 12, fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer' }}
                  >
                    <Plus size={16} />
                    Adicionar à Obra
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleCompareTranscriptionPrices(msg.transcription!)}
                    style={{ padding: '12px 16px', borderRadius: 12, fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)', cursor: 'pointer' }}
                  >
                    <Store size={16} color="#3B82F6" />
                    Comparar Preços nas Lojas
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onNavigate('obras', 'nova')}
                    style={{ padding: '12px 16px', borderRadius: 12, fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)', cursor: 'pointer' }}
                  >
                    <Building2 size={16} color="#8B5CF6" />
                    Criar Nova Obra
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* TABELA DE COMPARAÇÃO DE PREÇOS NAS LOJAS PRÓXIMAS */}
            {msg.priceComparison && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel"
                style={{ padding: 18, borderRadius: 20, border: '1px solid rgba(59, 130, 246, 0.3)', backgroundColor: 'rgba(59, 130, 246, 0.04)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <Store size={18} color="#3B82F6" />
                  <h4 style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                    Menores Preços Encontrados em Lojas Próximas:
                  </h4>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {Object.entries(msg.priceComparison).map(([matName, storeList], idx) => {
                    const best = storeList[0];
                    if (!best) return null;
                    return (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 12, backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
                        <div>
                          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-main)', display: 'block' }}>{matName}</span>
                          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>em {best.supplier} {best.distance ? `(${best.distance})` : ''}</span>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--color-primary)' }}>
                            R$ {best.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                          {best.tag && (
                            <span style={{ fontSize: 10, display: 'block', color: '#10B981', fontWeight: 700 }}>
                              {best.tag}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Render Suggestions */}
            {msg.suggestions && msg.suggestions.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
                {msg.suggestions.map((sug, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={sug.action}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '10px 16px',
                      borderRadius: 14,
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-main)',
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                    }}
                  >
                    <div style={{ color: 'var(--color-primary)' }}>{sug.icon}</div>
                    <span>{sug.label}</span>
                    <ArrowRight size={14} color="var(--text-muted)" />
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
        ))}

        {/* Typing Indicator com status visual */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 10 }}
            >
              <div style={{
                padding: '12px 18px',
                borderRadius: 20,
                borderBottomLeftRadius: 4,
                backgroundColor: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  {[0, 1, 2].map(i => (
                    <motion.span
                      key={i}
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
                      style={{
                        width: 7, height: 7, borderRadius: 4,
                        backgroundColor: 'var(--color-primary)',
                        display: 'inline-block'
                      }}
                    />
                  ))}
                </div>
                <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>
                  {typingStatus}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area Estilo ChatGPT / Gemini */}
      <div className="glass-panel" style={{ padding: '16px 20px', borderTop: '1px solid var(--border-subtle)', zIndex: 10, borderRadius: '24px 24px 0 0', marginTop: 'auto', backdropFilter: 'blur(20px)' }}>
        
        {/* Quick Chips no topo do input */}
        <div style={{ display: 'flex', overflowX: 'auto', gap: 8, paddingBottom: 12 }} className="hide-scrollbar">
          {quickChips.map((chip, idx) => (
            <motion.button 
              key={idx}
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                if (chip.isSpecial) {
                  handleCameraUpload('Transcreva esta nota fiscal/orçamento e extraia os itens com valores para minha obra.');
                } else if (chip.isPremium && !isPremium) {
                  setShowUpgradeModal(true);
                } else {
                  handleSend(chip.text);
                }
              }}
              style={{
                whiteSpace: 'nowrap',
                padding: '8px 14px',
                borderRadius: 16,
                backgroundColor: chip.isSpecial ? 'rgba(16, 185, 129, 0.12)' : chip.isPremium ? 'rgba(245, 158, 11, 0.08)' : 'var(--bg-elevated)',
                border: chip.isSpecial ? '1px solid rgba(16, 185, 129, 0.3)' : chip.isPremium ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid var(--border-subtle)',
                color: chip.isSpecial ? '#10B981' : chip.isPremium ? '#F59E0B' : 'var(--text-main)',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              {chip.isPremium && <Crown size={12} />}
              {chip.text}
            </motion.button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 880, margin: '0 auto' }}>
          
          {/* Anexo Preview */}
          {attachment && (
            <div style={{ position: 'relative', width: 88, height: 88, borderRadius: 14, overflow: 'hidden', border: '2px solid var(--color-primary)', boxShadow: '0 4px 12px var(--color-primary-glow)' }}>
              <img src={attachment} alt="Preview Anexo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button 
                onClick={() => setAttachment(null)}
                style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.65)', color: '#FFF', border: 'none', borderRadius: '50%', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <XIcon size={12} />
              </button>
            </div>
          )}

          <div style={{ display: 'flex', gap: 10, alignItems: 'center', width: '100%' }}>
            {/* Botão de Câmera / Upload */}
            <motion.button 
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => handleCameraUpload()}
              title="Tirar foto ou enviar documento"
              style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: 'var(--bg-elevated)', color: 'var(--text-muted)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <CameraIcon size={20} />
            </motion.button>

            {/* Input Bar */}
            <motion.div 
              animate={{ borderColor: query.trim() ? 'var(--color-primary)' : 'var(--border-subtle)' }}
              style={{ flex: 1, display: 'flex', alignItems: 'center', backgroundColor: 'var(--bg-elevated)', borderRadius: 24, padding: '8px 16px', border: '1px solid var(--border-subtle)' }}
            >
              <MessageSquare size={18} color="var(--text-muted)" style={{ marginRight: 10, flexShrink: 0 }} />
              <input 
                type="text"
                placeholder="Pergunte sobre cálculos, envie uma nota ou tire dúvidas de obra..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-main)', fontSize: 14 }}
              />
            </motion.div>

            {/* Botão Enviar */}
            <motion.button 
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => handleSend()}
              disabled={!query.trim() && !attachment}
              style={{ 
                width: 44, height: 44, borderRadius: 22, 
                backgroundColor: (query.trim() || attachment) ? 'var(--color-primary)' : 'var(--bg-surface)', 
                color: (query.trim() || attachment) ? '#FFF' : 'var(--text-muted)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: 'none', cursor: (query.trim() || attachment) ? 'pointer' : 'not-allowed',
                boxShadow: (query.trim() || attachment) ? '0 4px 14px var(--color-primary-glow)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              <ArrowRight size={20} />
            </motion.button>
          </div>
        </div>
      </div>

      {/* MODAL DE SELEÇÃO DE OBRA PARA SALVAR A NOTA */}
      <AnimatePresence>
        {isWorkModalOpen && targetTranscription && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass-panel"
              style={{ maxWidth: 480, width: '100%', padding: 24, borderRadius: 24, border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-elevated)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Building2 size={22} color="var(--color-primary)" />
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Adicionar à Obra</h3>
                </div>
                <button 
                  onClick={() => setIsWorkModalOpen(false)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  <XIcon size={20} />
                </button>
              </div>

              <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 16 }}>
                Selecione em qual obra deseja lançar os **{targetTranscription.items.length} itens** da nota no valor de **R$ {targetTranscription.totalAmount?.toFixed(2)}**:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24, maxHeight: 240, overflowY: 'auto' }}>
                {works.map(w => (
                  <div 
                    key={w.id}
                    onClick={() => setSelectedWorkId(w.id)}
                    style={{
                      padding: 14,
                      borderRadius: 14,
                      border: selectedWorkId === w.id ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                      backgroundColor: selectedWorkId === w.id ? 'var(--color-primary-alpha)' : 'var(--bg-surface)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-main)', display: 'block' }}>{w.name}</span>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Progresso: {w.progress || 0}% • Orçamento: R$ {w.budget || 0}</span>
                    </div>
                    {selectedWorkId === w.id && <CheckCircle2 size={18} color="var(--color-primary)" />}
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button 
                  onClick={() => setIsWorkModalOpen(false)}
                  style={{ flex: 1, padding: 14, borderRadius: 12, background: 'transparent', border: '1px solid var(--border-subtle)', color: 'var(--text-main)', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleSaveTranscriptionToWork}
                  disabled={isSavingToWork || !selectedWorkId}
                  className="btn-primary"
                  style={{ flex: 1, padding: 14, borderRadius: 12, fontWeight: 700, cursor: 'pointer' }}
                >
                  {isSavingToWork ? 'Salvando...' : 'Confirmar Lançamento'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function SmartAssistant(props: SmartAssistantProps) {
  return <AssistantErrorBoundary><SmartAssistantInner {...props} /></AssistantErrorBoundary>;
}
