const fs = require('fs');
let code = fs.readFileSync('src/contexts/WorksContext.tsx', 'utf8');

// Inside the onSnapshot for works
code = code.replace(/const worksData = snapshot\.docs\.map\(doc => \(\{ id: doc\.id, \.\.\.doc\.data\(\) \}\) as Work\);/g, 
`const worksData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Work);
        // Sort works by the 'order' field locally (fallback to createdAt or 0 if missing)
        worksData.sort((a, b) => {
          const orderA = typeof a.order === 'number' ? a.order : 9999;
          const orderB = typeof b.order === 'number' ? b.order : 9999;
          return orderA - orderB;
        });`);

fs.writeFileSync('src/contexts/WorksContext.tsx', code, 'utf8');
console.log("Added local sort to WorksContext");
