const fs = require('fs');

// 1. UPDATE API
const newApiCode = import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
const isDummyToken = !STRIPE_SECRET_KEY || STRIPE_SECRET_KEY.includes('TEST-0000') || STRIPE_SECRET_KEY === '';

const stripe = !isDummyToken ? new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2024-04-10' as any }) : null;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, userEmail, planId, price, title, stripePriceId } = req.body;

    if (!userId || !planId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (isDummyToken || !stripe) {
      return res.status(400).json({ error: 'MOCK_CHECKOUT_TRIGGER' });
    }

    const origin = req.headers.origin || 'https://centralobra.com';

    const line_item = stripePriceId 
      ? { price: stripePriceId, quantity: 1 }
      : {
          price_data: {
            currency: 'brl',
            product_data: { name: title || 'Assinatura ' + planId.toUpperCase(), description: 'Plano premium CentralObra SaaS' },
            unit_amount: Math.round(Number(price) * 100),
          },
          quantity: 1,
        };

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'boleto'],
      line_items: [line_item],
      mode: 'subscription',
      success_url: origin + '/#/checkout-success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: origin + '/#/checkout-failure',
      customer_email: userEmail,
      client_reference_id: userId,
      metadata: { userId, planId },
    });

    return res.status(200).json({ id: session.id, url: session.url });
  } catch (error: any) {
    console.error('Error creating Stripe checkout session:', error);
    return res.status(500).json({ error: 'Failed to create checkout session', details: error.message });
  }
}
;
fs.writeFileSync('api/stripe/create-checkout.ts', newApiCode, 'utf-8');

// 2. UPDATE FRONTEND SubscriptionPlans.tsx
let frontCode = fs.readFileSync('src/components/SubscriptionPlans.tsx', 'utf-8');

if (!frontCode.includes('const [isAnnual, setIsAnnual]')) {
  frontCode = frontCode.replace('const [showMockCheckout, setShowMockCheckout] = useState<{plan: string, price: number} | null>(null);', 
  "const [showMockCheckout, setShowMockCheckout] = useState<{plan: string, price: number} | null>(null);\n  const [isAnnual, setIsAnnual] = useState(false);");
}

const pricesMap = 
  const STRIPE_PRICES = {
    monthly: { starter: 'price_1U5y52Ht1GuKvdoeS6nyP9KJ', pro: 'price_1U5y5VHt1GuKvdoeG7DX2UrR', business: 'price_1U5y5wHt1GuKvdoefGFVgWho' },
    annual: { starter: 'price_1U5yKNHt1GuKvdoelS5v4j5E', pro: 'price_1U5yL4Ht1GuKvdoezJcnlgtc', business: 'price_1U5yMwHt1GuKvdoemZrVbRne' }
  };
  const starterPriceObj = isAnnual ? { val: 299.90, label: '/ano' } : { val: 29.99, label: '/mês' };
  const proPriceObj = isAnnual ? { val: 499.90, label: '/ano' } : { val: 49.99, label: '/mês' };
  const businessPriceObj = isAnnual ? { val: 799.00, label: '/ano' } : { val: 79.90, label: '/mês' };
;

frontCode = frontCode.replace(/const freePrice = 0;[\s\S]*?const businessPrice = 79\.90;/, "const freePrice = 0;" + pricesMap);

frontCode = frontCode.replace(/price: price,/g, "price: selectedPlan === 'pro' ? proPriceObj.val : selectedPlan === 'starter' ? starterPriceObj.val : businessPriceObj.val, stripePriceId: STRIPE_PRICES[isAnnual ? 'annual' : 'monthly'][selectedPlan],");

frontCode = frontCode.replace(/{starterPrice\.toFixed\(2\)\.replace\('\.', ','\)}<\/span>\s*<span[^>]*>\/mǦs<\/span>/g, "{starterPriceObj.val.toFixed(2).replace('.', ',')}</span>\n              <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>{starterPriceObj.label}</span>");
frontCode = frontCode.replace(/{proPrice\.toFixed\(2\)\.replace\('\.', ','\)}<\/span>\s*<span[^>]*>\/mǦs<\/span>/g, "{proPriceObj.val.toFixed(2).replace('.', ',')}</span>\n                  <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>{proPriceObj.label}</span>");
frontCode = frontCode.replace(/{businessPrice\.toFixed\(2\)\.replace\('\.', ','\)}<\/span>\s*<span[^>]*>\/mǦs<\/span>/g, "{businessPriceObj.val.toFixed(2).replace('.', ',')}</span>\n                <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>{businessPriceObj.label}</span>");

const toggleHtml = 
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 40 }}>
            <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-panel)', padding: 4, borderRadius: 24, border: '1px solid var(--border-subtle)' }}>
              <button 
                onClick={() => setIsAnnual(false)}
                style={{ padding: '8px 24px', borderRadius: 20, border: 'none', background: !isAnnual ? 'var(--color-primary)' : 'transparent', color: !isAnnual ? '#FFF' : 'var(--text-muted)', fontWeight: 700, fontSize: 14, cursor: 'pointer', transition: 'all 0.2s' }}
              >
                Mensal
              </button>
              <button 
                onClick={() => setIsAnnual(true)}
                style={{ padding: '8px 24px', borderRadius: 20, border: 'none', background: isAnnual ? 'var(--color-primary)' : 'transparent', color: isAnnual ? '#FFF' : 'var(--text-muted)', fontWeight: 700, fontSize: 14, cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 6 }}
              >
                Anual <span style={{ background: isAnnual ? 'rgba(255,255,255,0.2)' : 'rgba(59,130,246,0.1)', color: isAnnual ? '#FFF' : '#3B82F6', padding: '2px 8px', borderRadius: 12, fontSize: 11 }}>2 meses grátis</span>
              </button>
            </div>
          </div>
;
if (!frontCode.includes('setIsAnnual(false)')) {
  frontCode = frontCode.replace('{/* FREE PLAN */}', toggleHtml + '\n          {/* FREE PLAN */}');
}

fs.writeFileSync('src/components/SubscriptionPlans.tsx', frontCode, 'utf-8');
console.log('Update script finished successfully.');
