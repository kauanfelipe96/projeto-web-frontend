const CHAVE = 'pickem_usuarios';

document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('form').addEventListener('submit', function (e) {
        e.preventDefault();

        var nome     = document.getElementById('nome-completo').value.trim();
        var email    = document.getElementById('email').value.trim();
        var senha    = document.getElementById('senha').value;
        var nick     = document.getElementById('nick-steam').value.trim();
        var time     = document.getElementById('time-favorito').value;
        var dataNasc = document.getElementById('data-nascimento').value;

        if (!nome || !email || !senha || !nick || !time) {
            alert('Preencha todos os campos obrigatórios.');
            return;
        }

        var usuarios = JSON.parse(localStorage.getItem(CHAVE)) || [];

        if (usuarios.find(function (u) { return u.email === email; })) {
            alert('Este e-mail já está cadastrado.');
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

        window.location.href = 'login.html';
    });
});
