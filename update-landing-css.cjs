const fs = require('fs');
let code = fs.readFileSync('src/styles/landing.css', 'utf8');

// Force dark mode colors for navbar and footer
const forceDarkCSS = `
/* Force Dark Mode locally */
.landing-navbar, .landing-footer, .auth-modal-dark-force {
  --text-main: #FFFFFF;
  --text-muted: #9CA3AF;
  --bg-main: #0A0A0B;
  --bg-surface: #1E293B;
  --border-subtle: rgba(255,255,255,0.1);
}
`;

if (!code.includes('.auth-modal-dark-force')) {
  code = forceDarkCSS + code;
}

// Remove the [data-theme='light'] override for navbar
code = code.replace(/\[data-theme='light'\] \.landing-navbar\.scrolled \{\s*background-color: rgba\(255, 255, 255, 0\.85\);\s*\}/, '');

fs.writeFileSync('src/styles/landing.css', code, 'utf8');
console.log("Updated landing.css");
