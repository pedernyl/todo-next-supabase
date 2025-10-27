const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const url = process.env.SITE_URL || 'http://localhost:3000';
  console.log('Visiting', url);
  try {
    await page.goto(url, { waitUntil: 'networkidle' });
    console.log('Visited root');
    await page.goto(url + '/login', { waitUntil: 'networkidle' });
    console.log('Visited /login');
  } catch (err) {
    console.error('Playwright visit error', err);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
})();
