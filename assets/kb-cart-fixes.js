// kb-cart-fixes.js — Kleine Boefies cart helpers v2
(() => {
  function lineIndex(row) {
    const rows = Array.from(document.querySelectorAll('.cart-items .cart-item'));
    const i = rows.indexOf(row);
    return i >= 0 ? i + 1 : null; // Shopify line is 1-based
  }

  function removeByLine(line) {
    if (!line) return;
    // server-side, super-betrouwbaar:
    window.location.href = `/cart/change?line=${line}&quantity=0`;
  }

  function wireRemoveButtons(root = document) {
    document.querySelectorAll('.cart-items .cart-item').forEach((row) => {
      // 1) bestaande verwijderknoppen “repareren”
      const nativeBtns = row.querySelectorAll('.cart-remove, .cart-remove-button, [data-cart-remove], a[href*="change"][href*="quantity=0"]');
      let any = false;
      nativeBtns.forEach((btn) => {
        if (btn.__kbWired) return;
        btn.__kbWired = true;
        any = true;
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const ln = lineIndex(row);
          removeByLine(ln);
        });
      });

      // 2) als er geen knop is, voeg er één toe naast de qty
      if (!any) {
        const holder = row.querySelector('.cart-item__quantity') || row.querySelector('.cart-item__totals') || row;
        if (holder && !holder.querySelector('.kb-remove')) {
          const b = document.createElement('button');
          b.type = 'button';
          b.className = 'kb-remove';
          b.textContent = 'Verwijderen';
          b.setAttribute('aria-label', 'Verwijder dit product');
          b.addEventListener('click', () => removeByLine(lineIndex(row)));
          holder.appendChild(b);
        }
      }
    });
  }

  // Zorg dat +/− zichtbaar zijn op qty-knoppen
  function ensurePlusMinus() {
    document.querySelectorAll('.quantity__button').forEach((btn) => {
      if (btn.textContent.trim() === '') {
        const isMinus = (btn.name || '').toLowerCase().includes('minus');
        btn.textContent = isMinus ? '−' : '+';
      }
      btn.setAttribute('aria-hidden', 'false');
    });
  }

  // Leeg-bericht tonen/verbergen
  function toggleEmptyState() {
    const hasItems = !!document.querySelector('.cart-items .cart-item');
    document.querySelectorAll('.cart__warnings, .cart--empty, .cart__empty-text').forEach((w) => {
      if (hasItems) {
        w.setAttribute('hidden', 'hidden');
        w.style.display = 'none';
      } else {
        w.removeAttribute('hidden');
        w.style.display = '';
      }
    });
  }

  function init() {
    wireRemoveButtons();
    ensurePlusMinus();
    toggleEmptyState();
  }

  document.addEventListener('DOMContentLoaded', init);
  document.addEventListener('shopify:section:load', init);
})();
