const fs = require('fs');

let portalCode = fs.readFileSync('src/components/portal/ClientPortal.tsx', 'utf8');

portalCode = portalCode.replace(
  "const q = query(collection(db, 'shared_links'), where('token', '==', token));\n        const snap = await getDocs(q);\n        \n        if (snap.empty) {",
  "const docRef = doc(db, 'shared_links', token);\n        const docSnap = await getDoc(docRef);\n        \n        if (!docSnap.exists()) {"
);

portalCode = portalCode.replace(
  "const linkData = snap.docs[0].data();",
  "const linkData = docSnap.data();"
);

fs.writeFileSync('src/components/portal/ClientPortal.tsx', portalCode, 'utf8');
