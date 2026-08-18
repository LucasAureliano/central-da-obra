import type { VercelRequest, VercelResponse } from '@vercel/node';
import { MercadoPagoConfig, Preference } from 'mercadopago';

// Get the access token from env
const client = new MercadoPagoConfig({ 
  accessToken: process.env.MP_ACCESS_TOKEN || 'TEST-0000000000-000000-000000-0000000000',
  options: { timeout: 5000 }
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, userEmail, planId, price, title } = req.body;

    if (!userId || !planId || !price) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const preference = new Preference(client);

    const body = {
      items: [
        {
          id: planId,
          title: title || `Assinatura ${planId.toUpperCase()}`,
          quantity: 1,
          unit_price: Number(price),
          currency_id: 'BRL',
        }
      ],
      payer: {
        email: userEmail || 'comprador@email.com',
      },
      external_reference: userId, // CRITICAL: This is how we map the payment back to the user
      metadata: {
        userId,
        planId,
      },
      // Optionally configure back_urls if you also want to support checkout pro redirects
      back_urls: {
        success: `${req.headers.origin || process.env.VITE_APP_URL}/#/checkout-success`,
        failure: `${req.headers.origin || process.env.VITE_APP_URL}/#/checkout-failure`,
        pending: `${req.headers.origin || process.env.VITE_APP_URL}/#/checkout-pending`,
      },
      auto_return: 'approved'
    };

    const response = await preference.create({ body });

    return res.status(200).json({ 
      id: response.id,
      init_point: response.init_point, 
      sandbox_init_point: response.sandbox_init_point
    });

  } catch (error: any) {
    console.error('Error creating MP preference:', error);
    return res.status(500).json({ error: 'Failed to create preference', details: error.message });
  }
}
