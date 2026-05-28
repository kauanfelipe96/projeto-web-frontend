const CHAVE       = 'pickem_usuarios';
const CHAVE_SESSAO = 'usuario_logado';

document.addEventListener('DOMContentLoaded', function () {
    if (sessionStorage.getItem(CHAVE_SESSAO)) {
        window.location.href = 'index.html';
        return;
    }

    var form = document.querySelector('form');
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        formError.clearAll(form);

        var email = document.getElementById('email').value.trim();
        var senha = document.getElementById('senha').value;

        var hasError = false;
        if (!email) { formError.show('email', 'Informe seu e-mail.'); hasError = true; }
        if (!senha) { formError.show('senha', 'Informe sua senha.'); hasError = true; }
        if (hasError) return;

        var usuarios = JSON.parse(localStorage.getItem(CHAVE)) || [];
        var usuario  = usuarios.find(function (u) {
            return u.email === email && u.senha === senha;
        });

        if (!usuario) {
            formError.show('email', 'E-mail ou senha incorretos.');
            formError.show('senha', 'Verifique suas credenciais.');
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
