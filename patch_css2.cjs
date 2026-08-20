const fs = require('fs');
let code = fs.readFileSync('src/index.css', 'utf8');

const target = `.hide-on-desktop {
    display: none !important;
  }`;

const replacement = `.hide-on-desktop {
    display: none !important;
  }
  .desktop-only {
    display: block !important;
  }`;

const addMobileDesktopOnly = `.desktop-only { display: none !important; }
@media (min-width: 769px) {`;

code = code.replace(target, replacement);
code = code.replace(`@media (min-width: 769px) {`, addMobileDesktopOnly);

fs.writeFileSync('src/index.css', code, 'utf8');
