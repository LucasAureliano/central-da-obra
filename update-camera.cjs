const fs = require('fs');

let code = fs.readFileSync('src/components/Works.tsx', 'utf8');

// Insert the nativeCamera import
if (!code.includes('nativeCamera')) {
  code = code.replace(/import \{ doc, deleteDoc, updateDoc \} from 'firebase\/firestore';/, "import { doc, deleteDoc, updateDoc } from 'firebase/firestore';\nimport { takePicture } from '../utils/nativeCamera';");
}

// Create a handleNativeCamera function next to handleImageUpload
const newFunc = `
  const handleNativeCamera = async () => {
    try {
      const base64 = await takePicture();
      if (base64) {
        setNewImageUrl(base64);
      } else {
        // Fallback to normal input is already handled by the input element click
        // But we could just trigger the click on the input manually if we wanted.
      }
    } catch (e) {
      console.error(e);
    }
  };
`;

if (!code.includes('handleNativeCamera')) {
  code = code.replace(/const handleImageUpload =/, newFunc + '\n  const handleImageUpload =');
}

// Modify the button to trigger handleNativeCamera if on mobile
code = code.replace(/<label className="btn-secondary" style=\{\{ width: 44, height: 44, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 12, cursor: 'pointer', flexShrink: 0 \}\}>/g, 
`<label className="btn-secondary" onClick={handleNativeCamera} style={{ width: 44, height: 44, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 12, cursor: 'pointer', flexShrink: 0 }}>`);

fs.writeFileSync('src/components/Works.tsx', code, 'utf8');
console.log("Added native camera to Works cover");
