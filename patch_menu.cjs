const fs = require('fs');

const path = 'src/components/Menu.tsx';
let code = fs.readFileSync(path, 'utf8');

// Add font-family to RoleModal
code = code.replace(
  `backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(24px)',`,
  `backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(24px)', fontFamily: 'Inter, sans-serif',`
);

// Add SpecialtyModal logic
const specialtyModalStr = `        {/* Specialty Change Modal */}
        {typeof document !== 'undefined' && createPortal(
          <AnimatePresence>
            {showSpecialtyModal && (
              <div style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(24px)', fontFamily: 'Inter, sans-serif',
                zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: 20
              }}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  style={{
                    background: 'var(--bg-panel)', borderRadius: 24, padding: 32,
                    maxWidth: 400, width: '100%', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                    border: '1px solid var(--border-subtle)', position: 'relative'
                  }}
                >
                  <button onClick={() => setShowSpecialtyModal(false)} style={{
                    position: 'absolute', top: 16, right: 16, background: 'none', border: 'none',
                    color: 'var(--text-muted)', cursor: 'pointer'
                  }}>
                    <X size={24} />
                  </button>
                  <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-main)', marginBottom: 8, textAlign: 'center' }}>
                    Qual a sua especialidade?
                  </h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 12, marginTop: 24 }}>
                    {['Pedreiro', 'Eletricista', 'Encanador', 'Marceneiro', 'Pintor', 'Gesseiro', 'Mestre de Obras'].map(spec => (
                      <button
                        key={spec}
                        onClick={async () => {
                          setChangingSpecialty(true);
                          try {
                            if (user) {
                              const { doc, updateDoc } = await import('firebase/firestore');
                              const { db } = await import('../lib/firebase');
                              await updateDoc(doc(db, 'users', user.uid), { specialty: spec });
                            } else {
                              localStorage.setItem('pendingSpecialty', spec);
                            }
                            window.location.reload();
                          } catch(e) {
                            console.error(e);
                          } finally {
                            setChangingSpecialty(false);
                          }
                        }}
                        style={{
                          padding: '12px', borderRadius: 12, fontWeight: 700, fontSize: 14,
                          background: (profile as any)?.specialty === spec ? 'var(--color-primary)' : 'var(--bg-surface)',
                          color: (profile as any)?.specialty === spec ? '#fff' : 'var(--text-main)',
                          border: '1px solid var(--border-subtle)', cursor: changingSpecialty ? 'not-allowed' : 'pointer',
                          transition: 'all 0.2s'
                        }}
                        disabled={changingSpecialty}
                      >
                        {spec}
                      </button>
                    ))}
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
`;

// Insert it right after the RoleModal
if (!code.includes('showSpecialtyModal && (')) {
  code = code.replace(
    /<\/AnimatePresence>,\s*document\.body\s*\)\s*\}/,
    `</AnimatePresence>,\n          document.body\n        )}\n\n${specialtyModalStr}`
  );
}

// Add the badge to user info if it's service role
const profileNameRegex = /<h3 style={{ fontSize: 16, fontWeight: 700, color: 'var\(--text-main\)', margin: '0 0 2px' }}>/;
if (!code.includes('specialtyBadge')) {
  code = code.replace(
    profileNameRegex,
    `<h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', margin: '0 0 2px', display: 'flex', alignItems: 'center', gap: 8 }}>`
  );
  
  code = code.replace(
    `{profile?.displayName || 'Usuário'}`,
    `{profile?.displayName || 'Usuário'} {activeRole === 'service' && (profile as any)?.specialty && <span id="specialtyBadge" style={{ fontSize: 10, padding: '2px 8px', background: 'var(--color-primary-alpha)', color: 'var(--color-primary)', borderRadius: 10, fontWeight: 800 }}>{(profile as any)?.specialty}</span>}`
  );
}

fs.writeFileSync(path, code, 'utf8');
