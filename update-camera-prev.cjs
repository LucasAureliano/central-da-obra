const fs = require('fs');
let code = fs.readFileSync('src/components/Works.tsx', 'utf8');

code = code.replace(/const handleNativeCamera = async \(\) => \{/, "const handleNativeCamera = async (e: any) => {");
code = code.replace(/const base64 = await takePicture\(\);/g, "const base64 = await takePicture();\n      if (base64 !== undefined) { e.preventDefault(); }");

fs.writeFileSync('src/components/Works.tsx', code, 'utf8');
console.log("Updated handleNativeCamera");
