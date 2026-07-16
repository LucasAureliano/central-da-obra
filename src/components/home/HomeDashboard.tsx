import { useAuth } from '../../contexts/AuthContext';
import { OwnerDashboard } from './modules/OwnerDashboard';
import { ProfessionalDashboard } from './modules/ProfessionalDashboard';
import { ArchitectDashboard } from './modules/ArchitectDashboard';
import { BuilderDashboard } from './modules/BuilderDashboard';

export function HomeDashboard({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const { profile } = useAuth();
  
  const role = profile?.role || 'owner'; // Default to owner if guest or no role

  if (role === 'service') return <ProfessionalDashboard onNavigate={onNavigate} />;
  if (role === 'architect') return <ArchitectDashboard onNavigate={onNavigate} />;
  if (role === 'builder') return <BuilderDashboard onNavigate={onNavigate} />;
  
  // Default fallback for 'owner' and any unknown role
  return <OwnerDashboard onNavigate={onNavigate} />;
}
