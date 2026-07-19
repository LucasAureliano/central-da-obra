// import { apiClient } from '../../api/apiClient';

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
  async generateClientPortalLink(workId: string, expiresInDays: number = 30): Promise<PortalLink> {
    // Simula a ida ao backend para gerar um JWT ou token randômico
    await new Promise(resolve => setTimeout(resolve, 600));

    const mockToken = `co_${Math.random().toString(36).substring(2, 15)}`;
    
    return {
      workId,
      token: mockToken,
      shareableUrl: `https://centralobra.app/portal/${workId}?token=${mockToken}`,
      expiresAt: new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000).toISOString()
    };
  }
}

export const portalService = new PortalService();
