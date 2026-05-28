(function () {
  var NAV_ITEMS = [
    { id: 'overview',   label: 'Overview',   href: 'index.html' },
    { id: 'matches',    label: 'Matches',    href: 'matches.html' },
    { id: 'main-event', label: 'Main Event', href: 'main-event.html' },
    { id: 'pickem',     label: "Pick'em",    href: 'pickem.html' },
    { id: 'teams',      label: 'Teams',      href: 'teams.html' },
    { id: 'venue',      label: 'Venue',      href: 'venue.html' },
  ];

  var active = document.body.dataset.page || 'overview';

  var navMount = document.getElementById('site-nav');
  if (navMount) {
    navMount.innerHTML =
      '<nav class="nav">' +
        '<div class="nav-inner">' +
          '<a class="brand" href="index.html">' +
            '<div class="brand-mark">K</div>' +
            '<div class="brand-text">' +
              '<div class="small">Cologne 2026</div>' +
              '<div class="big">Major Hub</div>' +
            '</div>' +
          '</a>' +
          '<div class="nav-links">' +
            NAV_ITEMS.map(function (n) {
              return '<a class="nav-link' + (n.id === active ? ' active' : '') + '" href="' + n.href + '">' + n.label + '</a>';
            }).join('') +
          '</div>' +
          '<div class="nav-cta">' +
            '<a class="btn ghost nav-cta-desktop" href="login.html">Login</a>' +
            '<a class="btn primary nav-cta-desktop" href="cadastro.html">Cadastro</a>' +
            '<a class="btn ghost nav-cta-desktop" href="admin.html" title="Admin" style="padding:8px 10px;">&#9881;</a>' +
            '<button class="nav-hamburger" id="nav-hamburger" aria-label="Abrir menu" aria-expanded="false">' +
              '<span class="bar"></span>' +
              '<span class="bar"></span>' +
              '<span class="bar"></span>' +
            '</button>' +
          '</div>' +
        '</div>' +
      '</nav>' +
      '<div class="nav-drawer" id="nav-drawer" role="navigation" aria-label="Menu mobile">' +
        NAV_ITEMS.map(function (n) {
          return '<a class="nd-link' + (n.id === active ? ' active' : '') + '" href="' + n.href + '">' + n.label + '</a>';
        }).join('') +
        '<div class="nav-drawer-cta">' +
          '<a class="btn ghost" href="login.html" style="flex:1;justify-content:center;">Login</a>' +
          '<a class="btn primary" href="cadastro.html" style="flex:1;justify-content:center;">Cadastro</a>' +
          '<a class="btn ghost" href="admin.html" title="Admin" style="padding:8px 10px;">&#9881;</a>' +
        '</div>' +
      '</div>';

    var hamburger = document.getElementById('nav-hamburger');
    var drawer    = document.getElementById('nav-drawer');

    if (hamburger && drawer) {
      hamburger.addEventListener('click', function (e) {
        e.stopPropagation();
        var isOpen = drawer.classList.toggle('open');
        hamburger.classList.toggle('open', isOpen);
        hamburger.setAttribute('aria-expanded', String(isOpen));
        document.body.style.overflow = isOpen ? 'hidden' : '';
      });

      document.addEventListener('click', function (e) {
        if (drawer.classList.contains('open') && !navMount.contains(e.target)) {
          drawer.classList.remove('open');
          hamburger.classList.remove('open');
          hamburger.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        }
      });

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && drawer.classList.contains('open')) {
          drawer.classList.remove('open');
          hamburger.classList.remove('open');
          hamburger.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        }
      });
    }
  }

  /* ===== Toast (notificação global) ===== */
  window.Toast = {
    _container: function () {
      var c = document.getElementById('toast-container');
      if (!c) { c = document.createElement('div'); c.id = 'toast-container'; document.body.appendChild(c); }
      return c;
    },
    _build: function (type, message) {
      var t = document.createElement('div');
      t.className = 'toast toast-' + type;
      var icon = document.createElement('span');
      icon.className = 'toast-icon';
      icon.textContent =
        type === 'success' ? '✓' :
        type === 'error'   ? '✕' :
        type === 'warning' || type === 'confirm' ? '!' : 'i';
      var msg = document.createElement('span');
      msg.className = 'toast-msg';
      msg.textContent = message;
      t.appendChild(icon); t.appendChild(msg);
      return t;
    },
    show: function (message, type, duration) {
      type = type || 'info';
      duration = duration === undefined ? 3500 : duration;
      var c = this._container();
      var t = this._build(type, message);
      c.appendChild(t);
      requestAnimationFrame(function () { t.classList.add('show'); });
      if (duration > 0) {
        setTimeout(function () {
          t.classList.remove('show');
          setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 280);
        }, duration);
      }
      return t;
    },
    confirm: function (message, onConfirm, opts) {
      opts = opts || {};
      var c = this._container();
      var t = this._build('confirm', message);
      var act = document.createElement('div'); act.className = 'toast-actions';
      var cancel = document.createElement('button');
      cancel.type = 'button'; cancel.className = 'toast-btn toast-btn-cancel';
      cancel.textContent = opts.cancelLabel || 'Cancelar';
      var ok = document.createElement('button');
      ok.type = 'button'; ok.className = 'toast-btn toast-btn-ok';
      ok.textContent = opts.confirmLabel || 'Confirmar';
      act.appendChild(cancel); act.appendChild(ok);
      t.appendChild(act);
      c.appendChild(t);
      requestAnimationFrame(function () { t.classList.add('show'); });
      function close () {
        t.classList.remove('show');
        setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 280);
      }
      ok.addEventListener('click', function () { close(); if (onConfirm) onConfirm(); });
      cancel.addEventListener('click', function () { close(); if (opts.onCancel) opts.onCancel(); });
      return t;
    }
  };

  /* ===== formError (erro inline em inputs) ===== */
  window.formError = {
    _resolveInput: function (input) {
      return (typeof input === 'string') ? document.getElementById(input) : input;
    },
    show: function (input, message) {
      var el = this._resolveInput(input); if (!el) return;
      el.classList.add('input-invalid');
      var parent = el.parentElement; if (!parent) return;
      var err = parent.querySelector('.input-error');
      if (!err) { err = document.createElement('div'); err.className = 'input-error'; parent.appendChild(err); }
      err.textContent = message;
      err.classList.add('show');
      var clear = function () {
        window.formError.clear(el);
        el.removeEventListener('input', clear);
        el.removeEventListener('change', clear);
      };
      el.addEventListener('input', clear);
      el.addEventListener('change', clear);
    },
    clear: function (input) {
      var el = this._resolveInput(input); if (!el) return;
      el.classList.remove('input-invalid');
      var parent = el.parentElement; if (!parent) return;
      var err = parent.querySelector('.input-error');
      if (err) err.classList.remove('show');
    },
    clearAll: function (form) {
      var f = (typeof form === 'string') ? document.getElementById(form) : form;
      if (!f) return;
      f.querySelectorAll('.input-invalid').forEach(function (i) { i.classList.remove('input-invalid'); });
      f.querySelectorAll('.input-error.show').forEach(function (e) { e.classList.remove('show'); });
    }
  };

  var footMount = document.getElementById('site-foot');
  if (footMount) {
    footMount.innerHTML =
      '<div class="foot-wrap">' +
        '<div class="foot">' +
          '<div>' +
            '<div>&copy; 2026 KAUAN FELIPE AVELINO DE LIMA &mdash; Projeto acad&ecirc;mico, sem v&iacute;nculo oficial com ESL ou Valve.</div>' +
          '</div>' +
          '<div class="foot-links">' +
            '<a href="https://www.linkedin.com/in/kauan-felipe-fullstack/" target="_blank" rel="noopener">Curr&iacute;culo (LinkedIn)</a>' +
            '<a href="https://github.com/kauanfelipe96/projeto-web-frontend" target="_blank" rel="noopener">GitHub</a>' +
          '</div>' +
        '</div>' +
      '</div>';
  }
})();
