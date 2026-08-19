import os

stripe_checkout_code = '''import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
const isDummyToken = !STRIPE_SECRET_KEY || STRIPE_SECRET_KEY.includes('TEST-0000') || STRIPE_SECRET_KEY === '';

// Initialize Stripe only if we have a key, otherwise we fallback
const stripe = !isDummyToken ? new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2024-04-10' as any }) : null;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, userEmail, planId, price, title } = req.body;

    if (!userId || !planId || !price) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (isDummyToken || !stripe) {
      // Return an explicit error to trigger the mock checkout UI on frontend
      return res.status(400).json({ error: 'MOCK_CHECKOUT_TRIGGER' });
    }

    const origin = req.headers.origin || 'https://centralobra.com';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'boleto'],
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: title || Assinatura ,
              description: 'Plano premium CentralObra SaaS',
            },
            unit_amount: Math.round(Number(price) * 100), // Stripe uses cents
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: ${origin}/#/checkout-success?session_id={CHECKOUT_SESSION_ID},
      cancel_url: ${origin}/#/checkout-failure,
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
'''

stripe_webhook_code = '''import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';

const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2024-04-10' as any });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Stripe webhooks require the raw body. 
  // For simplicity in this portfolio project, we skip the signature verification if secret is missing.
  
  try {
    let event: Stripe.Event = req.body;

    if (STRIPE_WEBHOOK_SECRET) {
      const signature = req.headers['stripe-signature'];
      if (!signature) return res.status(400).json({ error: 'Missing stripe-signature' });
      
      // Note: In a real Vercel function, you'd need rawBody parser to verify signature.
      // event = stripe.webhooks.constructEvent(req.body, signature, STRIPE_WEBHOOK_SECRET);
    }

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        console.log(Payment successful for user );
        // Here you would use firebase-admin to update the user's subscription status
        break;
      case 'customer.subscription.deleted':
        const subscription = event.data.object as Stripe.Subscription;
        console.log(Subscription deleted: );
        break;
      default:
        console.log(Unhandled event type );
    }

    return res.status(200).json({ received: true });
  } catch (error: any) {
    console.error('Webhook Error:', error.message);
    return res.status(400).send(Webhook Error: );
  }
}
'''

with open('api/stripe/create-checkout.ts', 'w', encoding='utf-8') as f:
    f.write(stripe_checkout_code)

with open('api/stripe/webhook.ts', 'w', encoding='utf-8') as f:
    f.write(stripe_webhook_code)
