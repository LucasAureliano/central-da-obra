import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, CheckCircle, FileText, 
  Settings, Package, Users, DollarSign, 
  Download, Plus, Trash2, Search, Zap, 
  PaintRoller, BrickWall, Droplet, LayoutGrid, AlertCircle
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useAuth } from '../../contexts/AuthContext';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

const STEPS_DATA = [
  { id: 0, title: 'Início', msg: 'Vamos criar um orçamento profissional.' },
  { id: 1, title: 'Cliente', msg: 'Primeiro, para quem é este orçamento?' },
  { id: 2, title: 'Obra', msg: 'Onde o serviço será realizado?' },
  { id: 3, title: 'Tipo de Serviço', msg: 'Que tipo de serviço você vai prestar?' },
  { id: 4, title: 'Serviços', msg: 'Descreva os serviços que serão cobrados.' },
  { id: 5, title: 'Materiais', msg: 'Haverá fornecimento de materiais?' },
  { id: 6, title: 'Mão de Obra', msg: 'Como será a alocação da sua equipe?' },
  { id: 7, title: 'Custos Adic.', msg: 'Existem custos extras de logística?' },
  { id: 8, title: 'Desconto', msg: 'Deseja aplicar algum desconto?' },
  { id: 9, title: 'Condições', msg: 'Quais as condições comerciais?' },
  { id: 10, title: 'Resumo', msg: 'Pronto! Confira o resultado final.' }
];

const TEMPLATES: Record<string, any> = {
  'Elétrica': {
    icon: <Zap size={32} color="#F59E0B" />,
    services: [{ id: '1', desc: 'Revisão Elétrica e Troca de Disjuntores', qtd: 1, un: 'un', price: 1500 }],
    conditions: { prazo: '3 dias úteis', garantia: '12 meses', pagamento: '30% Entrada, 70% Entrega' }
  },
  'Pintura': {
    icon: <PaintRoller size={32} color="#EC4899" />,
    services: [{ id: '1', desc: 'Pintura Acrílica (2 demãos)', qtd: 1, un: 'm²', price: 25 }],
    conditions: { prazo: '10 dias úteis', garantia: '6 meses', pagamento: '50% Entrada, 50% Entrega' }
  },
  'Alvenaria': {
    icon: <BrickWall size={32} color="#F59E0B" />,
    services: [{ id: '1', desc: 'Alvenaria de Vedação', qtd: 1, un: 'm²', price: 45 }],
    conditions: { prazo: '15 dias úteis', garantia: '3 meses', pagamento: '50% Entrada, 50% Entrega' }
  },
  'Hidráulica': {
    icon: <Droplet size={32} color="#0EA5E9" />,
    services: [{ id: '1', desc: 'Instalação de Ponto de Água/Esgoto', qtd: 1, un: 'pt', price: 250 }],
    conditions: { prazo: '5 dias úteis', garantia: '6 meses', pagamento: 'À vista' }
  }
};

export function QuoteWizard({ onFinish }: { onFinish: () => void }) {
  const { user, profile } = useAuth();
  
  const [step, setStep] = useState(0);
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

  // --- AUTOPOPULATE BASED ON PROFILE (Optional override) ---
  const applyTemplate = (key: string) => {
    setServiceType(key);
    if (TEMPLATES[key]) {
      setServices(TEMPLATES[key].services.map((s: any) => ({...s, id: Date.now().toString() + Math.random()})));
      setConditions(TEMPLATES[key].conditions);
    }
    setStep(4); // Advance past type
  };

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
      
      doc.setFontSize(22);
      doc.setTextColor(30, 58, 138); 
      doc.text('ORÇAMENTO COMERCIAL', 14, 20);
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, 14, 28);
      doc.text(`Validade: ${conditions.validade}`, 14, 33);
      
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text('DADOS DO PRESTADOR', 14, 45);
      doc.setFontSize(10);
      doc.text(`Nome: ${profile?.name || 'CentralObra Pro'}`, 14, 52);
      if (profile?.specialty) doc.text(`Especialidade: ${profile.specialty}`, 14, 57);
      
      doc.setFontSize(12);
      doc.text('DADOS DO CLIENTE', 105, 45);
      doc.setFontSize(10);
      doc.text(`Nome: ${client.name || '-'}`, 105, 52);
      doc.text(`Telefone: ${client.phone || '-'}`, 105, 57);
      doc.text(`Obra: ${workData.name || '-'}`, 105, 62);
      
      if (services.length > 0) {
        autoTable(doc, {
          startY: 75,
          head: [['Serviço', 'Qtd', 'Un', 'Valor Unit.', 'Subtotal']],
          body: services.map(s => [s.desc, s.qtd, s.un, `R$ ${s.price.toFixed(2)}`, `R$ ${(s.qtd * s.price).toFixed(2)}`]),
          theme: 'striped',
          headStyles: { fillColor: [30, 58, 138] }
        });
      }
      
      const finalY = (doc as any).lastAutoTable?.finalY || 80;
      doc.setFontSize(12);
      doc.text(`Subtotal Serviços: R$ ${totalServices.toFixed(2)}`, 14, finalY + 10);
      doc.text(`Subtotal Materiais: R$ ${totalMaterials.toFixed(2)}`, 14, finalY + 16);
      doc.text(`Mão de Obra: R$ ${totalLabor.toFixed(2)}`, 14, finalY + 22);
      doc.text(`Custos Adicionais: R$ ${totalCosts.toFixed(2)}`, 14, finalY + 28);
      doc.text(`Desconto: - R$ ${discountAmount.toFixed(2)}`, 14, finalY + 34);
      
      doc.setFontSize(16);
      doc.setTextColor(16, 185, 129);
      doc.text(`TOTAL GERAL: R$ ${grandTotal.toFixed(2)}`, 14, finalY + 45);
      
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

  const handleApprove = async () => {
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
  const renderSidebar = () => (
    <div style={{ 
      width: 300, backgroundColor: 'var(--bg-elevated)', borderRadius: 24, padding: 24, 
      display: 'flex', flexDirection: 'column', gap: 24, border: '1px solid var(--border-subtle)',
      height: 'fit-content', position: 'sticky', top: 24
    }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Resumo do Orçamento</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>Cliente</span>
          <span style={{ fontWeight: 600, fontSize: 14 }}>{client.name || '---'}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>Serviços</span>
          <span style={{ fontWeight: 600, fontSize: 14 }}>{services.length} itens</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>Materiais</span>
          <span style={{ fontWeight: 600, fontSize: 14 }}>{materials.length} itens</span>
        </div>
      </div>
      
      <div style={{ height: 1, backgroundColor: 'var(--border-subtle)' }} />
      
      <div>
        <span style={{ color: 'var(--text-muted)', fontSize: 13, display: 'block', marginBottom: 4 }}>Total Parcial</span>
        <span style={{ fontSize: 28, fontWeight: 800, color: 'var(--color-primary)' }}>R$ {grandTotal.toFixed(2)}</span>
      </div>
    </div>
  );

  const renderHeader = () => {
    const currentStep = STEPS_DATA.find(s => s.id === step) || STEPS_DATA[0];
    const progress = Math.max(0, Math.min(100, (step / 10) * 100));
    
    return (
      <div style={{ marginBottom: 32 }}>
        <button className="btn-icon" onClick={onFinish} style={{ marginBottom: 16 }}><ChevronLeft size={24} /></button>
        
        {step > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: 1 }}>Etapa {step} de 10</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>{progress.toFixed(0)}%</span>
          </div>
        )}
        
        {step > 0 && (
          <div style={{ height: 6, backgroundColor: 'var(--bg-elevated)', borderRadius: 10, overflow: 'hidden', marginBottom: 24 }}>
            <motion.div 
              initial={{ width: 0 }} 
              animate={{ width: `${progress}%` }} 
              transition={{ duration: 0.5, ease: 'easeOut' }}
              style={{ height: '100%', backgroundColor: 'var(--color-primary)', borderRadius: 10 }} 
            />
          </div>
        )}

        <motion.div
          key={currentStep.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 style={{ fontSize: step === 0 ? 32 : 24, fontWeight: 800, color: 'var(--text-main)', margin: '0 0 8px 0', lineHeight: 1.2 }}>
            {currentStep.title}
          </h1>
          <p style={{ fontSize: 16, color: 'var(--text-muted)', margin: 0 }}>
            {currentStep.msg}
          </p>
        </motion.div>
      </div>
    );
  };

  const animationProps = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.2 }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-base)', padding: '24px 16px', paddingBottom: 120 }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', gap: 32 }}>
        
        <div style={{ flex: 1, minWidth: 0 }}>
          {renderHeader()}

          <AnimatePresence mode="wait">
            <motion.div key={step} {...animationProps}>
              
              {/* STEP 0: WELCOME */}
              {step === 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
                  {[
                    { title: 'Orçamento em Branco', desc: 'Começar do zero', icon: <FileText size={32} color="var(--color-primary)" />, action: () => setStep(1) },
                    { title: 'Usar Modelo / Template', desc: 'Preenchimento rápido', icon: <LayoutGrid size={32} color="#10B981" />, action: () => setStep(3) },
                    { title: 'Duplicar Existente', desc: 'Copiar orçamento anterior', icon: <Settings size={32} color="#8B5CF6" />, action: () => alert('Em breve!') },
                    { title: 'Da Lista de Compras', desc: 'Converter lista em orçamento', icon: <Package size={32} color="#F59E0B" />, action: () => alert('Em breve!') }
                  ].map((item, i) => (
                    <motion.div 
                      key={i}
                      whileHover={{ scale: 1.02, y: -4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={item.action}
                      className="glass-panel"
                      style={{ padding: 24, borderRadius: 24, cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 16, border: '1px solid var(--border-subtle)' }}
                    >
                      <div style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {item.icon}
                      </div>
                      <div>
                        <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 4px 0' }}>{item.title}</h3>
                        <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: 0 }}>{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* STEP 1: CLIENT */}
              {step === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <div className="glass-panel" style={{ padding: '12px 20px', borderRadius: 100, display: 'flex', alignItems: 'center', gap: 12, border: '1px solid var(--border-subtle)' }}>
                    <Search size={20} color="var(--color-primary)" />
                    <input type="text" placeholder="Pesquisar cliente existente..." style={{ border: 'none', background: 'transparent', outline: 'none', color: 'var(--text-main)', flex: 1, fontSize: 16 }} />
                  </div>
                  
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button className={`btn-${client.isNew ? 'primary' : 'secondary'}`} style={{ flex: 1, borderRadius: 16, padding: '16px' }} onClick={() => setClient({ ...client, isNew: true })}>Novo Cliente</button>
                    <button className={`btn-${!client.isNew ? 'primary' : 'secondary'}`} style={{ flex: 1, borderRadius: 16, padding: '16px' }} onClick={() => setClient({ ...client, isNew: false, name: 'João Silva', phone: '(11) 99999-9999' })}>Selecionar Existente</button>
                  </div>

                  <div className="glass-panel" style={{ padding: 24, borderRadius: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <input type="text" className="input-field" placeholder="Nome Completo / Empresa" value={client.name} onChange={e => setClient({...client, name: e.target.value})} />
                    <input type="tel" className="input-field" placeholder="WhatsApp / Telefone" value={client.phone} onChange={e => setClient({...client, phone: e.target.value})} />
                    <input type="email" className="input-field" placeholder="E-mail (opcional)" value={client.email} onChange={e => setClient({...client, email: e.target.value})} />
                  </div>
                </div>
              )}

              {/* STEP 2: WORK */}
              {step === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button className={`btn-${workData.isNew ? 'primary' : 'secondary'}`} style={{ flex: 1, borderRadius: 16, padding: '16px' }} onClick={() => setWorkData({ ...workData, isNew: true })}>Nova Obra</button>
                    <button className={`btn-${!workData.isNew ? 'primary' : 'secondary'}`} style={{ flex: 1, borderRadius: 16, padding: '16px' }} onClick={() => setWorkData({ ...workData, isNew: false, name: 'Reforma Apto 402' })}>Obra Existente</button>
                  </div>

                  <div className="glass-panel" style={{ padding: 24, borderRadius: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <input type="text" className="input-field" placeholder="Nome da Obra (Ex: Reforma Apto 402)" value={workData.name} onChange={e => setWorkData({...workData, name: e.target.value})} />
                    <input type="text" className="input-field" placeholder="Endereço Completo" value={workData.address} onChange={e => setWorkData({...workData, address: e.target.value})} />
                  </div>
                </div>
              )}

              {/* STEP 3: TYPE */}
              {step === 3 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                  {Object.keys(TEMPLATES).map(key => (
                    <motion.div 
                      key={key} 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => applyTemplate(key)}
                      style={{ 
                        padding: 24, borderRadius: 24, 
                        border: `2px solid ${serviceType === key ? 'var(--color-primary)' : 'var(--border-subtle)'}`,
                        backgroundColor: serviceType === key ? 'rgba(30, 58, 138, 0.05)' : 'var(--bg-elevated)',
                        cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16
                      }}
                    >
                      <div style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {TEMPLATES[key].icon}
                      </div>
                      <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)' }}>{key}</span>
                    </motion.div>
                  ))}
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { setServiceType('Outros'); setServices([]); setStep(4); }}
                    style={{ 
                      padding: 24, borderRadius: 24, border: '2px dashed var(--border-subtle)',
                      backgroundColor: 'transparent', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, justifyContent: 'center'
                    }}
                  >
                    <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-muted)' }}>Em Branco (Outro)</span>
                  </motion.div>
                </div>
              )}

              {/* STEP 4: SERVICES */}
              {step === 4 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {services.map((s, index) => (
                    <motion.div key={s.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-panel" style={{ padding: 20, borderRadius: 20, display: 'flex', flexDirection: 'column', gap: 16, border: '1px solid var(--border-subtle)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: 14, textTransform: 'uppercase' }}>Serviço {index + 1}</span>
                        <button className="btn-icon" onClick={() => setServices(services.filter(x => x.id !== s.id))}><Trash2 size={18} color="var(--color-danger)" /></button>
                      </div>
                      <input type="text" className="input-field" placeholder="Descrição detalhada..." value={s.desc} onChange={e => { const ns = [...services]; ns[index].desc = e.target.value; setServices(ns); }} style={{ fontSize: 16 }} />
                      <div style={{ display: 'flex', gap: 12 }}>
                        <div style={{ flex: 1 }}>
                          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>Qtd</label>
                          <input type="number" className="input-field" value={s.qtd} onChange={e => { const ns = [...services]; ns[index].qtd = Number(e.target.value); setServices(ns); }} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>Unidade</label>
                          <input type="text" className="input-field" placeholder="Ex: m², un" value={s.un} onChange={e => { const ns = [...services]; ns[index].un = e.target.value; setServices(ns); }} />
                        </div>
                        <div style={{ flex: 2 }}>
                          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>Valor Unit. (R$)</label>
                          <input type="number" className="input-field" value={s.price} onChange={e => { const ns = [...services]; ns[index].price = Number(e.target.value); setServices(ns); }} />
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', fontWeight: 800, fontSize: 18, color: 'var(--text-main)', marginTop: 4 }}>
                        Subtotal: R$ {(s.qtd * s.price).toFixed(2)}
                      </div>
                    </motion.div>
                  ))}
                  
                  <motion.button 
                    whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                    className="btn-secondary" 
                    style={{ borderRadius: 20, padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, border: '2px dashed var(--border-subtle)', background: 'transparent' }}
                    onClick={() => setServices([...services, { id: Date.now().toString(), desc: '', qtd: 1, un: 'un', price: 0 }])}
                  >
                    <Plus size={20} /> Adicionar Novo Serviço
                  </motion.button>
                </div>
              )}

              {/* STEP 5: MATERIALS */}
              {step === 5 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
                    <button className="btn-secondary" style={{ flex: 1, borderRadius: 16, display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center' }} onClick={() => alert('Em breve: Importar das calculadoras de material.')}><LayoutGrid size={16} /> Importar Calculadora</button>
                    <button className="btn-secondary" style={{ flex: 1, borderRadius: 16, display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center' }} onClick={() => alert('Em breve: Importar da sua lista de compras salva.')}><Package size={16} /> Lista de Compras</button>
                  </div>

                  {materials.map((m, index) => (
                    <motion.div key={m.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-panel" style={{ padding: 20, borderRadius: 20, display: 'flex', flexDirection: 'column', gap: 16, border: '1px solid var(--border-subtle)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 700, color: '#10B981', fontSize: 14, textTransform: 'uppercase' }}>Material {index + 1}</span>
                        <button className="btn-icon" onClick={() => setMaterials(materials.filter(x => x.id !== m.id))}><Trash2 size={18} color="var(--color-danger)" /></button>
                      </div>
                      <input type="text" className="input-field" placeholder="Nome do Material..." value={m.name} onChange={e => { const nm = [...materials]; nm[index].name = e.target.value; setMaterials(nm); }} />
                      <div style={{ display: 'flex', gap: 12 }}>
                        <div style={{ flex: 1 }}>
                          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>Qtd</label>
                          <input type="number" className="input-field" value={m.qtd} onChange={e => { const nm = [...materials]; nm[index].qtd = Number(e.target.value); setMaterials(nm); }} />
                        </div>
                        <div style={{ flex: 2 }}>
                          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>Valor Unit. (R$)</label>
                          <input type="number" className="input-field" value={m.price} onChange={e => { const nm = [...materials]; nm[index].price = Number(e.target.value); setMaterials(nm); }} />
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', fontWeight: 800, fontSize: 18, color: 'var(--text-main)', marginTop: 4 }}>
                        Subtotal: R$ {(m.qtd * m.price).toFixed(2)}
                      </div>
                    </motion.div>
                  ))}
                  
                  <motion.button 
                    whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                    className="btn-secondary" 
                    style={{ borderRadius: 20, padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, border: '2px dashed var(--border-subtle)', background: 'transparent' }}
                    onClick={() => setMaterials([...materials, { id: Date.now().toString(), name: '', qtd: 1, price: 0 }])}
                  >
                    <Plus size={20} /> Adicionar Material Manualmente
                  </motion.button>
                </div>
              )}

              {/* STEP 6: LABOR */}
              {step === 6 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <div className="glass-panel" style={{ padding: 24, borderRadius: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: 'rgba(30, 58, 138, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
                        <Users size={24} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 4px 0' }}>Profissionais Envolvidos</h4>
                        <input type="number" className="input-field" value={labor.workers} onChange={e => setLabor({...labor, workers: Number(e.target.value)})} style={{ fontSize: 20, fontWeight: 700, width: '100%', maxWidth: 150 }} />
                      </div>
                    </div>
                    
                    <div style={{ height: 1, backgroundColor: 'var(--border-subtle)' }} />

                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981' }}>
                        <AlertCircle size={24} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 4px 0' }}>Dias de Trabalho (Estimativa)</h4>
                        <input type="number" className="input-field" value={labor.days} onChange={e => setLabor({...labor, days: Number(e.target.value)})} style={{ fontSize: 20, fontWeight: 700, width: '100%', maxWidth: 150 }} />
                      </div>
                    </div>

                    <div style={{ height: 1, backgroundColor: 'var(--border-subtle)' }} />

                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: 'rgba(245, 158, 11, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F59E0B' }}>
                        <DollarSign size={24} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 4px 0' }}>Valor Médio da Diária (R$)</h4>
                        <input type="number" className="input-field" value={labor.dailyRate} onChange={e => setLabor({...labor, dailyRate: Number(e.target.value)})} style={{ fontSize: 20, fontWeight: 700, width: '100%', maxWidth: 150 }} />
                      </div>
                    </div>
                  </div>

                  <div className="glass-panel" style={{ padding: 24, borderRadius: 24, backgroundColor: 'var(--color-primary)', color: '#FFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: 14, opacity: 0.8, display: 'block', marginBottom: 4 }}>Cálculo Automático de Mão de Obra</span>
                      <span style={{ fontSize: 13, opacity: 0.6 }}>{labor.workers} pessoas × {labor.days} dias × R$ {labor.dailyRate}</span>
                    </div>
                    <span style={{ fontSize: 28, fontWeight: 800 }}>R$ {totalLabor.toFixed(2)}</span>
                  </div>
                </div>
              )}

              {/* STEP 7: ADDITIONAL COSTS */}
              {step === 7 && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
                  {[
                    { key: 'freight', title: 'Frete / Logística', desc: 'Transporte de materiais e entulho' },
                    { key: 'displacement', title: 'Deslocamento', desc: 'Custos de viagem e pedágio' },
                    { key: 'rental', title: 'Locação', desc: 'Aluguel de andaimes ou máquinas' },
                    { key: 'others', title: 'Outros Custos', desc: 'Taxas, ART, etc.' }
                  ].map((item) => (
                    <div key={item.key} className="glass-panel" style={{ padding: 20, borderRadius: 20, display: 'flex', alignItems: 'center', gap: 16, border: '1px solid var(--border-subtle)' }}>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 4px 0' }}>{item.title}</h4>
                        <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>{item.desc}</p>
                      </div>
                      <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', fontWeight: 600, color: 'var(--text-muted)' }}>R$</span>
                        <input 
                          type="number" 
                          className="input-field" 
                          style={{ paddingLeft: 44, width: 140, fontWeight: 700, fontSize: 16 }}
                          value={(costs as any)[item.key]} 
                          onChange={e => setCosts({...costs, [item.key]: Number(e.target.value)})} 
                        />
                      </div>
                    </div>
                  ))}
                  <div style={{ textAlign: 'right', fontWeight: 800, fontSize: 20, color: 'var(--text-main)', marginTop: 8 }}>
                    Total Adicional: R$ {totalCosts.toFixed(2)}
                  </div>
                </div>
              )}

              {/* STEP 8: DISCOUNT */}
              {step === 8 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <div style={{ display: 'flex', gap: 16 }}>
                    <motion.div 
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      onClick={() => setDiscount({ ...discount, isPercentage: false })}
                      style={{ 
                        flex: 1, padding: 24, borderRadius: 24, cursor: 'pointer', textAlign: 'center',
                        border: `2px solid ${!discount.isPercentage ? 'var(--color-primary)' : 'var(--border-subtle)'}`,
                        backgroundColor: !discount.isPercentage ? 'rgba(30, 58, 138, 0.05)' : 'var(--bg-elevated)'
                      }}
                    >
                      <h4 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 8px 0' }}>Valor Fixo (R$)</h4>
                      <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>Desconto direto em Reais</p>
                    </motion.div>
                    <motion.div 
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      onClick={() => setDiscount({ ...discount, isPercentage: true })}
                      style={{ 
                        flex: 1, padding: 24, borderRadius: 24, cursor: 'pointer', textAlign: 'center',
                        border: `2px solid ${discount.isPercentage ? 'var(--color-primary)' : 'var(--border-subtle)'}`,
                        backgroundColor: discount.isPercentage ? 'rgba(30, 58, 138, 0.05)' : 'var(--bg-elevated)'
                      }}
                    >
                      <h4 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 8px 0' }}>Percentual (%)</h4>
                      <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>Desconto percentual</p>
                    </motion.div>
                  </div>

                  <div className="glass-panel" style={{ padding: 32, borderRadius: 24, textAlign: 'center' }}>
                    <input 
                      type="number" 
                      className="input-field" 
                      style={{ fontSize: 48, fontWeight: 800, textAlign: 'center', padding: '16px 0', borderBottom: '2px solid var(--color-primary)', borderRadius: 0, backgroundColor: 'transparent' }}
                      value={discount.value} 
                      onChange={e => setDiscount({...discount, value: Number(e.target.value)})} 
                    />
                    <span style={{ display: 'block', marginTop: 16, fontSize: 16, color: 'var(--text-muted)' }}>
                      Total de abatimento: <strong style={{ color: 'var(--color-danger)' }}>- R$ {discountAmount.toFixed(2)}</strong>
                    </span>
                  </div>
                </div>
              )}

              {/* STEP 9: CONDITIONS */}
              {step === 9 && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
                  <div className="glass-panel" style={{ padding: 20, borderRadius: 20 }}>
                    <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8, display: 'block', textTransform: 'uppercase' }}>Prazo de Execução</label>
                    <input type="text" className="input-field" placeholder="Ex: 15 dias úteis após início" value={conditions.prazo} onChange={e => setConditions({...conditions, prazo: e.target.value})} style={{ fontSize: 16, fontWeight: 600 }} />
                  </div>
                  <div className="glass-panel" style={{ padding: 20, borderRadius: 20 }}>
                    <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8, display: 'block', textTransform: 'uppercase' }}>Garantia do Serviço</label>
                    <input type="text" className="input-field" placeholder="Ex: 6 meses contra defeitos" value={conditions.garantia} onChange={e => setConditions({...conditions, garantia: e.target.value})} style={{ fontSize: 16, fontWeight: 600 }} />
                  </div>
                  <div className="glass-panel" style={{ padding: 20, borderRadius: 20 }}>
                    <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8, display: 'block', textTransform: 'uppercase' }}>Forma de Pagamento</label>
                    <input type="text" className="input-field" placeholder="Ex: 50% Entrada, 50% Término" value={conditions.pagamento} onChange={e => setConditions({...conditions, pagamento: e.target.value})} style={{ fontSize: 16, fontWeight: 600 }} />
                  </div>
                  <div className="glass-panel" style={{ padding: 20, borderRadius: 20 }}>
                    <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8, display: 'block', textTransform: 'uppercase' }}>Validade da Proposta</label>
                    <input type="text" className="input-field" placeholder="Ex: 15 dias" value={conditions.validade} onChange={e => setConditions({...conditions, validade: e.target.value})} style={{ fontSize: 16, fontWeight: 600 }} />
                  </div>
                </div>
              )}

              {/* STEP 10: SUMMARY */}
              {step === 10 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <div className="glass-panel" style={{ padding: 32, borderRadius: 32, backgroundImage: 'linear-gradient(135deg, var(--bg-elevated) 0%, rgba(30, 58, 138, 0.05) 100%)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ textAlign: 'center', marginBottom: 32 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Total Geral do Orçamento</span>
                      <h2 style={{ fontSize: 48, fontWeight: 900, color: 'var(--color-primary)', margin: '8px 0' }}>R$ {grandTotal.toFixed(2)}</h2>
                      <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>Para o cliente: <strong>{client.name || 'Não informado'}</strong></span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 12, borderBottom: '1px dashed var(--border-subtle)' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Serviços ({services.length})</span>
                        <span style={{ fontWeight: 600 }}>R$ {totalServices.toFixed(2)}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 12, borderBottom: '1px dashed var(--border-subtle)' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Materiais ({materials.length})</span>
                        <span style={{ fontWeight: 600 }}>R$ {totalMaterials.toFixed(2)}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 12, borderBottom: '1px dashed var(--border-subtle)' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Mão de Obra</span>
                        <span style={{ fontWeight: 600 }}>R$ {totalLabor.toFixed(2)}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 12, borderBottom: '1px dashed var(--border-subtle)' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Custos Adicionais</span>
                        <span style={{ fontWeight: 600 }}>R$ {totalCosts.toFixed(2)}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 12 }}>
                        <span style={{ color: 'var(--color-danger)' }}>Descontos Aplicados</span>
                        <span style={{ fontWeight: 600, color: 'var(--color-danger)' }}>- R$ {discountAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <motion.button 
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      className="btn-primary" 
                      style={{ borderRadius: 20, padding: 20, fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}
                      onClick={generatePDF}
                      disabled={isGenerating}
                    >
                      {isGenerating ? 'Processando...' : <><Download size={20} /> Gerar PDF Formal</>}
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      className="btn-primary" 
                      style={{ borderRadius: 20, padding: 20, fontSize: 16, fontWeight: 700, backgroundColor: '#10B981', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, border: 'none' }}
                      onClick={handleApprove}
                    >
                      <CheckCircle size={20} /> Aprovar e Salvar
                    </motion.button>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

        {/* SIDEBAR FOR DESKTOP */}
        <div style={{ display: 'none' }} className="desktop-sidebar">
          {step > 0 && renderSidebar()}
        </div>
      </div>

      {/* FLOATING NAVIGATION FOOTER */}
      {step > 0 && step < 10 && (
        <div style={{ 
          position: 'fixed', bottom: 0, left: 0, right: 0, 
          padding: '16px 24px', backgroundColor: 'var(--bg-elevated)', 
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          boxShadow: '0 -4px 24px rgba(0,0,0,0.05)', zIndex: 100
        }}>
          <button 
            className="btn-secondary" 
            style={{ borderRadius: 16, padding: '14px 24px', fontWeight: 600, display: 'flex', gap: 8, alignItems: 'center' }}
            onClick={() => setStep(step - 1)}
          >
            <ChevronLeft size={18} /> Voltar
          </button>
          
          <button 
            className="btn-primary" 
            style={{ borderRadius: 16, padding: '14px 32px', fontWeight: 700, display: 'flex', gap: 8, alignItems: 'center' }}
            onClick={() => setStep(step + 1)}
          >
            Avançar <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* CSS for Desktop Sidebar Visibility */}
      <style>{`
        @media (min-width: 1024px) {
          .desktop-sidebar {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
}
