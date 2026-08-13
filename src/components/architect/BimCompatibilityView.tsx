import { useState } from 'react';
import { Puzzle, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export function BimCompatibilityView({ projectId }: { projectId: string }) {
  const [clashes] = useState([
    { id: 1, title: 'Conflito Viga 02 x Tubulação de Esgoto', discipline: 'Estrutural x Hidráulica', status: 'pending', date: '10 Ago 2026' },
    { id: 2, title: 'Eletrocalha passando em pé direito baixo', discipline: 'Elétrica x Arquitetura', status: 'resolved', date: '05 Ago 2026' }
  ]);

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Puzzle size={20} color="#F59E0B" />
            Compatibilização (BIM Clashes)
          </h3>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Registro de interferências entre disciplinas.</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {clashes.map(clash => (
          <motion.div 
            key={clash.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ padding: 16, borderRadius: 16, backgroundColor: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              {clash.status === 'pending' ? (
                <AlertTriangle size={24} color="#F59E0B" />
              ) : (
                <CheckCircle size={24} color="#10B981" />
              )}
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-main)', margin: '0 0 4px' }}>{clash.title}</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12, color: 'var(--text-muted)' }}>
                  <span>{clash.discipline}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={12} /> {clash.date}</span>
                </div>
              </div>
            </div>
            
            <span style={{ 
              padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 700,
              backgroundColor: clash.status === 'pending' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)',
              color: clash.status === 'pending' ? '#F59E0B' : '#10B981'
            }}>
              {clash.status === 'pending' ? 'Pendente' : 'Resolvido'}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
