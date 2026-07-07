import { ArrowLeft, Clock } from 'lucide-react';

interface PlaceholderScreenProps {
  title: string;
  onBack: () => void;
}

export function PlaceholderScreen({ title, onBack }: PlaceholderScreenProps) {
  return (
    <div className="screen-content animate-fade-in" style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 24 }}>
      <button 
        onClick={onBack}
        className="btn-icon" 
        style={{ marginBottom: 24 }}
      >
        <ArrowLeft size={20} />
      </button>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '50vh', textAlign: 'center' }}>
        <div style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
          <Clock size={40} color="var(--color-primary)" />
        </div>
        
        <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-main)', marginBottom: 8 }}>{title}</h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: 300 }}>
          Esta funcionalidade está em desenvolvimento e estará disponível em breve!
        </p>
        
        <button className="btn-primary" style={{ marginTop: 32 }} onClick={onBack}>
          Voltar para Início
        </button>
      </div>
    </div>
  );
}
