import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export function useGuestGuard() {
  const { isGuest, setShowGuestModal, setGuestActionName } = useAuth();

  const requireAuth = (actionName: string = 'realizar esta ação') => {
    if (isGuest) {
      setGuestActionName(actionName);
      setShowGuestModal(true);
      return false;
    }
    return true;
  };

  return { requireAuth };
}
