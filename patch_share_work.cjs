const fs = require('fs');

let shareCode = fs.readFileSync('src/components/works/ShareWorkView.tsx', 'utf8');

// Replace addDoc with setDoc
if (shareCode.includes("addDoc(collection(db, 'shared_links')")) {
  shareCode = shareCode.replace(
    "import { collection, query, where, onSnapshot, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';",
    "import { collection, query, where, onSnapshot, setDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';"
  );

  shareCode = shareCode.replace(
    "await addDoc(collection(db, 'shared_links'), {",
    "await setDoc(doc(db, 'shared_links', token), {"
  );
}

fs.writeFileSync('src/components/works/ShareWorkView.tsx', shareCode, 'utf8');
