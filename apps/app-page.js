// Share button for the app pages. Uses the phone or browser's own share sheet
// where there is one, and otherwise copies the page link.
(function () {
  function toast(message) {
    let el = document.querySelector('.toast');
    if (!el) {
      el = document.createElement('div');
      el.className = 'toast';
      el.setAttribute('role', 'status');
      el.setAttribute('aria-live', 'polite');
      document.body.appendChild(el);
    }
    el.textContent = message;
    el.classList.add('is-shown');
    clearTimeout(el._hide);
    el._hide = setTimeout(() => el.classList.remove('is-shown'), 2200);
  }

  async function copy(text) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }
    // Older browsers and plain http: a hidden field and execCommand.
    const field = document.createElement('textarea');
    field.value = text;
    field.setAttribute('readonly', '');
    field.style.position = 'fixed';
    field.style.opacity = '0';
    document.body.appendChild(field);
    field.select();
    document.execCommand('copy');
    field.remove();
  }

  document.querySelectorAll('.share-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const data = { title: btn.dataset.title, text: btn.dataset.text, url: btn.dataset.url };
      if (navigator.share) {
        try {
          await navigator.share(data);
          return;
        } catch (e) {
          // Closing the share sheet is not a failure worth falling back from.
          if (e && e.name === 'AbortError') return;
        }
      }
      try {
        await copy(data.url);
        const label = btn.querySelector('.share-label');
        btn.classList.add('is-copied');
        if (label) label.textContent = 'Link copied';
        toast('Link copied to your clipboard');
        setTimeout(() => {
          btn.classList.remove('is-copied');
          if (label) label.textContent = 'Share';
        }, 2200);
      } catch (e) {
        toast(data.url);
      }
    });
  });
})();
