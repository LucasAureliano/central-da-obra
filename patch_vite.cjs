const fs = require('fs');

let code = fs.readFileSync('vite.config.ts', 'utf8');

const target = `manualChunks: {
          'vendor-react': ['react', 'react-dom', 'framer-motion'],
          'vendor-firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage'],
          'vendor-pdf': ['jspdf', 'jspdf-autotable', 'html2canvas'],
          'vendor-payments': ['@stripe/stripe-js', '@mercadopago/sdk-react'],
          'vendor-charts': ['recharts'] // Assuming they might use recharts or similar, otherwise it safely ignores
        }`;

const replacement = `manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('framer-motion')) return 'vendor-react';
            if (id.includes('firebase')) return 'vendor-firebase';
            if (id.includes('jspdf') || id.includes('html2canvas')) return 'vendor-pdf';
            if (id.includes('stripe') || id.includes('mercadopago')) return 'vendor-payments';
            return 'vendor-core';
          }
        }`;

code = code.replace(target, replacement);

fs.writeFileSync('vite.config.ts', code, 'utf8');
