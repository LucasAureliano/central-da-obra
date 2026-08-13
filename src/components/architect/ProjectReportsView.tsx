import { FileSpreadsheet, Download } from 'lucide-react';
import { motion } from 'framer-motion';

export function ProjectReportsView({ projectId }: { projectId: string }) {
  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <FileSpreadsheet size={20} color="#10B981" />
            Relatórios e Entregáveis
          </h3>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Geração de PDFs e cadernos de obra.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{ padding: 20, borderRadius: 16, backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, cursor: 'pointer' }}
          onClick={() => alert('Gerando Caderno de Obras...')}
        >
          <div style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileSpreadsheet size={24} color="#3B82F6" />
          </div>
          <div style={{ textAlign: 'center' }}>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-main)', margin: '0 0 4px' }}>Caderno de Obras</h4>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Todas as plantas consolidadas.</p>
          </div>
          <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: '#3B82F6' }}>
            <Download size={14} /> Exportar PDF
          </div>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{ padding: 20, borderRadius: 16, backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, cursor: 'pointer' }}
          onClick={() => alert('Gerando Status Report...')}
        >
          <div style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileSpreadsheet size={24} color="#10B981" />
          </div>
          <div style={{ textAlign: 'center' }}>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-main)', margin: '0 0 4px' }}>Status Report</h4>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Resumo financeiro e cronograma.</p>
          </div>
          <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: '#10B981' }}>
            <Download size={14} /> Exportar PDF
          </div>
        </motion.button>
      </div>
    </div>
  );
}
