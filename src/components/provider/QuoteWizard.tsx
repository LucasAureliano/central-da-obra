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
import { materialPriceService } from '../../services/materials/MaterialPriceService';
import { CopilotTip } from '../assistant/CopilotTip';
import { PostApprovalModal } from './PostApprovalModal';
import { QuoteStepWelcome } from './quote_wizard/QuoteStepWelcome';
import { QuoteStepClient } from './quote_wizard/QuoteStepClient';
import { QuoteStepWork } from './quote_wizard/QuoteStepWork';
import { QuoteStepType } from './quote_wizard/QuoteStepType';
import { QuoteStepServices } from './quote_wizard/QuoteStepServices';
import { QuoteStepMaterials } from './quote_wizard/QuoteStepMaterials';
import { QuoteStepLabor } from './quote_wizard/QuoteStepLabor';
import { QuoteStepCosts } from './quote_wizard/QuoteStepCosts';
import { QuoteStepDiscount } from './quote_wizard/QuoteStepDiscount';
import { QuoteStepConditions } from './quote_wizard/QuoteStepConditions';
import { QuoteStepSummary } from './quote_wizard/QuoteStepSummary';

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
  const [showPostApproval, setShowPostApproval] = useState(false);

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
      getDocs(query(collection(db, 'users', user.uid, 'services_catalog'))).then(snap => {
        setExistingCatalogServices(snap.docs.map(d => ({id: d.id, ...d.data()})));
      });
    }
  }, [user]);
  
  const [services, setServices] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [isFetchingPrices, setIsFetchingPrices] = useState(false);
  const [labor, setLabor] = useState({ days: 1, workers: 1, dailyRate: 150, obs: '' });
  const [costs, setCosts] = useState({ freight: 0, displacement: 0, rental: 0, others: 0 });
  const [discount, setDiscount] = useState({ value: 0, isPercentage: false });
  const [conditions, setConditions] = useState({ prazo: '', garantia: '', pagamento: '', validade: '15 dias', obs: '' });

  const fetchMarketPrices = async () => {
    if (materials.length === 0) return;
    setIsFetchingPrices(true);
    try {
      const names = materials.map(m => m.name || m.desc).filter(Boolean);
      const pricesData = await materialPriceService.searchMultiple(names);
      
      const newMaterials = materials.map(m => {
        const matName = m.name || m.desc;
        const matches = pricesData[matName] || [];
        if (matches.length > 0) {
          return { ...m, price: matches[0].price, supplier: matches[0].supplier, link: matches[0].link };
        }
        return m;
      });
      setMaterials(newMaterials);
    } catch (e) {
      console.error('Error fetching market prices:', e);
    } finally {
      setIsFetchingPrices(false);
    }
  };

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
  const generatePDF = async () => {
    setIsGenerating(true);
    try {
      await generateCommercialQuotePDF({
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
            roles: {},
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
                ...materials.map(m => ({ name: m.name || m.desc, quantity: m.qtd, unit: m.un || 'un', unitPrice: m.price || 0, supplier: m.supplier || '', link: m.link || '', isPurchased: false }))
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
    setShowPostApproval(true);
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
    <div style={{ width: '100%', backgroundColor: 'var(--bg-base)', padding: '16px', paddingBottom: 120, display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 800, display: 'flex', flexDirection: 'column', gap: 24 }}>
        
        <div style={{ flex: 1, position: 'relative' }}>
          {isGuest && (
            <div style={{ backgroundColor: 'rgba(249, 115, 22, 0.1)', color: '#F97316', padding: '12px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
              <AlertCircle size={16} />
              Orçamento Temporário (Modo Visitante). Este orçamento não será salvo na nuvem.
            </div>
          )}

          {renderHeader()}

          <AnimatePresence mode="wait">
            <motion.div key={step} {...animationProps}>
              
              {/* STEP 0: WELCOME */}
              {step === 0 && (
                <QuoteStepWelcome setStep={setStep} />
              )}

              {/* STEP 1: CLIENT */}
              {step === 1 && (
                <QuoteStepClient client={client} setClient={setClient} existingClients={existingClients} />
              )}

              {/* STEP 2: WORK */}
              {step === 2 && (
                <QuoteStepWork workData={workData} setWorkData={setWorkData} existingWorks={existingWorks} />
              )}

              {/* STEP 3: TYPE */}
              {step === 3 && (
                <QuoteStepType TEMPLATES={TEMPLATES} serviceType={serviceType} applyTemplate={applyTemplate} setServiceType={setServiceType} setServices={setServices} setStep={setStep} />
              )}

              {/* STEP 4: SERVICES */}
              {step === 4 && (
                <QuoteStepServices services={services} setServices={setServices} existingCatalogServices={existingCatalogServices} />
              )}

              {/* STEP 5: MATERIALS */}
              {step === 5 && (
                <QuoteStepMaterials materials={materials} setMaterials={setMaterials} fetchMarketPrices={fetchMarketPrices} isFetchingPrices={isFetchingPrices} />
              )}

              {/* STEP 6: LABOR */}
              {step === 6 && (
                <QuoteStepLabor labor={labor} setLabor={setLabor} totalLabor={totalLabor} />
              )}

              {/* STEP 7: ADDITIONAL COSTS */}
              {step === 7 && (
                <QuoteStepCosts costs={costs} setCosts={setCosts} totalCosts={totalCosts} />
              )}

              {/* STEP 8: DISCOUNT */}
              {step === 8 && (
                <QuoteStepDiscount discount={discount} setDiscount={setDiscount} discountAmount={discountAmount} grandTotal={grandTotal} />
              )}

              {/* STEP 9: CONDITIONS */}
              {step === 9 && (
                <QuoteStepConditions conditions={conditions} setConditions={setConditions} />
              )}

              {/* STEP 10: SUMMARY */}
              {step === 10 && (
                <QuoteStepSummary client={client} workData={workData} services={services} materials={materials} conditions={conditions} grandTotal={grandTotal} totalServices={totalServices} totalMaterials={totalMaterials} totalLabor={totalLabor} totalCosts={totalCosts} discountAmount={discountAmount} isGenerating={isGenerating} generatePDF={generatePDF} handleApprove={handleApprove} />
              )}

            </motion.div>
          </AnimatePresence>
        </div>

        {/* SIDEBAR FOR DESKTOP */}
        <div style={{ display: 'none' }} className="desktop-sidebar">
          {step > 0 && renderSidebar()}
        </div>

        {/* NAVIGATION FOOTER */}
        {step > 0 && step < 10 && (
          <div style={{ 
            marginTop: 40,
            padding: '24px 0', 
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            width: '100%'
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
              Próximo <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>


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
      <PostApprovalModal
        isOpen={showPostApproval}
        onClose={() => {
          setShowPostApproval(false);
          onFinish();
        }}
        quoteData={{
          clientName: client.name || 'Cliente',
          clientPhone: client.phone,
          clientEmail: client.email,
          workName: workData.name,
          workAddress: workData.address,
          grandTotal,
          serviceType,
          services
        }}
      />
    </div>
  );
}
