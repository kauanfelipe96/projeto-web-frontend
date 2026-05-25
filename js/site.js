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
