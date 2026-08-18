import React from 'react';
import { Lock } from 'lucide-react';
import { useSubscription } from '../../contexts/SubscriptionContext';

interface PremiumFeatureGateProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  featureName?: string;
  isBlocker?: boolean;
}

export const PremiumFeatureGate: React.FC<PremiumFeatureGateProps> = ({ 
  children, 
  fallback, 
  featureName = 'Este recurso',
  isBlocker = true 
}) => {
  const { plan, triggerUpgrade } = useSubscription();

  // If user is on a premium plan, just render the content
  if (plan.id.includes('pro') || plan.id.includes('business') || plan.id.includes('enterprise')) {
    return <>{children}</>;
  }

  // If it's a hard blocker, don't render children, just render the lock UI or fallback
  if (isBlocker) {
    if (fallback) return <>{fallback}</>;
    
    return (
      <div 
        onClick={() => triggerUpgrade(`${featureName} é exclusivo para assinantes dos planos Premium.`)}
        className="relative overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 flex flex-col items-center justify-center text-center cursor-pointer group hover:border-blue-500/50 transition-colors"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--bg-surface)] opacity-80 z-10" />
        <div className="z-20 flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Lock size={18} className="text-blue-600" />
          </div>
          <h4 className="text-[var(--text-main)] font-bold text-sm mb-1">{featureName}</h4>
          <p className="text-[var(--text-muted)] text-xs">Exclusivo Premium</p>
        </div>
      </div>
    );
  }

  // If it's not a hard blocker, render the children but add an onClick interceptor wrapper
  return (
    <div className="relative group cursor-pointer" onClickCapture={(e) => {
      e.preventDefault();
      e.stopPropagation();
      triggerUpgrade(`${featureName} é exclusivo para assinantes dos planos Premium.`);
    }}>
      <div className="opacity-50 pointer-events-none transition-opacity group-hover:opacity-30">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="bg-black/80 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 backdrop-blur-sm">
          <Lock size={12} />
          Premium
        </div>
      </div>
    </div>
  );
};
