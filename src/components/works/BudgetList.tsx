import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Check, Circle, DollarSign, Package, Upload, Download } from 'lucide-react';
import { ImportBudgetModal } from './ImportBudgetModal';
import { generateBudgetPDF } from '../../utils/pdfGenerator';
import { addDoc, collection } from 'firebase/firestore';

export interface BudgetListProps {
  workId: string;
  work: any;
  user: any;
  calculations: any[];
  profile?: any;
}

export function BudgetList({ workId, work, user, calculations, profile }: BudgetListProps) {
  const [editingPrice, setEditingPrice] = useState<{ calcId: string, matIndex: number } | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const handleUpdateMaterial = async (calcId: string, materialIndex: number, field: string, value: any) => {
    const calc = calculations.find(c => c.id === calcId);
    if (!calc || !calc.resultData || !calc.resultData.materials) return;
    
    const updatedMaterials = [...calc.resultData.materials];
    updatedMaterials[materialIndex] = {
      ...updatedMaterials[materialIndex],
      [field]: value
    };
    
    // Recalculate totalCost for this calculation
    const totalCost = updatedMaterials.reduce((acc, mat) => acc + (Number(mat.quantity) * (mat.unitPrice || 0)), 0);

    try {
      const docRef = doc(db, 'works', workId, 'calculations', calcId);
      await updateDoc(docRef, {
        'resultData.materials': updatedMaterials,
        totalCost: totalCost
      });
    } catch (error) {
      console.error('Error updating material:', error);
    }
  };

  const handleImport = async (materials: any[]) => {
    try {
      const calcData = {
        calcType: 'Importação Manual',
        savedAt: new Date(),
        resultData: { materials },
        totalCost: materials.reduce((acc, mat) => acc + (mat.quantity * mat.unitPrice), 0)
      };
      await addDoc(collection(db, 'works', workId, 'calculations'), calcData);
      setIsImportModalOpen(false);
    } catch (err) {
      console.error('Failed to import', err);
    }
  };

  const handleExportPDF = () => {
    generateBudgetPDF({ work, user, calculations, profile });
  };

  const hasCalculations = calculations && calculations.length > 0;
  const hasMaterials = hasCalculations && calculations.some(c => c.resultData?.materials?.length > 0);

  if (!hasMaterials) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
        <Package size={48} style={{ margin: '0 auto 16px', opacity: 0.2 }} />
        <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-main)', marginBottom: 8 }}>Orçamento Vazio</p>
        <p style={{ fontSize: 14, marginBottom: 24 }}>Os materiais gerados pelos Assistentes Técnicos aparecerão aqui.</p>
        <button onClick={() => setIsImportModalOpen(true)} className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 8, fontWeight: 600 }}>
          <Upload size={18} />
          Importar Planilha / PDF
        </button>
        <ImportBudgetModal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} onImport={handleImport} />
      </div>
    );
  }

  // Calculate overall budget summary
  let totalEstimated = 0;
  let totalPurchased = 0;
  let itemsCount = 0;
  let purchasedCount = 0;

  calculations.forEach(calc => {
    if (calc.resultData && calc.resultData.materials) {
      calc.resultData.materials.forEach((mat: any) => {
        itemsCount++;
        const cost = Number(mat.quantity) * (mat.unitPrice || 0);
        totalEstimated += cost;
        if (mat.isPurchased) {
          purchasedCount++;
          totalPurchased += cost;
        }
      });
    }
  });

  return (
    <div style={{ padding: 20 }}>
      {/* Actions */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginBottom: 24 }}>
        <button onClick={() => setIsImportModalOpen(true)} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', borderRadius: 8, fontWeight: 600 }}>
          <Upload size={18} /> Importar
        </button>
        <button onClick={handleExportPDF} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', borderRadius: 8, fontWeight: 600 }}>
          <Download size={18} /> Exportar PDF
        </button>
      </div>

      <ImportBudgetModal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} onImport={handleImport} />

      {/* Budget Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <div className="glass-panel" style={{ padding: 16, borderRadius: 16, borderLeft: '4px solid var(--color-primary)' }}>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>Estimativa Total</p>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalEstimated)}
          </h3>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>{itemsCount} itens no total</p>
        </div>
        <div className="glass-panel" style={{ padding: 16, borderRadius: 16, borderLeft: '4px solid var(--color-success)' }}>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>Já Comprado</p>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--color-success)', margin: 0 }}>
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalPurchased)}
          </h3>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>{purchasedCount} de {itemsCount} itens</p>
        </div>
      </div>

      {/* Materials List Grouped by Calculation */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {calculations.map(calc => {
          if (!calc.resultData || !calc.resultData.materials || calc.resultData.materials.length === 0) return null;

          return (
            <div key={calc.id} className="glass-panel animate-fade-in" style={{ borderRadius: 16, overflow: 'hidden' }}>
              {/* Header */}
              <div style={{ padding: '16px 20px', backgroundColor: 'rgba(0,0,0,0.03)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>{calc.calcType}</h4>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>
                    Adicionado em {new Date(calc.savedAt?.toDate?.() || Date.now()).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(calc.totalCost || 0)}
                  </p>
                </div>
              </div>

              {/* Items */}
              <div style={{ padding: '8px 0' }}>
                {calc.resultData.materials.map((mat: any, idx: number) => {
                  const isPurchased = !!mat.isPurchased;
                  const unitPrice = mat.unitPrice || 0;
                  const lineTotal = Number(mat.quantity) * unitPrice;
                  const isEditing = editingPrice?.calcId === calc.id && editingPrice?.matIndex === idx;

                  return (
                    <div key={idx} style={{ 
                      padding: '12px 20px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 16,
                      borderBottom: idx < calc.resultData.materials.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                      opacity: isPurchased ? 0.6 : 1,
                      transition: 'all 0.2s ease'
                    }}>
                      
                      {/* Checkbox */}
                      <button 
                        onClick={() => handleUpdateMaterial(calc.id, idx, 'isPurchased', !isPurchased)}
                        style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, flexShrink: 0 }}
                      >
                        {isPurchased ? <Check size={20} color="var(--color-success)" /> : <Circle size={20} color="var(--text-muted)" />}
                      </button>

                      {/* Info */}
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-main)', margin: 0, textDecoration: isPurchased ? 'line-through' : 'none' }}>
                          {mat.name}
                        </p>
                        <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>
                          Qtd: {mat.quantity} {mat.unit}
                        </p>
                      </div>

                      {/* Price Input & Total */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                        {isEditing ? (
                          <input 
                            autoFocus
                            type="number"
                            defaultValue={unitPrice || ''}
                            placeholder="R$ 0,00"
                            className="input-premium"
                            style={{ width: 80, padding: '4px 8px', fontSize: 13, textAlign: 'right', marginBottom: 0 }}
                            onBlur={(e) => {
                              const val = parseFloat(e.target.value) || 0;
                              if (val !== unitPrice) {
                                handleUpdateMaterial(calc.id, idx, 'unitPrice', val);
                              }
                              setEditingPrice(null);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') e.currentTarget.blur();
                            }}
                          />
                        ) : (
                          <div 
                            onClick={() => !isPurchased && setEditingPrice({ calcId: calc.id, matIndex: idx })}
                            style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: isPurchased ? 'default' : 'pointer', padding: '4px 8px', backgroundColor: 'var(--bg-elevated)', borderRadius: 6, border: '1px solid var(--border-subtle)' }}
                          >
                            <DollarSign size={12} color="var(--text-muted)" />
                            <span style={{ fontSize: 13, fontWeight: unitPrice > 0 ? 600 : 400, color: unitPrice > 0 ? 'var(--text-main)' : 'var(--text-muted)' }}>
                              {unitPrice > 0 ? unitPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : 'Add Preço'}
                            </span>
                          </div>
                        )}
                        {unitPrice > 0 && (
                          <span style={{ fontSize: 11, color: 'var(--color-primary)', fontWeight: 600 }}>
                            {lineTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
