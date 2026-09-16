const fs = require('fs');
let code = fs.readFileSync('src/components/landing/FeaturesGridSection.tsx', 'utf8');

const oldCard = `className="landing-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}`;

const newCard = `className="landing-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05, translateY: -5, boxShadow: '0 20px 40px rgba(59, 130, 246, 0.1)' }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}`;

code = code.replace(oldCard, newCard);
fs.writeFileSync('src/components/landing/FeaturesGridSection.tsx', code, 'utf8');
console.log("Updated FeaturesGridSection");
