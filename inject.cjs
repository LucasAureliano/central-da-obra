const fs = require('fs');
let code = fs.readFileSync('src/components/Works.tsx', 'utf8');

// 1. Imports
code = code.replace("import { motion, AnimatePresence } from 'framer-motion';", "import { motion, AnimatePresence, Reorder } from 'framer-motion';\nimport { useEffect } from 'react';");

// 2. State
code = code.replace("  const [contextMenuWorkId, setContextMenuWorkId] = useState<string | null>(null);", `  const [contextMenuWorkId, setContextMenuWorkId] = useState<string | null>(null);

  const [localFilteredWorks, setLocalFilteredWorks] = useState<Work[]>([]);
  useEffect(() => {
    const filtered = works.filter(w => {
      if (filter === 'all') return true;
      const progress = w.progress || 0;
      if (filter === 'ongoing') return progress < 100;
      if (filter === 'completed') return progress === 100;
      return true;
    });
    setLocalFilteredWorks(filtered);
  }, [works, filter]);

  const handleReorder = async (newOrder: Work[]) => {
    setLocalFilteredWorks(newOrder);
    const promises = newOrder.map((w, index) => {
      return updateDoc(doc(db, 'works', w.id), { order: index });
    });
    try {
      await Promise.all(promises);
    } catch (e) {
      console.error(e);
      toast.error('Erro ao salvar ordem');
    }
  };`);

// 3. Mapping Header
const mapSearch = `<div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16, paddingBottom: 40 }}>
            {filteredWorks.map((work, index) => {
              const isPrimary = primaryWork?.id === work.id;
              return (
                <div key={work.id} className={\`card-premium card-premium-interactive animate-stagger-\${Math.min((index + 1), 5)}\`} style={{ padding: 0, position: 'relative', zIndex: contextMenuWorkId === work.id ? 50 : 1 }} onClick={() => onWorkSelect(work.id)}>`;

const mapReplace = `<Reorder.Group axis="y" values={localFilteredWorks} onReorder={handleReorder} style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16, paddingBottom: 40, listStyle: 'none', margin: 0, padding: 0 }}>
            {localFilteredWorks.map((work, index) => {
              const isPrimary = primaryWork?.id === work.id;
              return (
                <Reorder.Item key={work.id} value={work} style={{ listStyle: 'none' }}>
                  <div className={\`card-premium card-premium-interactive animate-stagger-\${Math.min((index + 1), 5)}\`} style={{ padding: 0, position: 'relative', zIndex: contextMenuWorkId === work.id ? 50 : 1 }} onClick={() => onWorkSelect(work.id)}>`;
                  
code = code.replace(mapSearch, mapReplace);

// 4. Mapping Footer
const footerSearch = `                </div>
              );
            })}
          </div>`;
          
const footerReplace = `                </div>
                </Reorder.Item>
              );
            })}
          </Reorder.Group>`;

code = code.replace(footerSearch, footerReplace);

fs.writeFileSync('src/components/Works.tsx', code, 'utf8');
console.log('Fixed properly');
