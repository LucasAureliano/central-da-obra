import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 320, height: 600, deviceScaleFactor: 2 });
  await page.goto('https://central-da-obra.vercel.app', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 6000));
  await page.screenshot({ path: 'C:\\Users\\Lucas\\.gemini\\antigravity\\brain\\6b2640ff-461a-4b13-a8c3-09fc523cae76\\screenshot_mobile.png' });
  await browser.close();
})();
