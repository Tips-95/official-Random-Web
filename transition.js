/**
 * transition.js — tips & stuff
 * Add <script src="transition.js"></script> to every page.
 * Intercepts internal link clicks and plays a loading overlay.
 */
(function () {

  /* ── inject styles ── */
  const style = document.createElement('style');
  style.textContent = `
    #page-transition {
      position: fixed; inset: 0; z-index: 9999;
      background: #f5f2eb;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center; gap: 20px;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.22s ease;
    }
    #page-transition.show {
      opacity: 1;
      pointer-events: all;
    }
    #page-transition::before {
      content: '';
      position: absolute; inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
      background-size: 200px 200px;
    }
    #pt-logo {
      font-family: 'Instrument Serif', serif;
      font-size: 2rem; letter-spacing: -0.02em;
      color: #1a1612;
      position: relative;
      opacity: 0;
      transform: translateY(6px);
      transition: opacity 0.3s ease 0.05s, transform 0.3s ease 0.05s;
    }
    #pt-logo em { font-style: italic; color: #c8602a; }
    #page-transition.show #pt-logo {
      opacity: 1; transform: translateY(0);
    }
    #pt-bar-wrap {
      width: 120px; height: 2px;
      background: rgba(60,50,30,0.12);
      border-radius: 99px; overflow: hidden;
      position: relative;
    }
    #pt-bar {
      height: 100%; width: 0%;
      background: #c8602a;
      border-radius: 99px;
      transition: width 0s;
    }
    #page-transition.show #pt-bar {
      transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.1s;
      width: 100%;
    }
    #pt-label {
      font-family: 'DM Mono', monospace;
      font-size: 0.65rem; letter-spacing: 0.14em;
      text-transform: uppercase;
      color: #7a7060;
      opacity: 0;
      transition: opacity 0.3s ease 0.1s;
    }
    #page-transition.show #pt-label { opacity: 1; }
  `;
  document.head.appendChild(style);

  /* ── inject overlay HTML ── */
  const overlay = document.createElement('div');
  overlay.id = 'page-transition';
  overlay.innerHTML = `
    <div id="pt-logo">tips <em>&</em> stuff</div>
    <div id="pt-bar-wrap"><div id="pt-bar"></div></div>
    <div id="pt-label">loading...</div>
  `;
  document.body.appendChild(overlay);

  /* ── page enter: fade in from overlay if coming from a transition ── */
  if (sessionStorage.getItem('transitioning')) {
    sessionStorage.removeItem('transitioning');
    // Page just loaded via transition — no extra animation needed, just clear
  }

  /* ── intercept clicks ── */
  document.addEventListener('click', function (e) {
    const a = e.target.closest('a[href]');
    if (!a) return;

    const href = a.getAttribute('href');
    if (!href) return;

    // Skip: external links, hash links, mail/tel, new tab
    if (
      href.startsWith('http') ||
      href.startsWith('//') ||
      href.startsWith('#') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:') ||
      a.target === '_blank' ||
      e.metaKey || e.ctrlKey || e.shiftKey
    ) return;

    e.preventDefault();

    // Show overlay
    overlay.classList.add('show');
    sessionStorage.setItem('transitioning', '1');

    // Navigate after bar animation (~600ms)
    setTimeout(() => {
      window.location.href = href;
    }, 580);
  });

  /* ── also run on browser back/forward ── */
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) {
      overlay.classList.remove('show');
    }
  });

})();
