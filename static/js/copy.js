// Copy buttons on the guide's code blocks. Each <pre> is wrapped so the
// button sits on the block's corner instead of scrolling away with a long
// line. Same look and feedback as the home page's install button.
(() => {
  if (!navigator.clipboard) return;   // no Clipboard API (plain http): no dead buttons
  document.querySelectorAll('article.doc pre').forEach(pre => {
    const wrap = document.createElement('div');
    wrap.className = 'codeblock';
    pre.parentNode.insertBefore(wrap, pre);
    wrap.appendChild(pre);

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'copy';
    btn.textContent = 'copy';
    btn.setAttribute('aria-label', 'Copy to clipboard');
    btn.addEventListener('click', async () => {
      const text = (pre.querySelector('code') || pre).innerText.replace(/\n+$/, '');
      try {
        await navigator.clipboard.writeText(text);
        btn.textContent = 'copied';
      } catch (e) {
        btn.textContent = 'failed';
      }
      setTimeout(() => (btn.textContent = 'copy'), 1500);
    });
    wrap.appendChild(btn);
  });
})();
