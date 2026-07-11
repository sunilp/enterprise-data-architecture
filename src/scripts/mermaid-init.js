// Render mermaid code blocks client-side, only on pages that have them.
const blocks = document.querySelectorAll('code.language-mermaid');

if (blocks.length) {
  const { default: mermaid } = await import('mermaid');

  blocks.forEach((code) => {
    const holder = document.createElement('div');
    holder.className = 'mermaid';
    holder.textContent = code.textContent;
    const pre = code.closest('pre');
    (pre ?? code).replaceWith(holder);
  });

  mermaid.initialize({
    startOnLoad: false,
    theme: 'neutral',
    themeVariables: {
      background: '#fafaf8',
      primaryColor: '#efece4',
      primaryBorderColor: '#1a1a1a',
      primaryTextColor: '#1a1a1a',
      lineColor: '#6b6b6b',
      fontFamily: 'IBM Plex Mono, monospace',
      fontSize: '14px',
    },
  });

  await mermaid.run({ querySelector: '.mermaid' });
}
