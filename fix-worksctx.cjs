const fs = require('fs');
let ctx = fs.readFileSync('src/contexts/WorksContext.tsx', 'utf8');
ctx = ctx.replace("const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Work));\n      setWorks(data);", "const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Work)).sort((a, b) => (a.order || 0) - (b.order || 0));\n      setWorks(data);");
fs.writeFileSync('src/contexts/WorksContext.tsx', ctx, 'utf8');
console.log('Fixed WorksContext ordering');
