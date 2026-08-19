import re

with open('src/components/SubscriptionPlans.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("toast.error('Erro ao gerar pagamento.');", "")
content = content.replace("toast.error('Erro ao conectar com o gateway.');", "")
content = content.replace("handleDevBypass(selectedPlan);", "setShowMockCheckout({ plan: selectedPlan, price });")
content = content.replace("const [preferenceId, setPreferenceId] = useState<string | null>(null);", "const [preferenceId, setPreferenceId] = useState<string | null>(null);\n  const [showMockCheckout, setShowMockCheckout] = useState<{plan: string, price: number} | null>(null);")

mock_func = '''
  const handleMockPayment = async () => {
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
  };
'''

content = re.sub(r'const handleDevBypass = async \(selectedPlan: string\) => \{[\s\S]*?^\s*\};\n', mock_func, content, flags=re.MULTILINE)

mock_ui = '''
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
      )}
'''

content = content.replace("</AnimatePresence>\n    </div>\n  );\n};", "</AnimatePresence>\n" + mock_ui + "\n    </div>\n  );\n};")

with open('src/components/SubscriptionPlans.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
