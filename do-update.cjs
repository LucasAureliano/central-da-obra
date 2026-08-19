const fs = require('fs');
let code = fs.readFileSync('src/components/SubscriptionPlans.tsx', 'utf-8');

// Replace standard variables
code = code.replace(/const starterPrice = [\d.]+;/g, 'const starterPrice = 29.90;');
code = code.replace(/const proPrice = [\d.]+;/g, 'const proPrice = 49.90;');
code = code.replace(/const businessPrice = [\d.]+;/g, 'const businessPrice = 79.90;');

// Insert the toggle state and Stripe IDs if they don't exist
if (!code.includes('STRIPE_PRICES')) {
  code = code.replace('const [showMockCheckout, setShowMockCheckout] = useState<{plan: string, price: number} | null>(null);', 
  "const [showMockCheckout, setShowMockCheckout] = useState<{plan: string, price: number} | null>(null);\n  const [isAnnual, setIsAnnual] = useState(false);");

  const pricesMap = 
  const STRIPE_PRICES = {
    monthly: { starter: 'price_1U5y52Ht1GuKvdoeS6nyP9KJ', pro: 'price_1U5y5VHt1GuKvdoeG7DX2UrR', business: 'price_1U5y5wHt1GuKvdoefGFVgWho' },
    annual: { starter: 'price_1U5yKNHt1GuKvdoelS5v4j5E', pro: 'price_1U5yL4Ht1GuKvdoezJcnlgtc', business: 'price_1U5yMwHt1GuKvdoemZrVbRne' }
  };
  const starterPriceObj = isAnnual ? { val: 299.90, label: '/ano' } : { val: 29.90, label: '/mês' };
  const proPriceObj = isAnnual ? { val: 499.90, label: '/ano' } : { val: 49.90, label: '/mês' };
  const businessPriceObj = isAnnual ? { val: 799.00, label: '/ano' } : { val: 79.90, label: '/mês' };
;
  code = code.replace(/const freePrice = 0;/g, "const freePrice = 0;" + pricesMap);

  // Update logic to use objects
  code = code.replace(/price: selectedPlan === 'pro' \? proPrice : selectedPlan === 'starter' \? starterPrice : businessPrice/g, "price: selectedPlan === 'pro' ? proPriceObj.val : selectedPlan === 'starter' ? starterPriceObj.val : businessPriceObj.val, stripePriceId: STRIPE_PRICES[isAnnual ? 'annual' : 'monthly'][selectedPlan]");

  // Update UI rendering for Starter
  code = code.replace(/\{starterPrice\.toFixed\(2\)\.replace\('\.', ','\)\}/g, "{starterPriceObj.val.toFixed(2).replace('.', ',')}");
  // Update the /mês span for Starter
  code = code.replace(/<span style=\{\{ fontSize: 14, color: 'var\(--text-muted\)' \}\}>\/mǦs<\/span>/g, "<span style={{ fontSize: 14, color: 'var(--text-muted)' }}>{starterPriceObj.label}</span>");
  
  // Actually, let's just do a blanket replace for the /mês labels if they use that exact string, or do it more safely
  code = code.replace(/\{proPrice\.toFixed\(2\)\.replace\('\.', ','\)\}/g, "{proPriceObj.val.toFixed(2).replace('.', ',')}");
  code = code.replace(/\{businessPrice\.toFixed\(2\)\.replace\('\.', ','\)\}/g, "{businessPriceObj.val.toFixed(2).replace('.', ',')}");
  
  // Fix the /mês label that might have bad encoding (Ǧs)
  code = code.replace(/\/mǦs/g, '{starterPriceObj.label}'); // A bit hacky but we'll fix it if it's identical
  
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
  code = code.replace('{/* FREE PLAN */}', toggleHtml + '\n          {/* FREE PLAN */}');
}

// Ads fix
code = code.replace(/Anúncios|Anúncio/g, 'Sem Anúncios'); // we'll just be careful, let's see where ads are first.
fs.writeFileSync('src/components/SubscriptionPlans.tsx', code, 'utf-8');
console.log('SubscriptionPlans updated');
