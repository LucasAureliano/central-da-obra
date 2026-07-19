import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, CheckCircle, FileText, 
  Settings, Package, Users, DollarSign, 
  Download, Plus, Trash2, Search, Zap, 
  PaintRoller, BrickWall, Droplet, LayoutGrid, AlertCircle,
  User, Phone, Mail, MapPin, Box
} from 'lucide-react';

import { useAuth } from '../../contexts/AuthContext';
import { useAuthModal } from '../../contexts/AuthModalContext';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { generateCommercialQuotePDF } from '../../utils/pdfGenerator';
import { CopilotTip } from '../assistant/CopilotTip';

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
    desc: 'Inclui: Passagem de fiação, troca de disjuntores e instalação de tomadas/interruptores.',
    services: [{ id: '1', desc: 'Revisão Elétrica e Troca de Disjuntores', qtd: 1, un: 'un', price: 1500 }],
    conditions: { prazo: '3 dias úteis', garantia: '12 meses', pagamento: '30% Entrada, 70% Entrega' }
  },
  'Pintura': {
    icon: <PaintRoller size={32} color="#EC4899" />,
    desc: 'Inclui: Preparação de superfície, lixamento, massa corrida e pintura (2 demãos).',
    services: [{ id: '1', desc: 'Pintura Acrílica (2 demãos)', qtd: 1, un: 'm²', price: 25 }],
    conditions: { prazo: '10 dias úteis', garantia: '6 meses', pagamento: '50% Entrada, 50% Entrega' }
  },
  'Alvenaria': {
    icon: <BrickWall size={32} color="#F59E0B" />,
    desc: 'Inclui: Marcação, assentamento de blocos/tijolos, prumo e nivelamento.',
    services: [{ id: '1', desc: 'Alvenaria de Vedação', qtd: 1, un: 'm²', price: 45 }],
    conditions: { prazo: '15 dias úteis', garantia: '3 meses', pagamento: '50% Entrada, 50% Entrega' }
  },
  'Hidráulica': {
    icon: <Droplet size={32} color="#0EA5E9" />,
    desc: 'Inclui: Rasgo de alvenaria, passagem de tubulação de água/esgoto e chumbamento.',
    services: [{ id: '1', desc: 'Instalação de Ponto de Água/Esgoto', qtd: 1, un: 'pt', price: 250 }],
    conditions: { prazo: '5 dias úteis', garantia: '6 meses', pagamento: 'À vista' }
  },
  'Projeto Arquitetônico': {
    icon: <LayoutGrid size={32} color="#8B5CF6" />,
    desc: 'Inclui: Levantamento, estudo preliminar, anteprojeto, projeto legal e executivo.',
    services: [{ id: '1', desc: 'Projeto Arquitetônico Completo', qtd: 1, un: 'm²', price: 65 }],
    conditions: { prazo: '30 dias úteis', garantia: 'Vitalícia (Direitos Autorais)', pagamento: '30% Entrada, 30% Estudo, 40% Executivo' }
  },
  'Projeto Estrutural': {
    icon: <BrickWall size={32} color="#F59E0B" />,
    desc: 'Inclui: Cálculo estrutural, fundações, pilares, vigas e lajes (Concreto Armado).',
    services: [{ id: '1', desc: 'Cálculo Estrutural', qtd: 1, un: 'm²', price: 40 }],
    conditions: { prazo: '20 dias úteis', garantia: '5 anos', pagamento: '50% Entrada, 50% Entrega' }
  },
  'Compatibilização BIM': {
    icon: <Box size={32} color="#10B981" />,
    desc: 'Inclui: Modelagem 3D, detecção de interferências (Clash Detection) e extração de quantitativos.',
    services: [{ id: '1', desc: 'Modelagem e Compatibilização BIM', qtd: 1, un: 'm²', price: 35 }],
    conditions: { prazo: '15 dias úteis', garantia: '3 meses', pagamento: '40% Entrada, 60% Entrega' }
  },
  'Emissão de ART/RRT': {
    icon: <FileText size={32} color="#F43F5E" />,
    desc: 'Inclui: Responsabilidade técnica sobre projeto ou execução.',
    services: [{ id: '1', desc: 'Taxa e Emissão de ART/RRT', qtd: 1, un: 'un', price: 600 }],
    conditions: { prazo: '2 dias úteis', garantia: 'N/A', pagamento: '100% Antecipado' }
  }
};

export function QuoteWizard({ onFinish }: { onFinish: () => void }) {
  const { user, isGuest } = useAuth();
  const { profile } = useAuth();
  const { openAuthModal } = useAuthModal();
  
  const [step, setStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showGuestWarning, setShowGuestWarning] = useState(isGuest);

  // --- STATE DATA ---
  const [client, setClient] = useState({ name: '', phone: '', email: '', address: '', city: '', isNew: true });
  const [workData, setWorkData] = useState<{name: string, address: string, isNew: boolean, id?: string}>({ name: '', address: '', isNew: true });
  const [serviceType, setServiceType] = useState('');
  const [existingWorks, setExistingWorks] = useState<any[]>([]);
  const [existingClients, setExistingClients] = useState<any[]>([]);
  const [existingCatalogServices, setExistingCatalogServices] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      getDocs(query(collection(db, 'works'), where('userId', '==', user.uid))).then(snap => {
        setExistingWorks(snap.docs.map(d => ({id: d.id, ...d.data()})));
      });
      getDocs(query(collection(db, 'users', user.uid, 'clients'))).then(snap => {
        setExistingClients(snap.docs.map(d => ({id: d.id, ...d.data()})));
      });
      getDocs(query(collection(db, 'users', user.uid, 'services'))).then(snap => {
        setExistingCatalogServices(snap.docs.map(d => ({id: d.id, ...d.data()})));
      });
    }
  }, [user]);
  
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
      try {
        generateCommercialQuotePDF({
          client,
          workData,
          services,
          materials,
          labor,
          costs,
          conditions,
          totals: {
            totalServices,
            totalMaterials,
            totalLabor,
            totalCosts,
            subtotal,
            discountAmount,
            grandTotal
          },
          profile
        });
      } catch (e) {
        console.error("Erro ao gerar PDF", e);
        alert("Ocorreu um erro ao gerar o PDF. Tente novamente.");
      } finally {
        setIsGenerating(false);
      }
    }, 800);
  };

  const handleApprove = async () => {
    if (isGuest) {
      alert('Orçamento Concluído!\n\nEste é um orçamento temporário. Salve o PDF acima. Crie uma conta gratuitamente para salvar seus orçamentos, obras e clientes.');
      onFinish();
      return;
    }

    if (user) {
      try {
        let selectedWorkId = workData.id;
        
        if (workData.name && workData.isNew) {
          const docRef = await addDoc(collection(db, 'works'), {
            userId: user.uid,
            name: workData.name,
            address: workData.address,
            budget: grandTotal,
            spent: 0,
            progress: 0,
            createdAt: new Date().toISOString()
          });
          selectedWorkId = docRef.id;
        }

        if (selectedWorkId) {
          await addDoc(collection(db, 'works', selectedWorkId, 'calculations'), {
            calcType: 'Orçamento (Assistente)',
            savedAt: new Date().toISOString(),
            totalCost: grandTotal,
            resultData: {
              materials: [
                ...services.map(s => ({ name: s.desc, quantity: s.qtd, unit: s.un, unitPrice: s.price, isPurchased: false })),
                ...materials.map(m => ({ name: m.name || m.desc, quantity: m.qtd, unit: m.un || 'un', unitPrice: m.price, isPurchased: false }))
              ]
            }
          });
        }

        await addDoc(collection(db, 'users', user.uid, 'quotes'), {
          client: client.name || 'Cliente Não Identificado',
          service: serviceType || 'Serviços Diversos',
          value: grandTotal,
          status: 'Aprovado',
          date: new Date().toISOString(),
          workId: selectedWorkId || null
        });
      } catch (err) {
        console.error('Erro ao criar obra e orçamento', err);
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
                style={{ 
                  height: '100%', 
                  background: 'linear-gradient(90deg, #F97316, #FB923C)', 
                  borderRadius: 10,
                  boxShadow: '0 0 12px rgba(249, 115, 22, 0.6)'
                }}
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
        
        <div style={{ flex: 1, padding: 24, overflowY: 'auto', position: 'relative' }}>
          {isGuest && (
            <div style={{ backgroundColor: 'rgba(249, 115, 22, 0.1)', color: '#F97316', padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
              <AlertCircle size={16} />
              Orçamento Temporário (Modo Visitante). Este orçamento não será salvo na nuvem.
            </div>
          )}

          {renderHeader()}

          <AnimatePresence mode="wait">
            <motion.div key={step} {...animationProps}>
              
              {/* STEP 0: WELCOME */}
              {step === 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
                  {[
                    { title: 'Novo Orçamento', desc: 'Comece um orçamento totalmente em branco, preenchendo serviços, materiais e mão de obra do zero.', icon: <FileText size={32} color="#FFF" />, bg: 'var(--color-primary)', action: () => setStep(1) },
                    { title: 'Usar Modelo Existente', desc: 'Utilize estruturas pré-configuradas (ex: Pintura, Elétrica) para ganhar tempo no preenchimento.', icon: <LayoutGrid size={32} color="#FFF" />, bg: '#10B981', action: () => setStep(3) },
                    { title: 'Duplicar Anterior', desc: 'Copie todos os dados de um orçamento que você já enviou para outro cliente.', icon: <Settings size={32} color="#FFF" />, bg: '#8B5CF6', action: () => alert('Em breve!') },
                    { title: 'A partir de Lista', desc: 'Gere um orçamento importando itens diretamente de uma Lista de Compras salva.', icon: <Package size={32} color="#FFF" />, bg: '#F59E0B', action: () => alert('Em breve!') }
                  ].map((item, i) => (
                    <motion.div 
                      key={i}
                      whileHover={{ scale: 1.02, y: -4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={item.action}
                      className="glass-panel"
                      style={{ padding: 32, borderRadius: 24, cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 20, border: '1px solid var(--border-subtle)', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}
                    >
                      <div style={{ width: 64, height: 64, borderRadius: 20, backgroundColor: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 16px rgba(0,0,0,0.2)' }}>
                        {item.icon}
                      </div>
                      <div>
                        <h3 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 8px 0', color: 'var(--text-main)' }}>{item.title}</h3>
                        <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* STEP 1: CLIENT */}
              {step === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <div className="glass-panel" style={{ padding: '12px 20px', borderRadius: 100, display: 'flex', alignItems: 'center', gap: 12, border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-elevated)' }}>
                    <Search size={20} color="var(--color-primary)" />
                    <input type="text" placeholder="Pesquisar cliente existente..." style={{ border: 'none', background: 'transparent', outline: 'none', color: 'var(--text-main)', flex: 1, fontSize: 16 }} />
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
                    <button className={`btn-${client.isNew ? 'primary' : 'secondary'}`} style={{ borderRadius: 16, padding: '16px' }} onClick={() => setClient({ ...client, isNew: true })}>Novo Cliente</button>
                    <button className={`btn-${!client.isNew ? 'primary' : 'secondary'}`} style={{ borderRadius: 16, padding: '16px' }} onClick={() => setClient({ ...client, isNew: false })}>Existente</button>
                  </div>

                  {client.isNew ? (
                    <div className="glass-panel" style={{ padding: 24, borderRadius: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                      <div className="input-group">
                        <label>Nome Completo / Empresa</label>
                        <div className="input-icon-wrapper">
                          <User size={20} />
                          <input type="text" className="input-field" placeholder="Ex: João da Silva" value={client.name} onChange={e => setClient({...client, name: e.target.value})} />
                        </div>
                      </div>
                      <div className="input-group">
                        <label>WhatsApp / Telefone</label>
                        <div className="input-icon-wrapper">
                          <Phone size={20} />
                          <input type="tel" className="input-field" placeholder="(00) 00000-0000" value={client.phone} onChange={e => setClient({...client, phone: e.target.value})} />
                        </div>
                      </div>
                      <div className="input-group">
                        <label>E-mail (opcional)</label>
                        <div className="input-icon-wrapper">
                          <Mail size={20} />
                          <input type="email" className="input-field" placeholder="joao@email.com" value={client.email} onChange={e => setClient({...client, email: e.target.value})} />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="glass-panel" style={{ padding: 24, borderRadius: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                      <div className="input-group">
                        <label>Selecione o Cliente</label>
                        <select 
                          className="input-field" 
                          onChange={e => {
                            const c = existingClients.find(cx => cx.id === e.target.value);
                            if (c) setClient({ ...client, name: c.name, phone: c.phone || '', email: c.email || '', isNew: false });
                          }}
                        >
                          <option value="">-- Selecione --</option>
                          {existingClients.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 2: WORK */}
              {step === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
                    <button className={`btn-${workData.isNew ? 'primary' : 'secondary'}`} style={{ borderRadius: 16, padding: '16px' }} onClick={() => setWorkData({ ...workData, isNew: true })}>Nova Obra</button>
                    <button className={`btn-${!workData.isNew ? 'primary' : 'secondary'}`} style={{ borderRadius: 16, padding: '16px' }} onClick={() => setWorkData({ ...workData, isNew: false })}>Existente</button>
                  </div>

                  {workData.isNew ? (
                    <div className="glass-panel" style={{ padding: 24, borderRadius: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                      <div className="input-group">
                        <label>Nome da Obra</label>
                        <input type="text" className="input-field" placeholder="Ex: Reforma Apto 402" value={workData.name} onChange={e => setWorkData({...workData, name: e.target.value})} />
                      </div>
                      <div className="input-group">
                        <label>Endereço Completo</label>
                        <div className="input-icon-wrapper">
                          <MapPin size={20} />
                          <input type="text" className="input-field" placeholder="Rua, Número, Bairro..." value={workData.address} onChange={e => setWorkData({...workData, address: e.target.value})} />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="glass-panel" style={{ padding: 24, borderRadius: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                      <div className="input-group">
                        <label>Selecione a Obra</label>
                        <select 
                          className="input-field" 
                          value={workData.id || ''} 
                          onChange={e => {
                            const w = existingWorks.find(wx => wx.id === e.target.value);
                            setWorkData({...workData, id: w?.id, name: w?.name || '', address: w?.address || ''});
                          }}
                        >
                          <option value="">-- Selecione --</option>
                          {existingWorks.map(w => (
                            <option key={w.id} value={w.id}>{w.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 3: TYPE */}
              {step === 3 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: 0 }}>Selecione um modelo pré-configurado. Você poderá editar os itens livremente nas próximas etapas.</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                    {Object.keys(TEMPLATES).map(key => (
                      <motion.div 
                        key={key} 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => applyTemplate(key)}
                        className="glass-panel"
                        style={{ 
                          padding: 24, borderRadius: 24, 
                          border: `2px solid ${serviceType === key ? 'var(--color-primary)' : 'var(--border-subtle)'}`,
                          backgroundColor: serviceType === key ? 'rgba(30, 58, 138, 0.05)' : 'var(--bg-elevated)',
                          cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 16
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                          <div style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                            {TEMPLATES[key].icon}
                          </div>
                          <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-main)' }}>{key}</span>
                        </div>
                        <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                          {TEMPLATES[key].desc}
                        </p>
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
                      <div className="input-group">
                        <label>Descrição do Serviço</label>
                        <input type="text" className="input-field" placeholder="Ex: Pintura das paredes internas..." value={s.desc} onChange={e => { const ns = [...services]; ns[index].desc = e.target.value; setServices(ns); }} style={{ fontSize: 16 }} />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: 12 }}>
                        <div className="input-group">
                          <label>Qtd</label>
                          <input type="number" className="input-field" value={s.qtd} onChange={e => { const ns = [...services]; ns[index].qtd = Number(e.target.value); setServices(ns); }} />
                        </div>
                        <div className="input-group">
                          <label>Unidade</label>
                          <input type="text" className="input-field" placeholder="Ex: m², un" value={s.un} onChange={e => { const ns = [...services]; ns[index].un = e.target.value; setServices(ns); }} />
                        </div>
                        <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                          <label>Valor Unit. (R$)</label>
                          <div className="input-icon-wrapper">
                            <DollarSign size={20} />
                            <input type="number" className="input-field" value={s.price} onChange={e => { const ns = [...services]; ns[index].price = Number(e.target.value); setServices(ns); }} />
                          </div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', fontWeight: 800, fontSize: 18, color: 'var(--text-main)', marginTop: 4 }}>
                        Subtotal: R$ {(s.qtd * s.price).toFixed(2)}
                      </div>
                    </motion.div>
                  ))}
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <motion.button 
                      whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                      className="btn-secondary" 
                      style={{ borderRadius: 20, padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, border: '2px dashed var(--border-subtle)', background: 'transparent' }}
                      onClick={() => setServices([...services, { id: Date.now().toString(), desc: '', qtd: 1, un: 'un', price: 0 }])}
                    >
                      <Plus size={20} /> Adicionar Novo Serviço
                    </motion.button>
                    <select 
                      className="btn-secondary"
                      style={{ borderRadius: 20, padding: '0 20px', border: '2px dashed var(--border-subtle)', background: 'transparent', color: 'var(--text-main)', cursor: 'pointer', appearance: 'none' }}
                      onChange={e => {
                        const s = existingCatalogServices.find(x => x.id === e.target.value);
                        if (s) {
                          setServices([...services, { id: Date.now().toString(), desc: s.name, qtd: 1, un: s.unit || 'un', price: s.price || 0 }]);
                        }
                        e.target.value = '';
                      }}
                    >
                      <option value="">+ Importar do Catálogo</option>
                      {existingCatalogServices.map(s => <option key={s.id} value={s.id}>{s.name} ({s.category})</option>)}
                    </select>
                  </div>
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
                      <div className="input-group">
                        <label>Nome do Material</label>
                        <input type="text" className="input-field" placeholder="Ex: Cimento 50kg..." value={m.name} onChange={e => { const nm = [...materials]; nm[index].name = e.target.value; setMaterials(nm); }} />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 12 }}>
                        <div className="input-group">
                          <label>Qtd</label>
                          <input type="number" className="input-field" value={m.qtd} onChange={e => { const nm = [...materials]; nm[index].qtd = Number(e.target.value); setMaterials(nm); }} />
                        </div>
                        <div className="input-group">
                          <label>Valor Unit. (R$)</label>
                          <div className="input-icon-wrapper">
                            <DollarSign size={20} />
                            <input type="number" className="input-field" value={m.price} onChange={e => { const nm = [...materials]; nm[index].price = Number(e.target.value); setMaterials(nm); }} />
                          </div>
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
                      <div style={{ flex: 1 }} className="input-group">
                        <label style={{ color: 'var(--text-main)' }}>Profissionais Envolvidos</label>
                        <input type="number" className="input-field" value={labor.workers} onChange={e => setLabor({...labor, workers: Number(e.target.value)})} style={{ fontSize: 20, fontWeight: 700 }} />
                      </div>
                    </div>
                    
                    <div style={{ height: 1, backgroundColor: 'var(--border-subtle)' }} />

                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981' }}>
                        <AlertCircle size={24} />
                      </div>
                      <div style={{ flex: 1 }} className="input-group">
                        <label style={{ color: 'var(--text-main)' }}>Dias de Trabalho</label>
                        <input type="number" className="input-field" value={labor.days} onChange={e => setLabor({...labor, days: Number(e.target.value)})} style={{ fontSize: 20, fontWeight: 700 }} />
                      </div>
                    </div>

                    <div style={{ height: 1, backgroundColor: 'var(--border-subtle)' }} />

                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: 'rgba(245, 158, 11, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F59E0B' }}>
                        <DollarSign size={24} />
                      </div>
                      <div style={{ flex: 1 }} className="input-group">
                        <label style={{ color: 'var(--text-main)' }}>Valor da Diária (R$)</label>
                        <input type="number" className="input-field" value={labor.dailyRate} onChange={e => setLabor({...labor, dailyRate: Number(e.target.value)})} style={{ fontSize: 20, fontWeight: 700 }} />
                      </div>
                    </div>
                  </div>

                  <div className="glass-panel" style={{ padding: 24, borderRadius: 24, backgroundColor: 'var(--color-primary)', color: '#FFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
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
                    <div key={item.key} className="glass-panel" style={{ padding: 20, borderRadius: 20, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16, border: '1px solid var(--border-subtle)' }}>
                      <div style={{ flex: '1 1 200px' }}>
                        <h4 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 4px 0' }}>{item.title}</h4>
                        <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>{item.desc}</p>
                      </div>
                      <div className="input-icon-wrapper" style={{ width: 140 }}>
                        <DollarSign size={20} />
                        <input 
                          type="number" 
                          className="input-field" 
                          style={{ fontWeight: 700, fontSize: 16 }}
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
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16 }}>
                    <motion.div 
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      onClick={() => setDiscount({ ...discount, isPercentage: false })}
                      style={{ 
                        padding: 24, borderRadius: 24, cursor: 'pointer', textAlign: 'center',
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
                        padding: 24, borderRadius: 24, cursor: 'pointer', textAlign: 'center',
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
                  
                  <CopilotTip tip={discountAmount > grandTotal * 0.1 ? 'Atenção: Seu desconto está superando 10% do valor total. Certifique-se de que sua margem de lucro não está sendo comprometida.' : null} />
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

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
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
                      style={{ borderRadius: 20, padding: 20, fontSize: 16, fontWeight: 700, backgroundColor: '#25D366', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, border: 'none' }}
                      onClick={() => {
                        const msg = `*Orçamento: ${client.name}*\n\nServiços: R$ ${totalServices.toFixed(2)}\nMateriais: R$ ${totalMaterials.toFixed(2)}\nMão de Obra: R$ ${totalLabor.toFixed(2)}\n\n*Total: R$ ${grandTotal.toFixed(2)}*\n\nPrazo: ${conditions.prazo}\nPagamento: ${conditions.pagamento}\nValidade: ${conditions.validade}`;
                        window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
                      }}
                    >
                      <Phone size={20} /> Enviar WhatsApp
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
          padding: '16px 24px', paddingBottom: 'calc(16px + env(safe-area-inset-bottom, 0px) + 80px)',
          backgroundColor: 'var(--bg-elevated)', 
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

      {/* GUEST WARNING MODAL */}
      <AnimatePresence>
        {showGuestWarning && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)',
            zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass-panel"
              style={{ width: '100%', maxWidth: 450, padding: 32, borderRadius: 32, display: 'flex', flexDirection: 'column', gap: 24, position: 'relative' }}
            >
              <div style={{ width: 64, height: 64, borderRadius: 20, backgroundColor: 'rgba(249, 115, 22, 0.1)', color: '#F97316', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                <AlertCircle size={32} />
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-main)', marginBottom: 12 }}>Modo Visitante</h2>
                <p style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 16 }}>
                  Você pode gerar seu orçamento e exportar o PDF normalmente, porém <strong>ele não será salvo</strong> no aplicativo e será perdido ao sair.
                </p>
                <p style={{ fontSize: 14, color: 'var(--text-main)', fontWeight: 500 }}>
                  Faça login para salvar seus orçamentos, obras e clientes.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <button 
                  className="btn-primary" 
                  style={{ padding: '16px', borderRadius: 16, fontWeight: 600, fontSize: 16 }}
                  onClick={() => {
                    setShowGuestWarning(false);
                    onFinish();
                    openAuthModal();
                  }}
                >
                  Entrar ou Criar Conta
                </button>
                <button 
                  className="btn-secondary" 
                  style={{ padding: '16px', borderRadius: 16, fontWeight: 600, fontSize: 16 }}
                  onClick={() => setShowGuestWarning(false)}
                >
                  Continuar como Visitante
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
