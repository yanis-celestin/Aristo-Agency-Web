/*
  Cookie consent + Google Analytics — shared across every page.

  GDPR / ePrivacy approach:
  - Google Analytics (gtag.js) is NOT loaded and sets NO cookies until the
    visitor clicks "Accept". Before that, nothing is sent to Google.
  - "Reject" is one click and as prominent as "Accept".
  - The choice is remembered for ~6 months, then the visitor is asked again.
  - Consent can be changed or withdrawn at any time via the "Cookie settings"
    link this script adds to the footer's Legal list (or by calling
    window.openCookieSettings()). Withdrawing stops tracking and deletes
    the _ga cookies.
  - Google Consent Mode v2 defaults are set to "denied" as a second safeguard.
*/
(function () {
    var GA_ID = 'G-VHMLTY2KR6';
    var KEY = 'aristo-cookie-consent';
    var MAX_AGE = 1000 * 60 * 60 * 24 * 182; // ~6 months

    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('consent', 'default', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied'
    });

    /* ---------- stored choice ---------- */
    function readChoice() {
        try {
            var v = JSON.parse(localStorage.getItem(KEY));
            if (v && (v.c === 'accepted' || v.c === 'rejected') && Date.now() - v.t < MAX_AGE) return v.c;
        } catch (e) {}
        return null;
    }
    function saveChoice(c) {
        try { localStorage.setItem(KEY, JSON.stringify({ c: c, t: Date.now() })); } catch (e) {}
    }

    /* ---------- analytics on / off ---------- */
    var gaLoaded = false;
    function enableAnalytics() {
        window['ga-disable-' + GA_ID] = false;
        gtag('consent', 'update', { analytics_storage: 'granted' });
        if (gaLoaded) return;
        gaLoaded = true;
        var s = document.createElement('script');
        s.async = true;
        s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
        document.head.appendChild(s);
        gtag('js', new Date());
        gtag('config', GA_ID);
    }
    function disableAnalytics() {
        window['ga-disable-' + GA_ID] = true;
        gtag('consent', 'update', { analytics_storage: 'denied' });
        // Delete any Google Analytics cookies already set (_ga, _ga_XXXX)
        var host = location.hostname;
        var domains = ['', host, '.' + host, '.' + host.replace(/^www\./, '')];
        document.cookie.split(';').forEach(function (c) {
            var name = c.split('=')[0].trim();
            if (!/^_ga/.test(name)) return;
            domains.forEach(function (d) {
                document.cookie = name + '=; Max-Age=0; path=/' + (d ? '; domain=' + d : '');
            });
        });
    }

    /* ---------- banner ---------- */
    var css = [
        '.cookie-banner{position:fixed;left:24px;bottom:24px;z-index:250;max-width:400px;',
        'background:#FFFFFF;color:#0F1923;border:1px solid #E0E5EE;border-radius:10px;',
        'padding:22px 22px 20px;box-shadow:0 18px 44px -18px rgba(15,25,35,.35);',
        'font-family:inherit;font-size:13.5px;line-height:1.6;',
        'opacity:0;transform:translateY(12px);transition:opacity .35s ease,transform .35s cubic-bezier(.22,1,.36,1)}',
        '.cookie-banner.show{opacity:1;transform:none}',
        '.cookie-banner p{margin:0 0 16px;color:#5C6980}',
        '.cookie-banner strong{display:block;margin-bottom:6px;color:#0F1923;font-weight:500;font-size:14px}',
        '.cookie-banner a{color:#0F1923;text-decoration:underline;text-underline-offset:2px}',
        '.cookie-actions{display:flex;gap:10px}',
        '.cookie-actions button{flex:1;padding:11px 14px;font:inherit;font-size:11px;letter-spacing:.12em;',
        'text-transform:uppercase;cursor:pointer;border:1px solid #0F1923;border-radius:0;',
        'transition:background .2s,color .2s}',
        '.cookie-reject{background:transparent;color:#0F1923}',
        '.cookie-reject:hover{background:#0F1923;color:#FFFFFF}',
        '.cookie-accept{background:#0F1923;color:#FFFFFF}',
        '.cookie-accept:hover{background:#2A3644}',
        '@media (max-width:560px){.cookie-banner{left:12px;right:12px;bottom:12px;max-width:none}}'
    ].join('');

    var banner = null;
    function hideBanner() {
        if (!banner) return;
        banner.classList.remove('show');
        var b = banner;
        banner = null;
        setTimeout(function () { b.remove(); }, 350);
    }
    function showBanner() {
        if (banner) return;
        if (!document.getElementById('cookie-banner-css')) {
            var st = document.createElement('style');
            st.id = 'cookie-banner-css';
            st.textContent = css;
            document.head.appendChild(st);
        }
        banner = document.createElement('div');
        banner.className = 'cookie-banner';
        banner.setAttribute('role', 'region');
        banner.setAttribute('aria-label', 'Cookie consent');
        banner.innerHTML =
            '<strong>Cookies</strong>' +
            '<p>We’d like to use analytics cookies (Google Analytics) to understand how visitors use our site. ' +
            'They’re only set if you accept. See our <a href="/privacy-policy">Privacy Policy</a>.</p>' +
            '<div class="cookie-actions">' +
            '<button type="button" class="cookie-reject">Reject</button>' +
            '<button type="button" class="cookie-accept">Accept</button>' +
            '</div>';
        banner.querySelector('.cookie-accept').addEventListener('click', function () {
            saveChoice('accepted'); enableAnalytics(); hideBanner();
        });
        banner.querySelector('.cookie-reject').addEventListener('click', function () {
            saveChoice('rejected'); disableAnalytics(); hideBanner();
        });
        document.body.appendChild(banner);
        requestAnimationFrame(function () { requestAnimationFrame(function () { banner && banner.classList.add('show'); }); });
    }

    // Lets the visitor change their mind at any time
    window.openCookieSettings = showBanner;

    /* ---------- footer "Cookie settings" link ---------- */
    function addFooterLink() {
        var footer = document.querySelector('footer');
        if (!footer) return;
        // The Legal list's Privacy Policy link (not the newsletter consent link)
        var policy = footer.querySelector('ul a[href*="privacy-policy"]');
        var list = policy && policy.closest('ul');
        if (!list || list.querySelector('.cookie-settings-link')) return;
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.href = '#';
        a.className = 'cookie-settings-link';
        a.textContent = 'Cookie Settings';
        a.addEventListener('click', function (e) { e.preventDefault(); showBanner(); });
        li.appendChild(a);
        list.appendChild(li);
    }

    /* ---------- start ---------- */
    var choice = readChoice();
    if (choice === 'accepted') enableAnalytics();

    function onReady() {
        addFooterLink();
        if (!choice) showBanner();
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', onReady);
    else onReady();
})();
