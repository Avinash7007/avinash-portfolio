// ============================================================
// Avinash Dubey — Portfolio scripts
// Smooth-scroll nav, mobile hamburger menu, accessible sliders,
// floating action buttons, obfuscated email, GA4 event tracking.
// ============================================================

(function () {
  'use strict';

  // ── SMOOTH SCROLL TO SECTION ─────────────────────────────
  function navTo(id) {
    var el = document.getElementById(id);
    if (!el) return;
    var navEl = document.getElementById('topnav');
    var offset = navEl ? navEl.offsetHeight + 6 : 70;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - offset, behavior: 'smooth' });
  }

  // ── NAV: click handling (data-nav links), active highlight ──
  var NAV_SECTIONS = ['about', 'skills', 'projects', 'experience', 'contact'];
  var navLinks = document.querySelectorAll('.nav-links a[data-nav]');
  var topnav = document.getElementById('topnav');
  var navToggle = document.getElementById('navToggle');
  var navLinksBox = document.getElementById('navLinksBox');

  function closeMobileMenu() {
    if (!topnav || !navToggle) return;
    topnav.classList.remove('menu-open');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  function openMobileMenu() {
    if (!topnav || !navToggle) return;
    topnav.classList.add('menu-open');
    navToggle.setAttribute('aria-expanded', 'true');
  }

  document.querySelectorAll('[data-nav]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      navTo(link.getAttribute('data-nav'));
      closeMobileMenu();
    });
  });

  var logoLink = document.querySelector('.logo');
  if (logoLink) {
    logoLink.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      closeMobileMenu();
    });
  }

  function setActive() {
    var sy = window.pageYOffset + 130;
    var cur = '';
    NAV_SECTIONS.forEach(function (id) {
      var el = document.getElementById(id);
      if (el && el.offsetTop <= sy) cur = id;
    });
    navLinks.forEach(function (a) {
      a.classList.toggle('active', a.getAttribute('data-nav') === cur);
      if (a.getAttribute('data-nav') === cur) {
        a.setAttribute('aria-current', 'true');
      } else {
        a.removeAttribute('aria-current');
      }
    });
  }
  window.addEventListener('scroll', setActive, { passive: true });
  setActive();

  // ── MOBILE HAMBURGER MENU ────────────────────────────────
  if (navToggle) {
    navToggle.addEventListener('click', function () {
      var isOpen = topnav.classList.contains('menu-open');
      if (isOpen) closeMobileMenu(); else openMobileMenu();
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMobileMenu();
  });
  document.addEventListener('click', function (e) {
    if (!topnav || !topnav.classList.contains('menu-open')) return;
    if (!topnav.contains(e.target)) closeMobileMenu();
  });
  window.addEventListener('resize', function () {
    if (window.innerWidth > 900) closeMobileMenu();
  });

  // ── SLIDERS (manual only, keyboard accessible, NO auto) ──
  var SL = {};

  function initSlider(id) {
    var btn = document.querySelector('.sl-btn[data-sid="' + id + '"]');
    if (!btn) return;
    var wrap = btn.closest('.slider-wrap');
    if (!wrap) return;

    var slides = wrap.querySelectorAll('.slide-item');
    var dotsBox = document.getElementById('dots' + id);
    var n = slides.length;
    SL[id] = { cur: 0, n: n, slides: slides, dotsBox: dotsBox };

    dotsBox.innerHTML = '';
    for (var i = 0; i < n; i++) {
      var d = document.createElement('button');
      d.type = 'button';
      d.className = 'sl-dot' + (i === 0 ? ' on' : '');
      d.setAttribute('aria-label', 'Show slide ' + (i + 1) + ' of ' + n);
      (function (idx) {
        d.addEventListener('click', function (e) {
          e.stopPropagation();
          goSlide(id, idx);
        });
      })(i);
      dotsBox.appendChild(d);
    }
    SL[id].dots = dotsBox.querySelectorAll('.sl-dot');

    // Keyboard support: left/right arrows while the slider has focus
    wrap.setAttribute('tabindex', '0');
    wrap.setAttribute('role', 'group');
    wrap.setAttribute('aria-label', 'Project screenshot gallery');
    wrap.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); goSlide(id, SL[id].cur - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); goSlide(id, SL[id].cur + 1); }
    });
  }

  function goSlide(id, idx) {
    var s = SL[id];
    if (!s) return;
    s.slides[s.cur].classList.remove('active');
    s.dots[s.cur].classList.remove('on');
    s.cur = ((idx % s.n) + s.n) % s.n;
    s.slides[s.cur].classList.add('active');
    s.dots[s.cur].classList.add('on');
  }

  document.querySelectorAll('.sl-prev').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var id = parseInt(btn.getAttribute('data-sid'), 10);
      if (SL[id]) goSlide(id, SL[id].cur - 1);
    });
  });
  document.querySelectorAll('.sl-next').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var id = parseInt(btn.getAttribute('data-sid'), 10);
      if (SL[id]) goSlide(id, SL[id].cur + 1);
    });
  });

  document.querySelectorAll('.slider-wrap').forEach(function (wrap, i) {
    initSlider(i + 1);
  });

  // ── FLOATING ACTION BUTTONS: show after scrolling past hero ─
  (function () {
    var fa = document.getElementById('floatActions');
    var hero = document.getElementById('hero');
    if (!fa || !hero) return;
    function toggleFloat() {
      var heroBottom = hero.getBoundingClientRect().bottom;
      fa.classList.toggle('show', heroBottom < 100);
    }
    window.addEventListener('scroll', toggleFloat, { passive: true });
    toggleFloat();
  })();

  // ── OBFUSCATED EMAIL (kept out of page source as plain text) ─
  var CONTACT_EMAIL = 'dubeyavinash157' + '@' + 'gmail.com';
  var CONTACT_PHONE = '+91 7007682626';
  (function () {
    var ci = document.getElementById('email-ci');
    var btn = document.getElementById('email-btn');
    if (ci) ci.href = 'mai' + 'lto:' + CONTACT_EMAIL;
    if (btn) btn.href = 'mai' + 'lto:' + CONTACT_EMAIL;
  })();

  // ── TOAST (visible confirmation when mailto:/tel: has no app to open) ─
  function showToast(msg) {
    var t = document.getElementById('toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'toast';
      t.className = 'toast';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t._hideTimer);
    t._hideTimer = setTimeout(function () { t.classList.remove('show'); }, 2600);
  }

  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (err) { /* no-op */ }
    document.body.removeChild(ta);
  }

  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(function () { fallbackCopy(text); });
    } else {
      fallbackCopy(text);
    }
  }

  // Detect touch/mobile devices — on these, tel: already opens the native
  // dialer app directly, so we skip the copy+toast fallback there.
  var IS_TOUCH_DEVICE = window.matchMedia && window.matchMedia('(any-pointer: coarse)').matches;

  // Every mailto: link: on mobile, let the native Mail app open normally.
  // On desktop (often no mail client registered), open Gmail's web compose
  // in a new tab instead — a real "send email" action, not just a copy —
  // and also copy the address to clipboard as a backup.
  document.querySelectorAll('a[href^="mai' + 'lto:"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      if (!IS_TOUCH_DEVICE) {
        e.preventDefault();
        copyToClipboard(CONTACT_EMAIL);
        var gmailUrl = 'https://mail.google.com/mail/?view=cm&fs=1&to=' +
          encodeURIComponent(CONTACT_EMAIL) +
          '&su=' + encodeURIComponent('Portfolio Inquiry');
        window.open(gmailUrl, '_blank', 'noopener');
        showToast('Opening Gmail — address also copied: ' + CONTACT_EMAIL);
      }
      // On mobile: do nothing extra, let the mailto: link open the native Mail app.
    });
  });

  // Every tel: link: on desktop (no dialer app), copy + toast as fallback.
  // On mobile/touch devices, let the native dialer open cleanly — no popup.
  document.querySelectorAll('a[href^="tel:"]').forEach(function (a) {
    a.addEventListener('click', function () {
      if (!IS_TOUCH_DEVICE) {
        copyToClipboard(CONTACT_PHONE);
        showToast('Number copied: ' + CONTACT_PHONE);
      }
    });
  });

  // ── ANALYTICS: section views + CTA click tracking (GA4) ──
  (function () {
    function track(name, params) {
      if (typeof window.gtag === 'function') window.gtag('event', name, params || {});
    }

    var sectionIds = ['about', 'skills', 'projects', 'experience', 'certificates', 'contact'];
    var seen = {};
    if ('IntersectionObserver' in window) {
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          var id = entry.target.id;
          if (entry.isIntersecting && id && !seen[id]) {
            seen[id] = true;
            track('section_view', { section_name: id });
          }
        });
      }, { threshold: 0.4 });
      sectionIds.forEach(function (id) {
        var el = document.getElementById(id);
        if (el) obs.observe(el);
      });
    }

    function bind(selector, eventName) {
      document.querySelectorAll(selector).forEach(function (el) {
        el.addEventListener('click', function () { track(eventName); });
      });
    }
    bind('a[href^="https://wa.me/"]', 'whatsapp_click');
    bind('a[href^="tel:"]', 'call_click');
    bind('#email-ci, #email-btn', 'email_click');
    bind('a[href*="linkedin.com"]', 'linkedin_click');
    bind('a[href*="github.com"]', 'github_click');
    bind('.hire', 'hire_me_click');
    bind('.cert-link', 'certificate_click');
    bind('.nav-toggle', 'menu_toggle_click');
    bind('.logo', 'logo_click');
    bind('.sl-prev, .sl-next', 'carousel_arrow_click');
    bind('.sl-dot', 'carousel_dot_click');

    // Nav links + any element with data-nav (About/Skills/Projects/Experience/
    // Contact in the navbar, and "View My Work" in the Hero) — tracked with
    // which section was targeted.
    document.querySelectorAll('[data-nav]').forEach(function (el) {
      el.addEventListener('click', function () {
        track('nav_click', { section: el.getAttribute('data-nav') || '' });
      });
    });

    // Universal safety net: track every link/button click, even ones added
    // later or not explicitly named above, so nothing is ever missed.
    document.addEventListener('click', function (e) {
      var el = e.target.closest('a, button');
      if (!el) return;
      var label = (el.getAttribute('aria-label') || el.textContent || '')
        .trim().replace(/\s+/g, ' ').slice(0, 80);
      track('click', {
        element_label: label || el.id || el.className || 'unlabeled',
        element_href: el.getAttribute('href') || ''
      });
    }, true);
  })();
})();