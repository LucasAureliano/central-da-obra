const fs = require('fs');
let code = fs.readFileSync('src/contexts/AuthContext.tsx', 'utf8');

code = code.replace(/hasSeenWelcome:\s*localStorage\.getItem\("guestHasSeenWelcome"\) === "true",/g, 'hasSeenWelcome: localStorage.getItem("guestHasSeenWelcome") === "true",\n          hasSeenTour: localStorage.getItem("guestHasSeenTour") === "true",');

code = code.replace(/hasSeenWelcome:\s*sessionStorage\.getItem\("guestHasSeenWelcome"\) === "true",/g, 'hasSeenWelcome: sessionStorage.getItem("guestHasSeenWelcome") === "true",\n                hasSeenTour: sessionStorage.getItem("guestHasSeenTour") === "true",');

fs.writeFileSync('src/contexts/AuthContext.tsx', code, 'utf8');
console.log('Updated AuthContext to support guestHasSeenTour');
