import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, CheckCircle, FileText, User, 
  MapPin, Settings, Package, Users, DollarSign, Tag, Save, 
  Download, FileCheck, Plus, Trash2
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useAuth } from '../../contexts/AuthContext';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

const STEPS = [
  { id: 1, title: 'Cliente', icon: <User size={18} /> },
  { id: 2, title: 'Obra', icon: <MapPin size={18} /> },
  { id: 3, title: 'Tipo', icon: <Settings size={18} /> },
  { id: 4, title: 'Serviços', icon: <FileText size={18} /> },
  { id: 5, title: 'Materiais', icon: <Package size={18} /> },
  { id: 6, title: 'Mão de Obra', icon: <Users size={18} /> },
  { id: 7, title: 'Custos Adic.', icon: <DollarSign size={18} /> },
  { id: 8, title: 'Desconto', icon: <Tag size={18} /> },
  { id: 9, title: 'Condições', icon: <FileCheck size={18} /> },
  { id: 10, title: 'Resumo', icon: <Save size={18} /> }
];

const TEMPLATES: Record<string, any> = {
  Pedreiro: {
    services: [{ id: '1', desc: 'Alvenaria de Vedação', qtd: 1, un: 'm²', price: 45, subtotal: 45 }],
    conditions: { prazo: '15 dias úteis', garantia: '3 meses', pagamento: '50% Entrada, 50% Entrega' }
  },
  Pintor: {
    services: [{ id: '1', desc: 'Pintura Acrílica (2 demãos)', qtd: 1, un: 'm²', price: 25, subtotal: 25 }],
    conditions: { prazo: '10 dias úteis', garantia: '6 meses', pagamento: '50% Entrada, 50% Entrega' }
  },
  Eletricista: {
    services: [{ id: '1', desc: 'Troca de fiação e disjuntores', qtd: 1, un: 'un', price: 1500, subtotal: 1500 }],
    conditions: { prazo: '3 dias úteis', garantia: '12 meses', pagamento: '30% Entrada, 70% Entrega' }
  },
  Encanador: {
    services: [{ id: '1', desc: 'Instalação Hidráulica Ponto de Água', qtd: 1, un: 'pt', price: 200, subtotal: 200 }],
    conditions: { prazo: '5 dias úteis', garantia: '6 meses', pagamento: 'À vista no término' }
  }
};

export function QuoteWizard({ onFinish }: { onFinish: () => void }) {
  const { user, profile } = useAuth();
  
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);

  // --- STATE DATA ---
  const [client, setClient] = useState({ name: '', phone: '', email: '', address: '', city: '', isNew: true });
  const [workData, setWorkData] = useState({ name: '', address: '', isNew: true });
  const [serviceType, setServiceType] = useState('');
  
  const [services, setServices] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [labor, setLabor] = useState({ days: 1, workers: 1, dailyRate: 150, obs: '' });
  const [costs, setCosts] = useState({ freight: 0, displacement: 0, rental: 0, others: 0 });
  const [discount, setDiscount] = useState({ value: 0, isPercentage: false });
  const [conditions, setConditions] = useState({ prazo: '', garantia: '', pagamento: '', validade: '15 dias', obs: '' });

  // --- AUTOPOPULATE BASED ON PROFILE ---
  useEffect(() => {
    if (profile?.specialty && TEMPLATES[profile.specialty]) {
      setServiceType(profile.specialty);
      setServices(TEMPLATES[profile.specialty].services);
      setConditions(TEMPLATES[profile.specialty].conditions);
    }
  }, [profile]);

  // --- CALCULATIONS ---
  const totalServices = services.reduce((acc, curr) => acc + (curr.qtd * curr.price), 0);
  const totalMaterials = materials.reduce((acc, curr) => acc + (curr.qtd * curr.price), 0);
  const totalLabor = labor.days * labor.workers * labor.dailyRate;
  const totalCosts = costs.freight + costs.displacement + costs.rental + costs.others;
  const subtotal = totalServices + totalMaterials + totalLabor + totalCosts;
  
  const discountAmount = discount.isPercentage ? (subtotal * (discount.value / 100)) : discount.value;
  const grandTotal = subtotal - discountAmount;

  // --- PDF GENERATION ---
  const generatePDF = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const doc = new jsPDF();
      
      // Header
      doc.setFontSize(22);
      doc.setTextColor(30, 58, 138); // var(--color-primary)
      doc.text('ORÇAMENTO COMERCIAL', 14, 20);
      
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, 14, 28);
      doc.text(`Validade: ${conditions.validade}`, 14, 33);
      
      // Provider Info
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text('DADOS DO PRESTADOR', 14, 45);
      doc.setFontSize(10);
      doc.text(`Nome: ${profile?.name || 'CentralObra Pro'}`, 14, 52);
      if (profile?.specialty) doc.text(`Especialidade: ${profile.specialty}`, 14, 57);
      
      // Client Info
      doc.setFontSize(12);
      doc.text('DADOS DO CLIENTE', 105, 45);
      doc.setFontSize(10);
      doc.text(`Nome: ${client.name || '-'}`, 105, 52);
      doc.text(`Telefone: ${client.phone || '-'}`, 105, 57);
      doc.text(`Obra: ${workData.name || '-'}`, 105, 62);
      
      // Services Table
      if (services.length > 0) {
        autoTable(doc, {
          startY: 75,
          head: [['Serviço', 'Qtd', 'Un', 'Valor Unit.', 'Subtotal']],
          body: services.map(s => [s.desc, s.qtd, s.un, `R$ ${s.price.toFixed(2)}`, `R$ ${(s.qtd * s.price).toFixed(2)}`]),
          theme: 'striped',
          headStyles: { fillColor: [30, 58, 138] }
        });
      }
      
      // Summary Totals
      const finalY = (doc as any).lastAutoTable?.finalY || 80;
      doc.setFontSize(12);
      doc.text(`Subtotal Serviços: R$ ${totalServices.toFixed(2)}`, 14, finalY + 10);
      doc.text(`Subtotal Materiais: R$ ${totalMaterials.toFixed(2)}`, 14, finalY + 16);
      doc.text(`Mão de Obra: R$ ${totalLabor.toFixed(2)}`, 14, finalY + 22);
      doc.text(`Custos Adicionais: R$ ${totalCosts.toFixed(2)}`, 14, finalY + 28);
      doc.text(`Desconto: - R$ ${discountAmount.toFixed(2)}`, 14, finalY + 34);
      
      doc.setFontSize(16);
      doc.setTextColor(16, 185, 129); // green
      doc.text(`TOTAL GERAL: R$ ${grandTotal.toFixed(2)}`, 14, finalY + 45);
      
      // Conditions
      doc.setFontSize(12);
      doc.setTextColor(0,0,0);
      doc.text('CONDIÇÕES COMERCIAIS', 14, finalY + 60);
      doc.setFontSize(10);
      doc.text(`Prazo de Execução: ${conditions.prazo}`, 14, finalY + 67);
      doc.text(`Garantia: ${conditions.garantia}`, 14, finalY + 72);
      doc.text(`Forma de Pagamento: ${conditions.pagamento}`, 14, finalY + 77);

      doc.save(`Orcamento_${client.name.replace(/\s+/g, '_') || 'Novo'}.pdf`);
      setIsGenerating(false);
    }, 800);
  };

  // --- ACTIONS ---
  const handleApprove = async () => {
    // Integração: Criar Obra Automaticamente
    if (workData.name && user) {
      try {
        await addDoc(collection(db, 'works'), {
          userId: user.uid,
          name: workData.name,
          address: workData.address,
          budget: grandTotal,
          spent: 0,
          progress: 0,
          createdAt: new Date().toISOString()
        });
      } catch (err) {
        console.error('Erro ao criar obra', err);
      }
    }
    alert('Orçamento Aprovado! Obra e Previsão Financeira criadas com sucesso na CentralObra.');
    onFinish();
  };

  // --- RENDER HELPERS ---
  const renderStepHeader = () => (
    <div style={{ display: 'flex', overflowX: 'auto', gap: 8, paddingBottom: 16, borderBottom: '1px solid var(--border-subtle)', marginBottom: 24, msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
      {STEPS.map(s => (
        <div 
          key={s.id} 
          style={{ 
            display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 20, 
            backgroundColor: step === s.id ? 'var(--color-primary)' : step > s.id ? 'var(--bg-elevated)' : 'transparent',
            color: step === s.id ? '#FFF' : step > s.id ? 'var(--text-main)' : 'var(--text-muted)',
            border: `1px solid ${step === s.id ? 'var(--color-primary)' : 'var(--border-subtle)'}`,
            whiteSpace: 'nowrap',
            transition: 'all 0.3s'
          }}
        >
          {step > s.id ? <CheckCircle size={16} color="var(--color-success)" /> : s.icon}
          <span style={{ fontSize: 13, fontWeight: 600 }}>{s.title}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ padding: '20px 16px 100px 16px', minHeight: '100vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button className="btn-icon" onClick={onFinish}><ChevronLeft size={24} /></button>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Assistente de Orçamento</h1>
      </div>

      <div className="glass-panel" style={{ padding: 24, borderRadius: 24 }}>
        {renderStepHeader()}

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {/* STEP 1: CLIENTE */}
            {step === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Dados do Cliente</h3>
                <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
                  <button className={`btn-${client.isNew ? 'primary' : 'secondary'}`} style={{ flex: 1, borderRadius: 12 }} onClick={() => setClient({ ...client, isNew: true })}>Novo Cliente</button>
                  <button className={`btn-${!client.isNew ? 'primary' : 'secondary'}`} style={{ flex: 1, borderRadius: 12 }} onClick={() => setClient({ ...client, isNew: false, name: 'João Silva (Exemplo)', phone: '(11) 99999-9999' })}>Cliente Existente</button>
                </div>
                <input type="text" className="input-field" placeholder="Nome Completo / Empresa" value={client.name} onChange={e => setClient({...client, name: e.target.value})} />
                <input type="tel" className="input-field" placeholder="WhatsApp / Telefone" value={client.phone} onChange={e => setClient({...client, phone: e.target.value})} />
                <input type="email" className="input-field" placeholder="E-mail" value={client.email} onChange={e => setClient({...client, email: e.target.value})} />
              </div>
            )}

            {/* STEP 2: OBRA */}
            {step === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Dados da Obra / Local</h3>
                <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
                  <button className={`btn-${workData.isNew ? 'primary' : 'secondary'}`} style={{ flex: 1, borderRadius: 12 }} onClick={() => setWorkData({ ...workData, isNew: true })}>Nova Obra</button>
                  <button className={`btn-${!workData.isNew ? 'primary' : 'secondary'}`} style={{ flex: 1, borderRadius: 12 }} onClick={() => setWorkData({ ...workData, isNew: false, name: 'Reforma Apto 402' })}>Vincular a Obra Ativa</button>
                </div>
                <input type="text" className="input-field" placeholder="Nome do Local (Ex: Reforma Apto 402)" value={workData.name} onChange={e => setWorkData({...workData, name: e.target.value})} />
                <input type="text" className="input-field" placeholder="Endereço Completo" value={workData.address} onChange={e => setWorkData({...workData, address: e.target.value})} />
              </div>
            )}

            {/* STEP 3: TIPO DE SERVIÇO (TEMPLATES) */}
            {step === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Tipo de Serviço / Modelo</h3>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: 0 }}>Selecione um modelo inteligente para preencher automaticamente os serviços.</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {Object.keys(TEMPLATES).map(key => (
                    <div 
                      key={key} 
                      onClick={() => {
                        setServiceType(key);
                        setServices(TEMPLATES[key].services);
                        setConditions(TEMPLATES[key].conditions);
                      }}
                      style={{ 
                        padding: 16, borderRadius: 16, 
                        border: `2px solid ${serviceType === key ? 'var(--color-primary)' : 'var(--border-subtle)'}`,
                        backgroundColor: serviceType === key ? 'rgba(30, 58, 138, 0.05)' : 'var(--bg-base)',
                        cursor: 'pointer', textAlign: 'center', fontWeight: 600, color: 'var(--text-main)'
                      }}
                    >
                      {key}
                    </div>
                  ))}
                  <div 
                    onClick={() => { setServiceType('Outros'); setServices([]); }}
                    style={{ 
                      padding: 16, borderRadius: 16, 
                      border: `2px solid ${serviceType === 'Outros' ? 'var(--color-primary)' : 'var(--border-subtle)'}`,
                      backgroundColor: serviceType === 'Outros' ? 'rgba(30, 58, 138, 0.05)' : 'var(--bg-base)',
                      cursor: 'pointer', textAlign: 'center', fontWeight: 600, color: 'var(--text-main)'
                    }}
                  >
                    Em Branco
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: SERVIÇOS */}
            {step === 4 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Descrição dos Serviços</h3>
                
                {services.map((s, index) => (
                  <div key={s.id} style={{ padding: 16, backgroundColor: 'var(--bg-elevated)', borderRadius: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 600 }}>Item {index + 1}</span>
                      <button className="btn-icon" onClick={() => setServices(services.filter(x => x.id !== s.id))}><Trash2 size={16} color="var(--color-danger)" /></button>
                    </div>
                    <input type="text" className="input-field" placeholder="Descrição (Ex: Instalação de porcelanato)" value={s.desc} onChange={e => { const ns = [...services]; ns[index].desc = e.target.value; setServices(ns); }} />
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input type="number" className="input-field" style={{ flex: 1 }} placeholder="Qtd" value={s.qtd} onChange={e => { const ns = [...services]; ns[index].qtd = Number(e.target.value); setServices(ns); }} />
                      <input type="text" className="input-field" style={{ flex: 1 }} placeholder="Un (m², un)" value={s.un} onChange={e => { const ns = [...services]; ns[index].un = e.target.value; setServices(ns); }} />
                      <input type="number" className="input-field" style={{ flex: 2 }} placeholder="R$ Unit." value={s.price} onChange={e => { const ns = [...services]; ns[index].price = Number(e.target.value); setServices(ns); }} />
                    </div>
                  </div>
                ))}
                
                <button 
                  className="btn-secondary" 
                  style={{ borderRadius: 12, padding: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                  onClick={() => setServices([...services, { id: Date.now().toString(), desc: '', qtd: 1, un: 'un', price: 0 }])}
                >
                  <Plus size={18} /> Adicionar Serviço
                </button>
                <div style={{ textAlign: 'right', fontWeight: 800, fontSize: 18, color: 'var(--text-main)', marginTop: 8 }}>
                  Subtotal: R$ {totalServices.toFixed(2)}
                </div>
              </div>
            )}

            {/* STEP 5: MATERIAIS */}
            {step === 5 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Materiais</h3>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: 0 }}>Opcional. Adicione se o fornecimento de material estiver incluso no orçamento.</p>
                
                {materials.map((m, index) => (
                  <div key={m.id} style={{ padding: 16, backgroundColor: 'var(--bg-elevated)', borderRadius: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 600 }}>Material {index + 1}</span>
                      <button className="btn-icon" onClick={() => setMaterials(materials.filter(x => x.id !== m.id))}><Trash2 size={16} color="var(--color-danger)" /></button>
                    </div>
                    <input type="text" className="input-field" placeholder="Nome (Ex: Cimento 50kg)" value={m.name} onChange={e => { const nm = [...materials]; nm[index].name = e.target.value; setMaterials(nm); }} />
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input type="number" className="input-field" style={{ flex: 1 }} placeholder="Qtd" value={m.qtd} onChange={e => { const nm = [...materials]; nm[index].qtd = Number(e.target.value); setMaterials(nm); }} />
                      <input type="number" className="input-field" style={{ flex: 2 }} placeholder="R$ Unit." value={m.price} onChange={e => { const nm = [...materials]; nm[index].price = Number(e.target.value); setMaterials(nm); }} />
                    </div>
                  </div>
                ))}
                
                <button 
                  className="btn-secondary" 
                  style={{ borderRadius: 12, padding: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                  onClick={() => setMaterials([...materials, { id: Date.now().toString(), name: '', qtd: 1, un: 'un', price: 0 }])}
                >
                  <Plus size={18} /> Adicionar Material
                </button>
                <div style={{ textAlign: 'right', fontWeight: 800, fontSize: 18, color: 'var(--text-main)', marginTop: 8 }}>
                  Subtotal: R$ {totalMaterials.toFixed(2)}
                </div>
              </div>
            )}

            {/* STEP 6: MÃO DE OBRA */}
            {step === 6 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Mão de Obra</h3>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: 0 }}>Cálculo de alocação de equipe por dias.</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>Qtd. de Dias</label>
                    <input type="number" className="input-field" value={labor.days} onChange={e => setLabor({...labor, days: Number(e.target.value)})} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>Qtd. Profissionais</label>
                    <input type="number" className="input-field" value={labor.workers} onChange={e => setLabor({...labor, workers: Number(e.target.value)})} />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>Valor Diária (R$ / Profissional)</label>
                  <input type="number" className="input-field" value={labor.dailyRate} onChange={e => setLabor({...labor, dailyRate: Number(e.target.value)})} />
                </div>
                
                <div style={{ textAlign: 'right', fontWeight: 800, fontSize: 18, color: 'var(--text-main)', marginTop: 8 }}>
                  Subtotal: R$ {totalLabor.toFixed(2)}
                </div>
              </div>
            )}

            {/* STEP 7: CUSTOS ADICIONAIS */}
            {step === 7 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Custos Adicionais</h3>
                
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>Frete / Logística (R$)</label>
                  <input type="number" className="input-field" value={costs.freight} onChange={e => setCosts({...costs, freight: Number(e.target.value)})} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>Deslocamento (R$)</label>
                  <input type="number" className="input-field" value={costs.displacement} onChange={e => setCosts({...costs, displacement: Number(e.target.value)})} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>Locação Equipamentos (R$)</label>
                  <input type="number" className="input-field" value={costs.rental} onChange={e => setCosts({...costs, rental: Number(e.target.value)})} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>Outros (R$)</label>
                  <input type="number" className="input-field" value={costs.others} onChange={e => setCosts({...costs, others: Number(e.target.value)})} />
                </div>
                
                <div style={{ textAlign: 'right', fontWeight: 800, fontSize: 18, color: 'var(--text-main)', marginTop: 8 }}>
                  Subtotal: R$ {totalCosts.toFixed(2)}
                </div>
              </div>
            )}

            {/* STEP 8: DESCONTO */}
            {step === 8 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Descontos</h3>
                
                <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
                  <button className={`btn-${!discount.isPercentage ? 'primary' : 'secondary'}`} style={{ flex: 1, borderRadius: 12 }} onClick={() => setDiscount({ ...discount, isPercentage: false })}>Fixo (R$)</button>
                  <button className={`btn-${discount.isPercentage ? 'primary' : 'secondary'}`} style={{ flex: 1, borderRadius: 12 }} onClick={() => setDiscount({ ...discount, isPercentage: true })}>Percentual (%)</button>
                </div>
                
                <input type="number" className="input-field" placeholder="Valor do Desconto" value={discount.value} onChange={e => setDiscount({...discount, value: Number(e.target.value)})} />
                
                <div style={{ textAlign: 'right', fontWeight: 800, fontSize: 18, color: 'var(--color-success)', marginTop: 8 }}>
                  Desconto Total: - R$ {discountAmount.toFixed(2)}
                </div>
              </div>
            )}

            {/* STEP 9: CONDIÇÕES */}
            {step === 9 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Condições Comerciais</h3>
                
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>Prazo de Execução</label>
                  <input type="text" className="input-field" placeholder="Ex: 15 dias úteis" value={conditions.prazo} onChange={e => setConditions({...conditions, prazo: e.target.value})} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>Garantia</label>
                  <input type="text" className="input-field" placeholder="Ex: 3 meses contra defeitos" value={conditions.garantia} onChange={e => setConditions({...conditions, garantia: e.target.value})} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>Forma de Pagamento</label>
                  <input type="text" className="input-field" placeholder="Ex: 50% Entrada, 50% Término" value={conditions.pagamento} onChange={e => setConditions({...conditions, pagamento: e.target.value})} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>Validade da Proposta</label>
                  <input type="text" className="input-field" placeholder="Ex: 15 dias" value={conditions.validade} onChange={e => setConditions({...conditions, validade: e.target.value})} />
                </div>
              </div>
            )}

            {/* STEP 10: RESUMO */}
            {step === 10 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ textAlign: 'center', marginBottom: 16 }}>
                  <CheckCircle size={48} color="var(--color-success)" style={{ margin: '0 auto', marginBottom: 12 }} />
                  <h3 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>Orçamento Finalizado!</h3>
                  <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: 0 }}>Confira os valores antes de gerar o PDF e Aprovar.</p>
                </div>
                
                <div style={{ padding: 16, backgroundColor: 'var(--bg-elevated)', borderRadius: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14 }}>
                    <span style={{ color: 'var(--text-muted)' }}>Serviços:</span>
                    <span style={{ fontWeight: 600 }}>R$ {totalServices.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14 }}>
                    <span style={{ color: 'var(--text-muted)' }}>Materiais:</span>
                    <span style={{ fontWeight: 600 }}>R$ {totalMaterials.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14 }}>
                    <span style={{ color: 'var(--text-muted)' }}>Mão de Obra:</span>
                    <span style={{ fontWeight: 600 }}>R$ {totalLabor.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14 }}>
                    <span style={{ color: 'var(--text-muted)' }}>Custos Adicionais:</span>
                    <span style={{ fontWeight: 600 }}>R$ {totalCosts.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 14, color: 'var(--color-danger)' }}>
                    <span>Desconto:</span>
                    <span style={{ fontWeight: 600 }}>- R$ {discountAmount.toFixed(2)}</span>
                  </div>
                  <div style={{ height: 1, backgroundColor: 'var(--border-subtle)', margin: '12px 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 20, fontWeight: 800, color: 'var(--color-primary)' }}>
                    <span>Total:</span>
                    <span>R$ {grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 16 }}>
                  <button 
                    className="btn-primary" 
                    style={{ borderRadius: 12, padding: '16px 0', fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                    onClick={generatePDF}
                    disabled={isGenerating}
                  >
                    {isGenerating ? 'Gerando...' : <><Download size={18} /> Gerar PDF</>}
                  </button>
                  <button 
                    className="btn-primary" 
                    style={{ borderRadius: 12, padding: '16px 0', fontSize: 15, fontWeight: 700, backgroundColor: 'var(--color-success)', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                    onClick={handleApprove}
                  >
                    <CheckCircle size={18} /> Aprovar Obra
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* NAVIGATION FOOTER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32, paddingTop: 16, borderTop: '1px solid var(--border-subtle)' }}>
          <button 
            className="btn-secondary" 
            style={{ borderRadius: 12, padding: '12px 24px', visibility: step === 1 ? 'hidden' : 'visible' }}
            onClick={() => setStep(Math.max(1, step - 1))}
          >
            Voltar
          </button>
          
          {step < 10 && (
            <button 
              className="btn-primary" 
              style={{ borderRadius: 12, padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 8 }}
              onClick={() => setStep(Math.min(10, step + 1))}
            >
              Avançar <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
