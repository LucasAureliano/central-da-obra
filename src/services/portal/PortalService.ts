import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
export interface PortalLink {
  workId: string;
  token: string;
  shareableUrl: string;
  expiresAt: string;
}

class PortalService {
  /**
   * Gera um link seguro (Magic Link/Token) para o cliente acompanhar a obra
   */
  async generateClientPortalLink(workData: any, profileData: any, expiresInDays: number = 30): Promise<PortalLink> {
    const mockToken = `co_${Math.random().toString(36).substring(2, 15)}`;
    
    // Save to Firestore
    try {
      await addDoc(collection(db, 'shared_links'), {
        token: mockToken,
        workId: workData.id,
        workData: {
          name: workData.name || '',
          address: workData.address || '',
          status: workData.status || '',
          deadline: workData.deadline || null,
          client: workData.client || '',
          progress: workData.progress || 0
        },
        providerProfile: profileData ? {
          companyName: profileData.companyName || profileData.legalName || '',
          phone: profileData.phone || '',
          email: profileData.email || ''
        } : null,
        createdAt: serverTimestamp(),
        expiresAt: new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000).toISOString()
      });
    } catch (error) {
      console.error('Error generating portal link:', error);
      throw error;
    }

    return {
      workId: workData.id,
      token: mockToken,
      shareableUrl: `${window.location.origin}/?shared=${mockToken}`,
      expiresAt: new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000).toISOString()
    };
  }
}

export const portalService = new PortalService();
