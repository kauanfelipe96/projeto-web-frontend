const CHAVE = 'pickem_usuarios';

document.addEventListener('DOMContentLoaded', function () {
    var form = document.querySelector('form');
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        formError.clearAll(form);

        var nome     = document.getElementById('nome-completo').value.trim();
        var email    = document.getElementById('email').value.trim();
        var senha    = document.getElementById('senha').value;
        var nick     = document.getElementById('nick-steam').value.trim();
        var time     = document.getElementById('time-favorito').value;
        var dataNasc = document.getElementById('data-nascimento').value;

        var hasError = false;
        if (!nome)  { formError.show('nome-completo', 'Informe seu nome completo.');  hasError = true; }
        if (!nick)  { formError.show('nick-steam',    'Informe seu nick.');           hasError = true; }
        if (!email) { formError.show('email',         'Informe seu e-mail.');         hasError = true; }
        if (!senha) { formError.show('senha',         'Informe uma senha.');          hasError = true; }
        else if (senha.length < 6) { formError.show('senha', 'A senha precisa ter ao menos 6 caracteres.'); hasError = true; }
        if (!time)  { formError.show('time-favorito', 'Selecione um time favorito.'); hasError = true; }
        if (hasError) return;

        var usuarios = JSON.parse(localStorage.getItem(CHAVE)) || [];

        if (usuarios.find(function (u) { return u.email === email; })) {
            formError.show('email', 'Este e-mail já está cadastrado.');
            return;
        }

        var usuario = {
            id: Date.now(),
            nome: nome,
            email: email,
            senha: senha,
            nick: nick,
            time: time,
            dataNasc: dataNasc,
            data: new Date().toLocaleString('pt-BR')
        };

        usuarios.push(usuario);
        localStorage.setItem(CHAVE, JSON.stringify(usuarios));

        Toast.show('Conta criada com sucesso. Faça login.', 'success', 2000);
        setTimeout(function () { window.location.href = 'login.html'; }, 1200);
    });
});
