import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export function useGuestGuard() {
  const { isGuest } = useAuth();

  const requireAuth = (actionName: string = 'realizar esta ação') => {
    if (isGuest) {
      toast.error(`Crie uma conta gratuita para ${actionName} e salvar seus dados permanentemente.`, {
        duration: 5000,
        icon: '🔒'
      });
      return false;
    }
    return true;
  };

  return { requireAuth };
}
