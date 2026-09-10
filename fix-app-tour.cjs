const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('const [localHasSeenTour, setLocalHasSeenTour] = useState(false);')) {
  code = code.replace(/const \[localHasSeenWelcome, setLocalHasSeenWelcome\] = useState\(false\);/, "const [localHasSeenWelcome, setLocalHasSeenWelcome] = useState(false);\n  const [localHasSeenTour, setLocalHasSeenTour] = useState(false);");
}

code = code.replace(/\{user && profile\?\.hasSeenWelcome && \!profile\?\.hasSeenTour && <InteractiveTour onComplete=\{async \(\) => \{[\s\S]*?\}\} \/>\}/m, `
{user && profile?.hasSeenWelcome && (!profile?.hasSeenTour && !localHasSeenTour) && <InteractiveTour onComplete={async () => {
    try {
      if (isGuest) {
        localStorage.setItem("guestHasSeenTour", "true");
        setLocalHasSeenTour(true);
      } else {
        const { doc, updateDoc } = await import('firebase/firestore');
        const { db } = await import('./lib/firebase');
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, { hasSeenTour: true });
        setLocalHasSeenTour(true);
      }
    } catch (e) {
      console.error('Failed to update tour state:', e);
      setLocalHasSeenTour(true);
    }
  }} />}`);

fs.writeFileSync('src/App.tsx', code, 'utf8');
console.log("Updated App.tsx to remove reload on tour completion");
