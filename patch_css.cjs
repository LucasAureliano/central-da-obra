const fs = require('fs');
let code = fs.readFileSync('src/index.css', 'utf8');

const target = `@media (min-width: 769px) {`;
const replacement = `@media (min-width: 769px) {
  .hide-on-desktop {
    display: none !important;
  }`;

if (!code.includes('.hide-on-desktop')) {
  code = code.replace(target, replacement);
  fs.writeFileSync('src/index.css', code, 'utf8');
}
