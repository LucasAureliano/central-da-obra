import { useState } from 'react';
import { ArrowLeft, Check, Grid, Droplet, Paintbrush, Layers, ChevronRight, Calculator, Loader2, Wallet, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useWorks } from '../../contexts/WorksContext';
import { db } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export function MaterialWizard({ onBack, onNavigate }: { onBack: () => void, onNavigate: (tab: string) => void }) {
  const { user } = useAuth();
  const { activeWork } = useWorks();
  
  const [step, setStep] = useState(1);
  const [calcType, setCalcType] = useState('');
  const [dimensions, setDimensions] = useState({ length: '', width: '', height: '', area: '' });
  const [quality, setQuality] = useState('');
  
  const [results, setResults] = useState<any[]>([]);
  const [totalCost, setTotalCost] = useState(0);

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleCalculate = () => {
    setStep(4);
    setStep(4);
    
    setTimeout(() => {
      let mats: any[] = [];
      let total = 0;
      
      const l = parseFloat(dimensions.length) || 0;
      const w = parseFloat(dimensions.width) || 0;
      const h = parseFloat(dimensions.height) || 0;
      const a = parseFloat(dimensions.area) || 0;
      
      const qMult = quality === 'Básico' ? 1 : quality === 'Intermediário' ? 1.5 : 2.5;

      if (calcType === 'Concreto') {
        const vol = (l * w * h) || 1;
        if (quality === 'Premium') {
          mats = [{ name: 'Concreto Usinado FCK 30', quantity: vol.toFixed(1), unit: 'm³', price: 450 }];
        } else {
          mats = [
            { name: 'Cimento Portland 50kg', quantity: Math.ceil(vol * 7), unit: 'sacos', price: 35 * qMult },
            { name: 'Areia Média', quantity: (vol * 0.8).toFixed(1), unit: 'm³', price: 120 },
            { name: 'Brita 1', quantity: (vol * 0.6).toFixed(1), unit: 'm³', price: 110 }
          ];
          if (quality === 'Intermediário') {
            mats.push({ name: 'Aditivo Plastificante', quantity: Math.ceil(vol * 2), unit: 'L', price: 15 });
          }
        }
      } else if (calcType === 'Pintura') {
        const areaPaint = a || (l * h);
        const latas = Math.ceil(areaPaint / 50); // 50m2 per 18L
        mats = [{ name: `Tinta Acrílica ${quality}`, quantity: latas, unit: 'latas 18L', price: 150 * qMult }];
        if (quality !== 'Básico') {
          mats.push({ name: 'Selador Acrílico', quantity: Math.ceil(latas / 2), unit: 'latas 18L', price: 90 * qMult });
          if (quality === 'Premium') {
            mats.push({ name: 'Massa Corrida', quantity: Math.ceil(areaPaint / 15), unit: 'barricas 25kg', price: 60 });
          }
        }
      } else if (calcType === 'Piso') {
        const areaPiso = a || (l * w);
        const caixas = Math.ceil((areaPiso * 1.1) / 2); // 2m2 per box + 10% loss
        const argamassa = Math.ceil(areaPiso / 4); // 4m2 per sack
        if (quality === 'Básico') {
          mats = [
            { name: 'Cerâmica PEI 3', quantity: caixas, unit: 'caixas', price: 40 },
            { name: 'Argamassa AC1', quantity: argamassa, unit: 'sacos 20kg', price: 12 }
          ];
        } else if (quality === 'Intermediário') {
          mats = [
            { name: 'Porcelanato Esmaltado', quantity: caixas, unit: 'caixas', price: 90 },
            { name: 'Argamassa AC2', quantity: argamassa, unit: 'sacos 20kg', price: 25 },
            { name: 'Rejunte Acrílico', quantity: Math.ceil(areaPiso / 10), unit: 'kg', price: 15 }
          ];
        } else {
          mats = [
            { name: 'Porcelanato Retificado Grandes Formatos', quantity: caixas, unit: 'caixas', price: 180 },
            { name: 'Argamassa AC3', quantity: argamassa, unit: 'sacos 20kg', price: 45 },
            { name: 'Rejunte Epóxi', quantity: Math.ceil(areaPiso / 8), unit: 'kg', price: 65 }
          ];
        }
      } else if (calcType === 'Alvenaria') {
        const areaAlv = a || (l * h);
        const blocos = Math.ceil(areaAlv * 25 * 1.1); // 25 per m2 + 10%
        if (quality === 'Básico') {
          mats = [
            { name: 'Bloco Cerâmico 9x19x19', quantity: blocos, unit: 'un', price: 1.2 },
            { name: 'Cimento 50kg', quantity: Math.ceil(areaAlv / 10), unit: 'sacos', price: 35 },
            { name: 'Areia Média', quantity: (areaAlv * 0.03).toFixed(2), unit: 'm³', price: 120 }
          ];
        } else if (quality === 'Intermediário') {
          mats = [
            { name: 'Bloco de Concreto Estrutural', quantity: blocos, unit: 'un', price: 2.5 },
            { name: 'Argamassa Pronta para Assentamento', quantity: Math.ceil(areaAlv / 2), unit: 'sacos 20kg', price: 18 }
          ];
        } else {
          mats = [
            { name: 'Bloco Celular Autoclavado', quantity: Math.ceil(areaAlv * 7 * 1.05), unit: 'un', price: 8.5 },
            { name: 'Argamassa Polimérica (Cola)', quantity: Math.ceil(areaAlv * 1.5), unit: 'kg', price: 12 }
          ];
        }
      }

      mats.forEach(m => { total += m.quantity * m.price; });
      setResults(mats);
      setTotalCost(total);
      setStep(5);
      setStep(5);
    }, 2000);
  };

  const handleSaveToShopping = async () => {
    if (!user || !activeWork) return;
    setIsSaving(true);
    try {
      // Salva como cálculo para aparecer no Shopping
      await addDoc(collection(db, 'works', activeWork.id, 'calculations'), {
        calcType: `Assistente: ${calcType} ${quality}`,
        resultData: {
          materials: results.map(m => ({
            name: m.name,
            quantity: m.quantity,
            unit: m.unit,
            unitPrice: m.price,
            isPurchased: false
          }))
        },
        totalCost: totalCost,
        savedAt: serverTimestamp()
      });
      setSaveSuccess('shopping');
      setTimeout(() => { onNavigate('compras'); }, 1500);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveToFinance = async () => {
    if (!user || !activeWork) return;
    setIsSaving(true);
    try {
      // Salva direto como despesa pendente
      const promises = results.map(m => {
        return addDoc(collection(db, 'works', activeWork.id, 'expenses'), {
          title: m.name,
          amount: Number(m.quantity) * m.price,
          category: 'Materiais',
          status: 'Pendente',
          date: serverTimestamp(),
          workId: activeWork.id,
          createdAt: serverTimestamp()
        });
      });
      await Promise.all(promises);
      setSaveSuccess('finance');
      setTimeout(() => { onNavigate('financeiro'); }, 1500);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="animate-fade-in">
            <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-main)', marginBottom: 24 }}>Qual o tipo de projeto?</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                { id: 'Concreto', icon: <Droplet size={32} />, desc: 'Traço, Fundações, Lajes' },
                { id: 'Pintura', icon: <Paintbrush size={32} />, desc: 'Paredes, Tetos, Texturas' },
                { id: 'Piso', icon: <Grid size={32} />, desc: 'Cerâmica, Porcelanato' },
                { id: 'Alvenaria', icon: <Layers size={32} />, desc: 'Muros e Paredes' }
              ].map(opt => (
                <button 
                  key={opt.id}
                  onClick={() => { setCalcType(opt.id); nextStep(); }}
                  className="glass-panel card-premium-interactive"
                  style={{
                    padding: 24, borderRadius: 24, textAlign: 'left', display: 'flex', flexDirection: 'column',
                    border: calcType === opt.id ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                    backgroundColor: calcType === opt.id ? 'var(--color-primary-alpha)' : 'var(--bg-surface)'
                  }}
                >
                  <div style={{ color: calcType === opt.id ? 'var(--color-primary)' : 'var(--text-muted)', marginBottom: 16 }}>{opt.icon}</div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-main)', marginBottom: 4 }}>{opt.id}</h3>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="animate-fade-in">
            <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-main)', marginBottom: 8 }}>Dimensões</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Informe as medidas para {calcType.toLowerCase()}.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
              {calcType === 'Concreto' ? (
                <>
                  <div className="input-group">
                    <label>Comprimento (m)</label>
                    <input type="number" value={dimensions.length} onChange={e=>setDimensions({...dimensions, length: e.target.value})} className="input-premium" placeholder="Ex: 5.0" />
                  </div>
                  <div className="input-group">
                    <label>Largura (m)</label>
                    <input type="number" value={dimensions.width} onChange={e=>setDimensions({...dimensions, width: e.target.value})} className="input-premium" placeholder="Ex: 4.0" />
                  </div>
                  <div className="input-group">
                    <label>Altura / Espessura (m)</label>
                    <input type="number" value={dimensions.height} onChange={e=>setDimensions({...dimensions, height: e.target.value})} className="input-premium" placeholder="Ex: 0.15" />
                  </div>
                </>
              ) : (
                <>
                  <div className="input-group">
                    <label>Área Total Já Calculada (m²)</label>
                    <input type="number" value={dimensions.area} onChange={e=>setDimensions({...dimensions, area: e.target.value})} className="input-premium" placeholder="Ex: 40" />
                  </div>
                  <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>OU informe as medidas:</div>
                  <div style={{ display: 'flex', gap: 16 }}>
                    <div className="input-group" style={{ flex: 1 }}>
                      <label>Comprimento (m)</label>
                      <input type="number" value={dimensions.length} onChange={e=>setDimensions({...dimensions, length: e.target.value})} className="input-premium" placeholder="Ex: 5.0" />
                    </div>
                    <div className="input-group" style={{ flex: 1 }}>
                      <label>{calcType === 'Piso' ? 'Largura' : 'Altura'} (m)</label>
                      <input type="number" value={calcType === 'Piso' ? dimensions.width : dimensions.height} onChange={e=>setDimensions({...dimensions, [calcType === 'Piso' ? 'width' : 'height']: e.target.value})} className="input-premium" placeholder="Ex: 2.8" />
                    </div>
                  </div>
                </>
              )}
            </div>
            
            <button 
              className="btn-primary" 
              style={{ width: '100%', padding: 16, borderRadius: 16, fontSize: 16 }}
              onClick={nextStep}
              disabled={!dimensions.area && (!dimensions.length || (!dimensions.width && !dimensions.height))}
            >
              Avançar <ChevronRight size={20} />
            </button>
          </div>
        );
      case 3:
        return (
          <div className="animate-fade-in">
            <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-main)', marginBottom: 8 }}>Qualidade e Acabamento</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Selecione o padrão desejado para o material.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
              {['Básico', 'Intermediário', 'Premium'].map(q => (
                <button 
                  key={q}
                  onClick={() => setQuality(q)}
                  className="glass-panel card-premium-interactive"
                  style={{
                    padding: 20, borderRadius: 16, textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    border: quality === q ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                    backgroundColor: quality === q ? 'var(--color-primary-alpha)' : 'var(--bg-surface)'
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: quality === q ? 'var(--color-primary)' : 'var(--text-main)' }}>Padrão {q}</h3>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                      {q === 'Básico' ? 'Foco em economia e custo-benefício.' : q === 'Intermediário' ? 'Equilíbrio entre qualidade e preço.' : 'Materiais de alta performance e durabilidade.'}
                    </p>
                  </div>
                  {quality === q && <Check size={24} color="var(--color-primary)" />}
                </button>
              ))}
            </div>

            <button 
              className="btn-primary" 
              style={{ width: '100%', padding: 16, borderRadius: 16, fontSize: 16 }}
              onClick={handleCalculate}
              disabled={!quality}
            >
              Calcular Materiais <Calculator size={20} />
            </button>
          </div>
        );
      case 4:
        return (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '50vh', textAlign: 'center' }}>
            <Loader2 size={48} color="var(--color-primary)" style={{ animation: 'spin 1s linear infinite', marginBottom: 24 }} />
            <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-main)', marginBottom: 8 }}>Processando Cálculo</h2>
            <p style={{ color: 'var(--text-muted)' }}>Analisando dimensões e ajustando parâmetros para qualidade {quality}...</p>
          </div>
        );
      case 5:
        return (
          <div className="animate-fade-in">
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <div style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Check size={32} />
              </div>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-main)' }}>Cálculo Concluído</h2>
              <p style={{ color: 'var(--text-muted)' }}>Lista de materiais necessários gerada.</p>
            </div>

            <div className="glass-panel" style={{ padding: 24, borderRadius: 24, marginBottom: 32 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', marginBottom: 16 }}>Materiais Estimados</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                {results.map((r, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, borderBottom: '1px solid var(--border-subtle)' }}>
                    <div>
                      <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-main)', display: 'block' }}>{r.name}</span>
                      <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{r.quantity} {r.unit}</span>
                    </div>
                    <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-main)' }}>
                      R$ {(r.quantity * r.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: 'var(--color-primary-alpha)', borderRadius: 12 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-primary)' }}>Custo Total Estimado</span>
                <span style={{ fontSize: 20, fontWeight: 800, color: 'var(--color-primary)' }}>
                  R$ {totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <button 
              className="btn-primary" 
              style={{ width: '100%', padding: 16, borderRadius: 16, fontSize: 16 }}
              onClick={nextStep}
            >
              Avançar para Ações <ChevronRight size={20} />
            </button>
          </div>
        );
      case 6:
        return (
          <div className="animate-fade-in">
            <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-main)', marginBottom: 8 }}>O que deseja fazer?</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: 32 }}>Converta o resultado em uma ação prática para a sua obra.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <button 
                onClick={handleSaveToShopping}
                disabled={isSaving}
                className="glass-panel card-premium-interactive"
                style={{ padding: 24, borderRadius: 24, display: 'flex', alignItems: 'center', gap: 16, textAlign: 'left', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}
              >
                <div style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: 'var(--color-primary-alpha)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
                  {saveSuccess === 'shopping' ? <Check size={24} /> : <ShoppingCart size={24} />}
                </div>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-main)', marginBottom: 4 }}>Adicionar à Lista de Compras</h3>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Acompanhe os itens que faltam comprar.</p>
                </div>
              </button>

              <button 
                onClick={handleSaveToFinance}
                disabled={isSaving}
                className="glass-panel card-premium-interactive"
                style={{ padding: 24, borderRadius: 24, display: 'flex', alignItems: 'center', gap: 16, textAlign: 'left', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}
              >
                <div style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: 'var(--color-warning-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-warning)' }}>
                  {saveSuccess === 'finance' ? <Check size={24} /> : <Wallet size={24} />}
                </div>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-main)', marginBottom: 4 }}>Lançar como Despesa Pendente</h3>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Agende o pagamento no seu financeiro.</p>
                </div>
              </button>
            </div>
            
            <div style={{ marginTop: 32, textAlign: 'center' }}>
              <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 14, fontWeight: 600, cursor: 'pointer', padding: 12 }}>
                Cancelar e Fechar Assistente
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="screen-content" style={{ padding: '24px 20px 0 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        {step > 1 && step < 4 && (
          <button onClick={prevStep} style={{ background: 'var(--bg-elevated)', border: 'none', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-main)', cursor: 'pointer' }}>
            <ArrowLeft size={20} />
          </button>
        )}
        {step === 1 && (
          <button onClick={onBack} style={{ background: 'var(--bg-elevated)', border: 'none', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-main)', cursor: 'pointer' }}>
            <ArrowLeft size={20} />
          </button>
        )}
        <div style={{ flex: 1, height: 6, backgroundColor: 'var(--bg-elevated)', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${(step / 6) * 100}%`, backgroundColor: 'var(--color-primary)', transition: 'width 0.3s ease-out' }} />
        </div>
        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)' }}>{step} de 6</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
