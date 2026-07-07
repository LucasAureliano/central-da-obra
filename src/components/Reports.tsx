import React, { useState } from 'react';
import { 
  FileText, Download, Share2, Sparkles, CheckCircle2, 
  ArrowRight, ClipboardList, TrendingUp, Camera 
} from 'lucide-react';

interface ReportsProps {
  activeWorkName: string;
  shoppingCount: number;
  financialCount: number;
  diaryCount: number;
}

export const Reports: React.FC<ReportsProps> = ({ 
  activeWorkName, 
  shoppingCount, 
  financialCount, 
  diaryCount 
}) => {
  const [generatingReport, setGeneratingReport] = useState<string | null>(null);
  const [successReport, setSuccessReport] = useState<string | null>(null);

  const startGeneration = (name: string) => {
    setGeneratingReport(name);
    setTimeout(() => {
      setGeneratingReport(null);
      setSuccessReport(name);
    }, 2000);
  };

  const reportsList = [
    { id: 'geral', title: '📊 Relatório Geral da Obra', desc: 'Resumo executivo da obra, prazos e percentuais concluídos.', icon: <ClipboardList size={22} className="text-primary" /> },
    { id: 'financeiro', title: '💸 Relatório Financeiro', desc: `Extrato completo de receitas, saídas e saldo (${financialCount} registros).`, icon: <TrendingUp size={22} className="text-primary" /> },
    { id: 'compras', title: '🛒 Lista de Compras & Cotações', desc: `Checklist de materiais pendentes e concluídos (${shoppingCount} materiais).`, icon: <FileText size={22} className="text-primary" /> },
    { id: 'fotografico', title: '📸 Diário Fotográfico de Campo', desc: `Timeline completa com fotos anexadas e observações (${diaryCount} logs).`, icon: <Camera size={22} className="text-primary" /> },
  ];

  return (
    <div className="screen-content animate-fade-in" style={{ padding: 16 }}>
      
      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        <h1 className="text-2xl font-black">Central de Relatórios</h1>
        <p className="text-xs text-muted">Exporte dados consolidados em PDF prontos para envio</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {reportsList.map(r => (
          <div key={r.id} className="card-premium">
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: '12px',
                backgroundColor: 'var(--color-primary-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {r.icon}
              </div>
              <div>
                <h3 className="text-sm font-bold">{r.title}</h3>
                <p className="text-xs text-muted" style={{ marginTop: 2 }}>{r.desc}</p>
              </div>
            </div>

            <button 
              onClick={() => startGeneration(r.title)}
              className="btn-primary" 
              style={{ padding: '8px 12px', fontSize: 12, gap: 6 }}
            >
              <Download size={14} /> Gerar PDF Exportável
            </button>
          </div>
        ))}
      </div>

      {/* Simulated generation loading state */}
      {generatingReport && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'var(--bg-glass)',
          zIndex: 200,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          gap: 16,
          padding: 24,
          textAlign: 'center'
        }} className="animate-fade-in">
          <div className="animate-pulse" style={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            backgroundColor: 'var(--color-primary-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Sparkles size={28} className="text-primary" />
          </div>
          <h3 className="text-base font-bold">Compilando Dados...</h3>
          <p className="text-xs text-muted" style={{ maxWidth: 200 }}>
            Processando cálculos estruturais, diário de obra e fluxos de caixa para a obra <strong>{activeWorkName}</strong>.
          </p>
        </div>
      )}

      {/* Simulated success popup */}
      {successReport && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          zIndex: 200,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 24
        }} className="animate-fade-in">
          <div className="card-premium animate-fade-in" style={{
            width: '100%',
            backgroundColor: 'var(--bg-surface)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
            padding: 24
          }}>
            <div style={{
              width: 50,
              height: 50,
              borderRadius: '50%',
              backgroundColor: 'rgba(34, 197, 94, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CheckCircle2 size={32} color="#22c55e" />
            </div>
            <div>
              <h3 className="text-base font-bold">PDF Gerado com Sucesso!</h3>
              <p className="text-xs text-muted" style={{ marginTop: 4 }}>
                O documento <strong>{successReport}</strong> foi empacotado e está pronto.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 8 }}>
              <button 
                onClick={() => {
                  alert('Download simulado com sucesso!');
                  setSuccessReport(null);
                }} 
                className="btn-primary" 
                style={{ fontSize: 13, gap: 6 }}
              >
                Visualizar PDF <ArrowRight size={14} />
              </button>
              <button 
                onClick={() => {
                  alert('Compartilhamento simulado com sucesso!');
                  setSuccessReport(null);
                }} 
                className="btn-secondary" 
                style={{ fontSize: 13, gap: 6 }}
              >
                Compartilhar via WhatsApp <Share2 size={14} />
              </button>
            </div>

            <button 
              onClick={() => setSuccessReport(null)}
              className="text-xs text-muted font-bold"
              style={{ background: 'none', border: 'none', cursor: 'pointer', marginTop: 4 }}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
