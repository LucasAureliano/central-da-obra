import { useState, useRef, useEffect } from 'react';
import { Sparkles, ArrowRight, MessageSquare, Calculator, BookOpen, ShoppingCart, Lightbulb, Calendar, ClipboardList, Palette, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorks } from '../../contexts/WorksContext';
import { useAuth } from '../../contexts/AuthContext';
import { formatCurrency } from '../../utils/formatters';


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

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, { role: 'user', text }]);
    setQuery('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const lowerText = text.toLowerCase();
      let responseText = "Não entendi muito bem. Pode reformular? Tente usar palavras como 'calcular', 'orçamento', 'compras', 'norma' ou 'obra'.";
      let suggestions: any[] = [];
      const role = profile?.role;

      // Role-specific intent overrides
      if (role === 'architect' || role === 'engineer') {
        if (lowerText.includes('interior') || lowerText.includes('studio') || lowerText.includes('decor')) {
          responseText = "Vou abrir o Studio de Interiores. Lá você encontra as marcas integradas (Portobello, Deca, Suvinil) e orçamentos em tempo real.";
          suggestions = [{ label: 'Abrir Studio de Interiores', action: () => onNavigate('studio-interiores'), icon: <Palette size={16} /> }];
        } else if (lowerText.includes('projeto') || lowerText.includes('desenho')) {
          responseText = "Para projetos, você pode consultar a Central Técnica ou gerenciar o andamento nas Obras.";
          suggestions = [
            { label: 'Central Técnica (NBR)', action: () => onNavigate('central-tecnica'), icon: <BookOpen size={16} /> },
            { label: 'Minhas Obras', action: () => onNavigate('obras'), icon: <BookOpen size={16} /> }
          ];
        }
      } else if (role === 'builder') {
        if (lowerText.includes('equipe') || lowerText.includes('profissional') || lowerText.includes('pedreiro')) {
          responseText = "Vou abrir a gestão da equipe. Você pode alocar profissionais nas obras.";
          suggestions = [{ label: 'Gerenciar Equipe', action: () => onNavigate('equipe'), icon: <User size={16} /> }];
        } else if (lowerText.includes('relatório') || lowerText.includes('diário')) {
          responseText = "O Diário de Obra é essencial para prestação de contas. Deseja registrar agora?";
          suggestions = [{ label: 'Diário de Obra', action: () => onNavigate('diario-tecnico'), icon: <ClipboardList size={16} /> }];
        }
      } else if (role === 'service') {
        if (lowerText.includes('proposta') || lowerText.includes('orçamento')) {
          responseText = "Aumente suas conversões criando uma proposta profissional agora.";
          suggestions = [{ label: 'Novo Orçamento', action: () => onNavigate('novo-orcamento'), icon: <Calculator size={16} /> }];
        } else if (lowerText.includes('marketing') || lowerText.includes('divulgar')) {
          responseText = "Use a aba Marketing para conseguir avaliações e divulgar seus serviços na sua região.";
          suggestions = [{ label: 'Acessar Marketing', action: () => onNavigate('marketing'), icon: <Sparkles size={16} /> }];
        }
      }

      // General intents if no override matched
      if (suggestions.length === 0) {
        if (lowerText.includes('concreto') || lowerText.includes('cimento') || lowerText.includes('traço') || lowerText.includes('laje')) {
          responseText = "Entendi! Vamos trabalhar com concreto. O que exatamente precisa?";
          suggestions = [
            { label: 'Calcular Traço de Concreto', action: () => onNavigate('calculos', 'concrete-mix'), icon: <Calculator size={16} /> },
            { label: 'Ver Normas sobre Concreto', action: () => onNavigate('central-tecnica'), icon: <BookOpen size={16} /> },
            { label: 'Preços de Cimento', action: () => onNavigate('compras'), icon: <ShoppingCart size={16} /> }
          ];
        } else if (lowerText.includes('piso') || lowerText.includes('porcelanato') || lowerText.includes('revestimento') || lowerText.includes('cerâmica')) {
          responseText = "Vamos trabalhar com pisos e revestimentos. Posso abrir a calculadora ou as Tendências.";
          suggestions = [
            { label: 'Calcular Piso/Porcelanato', action: () => onNavigate('calculos', 'floor'), icon: <Calculator size={16} /> },
            { label: 'Ver Tendências', action: () => onNavigate('tendencias'), icon: <Palette size={16} /> }
          ];
        } else if (lowerText.includes('pintura') || lowerText.includes('tinta') || lowerText.includes('parede')) {
          responseText = "Certo, assunto é pintura. Calcular a quantidade de tinta ou registrar a despesa?";
          suggestions = [
            { label: 'Calcular Tinta', action: () => onNavigate('calculos', 'paint'), icon: <Calculator size={16} /> },
            { label: 'Adicionar Despesa', action: () => onNavigate('financeiro'), icon: <ShoppingCart size={16} /> }
          ];
        } else if (lowerText.includes('elétrica') || lowerText.includes('chuveiro') || lowerText.includes('disjuntor') || lowerText.includes('fio') || lowerText.includes('iluminação') || lowerText.includes('dimensionar') || lowerText.includes('spot') || lowerText.includes('luminot')) {
          responseText = "Entendido. Para iluminação e elétrica, vou abrir as ferramentas certas.";
          suggestions = [
            { label: 'Projeto Luminotécnico', action: () => onNavigate('calculos', 'lighting'), icon: <Lightbulb size={16} /> },
            { label: 'Calculadora Elétrica', action: () => onNavigate('calculos', 'electrical'), icon: <Calculator size={16} /> },
            { label: 'Consultar NBR 5410', action: () => onNavigate('central-tecnica'), icon: <BookOpen size={16} /> }
          ];
        } else if (lowerText.includes('orçamento') || lowerText.includes('orçar') || lowerText.includes('proposta') || lowerText.includes('gastar')) {
          responseText = "Vamos cuidar dos orçamentos. Criar uma proposta ou registrar uma despesa?";
          suggestions = [
            { label: 'Criar Novo Orçamento', action: () => onNavigate('novo-orcamento'), icon: <BookOpen size={16} /> },
            { label: 'Adicionar Despesa', action: () => onNavigate('financeiro'), icon: <ShoppingCart size={16} /> }
          ];
        } else if (lowerText.includes('norma') || lowerText.includes('biblioteca') || lowerText.includes('artigo') || lowerText.includes('nbr') || lowerText.includes('consultar')) {
          responseText = "Abrindo a Biblioteca Técnica Inteligente. O que quer pesquisar?";
          suggestions = [
            { label: 'Acessar Central Técnica', action: () => onNavigate('central-tecnica'), icon: <BookOpen size={16} /> }
          ];
        } else if (lowerText.includes('compra') || lowerText.includes('material') || lowerText.includes('lista')) {
          responseText = "Vou abrir a Lista de Compras para gerenciar os materiais da obra.";
          suggestions = [
            { label: 'Lista de Compras', action: () => onNavigate('compras'), icon: <ShoppingCart size={16} /> }
          ];
        } else if (lowerText.includes('agenda') || lowerText.includes('compromisso') || lowerText.includes('visita') || lowerText.includes('agendar')) {
          responseText = "Abrindo sua Agenda Inteligente. Ela já lembra automaticamente de vistorias e vencimentos.";
          suggestions = [
            { label: 'Abrir Agenda', action: () => onNavigate('agenda-completa'), icon: <Calendar size={16} /> }
          ];
        } else if (lowerText.includes('diário') || lowerText.includes('registro') || lowerText.includes('foto') || lowerText.includes('log')) {
          responseText = "O Diário Técnico é onde você registra fotos, observações e gera PDF profissional.";
          suggestions = [
            { label: 'Abrir Diário de Obra', action: () => onNavigate('diario-tecnico'), icon: <ClipboardList size={16} /> }
          ];
        } else if (lowerText.includes('marketing') || lowerText.includes('divulgar') || lowerText.includes('cliente') || lowerText.includes('vender') || lowerText.includes('portfolio') || lowerText.includes('avalia')) {
          if (profile?.role === 'service' || profile?.role === 'architect') {
            responseText = "Excelente! Para divulgar seus serviços, use a aba de Marketing para gerar links de avaliação ou posts para redes sociais.";
            suggestions = [
              { label: 'Acessar Marketing', action: () => onNavigate('marketing'), icon: <Sparkles size={16} /> },
              { label: 'Novo Orçamento', action: () => onNavigate('novo-orcamento'), icon: <Calculator size={16} /> }
            ];
          } else {
            responseText = "Você pode compartilhar as obras com seus profissionais, abrindo o painel de obra.";
            suggestions = [
              { label: 'Minhas Obras', action: () => onNavigate('obras'), icon: <BookOpen size={16} /> }
            ];
          }
        } else if (lowerText.includes('interior') || lowerText.includes('decora') || lowerText.includes('moodboard') || lowerText.includes('paleta') || lowerText.includes('tendência')) {
          responseText = "O Tendências é sua ferramenta de design com inspirações, paletas e moodboards.";
          suggestions = [
            { label: 'Abrir Tendências', action: () => onNavigate('tendencias'), icon: <Palette size={16} /> }
          ];
        } else if (lowerText.includes('obra') || lowerText.includes('nova obra') || lowerText.includes('projeto')) {
          responseText = "Vamos gerenciar suas obras! Você pode criar uma nova ou ver as existentes.";
          suggestions = [
            { label: 'Minhas Obras', action: () => onNavigate('obras'), icon: <BookOpen size={16} /> }
          ];
        } else if (lowerText.includes('resumo') || lowerText.includes('status') || lowerText.includes('como está') || lowerText.includes('como esta')) {
          if (currentWork) {
            responseText = `Sua obra "${currentWork.name}" está ${currentWork.progress || 0}% concluída. O orçamento atual é de ${formatCurrency((currentWork.budget || 0))} e o gasto até o momento foi de ${formatCurrency((currentWork.spent || 0))}.`;
            suggestions = [
              { label: 'Ver Obra Completa', action: () => onNavigate('obras'), icon: <BookOpen size={16} /> },
              { label: 'O que falta?', action: () => handleSend('O que falta?'), icon: <Lightbulb size={16} /> }
            ];
          } else {
            responseText = "Você não tem nenhuma obra selecionada no momento. Gostaria de ver suas obras?";
            suggestions = [
              { label: 'Minhas Obras', action: () => onNavigate('obras'), icon: <BookOpen size={16} /> }
            ];
          }
        } else if (lowerText.includes('falta') || lowerText.includes('pendências') || lowerText.includes('atraso')) {
          if (currentWork) {
            responseText = `Para a obra "${currentWork.name}", cruzando o cronograma e as compras, identifiquei 2 materiais com entrega pendente e 1 etapa em atraso.`;
            suggestions = [
              { label: 'Compras Pendentes', action: () => onNavigate('compras'), icon: <ShoppingCart size={16} /> },
              { label: 'Cronograma', action: () => onNavigate('obras'), icon: <Calendar size={16} /> }
            ];
          } else {
            responseText = "Selecione uma obra primeiro para ver o que falta.";
            suggestions = [
              { label: 'Minhas Obras', action: () => onNavigate('obras'), icon: <BookOpen size={16} /> }
            ];
          }
        } else {
          if (profile?.role === 'service' || profile?.role === 'architect') {
            responseText = "Como profissional, estou aqui para te ajudar a orçar mais rápido, fechar mais negócios e gerenciar suas obras. Como posso ajudar?";
            suggestions = [
              { label: 'Novo Orçamento', action: () => onNavigate('novo-orcamento'), icon: <Calculator size={16} /> },
              { label: 'Marketing e Avaliações', action: () => onNavigate('marketing'), icon: <Sparkles size={16} /> },
              { label: 'Gerenciar Obras', action: () => onNavigate('obras'), icon: <BookOpen size={16} /> }
            ];
          } else {
            responseText = "Ainda estou aprendendo, mas aqui estão os atalhos mais usados para a sua casa:";
            suggestions = [
              { label: 'Central de Cálculos', action: () => onNavigate('calculos'), icon: <Calculator size={16} /> },
              { label: 'Lista de Compras', action: () => onNavigate('compras'), icon: <ShoppingCart size={16} /> },
              { label: 'Minhas Obras', action: () => onNavigate('obras'), icon: <BookOpen size={16} /> }
            ];
          }
        }
      }

      setMessages(prev => [...prev, { role: 'assistant', text: responseText, suggestions }]);
    }, 800);
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
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: 'var(--bg-base)' }}>
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
