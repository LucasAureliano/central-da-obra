import os

with open('src/components/Profile.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# Add state
code = code.replace(
    "const [photoUrl, setPhotoUrl] = useState(prof?.photoUrl || prof?.photoURL || '');",
    "const [photoUrl, setPhotoUrl] = useState(prof?.photoUrl || prof?.photoURL || '');\n  const [customQrLink, setCustomQrLink] = useState(prof?.customQrLink || '');"
)

# Add save logic
code = code.replace(
    "specialty,\n          photoUrl",
    "specialty,\n          photoUrl,\n          customQrLink"
)

# Add input field in the modal
modal_field = """<div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)' }}>Link do QR Code (Plano Premium)</label>
                <input 
                  type="text" 
                  value={customQrLink} 
                  onChange={e => setCustomQrLink(e.target.value)}
                  placeholder="Ex: https://instagram.com/seu.perfil"
                  disabled={prof?.plan !== 'pro'}
                  style={{ padding: '12px 16px', borderRadius: 12, border: '1px solid var(--border-subtle)', background: prof?.plan === 'pro' ? 'var(--bg-elevated)' : 'var(--bg-surface)', color: 'var(--text-main)', fontSize: 14 }}
                />
                {prof?.plan !== 'pro' && <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Assine o plano PRO para direcionar o QR Code dos orçamentos para o seu Instagram/Site.</span>}
              </div>"""

code = code.replace(
    """<div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)' }}>Especialidade / Foco</label>""",
    modal_field + "\n\n              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>\n                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)' }}>Especialidade / Foco</label>"
)

with open('src/components/Profile.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

print("Injected customQrLink")
