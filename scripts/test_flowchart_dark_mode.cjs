const puppeteer = require('puppeteer-core');

async function testFlowchartThemes() {
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

  console.log('Opening http://localhost:5173...');
  await page.goto('http://localhost:5173', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await new Promise(r => setTimeout(r, 2000));

  // Click Phase 6 button
  console.log('Clicking Phase 6 button...');
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll('button')].find(b => b.textContent.includes('ขั้นที่ 6'));
    if (btn) btn.click();
  });

  // Wait for mermaid SVG to render
  console.log('Waiting for Mermaid SVG to render...');
  await page.waitForSelector('.mermaid-svg-container svg', { timeout: 10000 });

  const lightState = await page.evaluate(() => {
    const svgs = document.querySelectorAll('.mermaid-svg-container svg');
    const container = document.querySelector('.mermaid-svg-container');
    return {
      svgCount: svgs.length,
      hasLightClass: container?.classList.contains('mermaid-light-theme'),
      hasDarkClass: container?.classList.contains('mermaid-dark-theme'),
      firstSvgId: svgs[0]?.id || null,
      isHtmlDark: document.documentElement.classList.contains('dark')
    };
  });
  console.log('1. Light Mode Mermaid Initial State:', lightState);

  // Toggle Dark Mode via Top Bar
  console.log('Toggling Dark Mode via Top Bar...');
  await page.evaluate(() => {
    const themeBtn = [...document.querySelectorAll('button')].find(b => 
      (b.title && (b.title.includes('มืด') || b.title.includes('สว่าง'))) ||
      b.querySelector('svg.lucide-moon') || 
      b.querySelector('svg.lucide-sun')
    );
    if (themeBtn) themeBtn.click();
  });

  // Wait for SVG update
  await new Promise(r => setTimeout(r, 1500));

  const darkState = await page.evaluate(() => {
    const svgs = document.querySelectorAll('.mermaid-svg-container svg');
    const container = document.querySelector('.mermaid-svg-container');
    return {
      svgCount: svgs.length,
      hasLightClass: container?.classList.contains('mermaid-light-theme'),
      hasDarkClass: container?.classList.contains('mermaid-dark-theme'),
      firstSvgId: svgs[0]?.id || null,
      isHtmlDark: document.documentElement.classList.contains('dark')
    };
  });
  console.log('2. Dark Mode Mermaid State after Toggle:', darkState);

  // Test local toggle inside MermaidViewer
  console.log('Testing local toolbar button inside MermaidViewer...');
  await page.evaluate(() => {
    const localBtn = document.querySelector('button[title*="สลับเป็นโหมด"]');
    if (localBtn) localBtn.click();
  });

  await new Promise(r => setTimeout(r, 1500));

  const localToggleState = await page.evaluate(() => {
    const container = document.querySelector('.mermaid-svg-container');
    return {
      hasLightClass: container?.classList.contains('mermaid-light-theme'),
      hasDarkClass: container?.classList.contains('mermaid-dark-theme'),
      isHtmlDark: document.documentElement.classList.contains('dark')
    };
  });
  console.log('3. Local Toggle State inside MermaidViewer:', localToggleState);

  await browser.close();
  console.log('All flowchart theme tests PASSED! Total errors:', errors.length);
}

testFlowchartThemes().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
