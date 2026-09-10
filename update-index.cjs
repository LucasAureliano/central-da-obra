const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const preloader = `
    <div id="root">
      <div id="global-preloader" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: #0A0A0B; display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 999999; font-family: system-ui, -apple-system, sans-serif;">
        <div style="width: 64px; height: 64px; border-radius: 16px; background-color: rgba(255, 107, 0, 0.1); display: flex; align-items: center; justify-content: center; margin-bottom: 24px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2 22L12 2l10 20"/>
            <path d="M12 12v10"/>
            <path d="M7 12l10 5"/>
          </svg>
        </div>
        <div style="color: #FFFFFF; font-size: 20px; font-weight: 700; margin-bottom: 8px;">CentralObra</div>
        <div style="color: rgba(255, 255, 255, 0.5); font-size: 14px;">Carregando ambiente...</div>
        <div style="margin-top: 32px; width: 48px; height: 48px; border: 3px solid rgba(255, 107, 0, 0.2); border-top-color: #FF6B00; border-radius: 50%; animation: spin 1s linear infinite;"></div>
        <style>
          @keyframes spin { to { transform: rotate(360deg); } }
        </style>
      </div>
`;

code = code.replace(/<div id="root">/, preloader);

fs.writeFileSync('index.html', code, 'utf8');
console.log("Added global preloader to index.html");
