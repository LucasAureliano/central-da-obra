import type { VercelRequest, VercelResponse } from '@vercel/node';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { adminDb } from '../_lib/firebase-admin.js';

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MP_ACCESS_TOKEN || 'TEST-0000000000-000000-000000-0000000000',
  options: { timeout: 5000 }
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const action = req.body?.action || req.query?.topic;
    
    // We only care about payment updates
    if (action === 'payment.created' || action === 'payment.updated' || req.query?.topic === 'payment') {
      const paymentId = req.body?.data?.id || req.query?.id;
      
      if (!paymentId) {
        return res.status(400).json({ error: 'Missing payment id' });
      }

      const paymentClient = new Payment(client);
      const paymentInfo = await paymentClient.get({ id: paymentId });
      
      console.log(`Payment ${paymentId} status: ${paymentInfo.status}`);

      if (paymentInfo.status === 'approved') {
        const userId = paymentInfo.external_reference;
        const planId = paymentInfo.metadata?.plan_id || 'pro'; // default to pro if not set
        
        if (!userId) {
          console.error(`Payment ${paymentId} approved but no external_reference (userId) found.`);
          return res.status(200).json({ status: 'ignored, no external_reference' });
        }

        if (!adminDb) {
          console.error('Firebase Admin not initialized');
          return res.status(500).json({ error: 'Database connection failed' });
        }

        // Add 30 days to current date for expiration
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);

        const userRef = adminDb.collection('users').doc(userId);
        
        await userRef.set({
          subscription: {
            planId: planId,
            status: 'ACTIVE',
            source: 'mercadopago',
            expiresAt: expiresAt,
            autoRenew: true,
            updatedAt: new Date()
          }
        }, { merge: true });

        console.log(`User ${userId} subscription updated to ACTIVE.`);
      }
    }

    // Always return 200 OK to Mercado Pago so they stop retrying
    return res.status(200).json({ status: 'success' });
    
  } catch (error: any) {
    console.error('Error handling webhook:', error);
    return res.status(500).json({ error: 'Webhook processing failed' });
  }
}
