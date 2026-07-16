import React, { useRef, useState } from 'react';
import { ArrowLeft, Heart, Share2, Info, Save, FileText, Download, Copy, FolderPlus, ListChecks, Check, Calculator } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useAuth } from '../../contexts/AuthContext';
import { useAuthModal } from '../../contexts/AuthModalContext';
import { db } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { SelectWorkModal } from './SelectWorkModal';
import { useWorks } from '../../contexts/WorksContext';

export type CalcResultItem = {
  label: string;
  value: string | number;
  unit?: string;
  highlight?: boolean;
};

export type CalcMaterial = {
  name: string;
  quantity: string | number;
  unit: string;
};

export interface BaseCalculatorProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  tip?: string;
  structuralWarning?: boolean;
  onBack: () => void;
  children: React.ReactNode; // The form inputs
  results?: {
    mainMetrics: CalcResultItem[];
    materials: CalcMaterial[];
    observations?: string[];
  } | null;
}

const resultContainerVariants: any = {
  hidden: { opacity: 0, height: 0 },
  show: {
    opacity: 1,
    height: 'auto',
    transition: {
      duration: 0.4,
      staggerChildren: 0.1
    }
  }
};

const resultItemVariants: any = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export function BaseCalculatorLayout({
  title,
  description,
  icon,
  tip,
  structuralWarning,
  onBack,
  children,
  results
}: BaseCalculatorProps) {
  const resultRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);
  const { user, isGuest } = useAuth();
  const { triggerGuestAlert } = useAuthModal();
  const { activeWork } = useWorks();
  
  const [prices, setPrices] = useState<Record<string, number>>({});

  
  // Generic Save
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Save to Work
  const [isWorkModalOpen, setIsWorkModalOpen] = useState(false);
  const [isSavingToWork, setIsSavingToWork] = useState(false);
  const [saveWorkSuccess, setSaveWorkSuccess] = useState(false);

  // Add to Shopping List
  const [isAddingShopping, setIsAddingShopping] = useState(false);
  const [addShoppingSuccess, setAddShoppingSuccess] = useState(false);

  const handleSaveGeneric = async () => {
    if (isGuest || !user) {
      triggerGuestAlert();
      return;
    }
    setIsSaving(true);
    try {
      await addDoc(collection(db, 'calculations'), {
        userId: user.uid,
        calcType: title,
        resultData: results,
        savedAt: serverTimestamp()
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (error) {
      console.error('Error saving calculation', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveToWork = async (workId: string) => {
    if (!user || !results) return;
    
    setIsWorkModalOpen(false);
    setIsSavingToWork(true);
    try {
      // Calculate total cost at the moment of saving
      const totalCost = results.materials.reduce((acc, mat) => {
        const price = prices[mat.name] || 0;
        return acc + (Number(mat.quantity) * price);
      }, 0);

      // Inject prices and purchased state into materials before saving
      const enrichedResults = {
        ...results,
        materials: results.materials.map(mat => ({
          ...mat,
          unitPrice: prices[mat.name] || 0,
          isPurchased: false
        }))
      };

      // Save it under works/{workId}/calculations
      await addDoc(collection(db, 'works', workId, 'calculations'), {
        calcType: title,
        resultData: enrichedResults,
        totalCost: totalCost,
        savedAt: serverTimestamp()
      });
      setSaveWorkSuccess(true);
      setTimeout(() => setSaveWorkSuccess(false), 2000);
    } catch (error) {
      console.error('Error saving calculation to work', error);
    } finally {
      setIsSavingToWork(false);
    }
  };

  const openWorkSelection = () => {
    if (isGuest || !user) {
      triggerGuestAlert();
      return;
    }
    setIsWorkModalOpen(true);
  };

  const handleAddToShopping = async () => {
    if (isGuest || !user) {
      triggerGuestAlert();
      return;
    }
    if (!results) return;
    if (!activeWork) {
      alert("Por favor, selecione uma obra ativa para adicionar à lista de compras da obra.");
      return;
    }

    setIsAddingShopping(true);
    try {
      const promises = results.materials.map(mat => {
        const price = prices[mat.name] || 0;
        return addDoc(collection(db, 'works', activeWork.id, 'shopping'), {
          name: mat.name,
          quantity: mat.quantity,
          unit: mat.unit,
          unitPrice: price,
          isPurchased: false,
          addedAt: serverTimestamp()
        });
      });
      await Promise.all(promises);
      
      setAddShoppingSuccess(true);
      setTimeout(() => setAddShoppingSuccess(false), 2000);
    } catch (error) {
      console.error('Error adding to shopping list', error);
    } finally {
      setIsAddingShopping(false);
    }
  };

  const generatePDF = async () => {
    if (!resultRef.current) return;
    setIsGeneratingPDF(true);
    try {
      const canvas = await html2canvas(resultRef.current, {
        scale: 2,
        backgroundColor: '#1A1A1A', // Dark theme background
        useCORS: true
      });
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Relatorio_${title.replace(/\s+/g, '_')}.pdf`);
      
      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 2000);
    } catch (error) {
      console.error('Error generating PDF', error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="screen-content" 
      style={{ padding: '0 20px', paddingTop: 24, paddingBottom: 120 }}
    >
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          <ArrowLeft size={20} /> Voltar
        </button>
        <div style={{ display: 'flex', gap: 12 }}>
          <button style={{ width: 40, height: 40, borderRadius: 20, border: 'none', background: 'var(--bg-glass)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            <Heart size={20} />
          </button>
          <button style={{ width: 40, height: 40, borderRadius: 20, border: 'none', background: 'var(--bg-glass)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            <Share2 size={20} />
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
        {icon && (
          <div style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: 'var(--color-primary-alpha)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
            {icon}
          </div>
        )}
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-main)', marginBottom: 4 }}>{title}</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.4 }}>{description}</p>
        </div>
      </div>

      {tip && (
        <div className="glass-panel" style={{ padding: 16, borderRadius: 16, marginBottom: 24, display: 'flex', gap: 12, backgroundColor: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.1)' }}>
          <Info size={20} color="#3B82F6" style={{ flexShrink: 0 }} />
          <p style={{ fontSize: 13, color: 'var(--text-main)', lineHeight: 1.5 }}>
            <strong style={{ color: '#3B82F6' }}>Dica Técnica:</strong> {tip}
          </p>
        </div>
      )}

      {structuralWarning && (
        <div className="glass-panel" style={{ padding: 16, borderRadius: 16, marginBottom: 24, display: 'flex', gap: 12, backgroundColor: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
          <Info size={20} color="#EF4444" style={{ flexShrink: 0 }} />
          <p style={{ fontSize: 13, color: 'var(--text-main)', lineHeight: 1.5 }}>
            <strong style={{ color: '#EF4444' }}>Aviso Importante:</strong> Esta calculadora fornece estimativas de referência e não substitui de forma alguma o projeto estrutural elaborado por um engenheiro calculista habilitado.
          </p>
        </div>
      )}

      {/* INPUTS (Children) */}
      <div style={{ marginBottom: 32 }}>
        {children}
      </div>

      {/* RESULTS */}
      <AnimatePresence>
        {results && (
          <motion.div 
            variants={resultContainerVariants}
            initial="hidden"
            animate="show"
            exit="hidden"
            style={{ marginTop: 40, overflow: 'hidden' }}
          >
            <motion.h2 variants={resultItemVariants} style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-main)', marginBottom: 16 }}>Resultado do Cálculo</motion.h2>
            
            <motion.div variants={resultItemVariants} ref={resultRef} className="glass-panel" style={{ padding: 20, borderRadius: 24, marginBottom: 24 }}>
              
              {/* BRANDING HEADER - Visible in PDF and on screen as a nice touch */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Calculator size={16} color="#FFF" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>CentralObra</h3>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0 }}>Relatório Técnico de Materiais</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-primary)', margin: 0 }}>{title}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0 }}>{new Date().toLocaleDateString('pt-BR')}</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                {results.mainMetrics.map((metric, i) => (
                  <div key={i} style={{ padding: 12, backgroundColor: metric.highlight ? 'var(--color-primary-alpha)' : 'var(--bg-input-glass)', borderRadius: 12, border: metric.highlight ? '1px solid var(--color-primary)' : '1px solid transparent' }}>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>{metric.label}</p>
                    <p style={{ fontSize: 18, fontWeight: 700, color: metric.highlight ? 'var(--color-primary)' : 'var(--text-main)' }}>
                      {metric.value} <span style={{ fontSize: 14, fontWeight: 500 }}>{metric.unit}</span>
                    </p>
                  </div>
                ))}
              </div>

              {/* ESTIMATED TOTAL COST */}
              {(() => {
                const totalCost = results.materials.reduce((acc, mat) => {
                  const price = prices[mat.name] || 0;
                  return acc + (Number(mat.quantity) * price);
                }, 0);
                if (totalCost > 0) {
                  return (
                    <div style={{ marginBottom: 24, padding: 16, borderRadius: 16, background: 'linear-gradient(135deg, var(--color-primary), #60A5FA)', color: '#FFF' }}>
                      <p style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4, opacity: 0.9 }}>Custo Total Estimado</p>
                      <h3 style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalCost)}
                      </h3>
                    </div>
                  );
                }
                return null;
              })()}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, borderBottom: '1px solid var(--border-subtle)', paddingBottom: 8 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>Lista de Materiais</h3>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Preço Unit. (R$)</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                {results.materials.map((mat, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: 14, color: 'var(--text-muted)', display: 'block' }}>{mat.name}</span>
                      <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-main)' }}>{mat.quantity} {mat.unit}</span>
                    </div>
                    <input 
                      type="number" 
                      placeholder="0,00"
                      className="input-premium"
                      style={{ width: 80, padding: '8px 12px', fontSize: 14, textAlign: 'right', marginBottom: 0 }}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        setPrices(prev => ({ ...prev, [mat.name]: val }));
                      }}
                    />
                  </div>
                ))}
              </div>
              {results.observations && results.observations.length > 0 && (
                <div style={{ backgroundColor: 'rgba(255,165,0,0.05)', padding: 16, borderRadius: 12, border: '1px solid rgba(255,165,0,0.2)' }}>
                  <h4 style={{ fontSize: 12, fontWeight: 700, color: '#F59E0B', marginBottom: 8, textTransform: 'uppercase' }}>Observações</h4>
                  <ul style={{ paddingLeft: 16, margin: 0, color: 'var(--text-muted)', fontSize: 12, lineHeight: 1.5 }}>
                    {results.observations.map((obs, i) => <li key={i}>{obs}</li>)}
                  </ul>
                </div>
              )}
            </motion.div>

            {/* ACTIONS */}
            <motion.div variants={resultItemVariants}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 12, paddingLeft: 8 }}>Ações Rápidas</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <ActionButton 
                  icon={isSaving ? <div style={{width:16,height:16,border:'2px solid #fff',borderTopColor:'transparent',borderRadius:'50%',animation:'spin 1s linear infinite'}}/> : (saveSuccess ? <Check size={18} /> : <Save size={18} />)} 
                  label={isSaving ? "Salvando..." : (saveSuccess ? "Salvo!" : "Salvar Histórico")} 
                  onClick={handleSaveGeneric} 
                />
                <ActionButton 
                  icon={isSavingToWork ? <div style={{width:16,height:16,border:'2px solid #fff',borderTopColor:'transparent',borderRadius:'50%',animation:'spin 1s linear infinite'}}/> : (saveWorkSuccess ? <Check size={18} /> : <FolderPlus size={18} />)} 
                  label={isSavingToWork ? "Salvando..." : (saveWorkSuccess ? "Salvo na Obra!" : "Add à Obra")} 
                  primary 
                  onClick={openWorkSelection}
                />
                <ActionButton 
                  icon={isAddingShopping ? <div style={{width:16,height:16,border:'2px solid var(--text-main)',borderTopColor:'transparent',borderRadius:'50%',animation:'spin 1s linear infinite'}}/> : (addShoppingSuccess ? <Check size={18} /> : <ListChecks size={18} />)} 
                  label={isAddingShopping ? "Adicionando..." : (addShoppingSuccess ? "Adicionado!" : "Add Lista Compras")} 
                  onClick={handleAddToShopping}
                />
                <ActionButton 
                  icon={pdfSuccess ? <Check size={18} /> : (isGeneratingPDF ? <div style={{width:16,height:16,border:'2px solid #fff',borderTopColor:'transparent',borderRadius:'50%',animation:'spin 1s linear infinite'}}/> : <FileText size={18} />)} 
                  label={pdfSuccess ? "PDF Gerado" : (isGeneratingPDF ? "Gerando..." : "Gerar PDF")} 
                  onClick={generatePDF} 
                />
                <ActionButton icon={<Download size={18} />} label="Planilha Excel" />
                <ActionButton icon={<Copy size={18} />} label="Duplicar" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <SelectWorkModal 
        isOpen={isWorkModalOpen} 
        onClose={() => setIsWorkModalOpen(false)} 
        onSelect={handleSaveToWork} 
      />
    </motion.div>
  );
}

function ActionButton({ icon, label, primary, onClick }: { icon: React.ReactNode, label: string, primary?: boolean, onClick?: () => void }) {
  return (
    <motion.button 
      whileHover={{ scale: 0.98, translateY: -1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="btn-action" 
      style={{
        border: primary ? 'none' : '1px solid var(--border-strong)',
        backgroundColor: primary ? 'var(--color-primary)' : 'var(--bg-glass)',
        color: primary ? '#fff' : 'var(--text-main)',
      }}
    >
      {icon}
      <span style={{ fontSize: 12, fontWeight: 600, textAlign: 'center' }}>{label}</span>
    </motion.button>
  );
}
