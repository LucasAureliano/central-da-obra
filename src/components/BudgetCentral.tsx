import { useState, useEffect } from 'react';
import { ArrowLeft, Printer, Building2 } from 'lucide-react';
import { collection, query, where, onSnapshot, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

interface BudgetCentralProps {
  onBack: () => void;
}

export function BudgetCentral({ onBack }: BudgetCentralProps) {
  const { user } = useAuth();
  const [works, setWorks] = useState<any[]>([]);
  const [selectedWork, setSelectedWork] = useState<any | null>(null);
  const [calculations, setCalculations] = useState<any[]>([]);
  
  const [laborCost, setLaborCost] = useState<string>('');
  const [equipmentCost, setEquipmentCost] = useState<string>('');
  const [bdiPercent, setBdiPercent] = useState<string>('0');
  const [discount, setDiscount] = useState<string>('');

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'works'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setWorks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [user]);

  const handleSelectWork = async (work: any) => {
    setSelectedWork(work);
    // Fetch calculations for this work
    const calcsSnap = await getDocs(collection(db, `works/${work.id}/calculations`));
    setCalculations(calcsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const materialTotal = calculations.reduce((acc, curr) => acc + (curr.totalCost || 0), 0);
  const parseAmount = (val: string) => parseFloat(val.replace(',', '.')) || 0;
  
  const vLabor = parseAmount(laborCost);
  const vEquipment = parseAmount(equipmentCost);
  const vDiscount = parseAmount(discount);
  const vBDI = parseAmount(bdiPercent);

  const subTotal = materialTotal + vLabor + vEquipment;
  const bdiAmount = subTotal * (vBDI / 100);
  const grandTotal = subTotal + bdiAmount - vDiscount;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="screen-content animate-fade-in" style={{ paddingBottom: 100 }}>
      {/* Header (Hide on print) */}
      <div className="no-print" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid var(--border-subtle)', position: 'sticky', top: 0, backgroundColor: 'var(--bg-main)', zIndex: 10 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }}>
          <ArrowLeft size={24} />
        </button>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-main)' }}>Central de Orçamentos</h2>
      </div>

      <div style={{ padding: 20 }}>
        
        {/* Work Selection (Hide on print if not selected, or just keep as select) */}
        {!selectedWork ? (
          <div className="no-print">
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', marginBottom: 16 }}>Selecione a Obra</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {works.map(work => (
                <div key={work.id} onClick={() => handleSelectWork(work)} className="glass-panel card-premium-interactive" style={{ padding: 16, borderRadius: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Building2 size={24} color="var(--color-primary)" />
                  <div>
                    <h4 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)' }}>{work.name}</h4>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Cliente: {work.client || 'Não informado'}</p>
                  </div>
                </div>
              ))}
              {works.length === 0 && (
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 20 }}>Nenhuma obra cadastrada.</p>
              )}
            </div>
          </div>
        ) : (
          <div className="print-area">
            {/* Header / Logo for Print */}
            <div style={{ textAlign: 'center', marginBottom: 32, paddingBottom: 16, borderBottom: '2px solid var(--color-primary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Building2 size={24} color="#FFF" />
                </div>
                <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-main)' }}>Orçamento Profissional</h1>
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-main)' }}>Obra: {selectedWork.name}</h2>
              <p style={{ color: 'var(--text-muted)' }}>Cliente: {selectedWork.client || 'Não informado'} | Data: {new Date().toLocaleDateString('pt-BR')}</p>
            </div>

            {/* Calculations List */}
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', marginBottom: 12, borderBottom: '1px solid var(--border-subtle)', paddingBottom: 8 }}>1. Materiais (Cálculos Salvos)</h3>
              {calculations.length > 0 ? (
                calculations.map(calc => (
                  <div key={calc.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px dashed var(--border-subtle)' }}>
                    <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>{calc.calcType || 'Geral'}</span>
                    <span style={{ color: 'var(--text-muted)' }}>R$ {(calc.totalCost || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                ))
              ) : (
                <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: 14 }}>Nenhum material salvo nesta obra.</p>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', fontWeight: 700, color: 'var(--text-main)' }}>
                <span>Subtotal Materiais</span>
                <span>R$ {materialTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            {/* Additional Costs (Inputs for screen, static text for print) */}
            <div style={{ marginBottom: 32 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', marginBottom: 12, borderBottom: '1px solid var(--border-subtle)', paddingBottom: 8 }}>2. Custos Adicionais</h3>
              
              <div style={{ display: 'grid', gap: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>Mão de Obra (R$)</span>
                  <input type="number" value={laborCost} onChange={e => setLaborCost(e.target.value)} className="input-premium no-print" placeholder="0.00" style={{ width: 120, textAlign: 'right' }} />
                  <span className="print-only" style={{ display: 'none' }}>R$ {vLabor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>Equipamentos / Frete (R$)</span>
                  <input type="number" value={equipmentCost} onChange={e => setEquipmentCost(e.target.value)} className="input-premium no-print" placeholder="0.00" style={{ width: 120, textAlign: 'right' }} />
                  <span className="print-only" style={{ display: 'none' }}>R$ {vEquipment.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>

            {/* Taxes and Discounts */}
            <div style={{ marginBottom: 32 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', marginBottom: 12, borderBottom: '1px solid var(--border-subtle)', paddingBottom: 8 }}>3. Taxas e Descontos</h3>
              
              <div style={{ display: 'grid', gap: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>BDI (%) - Lucro/Indiretos</span>
                  <input type="number" value={bdiPercent} onChange={e => setBdiPercent(e.target.value)} className="input-premium no-print" placeholder="0" style={{ width: 120, textAlign: 'right' }} />
                  <span className="print-only" style={{ display: 'none' }}>{vBDI}% (R$ {bdiAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })})</span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--color-danger)', fontWeight: 500 }}>Descontos (R$)</span>
                  <input type="number" value={discount} onChange={e => setDiscount(e.target.value)} className="input-premium no-print" placeholder="0.00" style={{ width: 120, textAlign: 'right', color: 'var(--color-danger)' }} />
                  <span className="print-only" style={{ display: 'none', color: 'var(--color-danger)' }}>- R$ {vDiscount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>

            {/* Grand Total */}
            <div style={{ backgroundColor: 'var(--bg-elevated)', padding: 20, borderRadius: 16, border: '2px solid var(--color-primary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-main)' }}>VALOR TOTAL</span>
                <span style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-primary)' }}>
                  R$ {grandTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <style>{`
              @media print {
                body * {
                  visibility: hidden;
                }
                .print-area, .print-area * {
                  visibility: visible;
                }
                .print-area {
                  position: absolute;
                  left: 0;
                  top: 0;
                  width: 100%;
                  padding: 20mm;
                }
                .no-print {
                  display: none !important;
                }
                .print-only {
                  display: block !important;
                }
              }
            `}</style>

            {/* Actions (Hide on print) */}
            <div className="no-print" style={{ display: 'flex', gap: 12, marginTop: 32 }}>
              <button 
                className="btn-primary" 
                onClick={handlePrint}
                style={{ flex: 1, padding: 16, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
              >
                <Printer size={20} />
                Gerar PDF / Imprimir
              </button>
              
              <button 
                onClick={() => setSelectedWork(null)}
                style={{ padding: 16, borderRadius: 16, backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)', fontWeight: 600, cursor: 'pointer' }}
              >
                Trocar Obra
              </button>
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
}
