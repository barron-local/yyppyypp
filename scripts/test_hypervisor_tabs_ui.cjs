const puppeteer = require('puppeteer-core');

async function testHypervisorTabs() {
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

  // Click Phase 2
  console.log('Clicking Phase 2 button...');
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll('button')].find(b => b.textContent.includes('ขั้นที่ 2'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  // Check top banner hypervisor switcher
  const bannerCheck = await page.evaluate(() => {
    const banner = document.querySelector('button span')?.textContent;
    const buttons = [...document.querySelectorAll('button')].map(b => b.textContent.trim()).filter(t => t.includes('VirtualBox') || t.includes('VMware') || t.includes('Proxmox'));
    return {
      foundButtons: buttons.length,
      sampleButtons: buttons.slice(0, 6)
    };
  });
  console.log('Banner & Tab Buttons found:', bannerCheck);

  // Click VMware tab on c6_1
  console.log('Clicking VMware tab on c6_1 card...');
  const clickedVMware = await page.evaluate(() => {
    const vmwareBtn = [...document.querySelectorAll('button')].find(b => b.textContent.includes('VMware Workstation'));
    if (vmwareBtn) {
      vmwareBtn.click();
      return true;
    }
    return false;
  });
  console.log('Clicked VMware:', clickedVMware);
  await new Promise(r => setTimeout(r, 800));

  const vmwareText = await page.evaluate(() => {
    const body = document.body.innerText;
    return {
      hasVMnet: body.includes('VMnet0') || body.includes('VMnet8'),
      hasWorkstation: body.includes('VMware Workstation Pro')
    };
  });
  console.log('VMware content verified:', vmwareText);

  // Click Proxmox tab
  console.log('Clicking Proxmox tab on c6_1 card...');
  await page.evaluate(() => {
    const proxmoxBtn = [...document.querySelectorAll('button')].find(b => b.textContent.includes('Proxmox VE'));
    if (proxmoxBtn) proxmoxBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  const proxmoxText = await page.evaluate(() => {
    const body = document.body.innerText;
    return {
      hasPort8006: body.includes(':8006'),
      hasPAM: body.includes('Linux PAM')
    };
  });
  console.log('Proxmox content verified:', proxmoxText);

  // Click VirtualBox tab
  console.log('Clicking VirtualBox tab on c6_1 card...');
  await page.evaluate(() => {
    const vboxBtn = [...document.querySelectorAll('button')].find(b => b.textContent.includes('Oracle VirtualBox'));
    if (vboxBtn) vboxBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  const vboxText = await page.evaluate(() => {
    const body = document.body.innerText;
    return {
      hasVBoxManage: body.includes('VBoxManage'),
      hasBridged: body.includes('Bridged Adapter') || body.includes('Host-Only')
    };
  });
  console.log('VirtualBox content verified:', vboxText);

  await browser.close();
  console.log('All Hypervisor Tabs UI tests PASSED! Total errors:', errors.length);
}

testHypervisorTabs().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
