const fs = require('fs');

let portalServiceCode = fs.readFileSync('src/services/portal/PortalService.ts', 'utf8');

portalServiceCode = portalServiceCode.replace(
  "import { collection, addDoc, serverTimestamp } from 'firebase/firestore';",
  "import { collection, setDoc, doc, serverTimestamp } from 'firebase/firestore';"
);

portalServiceCode = portalServiceCode.replace(
  "await addDoc(collection(db, 'shared_links'), {",
  "await setDoc(doc(db, 'shared_links', mockToken), {"
);

fs.writeFileSync('src/services/portal/PortalService.ts', portalServiceCode, 'utf8');
