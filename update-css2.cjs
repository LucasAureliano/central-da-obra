const fs = require('fs');
let code = fs.readFileSync('src/index.css', 'utf8');

const additionalCss = `
  /* Driver.js Overlay Enhancement */
  div#driver-page-overlay {
    backdrop-filter: blur(4px) !important;
    -webkit-backdrop-filter: blur(4px) !important;
  }
`;

code += additionalCss;

fs.writeFileSync('src/index.css', code, 'utf8');
console.log('updated css 2');
