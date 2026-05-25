const CHAVE_SESSAO = 'usuario_logado';

document.addEventListener('DOMContentLoaded', function () {
    var dados = sessionStorage.getItem(CHAVE_SESSAO);
    if (!dados) return;

    var usuario = JSON.parse(dados);
    var header  = document.querySelector('header');
    if (!header) return;

    var perfil = document.createElement('div');
    perfil.id  = 'perfil-usuario';

    var info   = document.createElement('span');
    var nick   = document.createElement('strong');
    nick.textContent = usuario.nick || usuario.nome;
    info.appendChild(nick);

    if (usuario.time) {
        var sep  = document.createTextNode(' · ');
        var time = document.createElement('span');
        time.textContent = usuario.time;
        info.appendChild(sep);
        info.appendChild(time);
    }

    var btnSair      = document.createElement('button');
    btnSair.type     = 'button';
    btnSair.textContent = 'Sair';
    btnSair.addEventListener('click', function () {
        sessionStorage.removeItem(CHAVE_SESSAO);
        window.location.href = 'index.html';
    });

    perfil.appendChild(info);
    perfil.appendChild(btnSair);
    header.appendChild(perfil);
});
