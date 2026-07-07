import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import type { UserRole } from '../../contexts/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { OwnerDemo } from './OwnerDemo';
import { ServiceDemo } from './ServiceDemo';
import { ArchitectDemo } from './ArchitectDemo';
import { BuilderDemo } from './BuilderDemo';
import { SpecialtySelection } from './SpecialtySelection';
import { OnboardingConclusion } from './OnboardingConclusion';

interface OnboardingEngineProps {
  role: UserRole;
  onComplete: () => void;
}

export const OnboardingEngine: React.FC<OnboardingEngineProps> = ({ role, onComplete }) => {
  const { user } = useAuth();
  const [stage, setStage] = useState<'demo' | 'specialty' | 'conclusion'>('demo');
  const [stepIndex, setStepIndex] = useState(0);
  const [actionCompleted, setActionCompleted] = useState(false); // Controls if the user interacted successfully in current step
  const [isFinishing, setIsFinishing] = useState(false);

  // Define max steps per role
  const getDemoLength = (r: UserRole) => {
    switch (r) {
      case 'owner': return 4;
      case 'service': return 4;
      case 'architect': return 2;
      case 'builder': return 3;
      default: return 3;
    }
  };

  const demoLength = getDemoLength(role);

  const handleNextStep = () => {
    if (stepIndex < demoLength - 1) {
      setStepIndex(stepIndex + 1);
      setActionCompleted(false);
    } else {
      finishDemo();
    }
  };

  const handlePrevStep = () => {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
      setActionCompleted(true); // Assuming they already did it if they go back
    }
  };

  const finishDemo = () => {
    if (role === 'service') {
      setStage('specialty');
    } else {
      setStage('conclusion');
    }
  };

  const finishSpecialty = async (specialty: string) => {
    setIsFinishing(true);
    if (user && !user.isAnonymous) {
      try {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, { specialty });
      } catch (err) {
        console.error('Error saving specialty:', err);
      }
    } else {
      localStorage.setItem('pendingSpecialty', specialty);
    }
    setStage('conclusion');
  };

  const finalizeOnboarding = async () => {
    if (user && !user.isAnonymous) {
      try {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, { hasSeenWelcome: true });
      } catch (err) {
        console.error('Error marking welcome:', err);
      }
    }
    onComplete();
  };

  const renderDemo = () => {
    const props = { step: stepIndex, onActionComplete: () => setActionCompleted(true) };
    switch (role) {
      case 'owner': return <OwnerDemo {...props} />;
      case 'service': return <ServiceDemo {...props} />;
      case 'architect': return <ArchitectDemo {...props} />;
      case 'builder': return <BuilderDemo {...props} />;
      default: return null;
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'var(--bg-main)',
      zIndex: 9999,
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden'
    }}>
      <AnimatePresence mode="wait">
        {stage === 'demo' && (
          <motion.div 
            key="demo"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
          >
            {/* Header / Controls */}
            <div style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                {Array.from({ length: demoLength }).map((_, i) => (
                  <div key={i} style={{
                    width: 40, height: 4, borderRadius: 2,
                    backgroundColor: i <= stepIndex ? 'var(--color-primary)' : 'var(--border-subtle)',
                    transition: 'all 0.3s ease'
                  }} />
                ))}
              </div>
              <button 
                onClick={finishDemo}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
              >
                Pular
              </button>
            </div>

            {/* Main Interactive Area */}
            <div style={{ flex: 1, position: 'relative', overflow: 'hidden', padding: '0 24px' }}>
              {renderDemo()}
            </div>

            {/* Bottom Controls */}
            <div style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', zIndex: 10 }}>
              <button 
                onClick={handlePrevStep}
                disabled={stepIndex === 0}
                style={{
                  padding: '12px 24px', borderRadius: 16, background: 'var(--bg-glass)', border: '1px solid var(--border-subtle)',
                  color: stepIndex === 0 ? 'var(--text-muted)' : 'var(--text-main)', cursor: stepIndex === 0 ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', gap: 8, opacity: stepIndex === 0 ? 0.5 : 1
                }}
              >
                <ChevronLeft size={18} /> Voltar
              </button>
              
              <button 
                onClick={handleNextStep}
                disabled={!actionCompleted}
                className={actionCompleted ? "btn-primary glow-effect" : "glass-panel"}
                style={{
                  padding: '12px 32px', borderRadius: 16, fontWeight: 600,
                  display: 'flex', alignItems: 'center', gap: 8,
                  opacity: !actionCompleted ? 0.5 : 1, cursor: !actionCompleted ? 'not-allowed' : 'pointer',
                  border: !actionCompleted ? '1px solid var(--border-subtle)' : 'none',
                  color: !actionCompleted ? 'var(--text-muted)' : '#fff'
                }}
              >
                {stepIndex === demoLength - 1 ? 'Concluir' : 'Próximo'} <ChevronRight size={18} />
              </button>
            </div>
          </motion.div>
        )}

        {stage === 'specialty' && (
          <SpecialtySelection key="specialty" onSelect={finishSpecialty} isFinishing={isFinishing} />
        )}

        {stage === 'conclusion' && (
          <OnboardingConclusion key="conclusion" role={role} onComplete={finalizeOnboarding} />
        )}
      </AnimatePresence>
    </div>
  );
};
