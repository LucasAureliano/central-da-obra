const fs = require('fs');
let code = fs.readFileSync('src/contexts/AuthContext.tsx', 'utf8');

if (!code.includes('hasSeenTour?: boolean;')) {
  code = code.replace('hasSeenWelcome?: boolean;', 'hasSeenWelcome?: boolean;\n    hasSeenTour?: boolean;');
  fs.writeFileSync('src/contexts/AuthContext.tsx', code, 'utf8');
  console.log('Added hasSeenTour to UserProfile');
} else {
  console.log('Already added');
}
