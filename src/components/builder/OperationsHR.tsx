import React, { useState, useEffect } from 'react';
import { Users, HardHat, Search, UserPlus, Filter, TrendingUp, Clock, AlertTriangle } from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';

interface Worker {
  id: string;
  name: string;
  role: string;
  site: string;
  status: 'Ativo' | 'Férias' | 'Afastado';
  productivity: number; // 0-100%
  overtime: number; // hours this month
}

export const OperationsHR: React.FC = () => {
  const { user } = useAuth();
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    if (!user) {
      setWorkers([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const qWorkers = query(collection(db, 'workers'), where('userId', '==', user.uid));
    
    const unsubscribe = onSnapshot(qWorkers, (snapshot) => {
      if (snapshot.empty) {
        setWorkers([]);
      } else {
        const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Worker));
        setWorkers(data);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching workers:", error);
      setWorkers([]);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const filteredWorkers = workers.filter(w => 
    w.name?.toLowerCase().includes(filter.toLowerCase()) || 
    w.site?.toLowerCase().includes(filter.toLowerCase()) ||
    w.role?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="screen-content hide-scrollbar" style={{ padding: '24px 20px 100px 20px', overflowX: 'hidden', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-main)', marginBottom: 4 }}>Produtividade & RH</h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Gestão de equipes e desempenho nas obras</p>
        </div>
        <button className="btn-primary" style={{ width: 48, height: 48, borderRadius: 24, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <UserPlus size={24} />
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 }}>
          <div className="skeleton-glass" style={{ height: 100, width: '100%', borderRadius: 16 }} />
          <div className="skeleton-glass" style={{ height: 100, width: '100%', borderRadius: 16 }} />
        </div>
      ) : workers.length === 0 ? (
        <div style={{ marginTop: 60, textAlign: 'center', padding: '40px 20px', backgroundColor: 'var(--bg-elevated)', borderRadius: 24, border: '1px solid var(--border-light)' }}>
          <div style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: 'var(--bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 8px 32px rgba(0,0,0,0.05)' }}>
            <Users size={40} color="var(--color-primary)" />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-main)', marginBottom: 12 }}>Nenhuma Equipe Cadastrada</h2>
          <p style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: 300, margin: '0 auto', marginBottom: 24 }}>
            Adicione seus colaboradores para gerenciar produtividade, horas extras e alocação por obra.
          </p>
          <button className="btn-primary hover-scale" style={{ padding: '0 24px', height: 48, borderRadius: 12, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <UserPlus size={20} />
            <span>Adicionar Colaborador</span>
          </button>
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
            <div className="glass-panel" style={{ padding: 16, borderRadius: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <Users size={16} color="var(--color-primary)" />
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Total Efetivo</span>
              </div>
              <span style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-main)' }}>{workers.length}</span>
            </div>
            <div className="glass-panel" style={{ padding: 16, borderRadius: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <TrendingUp size={16} color="#10B981" />
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Produtividade Média</span>
              </div>
              <span style={{ fontSize: 24, fontWeight: 900, color: '#10B981' }}>
                {workers.length > 0 ? Math.round(workers.reduce((acc, curr) => acc + (curr.productivity || 0), 0) / workers.length) : 0}%
              </span>
            </div>
          </div>

          <div style={{ position: 'relative', marginBottom: 24 }}>
            <Search size={20} color="var(--text-muted)" style={{ position: 'absolute', left: 16, top: 14 }} />
            <input 
              type="text" 
              placeholder="Buscar colaborador ou obra..." 
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
            <button style={{ position: 'absolute', right: 16, top: 14, background: 'none', border: 'none', color: 'var(--color-primary)' }}>
              <Filter size={20} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filteredWorkers.map(worker => (
              <div key={worker.id} className="glass-panel" style={{ padding: 16, borderRadius: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <HardHat size={22} color="var(--text-main)" />
                    </div>
                    <div>
                      <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', marginBottom: 2 }}>{worker.name}</h3>
                      <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{worker.role} • {worker.site}</span>
                    </div>
                  </div>
                  <span style={{ 
                    fontSize: 11, 
                    fontWeight: 700, 
                    padding: '4px 8px', 
                    borderRadius: 8, 
                    backgroundColor: worker.status === 'Ativo' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)', 
                    color: worker.status === 'Ativo' ? '#10B981' : '#F59E0B' 
                  }}>
                    {worker.status}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, backgroundColor: 'var(--bg-elevated)', padding: 12, borderRadius: 12 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <TrendingUp size={14} color="var(--text-muted)" />
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Produtividade</span>
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-main)' }}>{worker.productivity || 0}%</span>
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <Clock size={14} color={(worker.overtime || 0) > 20 ? '#EF4444' : 'var(--text-muted)'} />
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Horas Extras</span>
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 700, color: (worker.overtime || 0) > 20 ? '#EF4444' : 'var(--text-main)' }}>{worker.overtime || 0}h</span>
                  </div>
                </div>

                {(worker.overtime || 0) > 20 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, color: '#EF4444', fontSize: 12 }}>
                    <AlertTriangle size={14} />
                    Limite de horas extras excedido no mês.
                  </div>
                )}
              </div>
            ))}
            
            {filteredWorkers.length === 0 && workers.length > 0 && (
               <div style={{ textAlign: 'center', padding: 40 }}>
                 <p style={{ color: 'var(--text-muted)' }}>Nenhum colaborador encontrado com esse filtro.</p>
               </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
