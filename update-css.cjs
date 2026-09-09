const fs = require('fs');
let code = fs.readFileSync('src/index.css', 'utf8');

const popoverOld = `.premium-tour-popover {
    background: var(--bg-surface-solid) !important;
    color: var(--text-main) !important;
    border-radius: 16px !important;
    border: 1px solid var(--border-subtle) !important;
    box-shadow: 0 12px 32px rgba(0,0,0,0.15) !important;
    font-family: 'Inter', sans-serif !important;
  }`;

const popoverNew = `.premium-tour-popover {
    background: rgba(22, 24, 33, 0.8) !important;
    backdrop-filter: blur(24px) !important;
    -webkit-backdrop-filter: blur(24px) !important;
    color: var(--text-main) !important;
    border-radius: 20px !important;
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
    box-shadow: 0 24px 48px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1) !important;
    font-family: 'Inter', sans-serif !important;
    padding: 20px !important;
  }
  [data-theme='light'] .premium-tour-popover {
    background: rgba(255, 255, 255, 0.85) !important;
    border: 1px solid rgba(0, 0, 0, 0.05) !important;
    box-shadow: 0 24px 48px rgba(0,0,0,0.1) !important;
  }`;

code = code.replace(popoverOld, popoverNew);

fs.writeFileSync('src/index.css', code, 'utf8');
console.log('updated css');
