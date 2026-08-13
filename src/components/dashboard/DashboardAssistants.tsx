import { Calculator, Sparkles, GripVertical, ArrowRight } from 'lucide-react';
import { TiltCard } from '../TiltCard';

interface DashboardAssistantsProps {
  profile: any;
  onNavigate: (tab: string) => void;
}

export function DashboardAssistants({ profile, onNavigate }: DashboardAssistantsProps) {
  if (profile?.role === 'owner') return null;
  return (
    <div style={{ position: 'relative' }}>
      <div className="drag-handle" style={{ position: 'absolute', top: 16, right: 16, cursor: 'grab', color: 'rgba(255,255,255,0.6)', zIndex: 10 }}>
        <GripVertical size={20} />
      </div>
      <TiltCard 
        style={{ 
          padding: 24,
          borderRadius: 24,
          background: 'linear-gradient(135deg, var(--color-primary) 0%, #EA580C 100%)',
          boxShadow: '0 8px 32px rgba(255,107,0,0.3)',
          overflow: 'hidden',
          cursor: 'pointer'
        }}
        onClick={() => onNavigate('library')}
      >
        <div style={{ position: 'absolute', right: -20, top: -20, opacity: 0.15 }}>
          <Calculator size={140} color="#FFF" />
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={20} color="#FFF" />
          </div>
          <span style={{ fontWeight: 800, fontSize: 13, textTransform: 'uppercase', letterSpacing: 1, color: '#FFF' }}>Assistentes Técnicos</span>
        </div>
        
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#FFF', marginBottom: 8 }}>
          Orçamentos Precisos em Segundos
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: 14, marginBottom: 20, maxWidth: '85%', lineHeight: 1.5 }}>
          Descubra a quantidade exata de blocos, concreto, pisos e tintas. Gere relatórios em PDF com sua taxa de perda!
        </p>
        
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#FFF', fontWeight: 700, fontSize: 15, backgroundColor: 'rgba(0,0,0,0.2)', padding: '12px 20px', borderRadius: 16 }}>
          Abrir Assistentes <ArrowRight size={18} color="#FFF" />
        </div>
      </TiltCard>
    </div>
  );
}
