const fs = require('fs');

let code = fs.readFileSync('src/components/onboarding/InteractiveTour.tsx', 'utf8');

// The old InteractiveTour uses setTimeout. Let's fix the DOM timing issue which caused the real problem!
code = code.replace(/setTimeout\(\(\) => \{/, `const checkElements = setInterval(() => {
      const isDesktop = window.innerWidth > 1024;
      const requiredSelector = isDesktop ? '#tour-inicio-desktop' : '#tour-inicio-mobile';
      
      if (document.querySelector(requiredSelector) || document.querySelector('.nav-item-desktop:has(.lucide-calculator)')) {
        clearInterval(checkElements);
        startTour();
      }
    }, 200);

    setTimeout(() => { clearInterval(checkElements); startTour(); }, 5000);

    const startTour = () => {`);
    
code = code.replace(/tour\.drive\(\);\n\s*\}, 1200\);/g, "tour.drive();\n    };");

fs.writeFileSync('src/components/onboarding/InteractiveTour.tsx', code, 'utf8');
console.log("Improved old InteractiveTour with smart loading");
