import { useAuth } from '../contexts/AuthContext';
import { HomeDashboard } from './home/HomeDashboard';

interface DashboardRouterProps {
  onNavigate: (tab: string) => void;
}

export function DashboardRouter({ onNavigate }: DashboardRouterProps) {
  const { profile, isGuest } = useAuth();

  // Se for visitante ou não tiver perfil, mostra o dashboard padrão
  if (isGuest || !profile) {
    return <HomeDashboard onNavigate={onNavigate} />;
  }

  // Roteamento baseado no perfil
  // No futuro, podemos passar o `role` como prop para o HomeDashboard se ele precisar de variações profundas
  switch (profile.role) {
    case 'owner':
    case 'service':
    case 'architect':
    case 'builder':
    default:
      return <HomeDashboard onNavigate={onNavigate} />;
  }
}
