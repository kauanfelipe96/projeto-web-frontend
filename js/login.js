const CHAVE       = 'pickem_usuarios';
const CHAVE_SESSAO = 'usuario_logado';

document.addEventListener('DOMContentLoaded', function () {
    if (sessionStorage.getItem(CHAVE_SESSAO)) {
        window.location.href = 'index.html';
        return;
    }

    document.querySelector('form').addEventListener('submit', function (e) {
        e.preventDefault();

        var email = document.getElementById('email').value.trim();
        var senha = document.getElementById('senha').value;

        var usuarios = JSON.parse(localStorage.getItem(CHAVE)) || [];
        var usuario  = usuarios.find(function (u) {
            return u.email === email && u.senha === senha;
        });

        if (!usuario) {
            alert('E-mail ou senha incorretos.');
            return;
        }

        sessionStorage.setItem(CHAVE_SESSAO, JSON.stringify({
            nome:  usuario.nome,
            email: usuario.email,
            nick:  usuario.nick,
            time:  usuario.time
        }));

        window.location.href = 'index.html';
    });
});
