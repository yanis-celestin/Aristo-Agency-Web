/*
  Mobile navigation — shared across every page that has a <nav class="nav-inner">.

  On screens ≤900px the "Contact" button is replaced by a menu icon that opens a
  full-screen menu. The menu is BUILT FROM THE PAGE'S OWN NAV LINKS at runtime,
  so it always stays in sync — add or rename a nav item and the mobile menu
  follows automatically, with no duplicated markup to maintain.
*/
(function () {
    var nav = document.querySelector('nav');
    if (!nav) return;
    var inner = nav.querySelector('.nav-inner');
    var links = nav.querySelector('.nav-links');
    if (!inner || !links) return;

    /* ---------- styles ---------- */
    var css = [
        '.nav-toggle{display:none;width:44px;height:44px;margin-right:-10px;padding:0;',
        'background:none;border:0;cursor:pointer;color:var(--ink);',
        'align-items:center;justify-content:center;flex-direction:column;gap:6px}',
        '.nav-toggle i{display:block;width:22px;height:1.5px;background:currentColor}',
        'nav.at-top .nav-toggle{color:#F4F7FF}',

        '.mobile-menu{position:fixed;inset:0;z-index:300;background:var(--bg);color:var(--ink);',
        'display:flex;flex-direction:column;padding:0 var(--gutter) 48px;',
        'opacity:0;visibility:hidden;transition:opacity .28s ease,visibility .28s}',
        '.mobile-menu.open{opacity:1;visibility:visible}',
        '.mobile-menu-top{display:flex;align-items:center;justify-content:flex-end;height:68px;margin-bottom:6vh}',
        '.mobile-menu-close{width:44px;height:44px;margin-right:-10px;padding:0;background:none;border:0;',
        'cursor:pointer;color:var(--ink);position:relative}',
        '.mobile-menu-close::before,.mobile-menu-close::after{content:"";position:absolute;left:11px;top:21px;',
        'width:22px;height:1.5px;background:currentColor}',
        '.mobile-menu-close::before{transform:rotate(45deg)}',
        '.mobile-menu-close::after{transform:rotate(-45deg)}',
        '.mobile-menu ul{list-style:none;margin:0;padding:0}',
        '.mobile-menu li{opacity:0;transform:translateY(14px)}',
        '.mobile-menu.open li{opacity:1;transform:none;',
        'transition:opacity .45s ease,transform .45s cubic-bezier(.22,1,.36,1)}',
        '.mobile-menu.open li:nth-child(1){transition-delay:.05s}',
        '.mobile-menu.open li:nth-child(2){transition-delay:.10s}',
        '.mobile-menu.open li:nth-child(3){transition-delay:.15s}',
        '.mobile-menu.open li:nth-child(4){transition-delay:.20s}',
        '.mobile-menu.open li:nth-child(5){transition-delay:.25s}',
        '.mobile-menu.open li:nth-child(6){transition-delay:.30s}',
        '.mobile-menu a{display:block;padding:13px 0;font-size:clamp(28px,7.4vw,40px);',
        'line-height:1.25;letter-spacing:-.015em;color:var(--ink)}',

        '@media (max-width:900px){.nav-cta{display:none!important}.nav-toggle{display:inline-flex!important}}',
        '@media (min-width:901px){.mobile-menu{display:none}}',
        '@media (prefers-reduced-motion:reduce){.mobile-menu,.mobile-menu li{transition:none}}'
    ].join('');
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    /* ---------- menu icon (replaces the Contact button on mobile) ---------- */
    var btn = document.createElement('button');
    btn.className = 'nav-toggle';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Open menu');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', 'mobile-menu');
    btn.innerHTML = '<i></i><i></i>';
    inner.appendChild(btn);

    /* ---------- full-screen menu, built from this page's own links ---------- */
    var menu = document.createElement('div');
    menu.className = 'mobile-menu';
    menu.id = 'mobile-menu';
    menu.innerHTML = '<div class="mobile-menu-top">' +
        '<button class="mobile-menu-close" type="button" aria-label="Close menu"></button></div>';

    var ul = document.createElement('ul');
    function addItem(href, label) {
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.href = href;
        a.textContent = label;
        li.appendChild(a);
        ul.appendChild(li);
    }
    links.querySelectorAll('a').forEach(function (a) {
        addItem(a.getAttribute('href'), a.textContent.trim());
    });
    var cta = nav.querySelector('.nav-cta');
    if (cta) addItem(cta.getAttribute('href'), cta.textContent.trim());
    menu.appendChild(ul);
    document.body.appendChild(menu);

    /* ---------- behaviour ---------- */
    var closeBtn = menu.querySelector('.mobile-menu-close');
    function openMenu() {
        menu.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';   // lock background scroll
        closeBtn.focus();
    }
    function closeMenu() {
        menu.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        btn.focus();
    }
    btn.addEventListener('click', openMenu);
    closeBtn.addEventListener('click', closeMenu);
    menu.addEventListener('click', function (e) {
        if (e.target.tagName === 'A') closeMenu();   // navigating away
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && menu.classList.contains('open')) closeMenu();
    });
    window.addEventListener('resize', function () {
        if (window.innerWidth > 900 && menu.classList.contains('open')) closeMenu();
    });
})();
