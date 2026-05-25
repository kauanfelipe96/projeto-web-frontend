var CHAVE_SESSAO = 'usuario_logado';

document.addEventListener('DOMContentLoaded', function () {
    var dados = sessionStorage.getItem(CHAVE_SESSAO);
    if (!dados) return;

    var usuario;
    try { usuario = JSON.parse(dados); } catch (e) { return; }

    var nick = usuario.nick || usuario.nome;

    /* desktop nav-cta: hide Login/Cadastro, insert user info + sair */
    var cta = document.querySelector('.nav-cta');
    if (cta) {
        var loginLink    = cta.querySelector('a[href="login.html"]');
        var cadastroLink = cta.querySelector('a[href="cadastro.html"]');
        if (loginLink)    loginLink.style.display    = 'none';
        if (cadastroLink) cadastroLink.style.display = 'none';

        var hamburger = cta.querySelector('.nav-hamburger');

        var nickEl = document.createElement('span');
        nickEl.className = 'nav-user nav-cta-desktop';
        nickEl.textContent = nick;

        var btnSair = document.createElement('button');
        btnSair.type = 'button';
        btnSair.className = 'btn ghost nav-cta-desktop';
        btnSair.textContent = 'Sair';
        btnSair.addEventListener('click', function () {
            sessionStorage.removeItem(CHAVE_SESSAO);
            window.location.href = 'index.html';
        });

        cta.insertBefore(nickEl, hamburger || null);
        cta.insertBefore(btnSair, hamburger || null);
    }

    /* mobile drawer-cta: replace links with user info + sair */
    var drawerCta = document.querySelector('.nav-drawer-cta');
    if (drawerCta) {
        while (drawerCta.firstChild) {
            drawerCta.removeChild(drawerCta.firstChild);
        }

        var nickMobile = document.createElement('span');
        nickMobile.style.cssText = 'font-family:"Barlow Condensed",sans-serif;font-weight:700;font-size:16px;letter-spacing:0.08em;text-transform:uppercase;color:var(--accent);flex:1;display:flex;align-items:center;';
        nickMobile.textContent = nick;

        var adminMobile = document.createElement('a');
        adminMobile.href = 'admin.html';
        adminMobile.className = 'btn ghost';
        adminMobile.style.padding = '8px 10px';
        adminMobile.textContent = '⚙';

        var sairMobile = document.createElement('button');
        sairMobile.type = 'button';
        sairMobile.className = 'btn ghost';
        sairMobile.style.cssText = 'flex:1;justify-content:center;';
        sairMobile.textContent = 'Sair';
        sairMobile.addEventListener('click', function () {
            sessionStorage.removeItem(CHAVE_SESSAO);
            window.location.href = 'index.html';
        });

        drawerCta.appendChild(nickMobile);
        drawerCta.appendChild(adminMobile);
        drawerCta.appendChild(sairMobile);
    }
});
