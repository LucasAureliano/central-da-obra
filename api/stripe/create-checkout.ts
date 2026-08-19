import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || process.env.VITE_STRIPE_SECRET_KEY || '';
const isDummyToken = !STRIPE_SECRET_KEY || STRIPE_SECRET_KEY.includes('TEST-0000') || STRIPE_SECRET_KEY === '';

// Initialize Stripe only if we have a key, otherwise we fallback
const stripe = !isDummyToken ? new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2024-04-10' as any }) : null;

// Allow reading from Environment Variables, fallback to default test prices
const STRIPE_PRICES: Record<string, Record<string, string>> = {
  monthly: { 
    starter: (process.env.STRIPE_PRICE_STARTER_MONTHLY || process.env.VITE_STRIPE_PRICE_STARTER_MONTHLY) || 'price_1U5y52Ht1GuKvdoeS6nyP9KJ', 
    pro: (process.env.STRIPE_PRICE_PRO_MONTHLY || process.env.VITE_STRIPE_PRICE_PRO_MONTHLY) || 'price_1U5y5VHt1GuKvdoeG7DX2UrR', 
    business: (process.env.STRIPE_PRICE_BUSINESS_MONTHLY || process.env.VITE_STRIPE_PRICE_BUSINESS_MONTHLY) || 'price_1U5y5wHt1GuKvdoefGFVgWho' 
  },
  annual: { 
    starter: (process.env.STRIPE_PRICE_STARTER_ANNUAL || process.env.VITE_STRIPE_PRICE_STARTER_ANNUAL) || 'price_1U5yKNHt1GuKvdoelS5v4j5E', 
    pro: (process.env.STRIPE_PRICE_PRO_ANNUAL || process.env.VITE_STRIPE_PRICE_PRO_ANNUAL) || 'price_1U5yL4Ht1GuKvdoezJcnlgtc', 
    business: (process.env.STRIPE_PRICE_BUSINESS_ANNUAL || process.env.VITE_STRIPE_PRICE_BUSINESS_ANNUAL) || 'price_1U5yMwHt1GuKvdoemZrVbRne' 
  }
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, userEmail, planId, isAnnual, priceId } = req.body;

    if (!userId || !planId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (isDummyToken || !stripe) {
      // Return an explicit error to trigger the mock checkout UI on frontend
      return res.status(400).json({ error: 'MOCK_CHECKOUT_TRIGGER' });
    }

    const origin = req.headers.origin || 'https://centralobra.com';
    const billingCycle = isAnnual ? 'annual' : 'monthly';
    
    // Prioritize priceId from frontend, otherwise use Env Vars, otherwise fallback defaults
    const stripePriceId = priceId || STRIPE_PRICES[billingCycle][planId];

    if (!stripePriceId) {
      return res.status(400).json({ error: 'Invalid plan configuration. Missing Price ID.' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'boleto'],
      line_items: [{ price: stripePriceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${origin}/#/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/#/checkout-failure`,
      customer_email: userEmail,
      client_reference_id: userId,
      metadata: {
        userId,
        planId,
      },
    });

    return res.status(200).json({ 
      id: session.id,
      url: session.url
    });

  } catch (error: any) {
    console.error('Error creating Stripe checkout session:', error);
    return res.status(500).json({ error: 'Failed to create checkout session', details: error.message });
  }
}
