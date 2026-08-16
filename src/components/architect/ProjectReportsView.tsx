import { FileSpreadsheet, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import { toast } from 'react-hot-toast';
import { formatDate } from '../../utils/formatters';
import { applyGlobalWatermark } from '../../utils/pdfGenerator';


export function ProjectReportsView({ projectId }: { projectId: string }) {
  
  const generateCadernoObras = () => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(22);
      doc.text('Caderno de Obras', 20, 30);
      doc.setFontSize(12);
      doc.text(`ID do Projeto: ${projectId}`, 20, 45);
      doc.text('Este documento contém as informações consolidadas da obra.', 20, 60);
      
      doc.text('1. Plantas Arquitetônicas - (Anexos referenciados)', 20, 80);
      doc.text('2. Compatibilização de Projetos - (Sem interferências críticas)', 20, 90);
      doc.text('3. Especificação de Materiais - (Tabela em anexo)', 20, 100);

      applyGlobalWatermark(doc);
      doc.save(`Caderno_de_Obras_${projectId}.pdf`);
      toast.success('Caderno de Obras gerado com sucesso!');
    } catch (e) {
      toast.error('Erro ao gerar o PDF.');
      console.error(e);
    }
  };

  const generateStatusReport = () => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(22);
      doc.text('Status Report Executivo', 20, 30);
      doc.setFontSize(12);
      doc.text(`ID do Projeto: ${projectId}`, 20, 45);
      doc.text('Data de Geração: ' + formatDate(), 20, 60);
      
      doc.text('Resumo Financeiro:', 20, 80);
      doc.text('- Orçamento Total: (Calculado)', 20, 90);
      doc.text('- Gasto Até o Momento: (Calculado)', 20, 100);
      
      doc.text('Cronograma:', 20, 120);
      doc.text('- Avanço Físico: (Calculado)%', 20, 130);
      doc.text('- Próxima Etapa: (Definir)', 20, 140);

      applyGlobalWatermark(doc);
      doc.save(`Status_Report_${projectId}.pdf`);
      toast.success('Status Report gerado com sucesso!');
    } catch (e) {
      toast.error('Erro ao gerar o PDF.');
      console.error(e);
    }
  };

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
          onClick={generateCadernoObras}
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
          onClick={generateStatusReport}
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
