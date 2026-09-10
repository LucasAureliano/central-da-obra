const fs = require('fs');
let code = fs.readFileSync('src/components/onboarding/InteractiveTour.tsx', 'utf8');

// Replace setTimeout with a robust element waiter
const waiterCode = `
    const checkElements = setInterval(() => {
      const isDesktop = window.innerWidth > 1024;
      const requiredSelector = isDesktop ? '#tour-inicio-desktop' : '#tour-inicio-mobile';
      
      if (document.querySelector(requiredSelector)) {
        clearInterval(checkElements);
        startTour();
      }
    }, 200);

    // Timeout after 5s just in case
    setTimeout(() => { clearInterval(checkElements); startTour(); }, 5000);

    const startTour = () => {`;

code = code.replace(/setTimeout\(\(\) => \{/, waiterCode);

// Add the closing brace for startTour
code = code.replace(/tour\.drive\(\);\n\s*\}, 500\);/g, "tour.drive();\n    };\n");

// Add more driver CSS animations and fixes
code = code.replace(/overlayColor: 'rgba\(15,23,42,0\.85\)'/g, "overlayColor: 'rgba(0,0,0,0.85)'");

fs.writeFileSync('src/components/onboarding/InteractiveTour.tsx', code, 'utf8');
console.log("Updated InteractiveTour.tsx with robust waiting logic");
