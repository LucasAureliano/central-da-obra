const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/calculators_library/ConcreteMixCalc.tsx');
let content = fs.readFileSync(filePath, 'utf-8');

// Add import
if (!content.includes('MultiSurfaceInput')) {
  content = content.replace(
    /import { SearchableSelect } from '\.\/SearchableSelect';/,
    "import { MultiSurfaceInput } from './MultiSurfaceInput';\nimport { SearchableSelect } from './SearchableSelect';"
  );
}

// Replace states
content = content.replace(
  /const \[width, setWidth\] = useState\(''\);\s*const \[length, setLength\] = useState\(''\);\s*const \[thickness, setThickness\] = useState\(''\);/,
  "const [surfaces, setSurfaces] = useState([{ id: Date.now(), d1: '', d2: '', d3: '' }]);"
);

// Replace calculation
content = content.replace(
  /return \(parseFloat\(width\) \|\| 0\) \* \(parseFloat\(length\) \|\| 0\) \* \(parseFloat\(thickness\) \|\| 0\);/g,
  "return surfaces.reduce((acc, s) => acc + (parseFloat(s.d1) || 0) * (parseFloat(s.d2) || 0) * (parseFloat(s.d3) || 0), 0);"
);

// Replace dependencies in useMemo
content = content.replace(
  /\[inputMethod, volume, width, length, thickness\]/g,
  "[inputMethod, volume, surfaces]"
);

// Replace isValid condition
// There are no isValid for width/length/thickness separately, the isValid relies on `parsedVolume > 0`. So nothing to replace there!

// Replace JSX
const jsxRegex = /<>\s*<div className="input-group">\s*<label>Comprimento \(m\)<\/label>\s*<input type="number" className="input-premium" value={length} onChange={e => setLength\(e\.target\.value\)} placeholder="Ex: 10" \/>\s*<\/div>\s*<div className="input-group">\s*<label>Largura \(m\)<\/label>\s*<input type="number" className="input-premium" value={width} onChange={e => setWidth\(e\.target\.value\)} placeholder="Ex: 0\.15" \/>\s*<\/div>\s*<div className="input-group">\s*<label>Altura \/ Profundidade \(m\)<\/label>\s*<input type="number" className="input-premium" value={thickness} onChange={e => setThickness\(e\.target\.value\)} placeholder="Ex: 0\.40" \/>\s*<\/div>\s*<\/>/;

content = content.replace(jsxRegex, `<MultiSurfaceInput surfaces={surfaces} onChange={setSurfaces} d1Label="Largura (m)" d2Label="Comprimento (m)" d3Label="Altura / Profundidade (m)" title="Áreas de Concretagem" />`);

fs.writeFileSync(filePath, content);
console.log('Fixed ConcreteMixCalc.tsx');
