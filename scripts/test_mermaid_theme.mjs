import mermaid from 'mermaid';

async function testTheme() {
  mermaid.initialize({
    startOnLoad: false,
    theme: 'dark',
    securityLevel: 'loose'
  });
  
  const resDark = await mermaid.render('test-dark', 'flowchart TD\n  Start([Start]) --> End([End])');
  console.log('Dark SVG length:', resDark.svg.length);
  console.log('Sample Dark SVG substring:', resDark.svg.substring(0, 300));

  mermaid.initialize({
    startOnLoad: false,
    theme: 'default',
    securityLevel: 'loose'
  });

  const resLight = await mermaid.render('test-light', 'flowchart TD\n  Start([Start]) --> End([End])');
  console.log('Light SVG length:', resLight.svg.length);
  console.log('Sample Light SVG substring:', resLight.svg.substring(0, 300));
}

testTheme().catch(console.error);
