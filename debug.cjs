const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure().errorText));
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 3000)); // wait 3 seconds to let splash screen finish
  await page.screenshot({ path: 'screenshot.png' });
  const html = await page.evaluate(() => document.body.innerHTML);
  console.log('HTML DUMP:');
  console.log(html);
  await browser.close();
})();
