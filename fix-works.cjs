const fs = require('fs');
let txt = fs.readFileSync('src/components/Works.tsx', 'utf8');

// Add Reorder to framer-motion import
txt = txt.replace("import { motion, AnimatePresence } from 'framer-motion';", "import { motion, AnimatePresence, Reorder } from 'framer-motion';\nimport { useEffect } from 'react';");

// Add localFilteredWorks state and handleReorder
const stateInjection = `  const [contextMenuWorkId, setContextMenuWorkId] = useState<string | null>(null);

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
      toast.error('Erro ao salvar nova ordem');
    }
  };
`;

txt = txt.replace("  const [contextMenuWorkId, setContextMenuWorkId] = useState<string | null>(null);", stateInjection);

// Replace filteredWorks.map with Reorder Group
const mapRegex = /<div style=\{\{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16, paddingBottom: 40 \}\}>\s*\{filteredWorks\.map\(\(work, index\) => \{\s*const isPrimary = primaryWork\?\.id === work\.id;\s*return \(\s*<div key=\{work\.id\} className=\{`card-premium card-premium-interactive animate-stagger-\$\{Math\.min\(\(index \+ 1\), 5\)\}`\} style=\{\{ padding: 0, position: 'relative', zIndex: contextMenuWorkId === work\.id \? 50 : 1 \}\} onClick=\{\(\) => onWorkSelect\(work\.id\)\}>/m;

const replacement = `<Reorder.Group axis="y" values={localFilteredWorks} onReorder={handleReorder} style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16, paddingBottom: 40, listStyle: 'none', margin: 0, padding: 0 }}>
            {localFilteredWorks.map((work, index) => {
              const isPrimary = primaryWork?.id === work.id;
              return (
                <Reorder.Item key={work.id} value={work} style={{ cursor: 'grab', position: 'relative', zIndex: contextMenuWorkId === work.id ? 50 : 1, listStyle: 'none' }} whileDrag={{ scale: 1.02, zIndex: 100 }} dragConstraints={{ top: 0, bottom: 0 }}>
                  <div className="card-premium card-premium-interactive" style={{ padding: 0 }} onClick={(e) => {
                    // Prevent navigation if dragging just ended (framer motion handles this usually, but just in case)
                    onWorkSelect(work.id);
                  }}>`;

txt = txt.replace(mapRegex, replacement);

// Replace closing divs
txt = txt.replace(/<\/div>\s*\)\s*\}\)\}\s*<\/div>/g, "</div>\n                </Reorder.Item>\n              );\n            })}\n          </Reorder.Group>");

fs.writeFileSync('src/components/Works.tsx', txt, 'utf8');
console.log('Works.tsx modified');
