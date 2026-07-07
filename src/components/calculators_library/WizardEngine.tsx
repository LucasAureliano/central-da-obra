import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

export interface WizardStep {
  id: string;
  title: string;
  subtitle?: string;
  content: React.ReactNode;
  isValid: boolean;
  nextLabel?: string;
  hideNextButton?: boolean; // Sometimes the step auto-advances when a big option is clicked
}

interface WizardEngineProps {
  title: string;
  icon: React.ReactNode;
  steps: WizardStep[];
  currentStep: number;
  onNext: () => void;
  onPrev: () => void;
  onFinish: () => void;
  onCancel: () => void;
}

export function WizardEngine({ 
  title, 
  icon, 
  steps, 
  currentStep, 
  onNext, 
  onPrev, 
  onFinish,
  onCancel
}: WizardEngineProps) {
  
  const step = steps[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === steps.length - 1;
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '100vh', backgroundColor: 'var(--bg-main)' }}>
      {/* Header */}
      <div style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid var(--border-subtle)', position: 'sticky', top: 0, backgroundColor: 'var(--bg-main)', zIndex: 10 }}>
        <button onClick={onCancel} style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ArrowLeft size={24} />
        </button>
        <div style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: 'var(--color-primary-alpha)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {icon}
        </div>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.2 }}>{title}</h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Etapa {currentStep + 1} de {steps.length}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ height: 4, width: '100%', backgroundColor: 'var(--bg-surface)' }}>
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          style={{ height: '100%', backgroundColor: 'var(--color-primary)' }}
        />
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, position: 'relative', overflowX: 'hidden' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            style={{ padding: 24, paddingBottom: 100 }}
          >
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-main)', marginBottom: 8 }}>{step.title}</h3>
              {step.subtitle && <p style={{ fontSize: 15, color: 'var(--text-muted)' }}>{step.subtitle}</p>}
            </div>
            
            {step.content}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer Nav */}
      {!step.hideNextButton && (
        <div style={{ 
          position: 'fixed', bottom: 0, left: 0, right: 0, padding: 20, 
          backgroundColor: 'var(--bg-main)', borderTop: '1px solid var(--border-subtle)',
          display: 'flex', justifyContent: 'space-between', gap: 16, zIndex: 10
        }}>
          {!isFirst ? (
            <button 
              onClick={onPrev}
              style={{ padding: '16px 24px', borderRadius: 16, backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)', fontWeight: 600, fontSize: 16, cursor: 'pointer', flex: 1 }}
            >
              Voltar
            </button>
          ) : <div style={{ flex: 1 }} />}

          <button 
            onClick={isLast ? onFinish : onNext}
            disabled={!step.isValid}
            className="btn-primary"
            style={{ padding: '16px 24px', borderRadius: 16, fontWeight: 700, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, flex: 2, opacity: step.isValid ? 1 : 0.5, cursor: step.isValid ? 'pointer' : 'not-allowed' }}
          >
            {isLast ? 'Ver Resultados' : (step.nextLabel || 'Avançar')}
            {isLast ? <Check size={20} /> : <ArrowRight size={20} />}
          </button>
        </div>
      )}
    </div>
  );
}
