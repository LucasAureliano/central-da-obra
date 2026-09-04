const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');
content = content.replace(/<OnboardingEngine[\s\S]*?\/>/g, `<InteractiveTour onComplete={async () => { if (isGuest) { sessionStorage.setItem('guestHasSeenWelcome', 'true'); window.location.reload(); } else { setForceOnboarding(false); try { const { doc, updateDoc } = await import('firebase/firestore'); const { db } = await import('./lib/firebase'); const userRef = doc(db, 'users', user.uid); await updateDoc(userRef, { hasSeenWelcome: true }); } catch (e) { console.error('Error saving welcome state:', e); } } }} />`);
fs.writeFileSync('src/App.tsx', content, 'utf8');
