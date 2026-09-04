const fs = require('fs');

// 1. Update NewWorkModal.tsx
let modal = fs.readFileSync('src/components/NewWorkModal.tsx', 'utf8');
const addDocReplacement = `const isOwner = profile?.role === 'owner' || !profile?.role;
      const actualClient = isOwner ? (profile?.name || user?.displayName || 'Proprietário') : client;
      const actualProvider = isOwner ? client : (profile?.name || user?.displayName || 'Construtor');

      const newWorkRef = await addDoc(collection(db, 'works'), {
        userId: user.uid,
        name,
        client: actualClient,
        providerName: actualProvider,`;

modal = modal.replace(/const newWorkRef = await addDoc\(collection\(db, 'works'\), \{\s*userId: user\.uid,\s*name,\s*client,/, addDocReplacement);
fs.writeFileSync('src/components/NewWorkModal.tsx', modal, 'utf8');

// 2. Update Works.tsx
let works = fs.readFileSync('src/components/Works.tsx', 'utf8');
const worksDisplayReplacement = `{(!isOwner && work.client) && (
                      <p style={{ fontSize: 13, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
                        <HardHat size={14} /> Cliente: {work.client}
                      </p>
                    )}
                    {(isOwner && (work.providerName || work.client)) && (
                      <p style={{ fontSize: 13, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
                        <HardHat size={14} /> Prestador: {work.providerName || work.client}
                      </p>
                    )}`;

works = works.replace(/\{\!isOwner && work\.client && \([\s\S]*?\{work\.client\}[\s\S]*?<\/p>\s*\)\}/, worksDisplayReplacement);
fs.writeFileSync('src/components/Works.tsx', works, 'utf8');
