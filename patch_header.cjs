const fs = require('fs');
let code = fs.readFileSync('src/components/ui/GlobalHeader.tsx', 'utf8');

const target = `<motion.div 
          onClick={handleHomeClick}
          style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', flex: 1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
          <CustomLogo theme={theme} variant="horizontal" size={32} />
        </motion.div>`;

const replacement = `<motion.div 
          className="hide-on-desktop"
          onClick={handleHomeClick}
          style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', flex: 1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
          <CustomLogo theme={theme} variant="horizontal" size={32} />
        </motion.div>
        {/* Placeholder for flex centering on desktop */}
        <div className="desktop-only" style={{ flex: 1 }} />`;

if (code.includes('<CustomLogo')) {
  code = code.replace(target, replacement);
  fs.writeFileSync('src/components/ui/GlobalHeader.tsx', code, 'utf8');
}
