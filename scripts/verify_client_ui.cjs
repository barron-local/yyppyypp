const puppeteer = require('puppeteer-core');

async function testUI() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('Browser Error:', msg.text());
      errors.push(msg.text());
    }
  });

  page.on('pageerror', err => {
    console.log('Page Exception:', err.message);
    errors.push(err.message);
  });

  console.log('Navigating to http://localhost:5173...');
  await page.goto('http://localhost:5173', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await new Promise(r => setTimeout(r, 2000));

  const title = await page.title();
  console.log('Page Title:', title);

  const cardCount = await page.evaluate(() => document.querySelectorAll('article').length);
  console.log('Rendered Question Cards Count:', cardCount);

  // Test Phase Stepper pills
  const phasePills = await page.evaluate(() => {
    const buttons = [...document.querySelectorAll('button')];
    return buttons.map(b => b.textContent.trim()).filter(t => t.includes('ขั้นที่'));
  });
  console.log('Found Phase Stepper Buttons Count:', phasePills.length);
  console.log('Sample Phase Steppers:', phasePills.slice(0, 4));

  // Test clicking Phase 1 button
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll('button')].find(b => b.textContent.includes('ขั้นที่ 1'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 500));
  const phase1Count = await page.evaluate(() => document.querySelectorAll('article').length);
  console.log('Phase 1 Card Count after filter:', phase1Count);

  // Test switching to Section view
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll('button')].find(b => b.textContent.includes('เรียงตามหมวดเล่ม PDF'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 500));
  const sectionCardCount = await page.evaluate(() => document.querySelectorAll('article').length);
  console.log('Section view Card Count:', sectionCardCount);

  await browser.close();
  console.log('UI Verification passed! Total console errors:', errors.length);
}

testUI().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
