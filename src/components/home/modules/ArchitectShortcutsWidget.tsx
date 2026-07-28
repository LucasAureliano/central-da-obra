import { motion } from 'framer-motion';
import { Camera, FileText, Lightbulb, PaintBucket, ChevronRight } from 'lucide-react';

export function ArchitectShortcutsWidget({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const shortcuts = [
    { id: 'vistorias', label: 'Vistorias Técnicas', icon: Camera, color: '#3B82F6', tab: 'vistorias' },
    { id: 'diario', label: 'Diário de Obra', icon: FileText, color: '#8B5CF6', tab: 'diario-tecnico' },
    { id: 'lumi', label: 'Projeto Luminotécnico', icon: Lightbulb, color: '#F59E0B', tab: 'calculos', param: 'lighting' },
    { id: 'interiores', label: 'Tendências', icon: PaintBucket, color: '#D946EF', tab: 'tendencias' }
  ];

  return (
    <div style={{ marginBottom: 24 }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', marginBottom: 16, paddingLeft: 4 }}>
        Acesso Rápido
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {shortcuts.map((sc, i) => (
          <motion.button
            key={sc.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => onNavigate(sc.tab)} // We'd pass param here if onNavigate supported it, but it only takes tab. Wait, let's check onNavigate in HomeDashboard.
            className="card-premium-interactive glass-panel"
            style={{
              padding: 16,
              borderRadius: 20,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: 12,
              border: '1px solid var(--border-subtle)',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              backgroundColor: `${sc.color}15`,
              color: sc.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <sc.icon size={20} />
            </div>
            <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)', lineHeight: 1.2 }}>
                {sc.label}
              </span>
              <ChevronRight size={16} color="var(--text-muted)" />
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
