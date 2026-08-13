const fs = require('fs');
const path = require('path');

const calculators = [
  'WallPaintCalc.tsx',
  'TextureCalc.tsx',
  'MasonryCalc.tsx',
  'DrywallCalc.tsx',
  'FloorTileCalc.tsx',
  'PlasterCalc.tsx',
  'RoofingCalc.tsx',
  'WaterproofingCalc.tsx',
  'ConcreteMixCalc.tsx'
];

const basePath = path.join(__dirname, 'src/components/calculators_library');

for (const calcName of calculators) {
  const filePath = path.join(basePath, calcName);
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping ${calcName}, not found`);
    continue;
  }
  
  let content = fs.readFileSync(filePath, 'utf-8');

  if (!content.includes('MultiSurfaceInput')) {
    content = content.replace(
      /(import .* from '.\/SearchableSelect';|import type .* from '.\/WizardEngine';)/,
      "$1\nimport { MultiSurfaceInput } from './MultiSurfaceInput';"
    );
  }

  const hasWidth = content.includes('const [width, setWidth] = useState');
  const hasHeight = content.includes('const [height, setHeight] = useState');
  const hasLength = content.includes('const [length, setLength] = useState');
  const hasDepth = content.includes('const [depth, setDepth] = useState'); 
  const hasThickness = content.includes('const [thickness, setThickness] = useState');
  
  let d3Init = '';
  if (hasDepth || hasThickness) {
     d3Init = ", d3: ''";
  }

  content = content.replace(
    /const \[width, setWidth\] = useState\(''\);\s*(const \[(height|length), set(Height|Length)\] = useState\(''\);\s*)*(const \[(depth|thickness), set(Depth|Thickness)\] = useState\(''\);\s*)?/,
    `const [surfaces, setSurfaces] = useState([{ id: Date.now(), d1: '', d2: ''${d3Init} }]);\n  `
  );

  if (calcName === 'ConcreteMixCalc.tsx') {
    content = content.replace(
      /baseVolume = \(parseFloat\(width\) \|\| 0\) \* \(parseFloat\(length\) \|\| 0\) \* \(parseFloat\(depth\) \|\| 0\);/g,
      "baseVolume = surfaces.reduce((acc, s) => acc + (parseFloat(s.d1) || 0) * (parseFloat(s.d2) || 0) * (parseFloat(s.d3) || 0), 0);"
    );
    content = content.replace(
      /\(parseFloat\(width\) > 0 && parseFloat\(length\) > 0 && parseFloat\(depth\) > 0\)/g,
      "surfaces.every(s => parseFloat(s.d1) > 0 && parseFloat(s.d2) > 0 && parseFloat(s.d3) > 0)"
    );
    
    // Replace inputs
    content = content.replace(
      /<div className="input-group">[\s\S]*?value=\{width\}[\s\S]*?<\/div>\s*<div className="input-group">[\s\S]*?value=\{length\}[\s\S]*?<\/div>\s*<div className="input-group">[\s\S]*?value=\{depth\}[\s\S]*?<\/div>/,
      `<MultiSurfaceInput surfaces={surfaces} onChange={setSurfaces} d1Label="Largura (m)" d2Label="Comprimento (m)" d3Label="Profundidade/Espessura (m)" />`
    );
  } else {
    const areaRegex1 = /baseArea = \(parseFloat\(width\) \|\| 0\) \* \(parseFloat\(height\) \|\| 0\);/g;
    const areaRegex2 = /baseArea = \(parseFloat\(width\) \|\| 0\) \* \(parseFloat\(length\) \|\| 0\);/g;
    const replacement = "baseArea = surfaces.reduce((acc, s) => acc + (parseFloat(s.d1) || 0) * (parseFloat(s.d2) || 0), 0);";
    
    content = content.replace(areaRegex1, replacement);
    content = content.replace(areaRegex2, replacement);
    
    const validRegex1 = /\(parseFloat\(width\) > 0 && parseFloat\(height\) > 0\)/g;
    const validRegex2 = /\(parseFloat\(width\) > 0 && parseFloat\(length\) > 0\)/g;
    const validRep = "surfaces.every(s => parseFloat(s.d1) > 0 && parseFloat(s.d2) > 0)";
    
    content = content.replace(validRegex1, validRep);
    content = content.replace(validRegex2, validRep);

    let d1Label = "Comprimento/Largura (m)";
    let d2Label = hasHeight ? "Altura (m)" : "Comprimento/Extensão (m)";
    
    // Some are wrapped in <></> 
    const inputsRegex1 = /<>\s*<div className="input-group">[\s\S]*?value=\{width\}[\s\S]*?<\/div>\s*<div className="input-group">[\s\S]*?value=\{(height|length)\}[\s\S]*?<\/div>\s*<\/>/;
    const inputsRegex2 = /<div className="input-group">[\s\S]*?value=\{width\}[\s\S]*?<\/div>\s*<div className="input-group">[\s\S]*?value=\{(height|length)\}[\s\S]*?<\/div>/;
    
    content = content.replace(inputsRegex1, `<>\n                <MultiSurfaceInput surfaces={surfaces} onChange={setSurfaces} d1Label="${d1Label}" d2Label="${d2Label}" />\n              </>`);
    content = content.replace(inputsRegex2, `<MultiSurfaceInput surfaces={surfaces} onChange={setSurfaces} d1Label="${d1Label}" d2Label="${d2Label}" />`);
  }
  
  fs.writeFileSync(filePath, content);
  console.log(`Updated ${calcName}`);
}
