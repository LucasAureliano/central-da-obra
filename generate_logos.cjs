const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const generateLogos = async () => {
  const outputDir = path.join(__dirname, 'brand_system');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  // Load images
  const darkImageBase64 = fs.readFileSync(path.join(__dirname, 'public', 'assets', 'logo_3d.jpg'), 'base64');
  const lightImageBase64 = fs.readFileSync(path.join(__dirname, 'public', 'assets', 'logo_light_3d.jpg'), 'base64');

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const themes = [
    { 
      name: 'dark', 
      bg: 'radial-gradient(circle at center, #1A1A1A 0%, #050505 100%)', 
      text: '#ffffff', 
      src: `data:image/jpeg;base64,${darkImageBase64}` 
    },
    { 
      name: 'light', 
      bg: 'radial-gradient(circle at center, #FFFFFF 0%, #EFEFEF 100%)', 
      text: '#121212', 
      src: `data:image/jpeg;base64,${lightImageBase64}` 
    }
  ];

  // Variations for the Brand System
  const configs = [
    { name: 'logo_principal', width: 1080, height: 1080, mode: 'mode-vertical' }, // Square layout
    { name: 'logo_compacta', width: 800, height: 800, mode: 'mode-vertical' },
    { name: 'splash_logo', width: 1080, height: 1080, mode: 'mode-vertical' },
    { name: 'app_icon_1024', width: 1024, height: 1024, mode: 'mode-icon' },
    { name: 'favicon_512', width: 512, height: 512, mode: 'mode-icon' },{ name: 'favicon_192', width: 192, height: 192, mode: 'mode-icon' }
  ];

  for (const theme of themes) {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@800&display=swap');
          body { 
            margin: 0; padding: 0;
            background: ${theme.bg};
            display: flex; flex-direction: column;
            align-items: center; justify-content: center;
            height: 100vh; width: 100vw;
            overflow: hidden;
            font-family: 'Plus Jakarta Sans', sans-serif;
            position: relative;
          }
          
          .container {
            display: flex; flex-direction: column;
            align-items: center; justify-content: center;
            width: 100%; height: 100%;
            position: relative;
            z-index: 1;
          }
          
          .logo-img {
            /* Transição muito suave para o fundo */
            -webkit-mask-image: radial-gradient(circle at center, black 40%, transparent 70%);
            mask-image: radial-gradient(circle at center, black 40%, transparent 70%);
            object-fit: cover;
          }
          
          .logo-text {
            font-weight: 800; color: ${theme.text};
            letter-spacing: -0.03em;
            line-height: 1;
            text-align: center;
            z-index: 10;
          }
          .dot { color: #FF6B00; }
          
          /* Vertical Layouts */
          body.mode-vertical .logo-img {
            width: 75vmin; height: 75vmin;
            margin-top: 5vmin; /* Empurra para o topo */
          }
          body.mode-vertical .logo-text {
            font-size: 13vmin;
            margin-top: -8vmin; /* Aproxima o texto da parte iluminada inferior */
          }
          
          /* Icon Layout (App Icon) - Apenas a imagem pura, centralizada */
          body.mode-icon .bg-blur { display: none; }
          body.mode-icon .logo-img { 
            width: 100%; height: 100%; 
            margin: 0;
            -webkit-mask-image: none; mask-image: none;
          }
          body.mode-icon .logo-text { display: none; }
        </style>
      </head>
      <body>
        
        <div class="container">
          <img class="logo-img" src="${theme.src}" />
          <div class="logo-text">CentralObra<span class="dot">.</span></div>
        </div>
      </body>
      </html>
    `;

    await page.setContent(htmlContent);

    for (const config of configs) {
      await page.setViewport({ width: config.width, height: config.height });
      await page.evaluate((mode) => { document.body.className = mode; }, config.mode);
      
      await page.evaluateHandle('document.fonts.ready');
      await new Promise(r => setTimeout(r, 200));

      const filename = theme.name === 'dark' ? `${config.name}.png` : `${config.name}_light.png`;
      await page.screenshot({ path: path.join(outputDir, filename) });
      console.log(`Generated ${filename}`);
    }
  }

  await browser.close();
};

generateLogos().catch(console.error);
