import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, ChevronLeft, Home, HardHat, DraftingCompass, 
  Building2, Calculator, CheckCircle2, Users, Calendar, BarChart3,
  ClipboardList, CreditCard
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import type { UserRole } from '../../contexts/AuthContext';
import { doc, updateDoc, collection, addDoc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { generateDefaultStages } from '../../lib/ChecklistGenerator';
import { Logo } from '../ui/Logo';

interface OnboardingEngineProps {
  onComplete: () => void;
}

const ParticlesBackground = () => {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{
            opacity: 0,
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            scale: Math.random() * 0.5 + 0.5,
          }}
          animate={{
            opacity: [0.05, 0.2, 0.05],
            y: [null, Math.random() * window.innerHeight],
            x: [null, Math.random() * window.innerWidth],
          }}
          transition={{
            duration: Math.random() * 20 + 20,
            repeat: Infinity,
            ease: 'linear'
          }}
          style={{
            position: 'absolute',
            width: Math.random() * 400 + 100,
            height: Math.random() * 400 + 100,
            borderRadius: '50%',
            background: 'radial-gradient(circle, var(--color-primary-alpha) 0%, transparent 70%)',
            filter: 'blur(50px)',
          }}
        />
      ))}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(15,23,42,0.8), rgba(15,23,42,0.95))', zIndex: -1 }}></div>
    </div>
  );
};

const ROLES = [
  { id: 'owner', title: 'Proprietário', icon: Home, desc: 'Controle sua obra, gastos, compras e progresso.' },
  { id: 'service', title: 'Prestador de Serviço', icon: HardHat, desc: 'Crie orçamentos, organize clientes e recebimentos.' },
  { id: 'architect', title: 'Arquiteto/Engenheiro', icon: DraftingCompass, desc: 'Gerencie projetos, vistorias e acompanhamento.' },
  { id: 'builder', title: 'Construtora', icon: Building2, desc: 'Centralize operações, equipes e gestão financeira.' }
] as const;

const ROLE_FEATURES = {
  owner: [
    { icon: Home, title: 'Obra Principal', desc: 'Acompanhe tudo sobre sua construção em um único lugar.' },
    { icon: Calculator, title: 'Cálculos Exatos', desc: 'Saiba exatamente quanto de material comprar sem desperdício.' },
    { icon: CreditCard, title: 'Financeiro', desc: 'Controle seu orçamento e não estoure o limite da obra.' }
  ],
  service: [
    { icon: ClipboardList, title: 'Orçamentos', desc: 'Gere orçamentos profissionais em PDF e feche mais negócios.' },
    { icon: Users, title: 'Clientes e Serviços', desc: 'Tenha o histórico de todos os seus clientes organizados.' },
    { icon: Calculator, title: 'Assistente', desc: 'Ferramentas rápidas para o dia a dia na obra.' }
  ],
  architect: [
    { icon: DraftingCompass, title: 'Gestão de Projetos', desc: 'Acompanhamento técnico e diário de obra digital.' },
    { icon: Calendar, title: 'Cronograma', desc: 'Controle rígido de etapas e medições da obra.' },
    { icon: BarChart3, title: 'Relatórios e Vistorias', desc: 'Crie relatórios detalhados para os seus clientes.' }
  ],
  builder: [
    { icon: Building2, title: 'Centro de Operações', desc: 'Dashboard executivo para múltiplas obras simultâneas.' },
    { icon: Users, title: 'Gestão de Equipes', desc: 'Controle produtividade e alocação de profissionais.' },
    { icon: CreditCard, title: 'Financeiro Corporativo', desc: 'Fluxo de caixa avançado e gestão de contas a pagar.' }
  ]
};

export const OnboardingEngine: React.FC<OnboardingEngineProps> = ({ onComplete }) => {
  const { user } = useAuth();
  const [stage, setStage] = useState<'welcome' | 'role' | 'presentation' | 'conclusion'>('welcome');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isFinishing, setIsFinishing] = useState(false);

  const handleNext = () => {
    if (stage === 'welcome') setStage('role');
    else if (stage === 'role' && selectedRole) setStage('presentation');
    else if (stage === 'presentation') setStage('conclusion');
    else if (stage === 'conclusion') finalizeOnboarding();
  };

  const handleSkip = () => {
    finalizeOnboarding();
  };

  const finalizeOnboarding = async () => {
    if (isFinishing) return;
    setIsFinishing(true);

    if (user && !user.isAnonymous) {
      try {
        const userRef = doc(db, 'users', user.uid);
        // Set both role and hasSeenWelcome. We do NOT set hasSeenTour so InteractiveTour will run.
        const updateData: any = { hasSeenWelcome: true };
        if (selectedRole) updateData.role = selectedRole;
        
        await updateDoc(userRef, updateData);

        if (selectedRole === 'owner' || selectedRole === 'builder') {
          const defaultWorkName = selectedRole === 'owner' ? 'Minha Casa' : 'Residencial Vila Nova';
          const newWorkRef = await addDoc(collection(db, 'works'), {
            userId: user.uid,
            name: defaultWorkName,
            client: 'Próprio',
            address: 'Não informado',
            budget: 0,
            deadline: 'N/A',
            status: 'Em andamento',
            progress: 0,
            image: null,
            colorTheme: '#3B82F6',
            roles: {},
            createdAt: serverTimestamp(),
          });
          const defaultStages = generateDefaultStages();
          const batch = writeBatch(db);
          defaultStages.forEach(st => {
            const stageRef = doc(collection(db, `works/${newWorkRef.id}/stages`));
            batch.set(stageRef, st);
          });
          await batch.commit();
        }
      } catch (err) {
        console.error('Error marking welcome:', err);
      }
    } else {
      localStorage.setItem('guestHasSeenWelcome', 'true');
      if (selectedRole) localStorage.setItem('pendingRole', selectedRole);
      window.location.reload();
    }
    
    onComplete();
  };

  const slideVariants = {
    enter: { opacity: 0, y: 20, scale: 0.98 },
    center: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -20, scale: 0.98 }
  };

  const renderWelcome = () => (
    <motion.div variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.5, ease: "easeOut" }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', padding: 24, maxWidth: 600, margin: '0 auto' }}>
      <div style={{ marginBottom: 40, transform: 'scale(1.5)' }}>
        <Logo variant="splash" theme="dark" />
      </div>
      <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, color: '#FFF', marginBottom: 24, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
        Bem-vindo ao futuro da construção
      </h1>
      <p style={{ fontSize: 'clamp(16px, 3vw, 20px)', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: 48 }}>
        Organize sua obra, faça cálculos avançados, gerencie compras e tenha controle total financeiro e operacional em um só lugar.
      </p>
      <button onClick={handleNext} className="btn-primary glow-effect" style={{ padding: '16px 48px', fontSize: 18, borderRadius: 32, fontWeight: 700 }}>
        Começar a jornada
      </button>
    </motion.div>
  );

  const renderRole = () => (
    <motion.div variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4 }} style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '80px 24px 40px', maxWidth: 800, margin: '0 auto', overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <h2 style={{ fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: 800, color: '#FFF', marginBottom: 16 }}>Qual é o seu perfil?</h2>
        <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.7)' }}>A CentralObra adapta a experiência de acordo com as suas necessidades reais.</p>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, flex: 1, alignContent: 'center' }}>
        {ROLES.map((r) => {
          const isSelected = selectedRole === r.id;
          return (
            <motion.div
              key={r.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setSelectedRole(r.id as UserRole);
                setTimeout(() => {
                  setStage('presentation');
                }, 400);
              }}
              style={{
                padding: 24, borderRadius: 24, cursor: 'pointer',
                background: isSelected ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255,255,255,0.03)',
                border: `2px solid ${isSelected ? '#3B82F6' : 'rgba(255,255,255,0.1)'}`,
                boxShadow: isSelected ? '0 10px 40px rgba(59, 130, 246, 0.2)' : 'none',
                backdropFilter: 'blur(20px)', display: 'flex', flexDirection: 'column', gap: 16, position: 'relative', overflow: 'hidden'
              }}
            >
              {isSelected && (
                <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 70%)', filter: 'blur(20px)' }} />
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: isSelected ? '#3B82F6' : 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF' }}>
                  <r.icon size={28} />
                </div>
                {isSelected && <CheckCircle2 size={24} color="#3B82F6" />}
              </div>
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: '#FFF', marginBottom: 8 }}>{r.title}</h3>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>{r.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 40, alignItems: 'center' }}>
        <button onClick={() => setStage('welcome')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
          <ChevronLeft size={20} /> Voltar
        </button>
        <button 
          onClick={handleNext}
          disabled={!selectedRole}
          className={selectedRole ? "btn-primary glow-effect" : ""}
          style={{ padding: '16px 32px', borderRadius: 20, fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, opacity: selectedRole ? 1 : 0.5, background: selectedRole ? '#3B82F6' : 'rgba(255,255,255,0.1)', border: 'none', color: '#FFF', cursor: selectedRole ? 'pointer' : 'not-allowed' }}
        >
          Continuar <ChevronRight size={20} />
        </button>
      </div>
    </motion.div>
  );

  const renderPresentation = () => {
    const features = selectedRole ? ROLE_FEATURES[selectedRole as keyof typeof ROLE_FEATURES] : [];
    
    return (
      <motion.div variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4 }} style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '80px 24px 40px', maxWidth: 800, margin: '0 auto', overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: 800, color: '#FFF', marginBottom: 16 }}>Preparamos o seu ambiente</h2>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.7)' }}>Abaixo estão alguns dos recursos que você terá acesso imediato.</p>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1, justifyContent: 'center' }}>
          {features.map((feat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15, duration: 0.4 }}
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)', borderRadius: 20, padding: 24, display: 'flex', alignItems: 'center', gap: 24 }}
            >
              <div style={{ width: 64, height: 64, borderRadius: 20, background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3B82F6', flexShrink: 0 }}>
                <feat.icon size={32} />
              </div>
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: '#FFF', marginBottom: 6 }}>{feat.title}</h3>
                <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>{feat.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 40 }}>
          <button onClick={handleNext} className="btn-primary glow-effect" style={{ padding: '16px 40px', borderRadius: 20, fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
            Avançar <ChevronRight size={20} />
          </button>
        </div>
      </motion.div>
    );
  };

  const renderConclusion = () => (
    <motion.div variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.5 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', padding: 24, maxWidth: 600, margin: '0 auto' }}>
      <div style={{ width: 100, height: 100, borderRadius: 50, background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981', marginBottom: 32 }}>
        <CheckCircle2 size={48} />
      </div>
      <h2 style={{ fontSize: 'clamp(32px, 5vw, 40px)', fontWeight: 800, color: '#FFF', marginBottom: 16 }}>Tudo pronto!</h2>
      <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: 48 }}>
        Seu ambiente foi configurado. Agora você fará um breve tour guiado para conhecer as principais ferramentas do aplicativo.
      </p>
      <button onClick={finalizeOnboarding} disabled={isFinishing} className="btn-primary glow-effect" style={{ padding: '16px 48px', fontSize: 18, borderRadius: 32, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 12 }}>
        {isFinishing ? 'Preparando...' : 'Entrar no Aplicativo'}
      </button>
    </motion.div>
  );

  return (
    <div style={{
      position: 'fixed', inset: 0, backgroundColor: '#0f172a',
      zIndex: 9999, display: 'flex', flexDirection: 'column', overflow: 'hidden'
    }}>
      <ParticlesBackground />
      
      {/* ProgressBar */}
      <div style={{ position: 'absolute', top: 24, left: 24, right: 24, display: 'flex', justifyContent: 'center', gap: 8, zIndex: 10 }}>
        {['welcome', 'role', 'presentation', 'conclusion'].map((s, i) => {
          const stages = ['welcome', 'role', 'presentation', 'conclusion'];
          const currentIndex = stages.indexOf(stage);
          const isActive = i <= currentIndex;
          return (
            <div key={s} style={{ height: 4, width: 40, borderRadius: 2, background: isActive ? '#3B82F6' : 'rgba(255,255,255,0.1)', transition: 'background 0.3s ease' }} />
          );
        })}
      </div>

      <button onClick={handleSkip} style={{ position: 'absolute', top: 16, right: 24, background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 14, fontWeight: 600, cursor: 'pointer', zIndex: 10, padding: 8 }}>
        Pular
      </button>

      <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
        <AnimatePresence mode="wait">
          {stage === 'welcome' && <React.Fragment key="welcome">{renderWelcome()}</React.Fragment>}
          {stage === 'role' && <React.Fragment key="role">{renderRole()}</React.Fragment>}
          {stage === 'presentation' && <React.Fragment key="presentation">{renderPresentation()}</React.Fragment>}
          {stage === 'conclusion' && <React.Fragment key="conclusion">{renderConclusion()}</React.Fragment>}
        </AnimatePresence>
      </div>
    </div>
  );
};
