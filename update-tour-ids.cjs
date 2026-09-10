const fs = require('fs');
let code = fs.readFileSync('src/components/layout/AppLayout.tsx', 'utf8');

code = code.replace(/<button \s*className=\{`nav-item \$\{activeTab === 'inicio' \? 'active' : ''\}`\}\s*onClick=\{\(\) => setActiveTab\('inicio'\)\}\s*>/g, "<button id=\"tour-inicio-mobile\"\n            className={`nav-item ${activeTab === 'inicio' ? 'active' : ''}`}\n            onClick={() => setActiveTab('inicio')}\n          >");

code = code.replace(/<button \s*className=\{`nav-item \$\{activeTab === 'obras' \? 'active' : ''\}`\}\s*onClick=\{\(\) => setActiveTab\('obras'\)\}\s*>/g, "<button id=\"tour-obras-mobile\"\n            className={`nav-item ${activeTab === 'obras' ? 'active' : ''}`}\n            onClick={() => setActiveTab('obras')}\n          >");

code = code.replace(/<button \s*className=\{`nav-item highlight-nav \$\{activeTab === 'assistente' \? 'active' : ''\}`\}\s*onClick=\{\(\) => setActiveTab\('assistente'\)\}\s*>/g, "<button id=\"tour-assistente-mobile\"\n            className={`nav-item highlight-nav ${activeTab === 'assistente' ? 'active' : ''}`}\n            onClick={() => setActiveTab('assistente')}\n          >");

code = code.replace(/<button \s*className=\{`nav-item \$\{activeTab === 'menu' \? 'active' : ''\}`\}\s*onClick=\{\(\) => setActiveTab\('menu'\)\}\s*>/g, "<button id=\"tour-menu-mobile\"\n            className={`nav-item ${activeTab === 'menu' ? 'active' : ''}`}\n            onClick={() => setActiveTab('menu')}\n          >");

// Also the "calculos" button
code = code.replace(/<button \s*className=\{`nav-item \$\{activeTab === 'calculos' \? 'active' : ''\}`\}\s*onClick=\{\(\) => setActiveTab\('calculos'\)\}\s*>/g, "<button id=\"tour-calculos-mobile\"\n              className={`nav-item ${activeTab === 'calculos' ? 'active' : ''}`}\n              onClick={() => setActiveTab('calculos')}\n            >");

// And add id="tour-calculos-desktop" to desktop
code = code.replace(/<button className=\{`nav-item-desktop \$\{activeTab === 'calculos' \|\| activeTab === 'Calculadoras' \? 'active' : ''\}`\} onClick=\{\(\) => setActiveTab\('calculos'\)\}>/g, "<button id=\"tour-calculos-desktop\" className={`nav-item-desktop ${activeTab === 'calculos' || activeTab === 'Calculadoras' ? 'active' : ''}`} onClick={() => setActiveTab('calculos')}>");

// Add id="tour-menu-desktop"
code = code.replace(/<button className=\{`nav-item-desktop \$\{activeTab === 'menu' \? 'active' : ''\}`\} onClick=\{\(\) => setActiveTab\('menu'\)\}>/g, "<button id=\"tour-menu-desktop\" className={`nav-item-desktop ${activeTab === 'menu' ? 'active' : ''}`} onClick={() => setActiveTab('menu')}>");

fs.writeFileSync('src/components/layout/AppLayout.tsx', code, 'utf8');
console.log("Injected Tour IDs into AppLayout");
