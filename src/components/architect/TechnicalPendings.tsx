import React, { useState } from 'react';
import { AlertCircle, CheckCircle, Clock, Search, Filter } from 'lucide-react';

type PendingPriority = 'Alta' | 'Média' | 'Baixa';
type PendingStatus = 'Pendente' | 'Em Andamento' | 'Resolvido';

interface TechnicalPending {
  id: string;
  title: string;
  project: string;
  priority: PendingPriority;
  status: PendingStatus;
  date: string;
  description: string;
}

export const TechnicalPendings: React.FC = () => {
  const [pendings] = useState<TechnicalPending[]>([
    {
      id: '1',
      title: 'Aprovação Prefeitura Pendente',
      project: 'Residência Alpha',
      priority: 'Alta',
      status: 'Em Andamento',
      date: '10/07/2026',
      description: 'Aguardando liberação do alvará. Revisão da taxa de permeabilidade solicitada pelo fiscal.'
    },
    {
      id: '2',
      title: 'Definição de Revestimentos',
      project: 'Escritório Sede Tech',
      priority: 'Média',
      status: 'Pendente',
      date: '15/07/2026',
      description: 'Cliente precisa aprovar os revestimentos do banheiro da diretoria.'
    },
    {
      id: '3',
      title: 'Compatibilização Elétrica',
      project: 'Residência Beta',
      priority: 'Alta',
      status: 'Resolvido',
      date: '05/07/2026',
      description: 'Ajuste no quadro de distribuição finalizado com engenheiro parceiro.'
    }
  ]);

  const [filter, setFilter] = useState('');

  const filteredPendings = pendings.filter(p => 
    p.title.toLowerCase().includes(filter.toLowerCase()) || 
    p.project.toLowerCase().includes(filter.toLowerCase())
  );

  const getPriorityColor = (priority: PendingPriority) => {
    switch (priority) {
      case 'Alta': return '#EF4444';
      case 'Média': return '#F59E0B';
      case 'Baixa': return '#3B82F6';
      default: return 'var(--text-muted)';
    }
  };

  const getStatusIcon = (status: PendingStatus) => {
    switch (status) {
      case 'Resolvido': return <CheckCircle size={16} color="#10B981" />;
      case 'Em Andamento': return <Clock size={16} color="#F59E0B" />;
      case 'Pendente': return <AlertCircle size={16} color="#EF4444" />;
    }
  };

  return (
    <div className="screen-content hide-scrollbar" style={{ padding: '24px 20px 100px 20px', overflowX: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-main)', marginBottom: 4 }}>Pendências Técnicas</h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Controle de problemas e resoluções</p>
        </div>
        <button className="btn-secondary" style={{ width: 48, height: 48, borderRadius: 24, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Filter size={20} />
        </button>
      </div>

      <div style={{ position: 'relative', marginBottom: 24 }}>
        <Search size={20} color="var(--text-muted)" style={{ position: 'absolute', left: 16, top: 14 }} />
        <input 
          type="text" 
          placeholder="Buscar pendência ou projeto..." 
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ 
            width: '100%', 
            padding: '14px 16px 14px 48px', 
            borderRadius: 16, 
            border: '1px solid var(--border-light)', 
            backgroundColor: 'var(--bg-elevated)', 
            color: 'var(--text-main)',
            fontSize: 15
          }} 
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {filteredPendings.map(pending => (
          <div key={pending.id} className="glass-panel" style={{ padding: 16, borderRadius: 16, borderLeft: `4px solid ${getPriorityColor(pending.priority)}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {getStatusIcon(pending.status)}
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)' }}>{pending.status}</span>
              </div>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{pending.date}</span>
            </div>
            
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', marginBottom: 4 }}>{pending.title}</h3>
            <span style={{ fontSize: 13, color: 'var(--color-primary)', fontWeight: 600, display: 'block', marginBottom: 12 }}>{pending.project}</span>
            
            <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 16 }}>
              {pending.description}
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-light)', paddingTop: 12 }}>
              <span style={{ fontSize: 12, fontWeight: 600, padding: '4px 8px', borderRadius: 8, backgroundColor: 'var(--bg-elevated)', color: getPriorityColor(pending.priority) }}>
                Prioridade {pending.priority}
              </span>
              <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: 12, borderRadius: 8 }}>
                Ver Detalhes
              </button>
            </div>
          </div>
        ))}

        {filteredPendings.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <AlertCircle size={48} color="var(--border-light)" style={{ margin: '0 auto 16px' }} />
            <p style={{ color: 'var(--text-muted)' }}>Nenhuma pendência encontrada.</p>
          </div>
        )}
      </div>
    </div>
  );
};
