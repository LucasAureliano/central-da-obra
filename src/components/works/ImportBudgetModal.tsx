import { useState, useRef } from 'react';
import { UploadCloud, X, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';
import * as XLSX from 'xlsx';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface ImportBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (materials: any[]) => void;
}

export function ImportBudgetModal({ isOpen, onClose, onImport }: ImportBudgetModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [rawExcelData, setRawExcelData] = useState<any[][]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Upload, 2: Mapping, 3: Review
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Mapping state
  const [colName, setColName] = useState<number>(-1);
  const [colQuantity, setColQuantity] = useState<number>(-1);
  const [colPrice, setColPrice] = useState<number>(-1);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    setLoading(true);
    setError('');

    try {
      if (uploadedFile.name.endsWith('.xlsx') || uploadedFile.name.endsWith('.csv')) {
        await parseExcelAndShowMapping(uploadedFile);
      } else if (uploadedFile.name.endsWith('.pdf')) {
        const parsedMaterials = await parsePDF(uploadedFile);
        setPreviewData(parsedMaterials);
        setStep(3); // PDF goes directly to preview as we can't map columns easily
      } else {
        throw new Error('Formato não suportado. Use .xlsx, .csv ou .pdf');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao processar o arquivo.');
    } finally {
      setLoading(false);
    }
  };

  const parseExcelAndShowMapping = (file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const json: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          if (json.length < 2) {
            throw new Error('A planilha parece estar vazia ou não tem dados suficientes.');
          }

          const fileHeaders = (json[0] || []).map(h => String(h || '').trim());
          setHeaders(fileHeaders);
          setRawExcelData(json.slice(1)); // Store rows without header

          // Auto-detect columns
          let detectName = -1, detectQty = -1, detectPrice = -1;
          fileHeaders.forEach((h, index) => {
            const lowerH = h.toLowerCase();
            if (detectName === -1 && (lowerH.includes('nome') || lowerH.includes('descrição') || lowerH.includes('produto') || lowerH.includes('material'))) detectName = index;
            if (detectQty === -1 && (lowerH.includes('qtd') || lowerH.includes('quant'))) detectQty = index;
            if (detectPrice === -1 && (lowerH.includes('preço') || lowerH.includes('valor') || lowerH.includes('unit'))) detectPrice = index;
          });

          // Fallback if not detected, use 0, 1, 2
          setColName(detectName !== -1 ? detectName : (fileHeaders.length > 0 ? 0 : -1));
          setColQuantity(detectQty !== -1 ? detectQty : (fileHeaders.length > 1 ? 1 : -1));
          setColPrice(detectPrice !== -1 ? detectPrice : (fileHeaders.length > 2 ? 2 : -1));

          setStep(2); // Go to mapping step
          resolve();
        } catch (error: any) {
          reject(new Error(error.message || 'Falha ao ler o Excel. Certifique-se de que não está corrompido.'));
        }
      };
      reader.onerror = () => reject(new Error('Erro de leitura de arquivo.'));
      reader.readAsArrayBuffer(file);
    });
  };

  const handleApplyMapping = () => {
    if (colName === -1) {
      setError('Por favor, selecione a coluna correspondente ao Nome do Material.');
      return;
    }

    const materials = [];
    for (let i = 0; i < rawExcelData.length; i++) {
      const row = rawExcelData[i];
      if (!row || row.length === 0) continue;

      const name = String(row[colName] || '').trim();
      if (!name) continue;

      const quantity = (colQuantity !== -1) ? (parseFloat(row[colQuantity]) || 1) : 1;
      let price = 0;
      
      if (colPrice !== -1) {
        let rawPrice = row[colPrice];
        if (typeof rawPrice === 'string' && rawPrice.includes('R$')) {
          price = parseFloat(rawPrice.replace(/[^\d,-]/g, '').replace(',', '.')) || 0;
        } else {
          price = parseFloat(rawPrice) || 0;
        }
      }

      materials.push({
        name,
        quantity,
        unitPrice: price,
        unit: 'un', // Default
        isPurchased: false
      });
    }

    setPreviewData(materials);
    setStep(3);
    setError('');
  };

  const parsePDF = async (file: File): Promise<any[]> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        fullText += pageText + '\n';
      }

      // Fallback extremely basic parser for PDF (since it's raw text)
      // Usually fails, so we return empty or very basic split
      throw new Error('Extração de PDF é imprecisa. Por favor, suba um Excel (.xlsx) para garantir os dados ou insira manualmente.');
    } catch (err: any) {
      if (err.message.includes('imprecisa')) throw err;
      throw new Error('Falha ao processar o PDF.');
    }
  };

  const handleConfirm = () => {
    onImport(previewData);
    setStep(1);
    setPreviewData([]);
  };

  const handleBack = () => {
    setStep(1);
    setPreviewData([]);
    setError('');
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
      backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100, 
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
    }}>
      <div className="modal-content glass-panel animate-fade-in" onClick={e => e.stopPropagation()} style={{
        width: '100%', maxWidth: 600, backgroundColor: 'var(--bg-elevated)', 
        borderRadius: 24, padding: 32, position: 'relative'
      }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 24, right: 24, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
          <X size={24} />
        </button>

        <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-main)', marginBottom: 24 }}>
          Importar Orçamento
        </h2>

        {step === 1 && (
          <div>
            <p style={{ color: 'var(--text-muted)', marginBottom: 24, fontSize: 15 }}>
              Faça upload de uma planilha (Excel/CSV) ou PDF com seus itens e preços.
            </p>

            <div 
              style={{
                border: '2px dashed var(--border-subtle)', borderRadius: 16, padding: 40,
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
                backgroundColor: 'var(--bg-base)', cursor: 'pointer', transition: 'all 0.2s'
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadCloud size={48} color="var(--color-primary)" />
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontWeight: 600, color: 'var(--text-main)', margin: '0 0 4px 0' }}>Clique para selecionar o arquivo</p>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>Suporta .xlsx, .csv e .pdf</p>
              </div>
            </div>

            <input 
              type="file" 
              ref={fileInputRef}
              accept=".xlsx,.csv,.pdf" 
              style={{ display: 'none' }}
              onChange={handleFileUpload}
            />

            {loading && <p style={{ textAlign: 'center', color: 'var(--color-primary)', marginTop: 16 }}>Processando arquivo...</p>}
            {error && (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: 12, backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', borderRadius: 8, marginTop: 16 }}>
                <AlertTriangle size={18} />
                <span style={{ fontSize: 14 }}>{error}</span>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in">
            <p style={{ color: 'var(--text-muted)', marginBottom: 24, fontSize: 15 }}>
              Identificamos as colunas da sua planilha. Por favor, confirme qual coluna corresponde a cada informação para importarmos corretamente:
            </p>

            <div style={{ display: 'grid', gap: 16, marginBottom: 32 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 600, color: 'var(--text-main)' }}>Nome do Material/Serviço *</label>
                <select 
                  className="input-premium" 
                  value={colName} 
                  onChange={e => setColName(Number(e.target.value))}
                  style={{ width: '100%' }}
                >
                  <option value={-1}>Selecione a coluna...</option>
                  {headers.map((h, i) => <option key={i} value={i}>{h || `Coluna ${i+1}`}</option>)}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 600, color: 'var(--text-main)' }}>Quantidade (Opcional)</label>
                <select 
                  className="input-premium" 
                  value={colQuantity} 
                  onChange={e => setColQuantity(Number(e.target.value))}
                  style={{ width: '100%' }}
                >
                  <option value={-1}>Ignorar / Deixar como 1</option>
                  {headers.map((h, i) => <option key={i} value={i}>{h || `Coluna ${i+1}`}</option>)}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 600, color: 'var(--text-main)' }}>Preço Unitário (Opcional)</label>
                <select 
                  className="input-premium" 
                  value={colPrice} 
                  onChange={e => setColPrice(Number(e.target.value))}
                  style={{ width: '100%' }}
                >
                  <option value={-1}>Ignorar / Deixar como R$ 0,00</option>
                  {headers.map((h, i) => <option key={i} value={i}>{h || `Coluna ${i+1}`}</option>)}
                </select>
              </div>
            </div>

            {error && (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: 12, backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', borderRadius: 8, marginBottom: 16 }}>
                <AlertTriangle size={18} />
                <span style={{ fontSize: 14 }}>{error}</span>
              </div>
            )}

            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={handleBack} className="btn-secondary" style={{ flex: 1, padding: 16, borderRadius: 12, fontWeight: 600 }}>
                Voltar
              </button>
              <button onClick={handleApplyMapping} className="btn-primary" style={{ flex: 2, padding: 16, borderRadius: 12, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                Visualizar Importação
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade-in">
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: 12, backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10B981', borderRadius: 8, marginBottom: 24 }}>
              <CheckCircle2 size={18} />
              <span style={{ fontSize: 14 }}>Foram encontrados {previewData.length} itens prontos para importação.</span>
            </div>

            <div style={{ maxHeight: 300, overflowY: 'auto', backgroundColor: 'var(--bg-base)', borderRadius: 12, padding: 16, marginBottom: 24 }}>
              {previewData.slice(0, 10).map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: 600, color: 'var(--text-main)', fontSize: 14 }}>{item.name}</p>
                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 12 }}>Qtd: {item.quantity}</p>
                  </div>
                  <p style={{ margin: 0, fontWeight: 700, color: 'var(--color-primary)', fontSize: 14 }}>
                    {(item.unitPrice || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </p>
                </div>
              ))}
              {previewData.length > 10 && (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 12, marginTop: 12 }}>
                  e mais {previewData.length - 10} itens...
                </p>
              )}
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setStep(2)} className="btn-secondary" style={{ flex: 1, padding: 16, borderRadius: 12, fontWeight: 600 }}>
                Corrigir Colunas
              </button>
              <button onClick={handleConfirm} className="btn-primary" style={{ flex: 2, padding: 16, borderRadius: 12, fontWeight: 600 }}>
                Importar {previewData.length} Itens
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
