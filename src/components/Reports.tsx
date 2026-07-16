import React, { useState } from 'react';
import { 
  FileText, Download, Share2, Sparkles, CheckCircle2, 
  ArrowRight, ClipboardList, TrendingUp 
} from 'lucide-react';

import { useWorks } from '../contexts/WorksContext';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { generateGeneralReport, generateFinancialReport, generateShoppingReport } from '../lib/pdfGenerator';
import { Camera, ClipboardCheck } from 'lucide-react';

export const Reports: React.FC = () => {
  const { activeWork } = useWorks();
  const { profile } = useAuth();
  
  const [shoppingCount, setShoppingCount] = useState(0);
  const [financialCount, setFinancialCount] = useState(0);

  React.useEffect(() => {
    if (!activeWork) return;

    // Fetch total expenses count
    const qExp = query(collection(db, `works/${activeWork.id}/expenses`));
    getDocs(qExp).then(snap => setFinancialCount(snap.size));

    // Fetch calculations to estimate shopping count
    const qCalc = query(collection(db, `works/${activeWork.id}/calculations`));
    getDocs(qCalc).then(snap => {
      let matCount = 0;
      snap.forEach(doc => {
        const data = doc.data();
        if (data.resultData && data.resultData.materials) {
          matCount += data.resultData.materials.length;
        }
      });
      setShoppingCount(matCount);
    });
  }, [activeWork]);

  const activeWorkName = activeWork?.name || 'Nenhuma Obra';

  const [generatingReport, setGeneratingReport] = useState<string | null>(null);
  const [successReport, setSuccessReport] = useState<string | null>(null);

  const startGeneration = async (id: string, name: string) => {
    if (!activeWork) return;
    
    setGeneratingReport(name);
    try {
      if (id === 'geral') {
        await generateGeneralReport(activeWork);
      } else if (id === 'financeiro') {
        await generateFinancialReport(activeWork);
      } else if (id === 'compras') {
        await generateShoppingReport(activeWork);
      }
      setGeneratingReport(null);
      setSuccessReport(name);
    } catch (err) {
      console.error(err);
      setGeneratingReport(null);
      alert('Erro ao gerar relatório.');
    }
  };

  const baseReportsList = [
    { id: 'geral', title: '📊 Relatório Geral da Obra', desc: 'Resumo executivo da obra, prazos e percentuais concluídos.', icon: <ClipboardList size={22} className="text-primary" /> },
    { id: 'financeiro', title: '💸 Relatório Financeiro', desc: `Extrato completo de receitas, saídas e saldo (${financialCount} registros).`, icon: <TrendingUp size={22} className="text-primary" /> },
    { id: 'compras', title: '🛒 Lista de Compras & Cotações', desc: `Checklist de materiais pendentes e concluídos (${shoppingCount} materiais).`, icon: <FileText size={22} className="text-primary" /> },
  ];

  if (profile?.role === 'architect' || profile?.role === 'builder') {
    baseReportsList.push(
      { id: 'fotografico', title: '📸 Relatório Fotográfico', desc: 'Evolução da obra com registro de imagens datadas.', icon: <Camera size={22} className="text-primary" /> },
      { id: 'vistoria', title: '✅ Relatório de Vistoria Técnica', desc: 'Conformidades, anomalias e orientações da visita.', icon: <ClipboardCheck size={22} className="text-primary" /> }
    );
  }

  const reportsList = baseReportsList;

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
              onClick={() => startGeneration(r.id, r.title)}
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
                  setSuccessReport(null);
                  const printWindow = window.open('', '_blank');
                  if (printWindow) {
                    printWindow.document.write(`
                      <html>
                        <head>
                          <title>${successReport}</title>
                          <style>
                            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #111; line-height: 1.6; }
                            h1 { border-bottom: 2px solid #111; padding-bottom: 10px; margin-bottom: 30px; }
                            .footer { margin-top: 50px; font-size: 12px; color: #666; text-align: center; border-top: 1px solid #ccc; padding-top: 20px; }
                            .data-box { background: #f4f4f5; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
                          </style>
                        </head>
                        <body>
                          <h1>${successReport}</h1>
                          <div class="data-box">
                            <p><strong>Referência da Obra:</strong> ${activeWorkName}</p>
                            <p><strong>Data de Emissão:</strong> ${new Date().toLocaleDateString('pt-BR')}</p>
                          </div>
                          <h3>Resumo Consolidado</h3>
                          <ul>
                            <li>Registros Financeiros Processados: ${financialCount}</li>
                            <li>Materiais na Lista de Compras: ${shoppingCount}</li>
                          </ul>
                          <p style="margin-top: 40px;">Este relatório comprova os registros salvos na plataforma até o momento. Os dados financeiros representam as entradas de despesas declaradas pelo gestor da obra.</p>
                          <div class="footer">Gerado digitalmente via App CentralObra. Obras Inteligentes.</div>
                          <script>
                            window.onload = function() { window.print(); }
                          </script>
                        </body>
                      </html>
                    `);
                    printWindow.document.close();
                  }
                }} 
                className="btn-primary" 
                style={{ fontSize: 13, gap: 6 }}
              >
                Visualizar PDF <ArrowRight size={14} />
              </button>
              <button 
                onClick={() => {
                  const text = encodeURIComponent(`Olá! Segue o ${successReport} da obra ${activeWorkName} gerado pelo app CentralObra.`);
                  window.open(`https://wa.me/?text=${text}`, '_blank');
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
