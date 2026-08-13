import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Building2, AlertTriangle, CheckCircle2, Clock, Users, DollarSign } from 'lucide-react';
import { useWorks } from '../../contexts/WorksContext';
import { useBuilder } from '../../contexts/BuilderContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface BuilderOperationsCenterProps {
  onBack: () => void;
}

export function BuilderOperationsCenter({ onBack }: BuilderOperationsCenterProps) {
  const { works, isLoadingWorks } = useWorks();
  const { employees, procurements, equipments, isLoading } = useBuilder();

  // Aggregate stats
  const stats = useMemo(() => {
    const totalWorks = works.length;
    const activeWorks = works.filter(w => w.status === 'Em Andamento').length;
    const delayedWorks = works.filter(w => w.status === 'Atrasada').length;
    const completedWorks = works.filter(w => w.status === 'Finalizada').length;

    const totalEmployees = employees.length;
    const activeEmployees = employees.filter(e => e.status === 'Ativo').length;

    const pendingProcurements = procurements.filter(p => ['Solicitado', 'Cotando', 'Aprovado'].includes(p.status)).length;
    
    const equipmentInUse = equipments.filter(e => e.status === 'Em Uso').length;

    return {
      totalWorks,
      activeWorks,
      delayedWorks,
      completedWorks,
      totalEmployees,
      activeEmployees,
      pendingProcurements,
      equipmentInUse
    };
  }, [works, employees, procurements, equipments]);

  // Chart data: physical vs financial progress for works
  const worksProgressData = works.map(w => ({
    name: w.name,
    Físico: w.progress || 0,
    Financeiro: w.budget && w.spent ? Math.min(100, Math.round((w.spent / w.budget) * 100)) : 0,
  })).slice(0, 5); // Show top 5

  if (isLoadingWorks || isLoading) {
    return (
      <div style={{ padding: 20, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <div className="page-container" style={{ paddingBottom: 100 }}>
      <header className="page-header" style={{ marginBottom: 24, padding: '0 20px' }}>
        <button onClick={onBack} className="back-button">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Centro de Operações</h1>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 14 }}>Visão Tática Corporativa</p>
        </div>
      </header>

      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        
        {/* KPIs Row 1 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16 }}>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-panel" style={{ padding: 16, borderRadius: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#3B82F6', marginBottom: 8 }}>
              <Building2 size={18} />
              <span style={{ fontSize: 13, fontWeight: 700 }}>Obras Ativas</span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-main)' }}>{stats.activeWorks}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>de {stats.totalWorks} totais</div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-panel" style={{ padding: 16, borderRadius: 16, borderLeft: '4px solid #EF4444' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#EF4444', marginBottom: 8 }}>
              <AlertTriangle size={18} />
              <span style={{ fontSize: 13, fontWeight: 700 }}>Atrasadas</span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-main)' }}>{stats.delayedWorks}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Precisam de atenção</div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-panel" style={{ padding: 16, borderRadius: 16, borderLeft: '4px solid #10B981' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#10B981', marginBottom: 8 }}>
              <CheckCircle2 size={18} />
              <span style={{ fontSize: 13, fontWeight: 700 }}>Finalizadas</span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-main)' }}>{stats.completedWorks}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Obras entregues</div>
          </motion.div>
        </div>

        {/* KPIs Row 2 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16 }}>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-panel" style={{ padding: 16, borderRadius: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#8B5CF6', marginBottom: 8 }}>
              <Users size={18} />
              <span style={{ fontSize: 13, fontWeight: 700 }}>Equipe Alocada</span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-main)' }}>{stats.activeEmployees}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>de {stats.totalEmployees} cadastrados</div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-panel" style={{ padding: 16, borderRadius: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#F59E0B', marginBottom: 8 }}>
              <Clock size={18} />
              <span style={{ fontSize: 13, fontWeight: 700 }}>Compras Pendentes</span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-main)' }}>{stats.pendingProcurements}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Em cotação ou aprovação</div>
          </motion.div>
        </div>

        {/* Charts / BI Highlights */}
        {worksProgressData.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-panel" style={{ padding: 20, borderRadius: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-main)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <DollarSign size={18} color="#06B6D4" />
              Avanço Físico x Financeiro (Top 5)
            </h3>
            <div style={{ height: 300, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={worksProgressData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--bg-glass)', borderColor: 'var(--border-subtle)', borderRadius: 12, color: 'var(--text-main)' }}
                    itemStyle={{ fontWeight: 600 }}
                  />
                  <Bar dataKey="Físico" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Financeiro" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}

        {works.length === 0 && (
          <div className="glass-panel" style={{ padding: 40, textAlign: 'center', borderRadius: 24 }}>
            <Building2 size={48} color="var(--text-muted)" style={{ marginBottom: 16, opacity: 0.5 }} />
            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-main)', marginBottom: 8 }}>Nenhuma Obra Ativa</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Cadastre obras para ver os indicadores em tempo real.</p>
          </div>
        )}

      </div>
    </div>
  );
}
