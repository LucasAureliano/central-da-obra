const fs = require('fs');
let code = fs.readFileSync('src/hooks/useInsights.tsx', 'utf-8');

// The block to remove:
//       // --- SMART WEATHER INSIGHT ---
//       if (activeWork?.address) {
//          generatedInsights.push({
//           id: 'weather-alert',
//           icon: <AlertCircle size={20} color="#F59E0B" />,
//           title: 'Alerta Climático',
//           ...
//         });
//       }

const startIndex = code.indexOf('// --- SMART WEATHER INSIGHT ---');
if (startIndex !== -1) {
    const endIndex = code.indexOf('// Realtime Schedule Stages integration');
    if (endIndex !== -1) {
        code = code.slice(0, startIndex) + code.slice(endIndex);
        fs.writeFileSync('src/hooks/useInsights.tsx', code, 'utf-8');
        console.log("Removed Successfully.");
    }
}
