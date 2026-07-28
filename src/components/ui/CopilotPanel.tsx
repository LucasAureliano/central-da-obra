import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ShoppingCart, BookOpen, FileText, PlusCircle, ClipboardList, X, ChevronRight, Calculator, Calendar } from 'lucide-react';

interface CopilotAction {
  id: string;
  icon: React.ReactNode;
  label: string;
  desc: string;
  color: string;
  action: () => void;
}

interface CopilotPanelProps {
  trigger: 'calc-complete' | 'work-created' | 'budget-saved' | 'diary-saved';
  calcType?: string;
  onNavigate: (tab: string, param?: string) => void;
  onDismiss: () => void;
}

const CALC_ACTIONS: Record<string, CopilotAction[]> = {
  default: [
    { id: 'shopping', icon: <ShoppingCart size={18} />, label: 'Adicionar à Lista de Compras', desc: 'Importe os materiais calculados', color: '#F59E0B', action: () => {} },
    { id: 'library', icon: <BookOpen size={18} />, label: 'Consultar Norma Relacionada', desc: 'Ver artigos técnicos sobre o tema', color: '#8B5CF6', action: () => {} },
    { id: 'budget', icon: <Calculator size={18} />, label: 'Gerar Orçamento', desc: 'Criar proposta com estes valores', color: '#10B981', action: () => {} },
    { id: 'pdf', icon: <FileText size={18} />, label: 'Exportar PDF', desc: 'Relatório completo do cálculo', color: '#3B82F6', action: () => {} },
    { id: 'diary', icon: <ClipboardList size={18} />, label: 'Registrar no Diário', desc: 'Salvar no diário técnico da obra', color: '#EC4899', action: () => {} },
  ],
  'floor': [
    { id: 'shopping', icon: <ShoppingCart size={18} />, label: 'Adicionar à Lista de Compras', desc: 'Porcelanato e argamassa', color: '#F59E0B', action: () => {} },
    { id: 'library', icon: <BookOpen size={18} />, label: 'Ver norma de assentamento', desc: 'NBR 13753 — Revestimentos cerâmicos', color: '#8B5CF6', action: () => {} },
    { id: 'budget', icon: <Calculator size={18} />, label: 'Incluir no Orçamento', desc: 'Adicionar mão de obra e material', color: '#10B981', action: () => {} },
  ],
  'concrete-mix': [
    { id: 'shopping', icon: <ShoppingCart size={18} />, label: 'Comprar Materiais', desc: 'Cimento, areia e brita', color: '#F59E0B', action: () => {} },
    { id: 'library', icon: <BookOpen size={18} />, label: 'Ver NBR 6118', desc: 'Norma de concreto estrutural', color: '#8B5CF6', action: () => {} },
    { id: 'diary', icon: <ClipboardList size={18} />, label: 'Registrar Concretagem', desc: 'Salvar data e traço utilizado', color: '#EC4899', action: () => {} },
  ],
  'lighting': [
    { id: 'shopping', icon: <ShoppingCart size={18} />, label: 'Comprar Luminárias', desc: 'Adicionar à lista de compras', color: '#F59E0B', action: () => {} },
    { id: 'library', icon: <BookOpen size={18} />, label: 'Ver NBR ISO 8995-1', desc: 'Iluminação em ambientes de trabalho', color: '#8B5CF6', action: () => {} },
    { id: 'interior', icon: <PlusCircle size={18} />, label: 'Abrir Tendências', desc: 'Catálogo de inspirações', color: '#D946EF', action: () => {} },
  ],
  'paint': [
    { id: 'shopping', icon: <ShoppingCart size={18} />, label: 'Comprar Tinta', desc: 'Adicionar à lista de compras', color: '#F59E0B', action: () => {} },
    { id: 'budget', icon: <Calculator size={18} />, label: 'Incluir no Orçamento', desc: 'Material + mão de obra de pintura', color: '#10B981', action: () => {} },
    { id: 'diary', icon: <ClipboardList size={18} />, label: 'Registrar Início de Pintura', desc: 'Log no diário técnico', color: '#EC4899', action: () => {} },
  ],
};

const WORK_CREATED_ACTIONS: CopilotAction[] = [
  { id: 'schedule', icon: <Calendar size={18} />, label: 'Criar Cronograma', desc: 'Definir etapas e prazos', color: '#3B82F6', action: () => {} },
  { id: 'budget', icon: <Calculator size={18} />, label: 'Definir Orçamento', desc: 'Estimativa financeira da obra', color: '#10B981', action: () => {} },
  { id: 'diary', icon: <ClipboardList size={18} />, label: 'Iniciar Diário de Obra', desc: 'Registro do primeiro dia', color: '#EC4899', action: () => {} },
  { id: 'connect', icon: <Sparkles size={18} />, label: 'Compartilhar via Connect', desc: 'Gerar link para o cliente', color: '#8B5CF6', action: () => {} },
];

const BUDGET_SAVED_ACTIONS: CopilotAction[] = [
  { id: 'pdf', icon: <FileText size={18} />, label: 'Gerar PDF da Proposta', desc: 'Enviar para o cliente', color: '#3B82F6', action: () => {} },
  { id: 'shopping', icon: <ShoppingCart size={18} />, label: 'Criar Lista de Compras', desc: 'Importar materiais do orçamento', color: '#F59E0B', action: () => {} },
  { id: 'agenda', icon: <Calendar size={18} />, label: 'Agendar Visita Técnica', desc: 'Marcar na agenda', color: '#10B981', action: () => {} },
];

const TRIGGER_TITLES: Record<string, { title: string; subtitle: string }> = {
  'calc-complete': { title: 'Cálculo Concluído!', subtitle: 'O que você quer fazer agora?' },
  'work-created': { title: 'Obra Criada!', subtitle: 'Próximos passos recomendados' },
  'budget-saved': { title: 'Orçamento Salvo!', subtitle: 'O que fazer com esta proposta?' },
  'diary-saved': { title: 'Registro Salvo!', subtitle: 'Continue sua análise técnica' },
};

export function CopilotPanel({ trigger, calcType, onNavigate, onDismiss }: CopilotPanelProps) {
  const [dismissed, setDismissed] = useState(false);

  const getActions = (): CopilotAction[] => {
    if (trigger === 'work-created') return WORK_CREATED_ACTIONS;
    if (trigger === 'budget-saved') return BUDGET_SAVED_ACTIONS;
    const actions = (calcType && CALC_ACTIONS[calcType]) ? CALC_ACTIONS[calcType] : CALC_ACTIONS.default;
    // Inject real navigation
    return actions.map(a => ({
      ...a,
      action: () => {
        if (a.id === 'shopping') onNavigate('compras');
        else if (a.id === 'library') onNavigate('central-tecnica');
        else if (a.id === 'budget') onNavigate('novo-orcamento');
        else if (a.id === 'pdf') onNavigate('relatorios');
        else if (a.id === 'diary') onNavigate('diario-tecnico');
        else if (a.id === 'interior') onNavigate('tendencias');
        else if (a.id === 'schedule') onNavigate('cronograma');
        else if (a.id === 'connect') onNavigate('obras');
        else if (a.id === 'agenda') onNavigate('agenda-completa');
        onDismiss();
      }
    }));
  };

  const handleDismiss = () => {
    setDismissed(true);
    setTimeout(onDismiss, 300);
  };

  const actions = getActions();
  const titleConfig = TRIGGER_TITLES[trigger] || TRIGGER_TITLES['calc-complete'];

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          style={{
            position: 'fixed',
            bottom: 80,
            left: 0,
            right: 0,
            zIndex: 200,
            padding: '0 16px',
          }}
        >
          <div
            className="glass-panel"
            style={{
              borderRadius: 24,
              padding: 20,
              border: '1px solid var(--color-primary-alpha)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              maxWidth: 480,
              margin: '0 auto',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 12,
                  backgroundColor: 'var(--color-primary-alpha)',
                  color: 'var(--color-primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Sparkles size={18} />
                </div>
                <div>
                  <h4 style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>{titleConfig.title}</h4>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>{titleConfig.subtitle}</p>
                </div>
              </div>
              <button
                onClick={handleDismiss}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {actions.slice(0, 4).map((action, i) => (
                <motion.button
                  key={action.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => { action.action(); }}
                  className="card-premium-interactive"
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 14px', borderRadius: 14,
                    backgroundColor: 'var(--bg-elevated)',
                    border: '1px solid var(--border-subtle)',
                    cursor: 'pointer', textAlign: 'left', width: '100%'
                  }}
                >
                  <div style={{
                    width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                    backgroundColor: `${action.color}15`,
                    color: action.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {action.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-main)' }}>{action.label}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{action.desc}</div>
                  </div>
                  <ChevronRight size={16} color="var(--text-muted)" />
                </motion.button>
              ))}
            </div>

            {/* Dismiss */}
            <button
              onClick={handleDismiss}
              style={{
                width: '100%', marginTop: 12, padding: '10px 0',
                background: 'none', border: 'none',
                color: 'var(--text-muted)', fontSize: 13, fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Fechar sugestões
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
