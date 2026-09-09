const fs = require('fs');
let code = fs.readFileSync('src/components/layout/AppLayout.tsx', 'utf8');

// Inject IDs into desktop nav
code = code.replace(/<button className={`nav-item-desktop \${activeTab === 'inicio'/g, '<button id="tour-inicio-desktop" className={`nav-item-desktop ${activeTab === \'inicio\'');
code = code.replace(/<button className={`nav-item-desktop \${activeTab === 'obras'/g, '<button id="tour-obras-desktop" className={`nav-item-desktop ${activeTab === \'obras\'');
code = code.replace(/<button className={`nav-item-desktop \${activeTab === 'assistente'/g, '<button id="tour-assistente-desktop" className={`nav-item-desktop ${activeTab === \'assistente\'');

// Inject IDs into mobile bottom nav
code = code.replace(/<button \n\s*className={`nav-item \${activeTab === 'inicio'/g, '<button \n              id="tour-inicio-mobile"\n              className={`nav-item ${activeTab === \'inicio\'');
code = code.replace(/<button \n\s*className={`nav-item \${activeTab === 'obras'/g, '<button \n              id="tour-obras-mobile"\n              className={`nav-item ${activeTab === \'obras\'');
code = code.replace(/<button \n\s*className={`nav-item highlight-nav \${activeTab === 'assistente'/g, '<button \n              id="tour-assistente-mobile"\n              className={`nav-item highlight-nav ${activeTab === \'assistente\'');
code = code.replace(/<button \n\s*className={`nav-item \${activeTab === 'menu'/g, '<button \n              id="tour-menu-mobile"\n              className={`nav-item ${activeTab === \'menu\'');

fs.writeFileSync('src/components/layout/AppLayout.tsx', code, 'utf8');
console.log('Added IDs to AppLayout navigation');
