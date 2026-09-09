const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldStr = `const { db } = await import('./lib/firebase');
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, { hasSeenTour: true });`;

const newStr = `if (isGuest) {
      localStorage.setItem("guestHasSeenTour", "true");
      // Force reload to apply state properly or just let the tour close
      window.location.reload();
    } else {
      const { doc, updateDoc } = await import('firebase/firestore');
      const { db } = await import('./lib/firebase');
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { hasSeenTour: true });
    }`;

code = code.replace(oldStr, newStr);

fs.writeFileSync('src/App.tsx', code, 'utf8');
console.log('Fixed InteractiveTour guest completion');
