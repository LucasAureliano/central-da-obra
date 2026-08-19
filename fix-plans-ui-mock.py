import os

path = 'src/components/SubscriptionPlans.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

mock_ui = '''
      {showMockCheckout && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ type: "spring", bounce: 0, duration: 0.4 }} style={{ width: '100%', maxWidth: 400, background: 'var(--bg-panel)', borderRadius: 24, overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
            <div style={{ background: 'var(--bg-surface)', padding: '24px 24px 32px', textAlign: 'center', position: 'relative' }}>
              <button onClick={() => setShowMockCheckout(null)} style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(128,128,128,0.1)', border: 'none', padding: 8, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={20} color="var(--text-main)" />
              </button>
              <div style={{ width: 64, height: 64, borderRadius: 32, background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Crown size={32} />
              </div>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-main)', margin: '0 0 8px' }}>Ambiente de Testes</h2>
              <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: 14 }}>O Mercado Pago não está configurado. Utilize a simulação.</p>
            </div>
            <div style={{ padding: '32px 24px 24px', textAlign: 'center', marginTop: -20, background: 'var(--bg-panel)', borderRadius: '24px 24px 0 0' }}>
              <div style={{ marginBottom: 32 }}>
                <p style={{ color: 'var(--text-muted)', marginBottom: 8, fontSize: 14, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>Plano Selecionado</p>
                <h3 style={{ fontSize: 28, fontWeight: 900, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '-0.02em', marginBottom: 8 }}>{showMockCheckout.plan}</h3>
                <p style={{ fontSize: 36, fontWeight: 900, color: 'var(--color-primary)', margin: 0, letterSpacing: '-0.03em' }}>R$ {showMockCheckout.price.toFixed(2).replace('.', ',')}<span style={{ fontSize: 16, color: 'var(--text-muted)', fontWeight: 600 }}>/mês</span></p>
              </div>
              <button onClick={handleMockPayment} className="btn-primary" style={{ width: '100%', padding: 16, borderRadius: 16, fontWeight: 800, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                Simular Pagamento <Sparkles size={18} />
              </button>
              <button onClick={() => setShowMockCheckout(null)} className="btn-secondary" style={{ width: '100%', padding: 16, borderRadius: 16, fontWeight: 700, fontSize: 16, marginTop: 12, background: 'transparent' }}>
                Cancelar
              </button>
            </div>
          </motion.div>
        </div>
      )}
'''

if "showMockCheckout &&" not in content:
    content = content.replace("    </div>\n  );\n};", mock_ui + "\n    </div>\n  );\n};")
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
