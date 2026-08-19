const fs = require('fs');

let plansFile = fs.readFileSync('src/components/SubscriptionPlans.tsx', 'utf8');

// Replace handleDevBypass calls with setShowMockCheckout
plansFile = plansFile.replace(/toast\.error\('Erro ao gerar pagamento\.'\);\n\s*handleDevBypass\(selectedPlan\);/g, "setShowMockCheckout({ plan: selectedPlan, price });");
plansFile = plansFile.replace(/toast\.error\('Erro ao conectar com o gateway\.'\);\n\s*handleDevBypass\(selectedPlan\);/g, "setShowMockCheckout({ plan: selectedPlan, price });");

// Add showMockCheckout state
plansFile = plansFile.replace("const [preferenceId, setPreferenceId] = useState<string | null>(null);", "const [preferenceId, setPreferenceId] = useState<string | null>(null);\n  const [showMockCheckout, setShowMockCheckout] = useState<{plan: string, price: number} | null>(null);");

// Rewrite handleDevBypass to be handleMockPayment
plansFile = plansFile.replace(/const handleDevBypass = async \(selectedPlan: string\) => \{[\s\S]*?^\s*\};\n/m, const handleMockPayment = async () => {
    if (!showMockCheckout || !profile) return;
    try {
      const { doc, updateDoc } = await import('firebase/firestore');
      const { db } = await import('../lib/firebase');
      await updateDoc(doc(db, 'users', profile.uid), {
        subscription: {
          planId: showMockCheckout.plan,
          status: 'ACTIVE',
          source: 'sandbox_test',
          autoRenew: true,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        },
        updatedAt: new Date()
      });
      toast.success('Pagamento simulado com sucesso! Plano ativado.');
      setShowMockCheckout(null);
      setTimeout(() => { window.location.hash = '#/checkout-success'; window.location.reload(); }, 500);
    } catch (e) {
      console.error(e);
      toast.error('Erro ao simular pagamento.');
    }
  };\n);

// Add the mock checkout modal to the end of the return statement
plansFile = plansFile.replace(/\{preferenceId && \([\s\S]*?\}\)/m, {preferenceId && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} style={{ width: '100%', maxWidth: 500, background: 'var(--bg-panel)', borderRadius: 24, overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
            <div style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--bg-panel)', padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Finalizar Assinatura</h2>
              <button onClick={() => setPreferenceId(null)} style={{ background: 'rgba(128,128,128,0.1)', border: 'none', padding: 8, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={20} color="var(--text-muted)" />
              </button>
            </div>
            <div style={{ padding: 24, overflowY: 'auto' }}>
              <CheckoutBrick preferenceId={preferenceId} />
            </div>
          </motion.div>
        </div>
      )}

      {showMockCheckout && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} style={{ width: '100%', maxWidth: 400, background: 'var(--bg-panel)', borderRadius: 24, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ background: '#3B82F6', padding: '24px 24px 32px', textAlign: 'center', position: 'relative' }}>
              <button onClick={() => setShowMockCheckout(null)} style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,0.2)', border: 'none', padding: 8, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={20} color="#FFF" />
              </button>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#FFF', margin: '0 0 8px' }}>Ambiente de Testes</h2>
              <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0, fontSize: 14 }}>Gateway de pagamento não configurado.</p>
            </div>
            <div style={{ padding: '32px 24px 24px', textAlign: 'center', marginTop: -20, background: 'var(--bg-panel)', borderRadius: '24px 24px 0 0' }}>
              <div style={{ marginBottom: 24 }}>
                <p style={{ color: 'var(--text-muted)', marginBottom: 8 }}>Plano Selecionado</p>
                <h3 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-main)', textTransform: 'uppercase' }}>{showMockCheckout.plan}</h3>
                <p style={{ fontSize: 28, fontWeight: 800, color: 'var(--color-primary)', marginTop: 8 }}>R$ {showMockCheckout.price.toFixed(2).replace('.', ',')}</p>
              </div>
              <button onClick={handleMockPayment} className="btn-primary" style={{ width: '100%', padding: 16, borderRadius: 16, fontWeight: 800, fontSize: 16 }}>
                Simular Pagamento Aprovado
              </button>
            </div>
          </motion.div>
        </div>
      )});

fs.writeFileSync('src/components/SubscriptionPlans.tsx', plansFile);
