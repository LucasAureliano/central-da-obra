const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

// Replace the renderContent call with AnimatePresence
code = code.replace(/<Suspense fallback=\{<div style=\{\{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' \}\}><Loader2 className="animate-spin text-blue-500" size=\{32\} \/><\/div>\}>\{renderContent\(\)\}<\/Suspense>/g, `
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab + (selectedWorkId || '')}
                      initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                      transition={{ duration: 0.3 }}
                      style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                    >
                      <Suspense fallback={<div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}><Loader2 className="animate-spin text-blue-500" size={32} /></div>}>
                        {renderContent()}
                      </Suspense>
                    </motion.div>
                  </AnimatePresence>`);

fs.writeFileSync('src/App.tsx', code, 'utf8');
console.log("Added smooth page transitions to App.tsx");
