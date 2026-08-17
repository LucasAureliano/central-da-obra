import { motion } from 'framer-motion';
import { Users, FileText, HardHat, ChevronRight, Ruler, Percent, Camera, FileOutput } from 'lucide-react';
import { InsightsWidget } from './InsightsWidget';
import { AgendaWidget } from './AgendaWidget';
import { ServiceFinanceWidget } from './ServiceFinanceWidget';
import { CalculatorsCentralWidget } from './CalculatorsCentralWidget';
import { TipsWidget } from './TipsWidget';
import { ReorderableDashboardLayout } from './ReorderableDashboardLayout';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

// --------------------------------------------------------------------------------------
// Widget inline: CRM e Negócios (Funil de Vendas)
// --------------------------------------------------------------------------------------
function CRMBusinessWidget({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const { user } = useAuth();
  const [stats, setStats] = useState({ leads: 0, orcamentos: 0, ativas: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;
      try {
        const q = query(collection(db, 'users', user.uid, 'quotes'));
        const snap = await getDocs(q);
        
        let leads = 0;
        let orcamentos = 0;
        let ativas = 0;

        snap.docs.forEach(doc => {
          const status = doc.data().status;
          if (status === 'Rascunho' || status === 'Em Negociação') leads++;
          if (status === 'Enviado') orcamentos++;
          if (status === 'Execução') ativas++;
        });

        setStats({ leads, orcamentos, ativas });
      } catch (err) {
        console.error('Erro ao buscar stats do funil', err);
      }
    };
    fetchStats();
  }, [user]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.1 }}
      className="glass-panel"
      style={{ padding: 20, borderRadius: 24, marginBottom: 24, border: '1px solid rgba(59, 130, 246, 0.2)' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
          <Users size={18} color="#3B82F6" />
          Funil de Negócios (CRM)
        </h3>
        <button
          onClick={() => onNavigate('crm')}
          style={{ background: 'none', border: 'none', color: '#3B82F6', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}
        >
          Ver Todos <ChevronRight size={14} />
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {/* Leads */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--bg-elevated)', padding: 12, borderRadius: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={16} color="#F59E0B" />
            </div>
            <div>
              <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-main)', display: 'block' }}>Novos Leads</span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Rascunho e Negociação</span>
            </div>
          </div>
          <span style={{ fontSize: 14, fontWeight: 900, color: '#F59E0B' }}>{stats.leads}</span>
        </div>

        {/* Orçamentos */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--bg-elevated)', padding: 12, borderRadius: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={16} color="#3B82F6" />
            </div>
            <div>
              <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-main)', display: 'block' }}>Orçamentos</span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Enviados / Aguardando</span>
            </div>
          </div>
          <span style={{ fontSize: 14, fontWeight: 900, color: '#3B82F6' }}>{stats.orcamentos}</span>
        </div>

        {/* Obras Ativas */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--bg-elevated)', padding: 12, borderRadius: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <HardHat size={16} color="#10B981" />
            </div>
            <div>
              <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-main)', display: 'block' }}>Obras Ativas</span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Execução em andamento</span>
            </div>
          </div>
          <span style={{ fontSize: 14, fontWeight: 900, color: '#10B981' }}>{stats.ativas}</span>
        </div>
      </div>
    </motion.div>
  );
}

// --------------------------------------------------------------------------------------
// Widget inline: Boletim de Medição
// --------------------------------------------------------------------------------------
function MeasurementWidget({ onNavigate }: { onNavigate: (tab: string) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.15 }}
      className="glass-panel"
      style={{ padding: 20, borderRadius: 24, marginBottom: 24 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
          <Ruler size={18} color="#8B5CF6" />
          Boletim de Medição
        </h3>
        <button
          onClick={() => onNavigate('medicao')}
          style={{ background: 'none', border: 'none', color: '#8B5CF6', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}
        >
          Nova Medição <ChevronRight size={14} />
        </button>
      </div>

      <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12, lineHeight: 1.4 }}>
        Registre o quanto você já executou de cada serviço para solicitar a parcela de pagamento do cliente.
      </p>

      <div style={{ padding: 14, backgroundColor: 'var(--bg-elevated)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Percent size={18} color="#10B981" />
          <div>
            <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-main)', display: 'block' }}>Reboco - Sala</span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Status atual: 50%</span>
          </div>
        </div>
        <button
          onClick={() => onNavigate('medicao')}
          className="btn-primary"
          style={{ padding: '6px 12px', borderRadius: 10, fontSize: 12, backgroundColor: '#8B5CF6', color: '#FFF', border: 'none', cursor: 'pointer' }}
        >
          Atualizar
        </button>
      </div>
    </motion.div>
  );
}

// --------------------------------------------------------------------------------------
// Widget inline: Portfólio e Propostas
// --------------------------------------------------------------------------------------
function PortfolioWidget({ onNavigate }: { onNavigate: (tab: string) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
      className="glass-panel"
      style={{ padding: 20, borderRadius: 24, marginBottom: 24 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
          <Camera size={18} color="#EC4899" />
          Portfólio & Vendas
        </h3>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <button
          onClick={() => onNavigate('portfolio')}
          style={{ padding: 14, borderRadius: 14, backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6, cursor: 'pointer' }}
        >
          <div style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: 'rgba(236, 72, 153, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Camera size={14} color="#EC4899" />
          </div>
          <div style={{ textAlign: 'left' }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-main)', display: 'block' }}>Galeria</span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Obras entregues</span>
          </div>
        </button>

        <button
          onClick={() => onNavigate('novo-orcamento')}
          style={{ padding: 14, borderRadius: 14, backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6, cursor: 'pointer' }}
        >
          <div style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: 'rgba(245, 158, 11, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileOutput size={14} color="#F59E0B" />
          </div>
          <div style={{ textAlign: 'left' }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-main)', display: 'block' }}>Proposta PDF</span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Gerar orçamento</span>
          </div>
        </button>
      </div>
    </motion.div>
  );
}

export function ProfessionalDashboard({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const DEFAULT_ORDER = [
    'crm',
    'medicao',
    'portfolio',
    'calculadoras',
    'agenda',
    'recebimentos',
    'dicas'
  ];

  const WIDGET_NAMES = {
    crm:            'Funil de Negócios (CRM)',
    medicao:        'Boletim de Medição',
    portfolio:      'Portfólio & Vendas',
    calculadoras:   'Calculadoras',
    agenda:         'Agenda Técnica',
    recebimentos:   'Financeiro',
    dicas:          'Dicas',
  };

  const renderWidget = (id: string) => {
    switch (id) {
      case 'crm':           return <CRMBusinessWidget onNavigate={onNavigate} key="crm" />;
      case 'medicao':       return <MeasurementWidget onNavigate={onNavigate} key="medicao" />;
      case 'portfolio':     return <PortfolioWidget onNavigate={onNavigate} key="portfolio" />;
      case 'calculadoras':  return <CalculatorsCentralWidget onNavigate={onNavigate} key="calculadoras" />;
      case 'agenda':        return <AgendaWidget onNavigate={onNavigate} key="agenda" />;
      case 'recebimentos':  return <ServiceFinanceWidget onNavigate={onNavigate} key="recebimentos" />;
      case 'dicas':         return <TipsWidget onNavigate={onNavigate} key="dicas" />;
      default:              return null;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '24px 20px 0 20px' }}>
        <InsightsWidget onNavigate={onNavigate} />
      </div>
      <ReorderableDashboardLayout
        defaultOrder={DEFAULT_ORDER}
        renderWidget={renderWidget}
        widgetNames={WIDGET_NAMES}
      />
    </div>
  );
}

