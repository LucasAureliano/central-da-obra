const fs = require('fs');

// LandingNavbar
let nav = fs.readFileSync('src/components/landing/LandingNavbar.tsx', 'utf8');
nav = nav.replace(/<Logo variant="horizontal" theme=\{theme\} \/>/g, '<Logo variant="horizontal" theme="dark" />');
fs.writeFileSync('src/components/landing/LandingNavbar.tsx', nav, 'utf8');

// InstitutionalFooter
let foot = fs.readFileSync('src/components/landing/InstitutionalFooter.tsx', 'utf8');
foot = foot.replace(/<Logo variant="horizontal" theme=\{theme\} \/>/g, '<Logo variant="horizontal" theme="dark" />');
fs.writeFileSync('src/components/landing/InstitutionalFooter.tsx', foot, 'utf8');

console.log("Updated Navbar and Footer Logos");
