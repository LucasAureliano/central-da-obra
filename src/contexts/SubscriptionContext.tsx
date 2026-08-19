import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import type { SubscriptionData, Entitlements } from './AuthContext';
import { getPlanDetails } from '../config/plans';
import type { PlanDefinition, PlanLimits } from '../config/plans';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useWorks } from './WorksContext';

interface UsageMetrics {
  worksCount: number;
  quotesCount: number;
  clientsCount: number;
  projectsCount: number;
  teamMembersCount: number;
}

export interface QuotaAlert {
  resource: string;
  used: number;
  limit: number;
  pct: number;
}

interface SubscriptionContextType {
  plan: PlanDefinition;
  subscription: SubscriptionData;
  entitlements: Entitlements;
  limits: PlanLimits;
  usage: UsageMetrics;
  loading: boolean;
  canCreateWork: () => boolean;
  canCreateQuote: () => boolean;
  canCreateClient: () => boolean;
  canAddTeamMember: () => boolean;
  canUseCopilot: () => boolean;
  refreshUsage: () => Promise<void>;
  showUpgradeModal: boolean;
  setShowUpgradeModal: (show: boolean) => void;
  upgradeMessage: string;
  upgradeTitle: string;
  upgradeBenefits: string[];
  triggerUpgrade: (message?: string, title?: string, benefits?: string[]) => void;
  quotaAlerts: QuotaAlert[];
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const { user, profile, isGuest } = useAuth();
  const { works } = useWorks();
  
  const [usage, setUsage] = useState<UsageMetrics>({
    worksCount: 0,
    quotesCount: 0,
    clientsCount: 0,
    projectsCount: 0,
    teamMembersCount: 0
  });
  
  const [loading, setLoading] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeMessage, setUpgradeMessage] = useState('Faça um upgrade para acessar este recurso.');
  const [upgradeTitle, setUpgradeTitle] = useState('Faça o Upgrade do seu Plano');
  const [upgradeBenefits, setUpgradeBenefits] = useState<string[]>([]);

  // Extract subscription from profile or create a default free subscription
  const defaultSub: SubscriptionData = { planId: 'free', status: 'FREE', source: null, autoRenew: false };
  const subscription = profile?.subscription || defaultSub;
  const entitlements = profile?.entitlements || {};

  // Resolve the active plan based on subscription status and expiration
  const getResolvedPlanId = (): string => {
    if (['ACTIVE', 'TRIAL', 'COMP', 'TESTER'].includes(subscription.status)) {
      // Check expiration if applicable
      if (subscription.expiresAt && subscription.expiresAt.toDate) {
        const expiresAt = subscription.expiresAt.toDate();
        if (new Date() > expiresAt) {
          return 'free'; // Expired
        }
      } else if (typeof subscription.expiresAt === 'number') {
         if (Date.now() > subscription.expiresAt) return 'free';
      }
      return subscription.planId;
    }
    return 'free';
  };

  const activePlanId = getResolvedPlanId();
  const plan = getPlanDetails(profile?.role || null, activePlanId);
  
  // Apply entitlement overrides to limits
  const limits = { ...plan.limits };
  if (entitlements.unlimitedQuotes) limits.maxQuotes = Infinity;
  if (entitlements.multipleWorks) limits.maxWorks = Infinity;

  const refreshUsage = async () => {
    if (!user || isGuest) {
      setUsage({
        worksCount: works.length,
        quotesCount: 0,
        clientsCount: 0,
        projectsCount: works.length,
        teamMembersCount: 0
      });
      setLoading(false);
      return;
    }

    try {
      const quotesQ = query(collection(db, 'users', user.uid, 'quotes'));
      const clientsQ = query(collection(db, 'users', user.uid, 'clients'));
      const teamQ = query(collection(db, 'users', user.uid, 'contacts'));
      
      const [quotesSnap, clientsSnap, teamSnap] = await Promise.all([
        getDocs(quotesQ),
        getDocs(clientsQ),
        getDocs(teamQ)
      ]);

      const teamCount = teamSnap.docs.filter(d => d.data().category === 'team').length;

      setUsage({
        worksCount: works.length,
        projectsCount: works.length,
        quotesCount: quotesSnap.size,
        clientsCount: clientsSnap.size,
        teamMembersCount: teamCount
      });
    } catch (e) {
      console.error('Error fetching usage metrics', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUsage();
  }, [user, profile, works.length]);

  const triggerUpgrade = (message?: string, title?: string, benefits?: string[]) => {
    setUpgradeMessage(message || 'Faça um upgrade para acessar recursos premium e expandir seus limites.');
    setUpgradeTitle(title || 'Faça o Upgrade do seu Plano');
    setUpgradeBenefits(benefits || []);
    setShowUpgradeModal(true);
  };

  // Auto-show upgrade popup for free/starter users with 24h cooldown
  useEffect(() => {
    if (!user || isGuest) return;
    const planIsBasicOrFree = !['ACTIVE', 'COMP', 'TESTER'].includes(subscription.status) || subscription.planId === 'free' || subscription.planId === 'starter';
    if (!planIsBasicOrFree) return;
    
    const COOLDOWN_KEY = 'upgrade_popup_last_shown';
    const last = localStorage.getItem(COOLDOWN_KEY);
    if (last && Date.now() - parseInt(last) < 24 * 60 * 60 * 1000) return;
    
    const timer = setTimeout(() => {
      localStorage.setItem(COOLDOWN_KEY, Date.now().toString());
      triggerUpgrade(
        'Faça upgrade para desbloquear mais obras, orçamentos e clientes sem limites.',
        'Expanda seus limites com o plano Básico ou Pro',
        ['3 obras no Básico / Ilimitadas no Pro', 'Mais orçamentos mensais', 'Mais clientes gerenciados', 'Suporte prioritário']
      );
    }, 10000);
    
    return () => clearTimeout(timer);
  }, [user, isGuest, subscription.status, subscription.planId]);

  // Compute quota alerts: resources at >= 75% usage
  const quotaAlerts: QuotaAlert[] = [];
  const numericLimits: Array<{ resource: string; used: number; limit: number }> = [
    { resource: 'Obras', used: usage.worksCount, limit: limits.maxWorks },
    { resource: 'Orçamentos', used: usage.quotesCount, limit: limits.maxQuotes },
    { resource: 'Clientes', used: usage.clientsCount, limit: limits.maxClients },
    { resource: 'Equipe', used: usage.teamMembersCount, limit: limits.maxTeamMembers || 0 },
  ];
  for (const entry of numericLimits) {
    if (isFinite(entry.limit) && entry.limit > 0) {
      const pct = entry.used / entry.limit;
      if (pct >= 0.75) {
        quotaAlerts.push({ ...entry, pct });
      }
    }
  }

  const canCreateWork = () => {
    if (usage.worksCount >= limits.maxWorks) {
      triggerUpgrade(
        `Para gerenciar mais obras e desbloquear recursos avançados, conheça o Premium.`,
        `Sua primeira obra já está ativa 🎉`,
        ['Mais obras simultâneas', 'Gestão financeira avançada', 'Relatórios executivos', 'Assistente 24h']
      );
      return false;
    }
    return true;
  };

  const canCreateQuote = () => {
    if (usage.quotesCount >= limits.maxQuotes) {
      triggerUpgrade(
        `Você já criou ${limits.maxQuotes} de ${limits.maxQuotes} orçamentos gratuitos. Com o plano Profissional você poderá criar orçamentos sem limite.`,
        `Você chegou ao limite gratuito`,
        ['Orçamentos ilimitados', 'Modelos profissionais', 'PDF com sua logo', 'Gestão de clientes (CRM)']
      );
      return false;
    }
    return true;
  };

  const canCreateClient = () => {
    if (usage.clientsCount >= limits.maxClients) {
      triggerUpgrade(`Você atingiu o limite de ${limits.maxClients} clientes no seu plano atual.`);
      return false;
    }
    return true;
  };

  const canAddTeamMember = () => {
    if (usage.teamMembersCount >= limits.maxTeamMembers) {
      triggerUpgrade(`Você atingiu o limite de equipe no seu plano atual.`);
      return false;
    }
    return true;
  };

  const canUseCopilot = () => {
    if (entitlements.AI === true) return true;
    if (activePlanId !== 'free' && plan.features.some(f => f.toLowerCase().includes('copilot'))) return true;
    return false;
  };

  return (
    <SubscriptionContext.Provider value={{
      plan,
      subscription,
      entitlements,
      limits,
      usage,
      loading,
      canCreateWork,
      canCreateQuote,
      canCreateClient,
      canAddTeamMember,
      canUseCopilot,
      refreshUsage,
      showUpgradeModal,
      setShowUpgradeModal,
      upgradeMessage,
      upgradeTitle,
      upgradeBenefits,
      triggerUpgrade,
      quotaAlerts,
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};
