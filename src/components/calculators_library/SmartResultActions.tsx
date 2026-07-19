import { Download, FileText, ShoppingCart, Calculator, BookOpen, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';


interface Recommendation {
  id: string;
  title: string;
  desc: string;
  tags: string[];
  link?: string;
}

const recommendationsDb: Recommendation[] = [
  { id: 'nbr-8995', title: 'Iluminância de Interiores', desc: 'Consulte a norma NBR ISO 8995-1 para ambientes de trabalho.', tags: ['lighting', 'lighting-wizard', 'spots', 'led-strip'] },
  { id: 'color-temp', title: 'Guia de Temperatura de Cor', desc: 'Saiba quando usar luz quente ou fria.', tags: ['lighting', 'lighting-wizard', 'spots', 'led-strip'] },
  { id: 'concrete-cure', title: 'Cura do Concreto', desc: 'Boas práticas para evitar fissuras na laje.', tags: ['concrete-mix', 'masonry', 'isolated-footing'] },
  { id: 'baseboard-loss', title: 'Cálculo de Perdas', desc: 'Como prever perdas em recortes de rodapés.', tags: ['baseboard', 'floor'] },
  { id: 'solar-rules', title: 'Resolução Aneel 482', desc: 'Geração distribuída e créditos de energia.', tags: ['solar-power'] },
  { id: 'plaster-joints', title: 'Dilatação de Forros', desc: 'Onde usar tabica e juntas de dilatação no gesso.', tags: ['plastering', 'drywall'] }
];

interface SmartResultActionsProps {
  onSaveHistory?: () => void;
  onGeneratePDF?: () => void;
  onAddBudget?: () => void;
  onAddShoppingList?: () => void;
  tags?: string[];
}

export function SmartResultActions({ onSaveHistory, onGeneratePDF, onAddBudget, onAddShoppingList, tags = [] }: SmartResultActionsProps) {
  const [showRecs, setShowRecs] = useState(true);

  const relevantRecs = recommendationsDb.filter(rec => rec.tags.some(tag => tags.includes(tag)));

  return (
    <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Action Buttons */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        {onGeneratePDF && (
          <button onClick={onGeneratePDF} className="btn-primary" style={{ flex: 1, minWidth: 'calc(50% - 6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 14 }}>
            <Download size={20} />
            Gerar PDF
          </button>
        )}
        {onSaveHistory && (
          <button onClick={onSaveHistory} className="btn-secondary" style={{ flex: 1, minWidth: 'calc(50% - 6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 14 }}>
            <FileText size={20} />
            Salvar Histórico
          </button>
        )}
        {onAddBudget && (
          <button onClick={onAddBudget} className="btn-secondary" style={{ flex: 1, minWidth: 'calc(50% - 6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 14, background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <Calculator size={20} />
            Orçar
          </button>
        )}
        {onAddShoppingList && (
          <button onClick={onAddShoppingList} className="btn-secondary" style={{ flex: 1, minWidth: 'calc(50% - 6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 14, background: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
            <ShoppingCart size={20} />
            Comprar
          </button>
        )}
      </div>

      {/* Smart Recommendations */}
      <AnimatePresence>
        {showRecs && relevantRecs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-panel"
            style={{ borderRadius: 16, padding: 20, position: 'relative' }}
          >
            <button 
              onClick={() => setShowRecs(false)}
              style={{ position: 'absolute', top: 16, right: 16, background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
            >
              <X size={16} />
            </button>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(139, 92, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BookOpen size={20} color="#8B5CF6" />
              </div>
              <div>
                <h4 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-main)' }}>Biblioteca Inteligente</h4>
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Sugestões baseadas no seu cálculo</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {relevantRecs.map(rec => (
                <div key={rec.id} className="card-premium-interactive" style={{ padding: 12, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', background: 'var(--bg-input-glass)', border: '1px solid var(--border-subtle)' }}>
                  <div>
                    <h5 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-main)' }}>{rec.title}</h5>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{rec.desc}</p>
                  </div>
                  <ChevronRight size={16} color="var(--text-muted)" />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
