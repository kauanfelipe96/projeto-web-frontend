const CHAVE = 'pickem_usuarios';

function lerUsuarios() {
    return JSON.parse(localStorage.getItem(CHAVE)) || [];
}

function salvarUsuarios(usuarios) {
    localStorage.setItem(CHAVE, JSON.stringify(usuarios));
}

function criarItemLista(usuario) {
    var li = document.createElement('li');
    li.dataset.id    = usuario.id;
    li.dataset.nome  = usuario.nome.toLowerCase();
    li.dataset.email = usuario.email.toLowerCase();

    var info = document.createElement('div');
    info.className = 'usuario-info';

    var nomeEl = document.createElement('span');
    nomeEl.className   = 'usuario-nome';
    nomeEl.textContent = usuario.nome;
    info.appendChild(nomeEl);

    var emailEl = document.createElement('span');
    emailEl.className   = 'usuario-email';
    emailEl.textContent = usuario.email;
    info.appendChild(emailEl);

    if (usuario.nick) {
        var nickEl = document.createElement('span');
        nickEl.className   = 'usuario-nick';
        nickEl.textContent = 'Steam: ' + usuario.nick;
        info.appendChild(nickEl);
    }

    if (usuario.time) {
        var timeEl = document.createElement('span');
        timeEl.className   = 'usuario-time';
        timeEl.textContent = usuario.time;
        info.appendChild(timeEl);
    }

    var dataEl = document.createElement('span');
    dataEl.className   = 'usuario-data';
    dataEl.textContent = usuario.data;
    info.appendChild(dataEl);

    var btnExcluir = document.createElement('button');
    btnExcluir.type        = 'button';
    btnExcluir.textContent = 'Excluir';
    btnExcluir.addEventListener('click', function () {
        excluirUsuario(usuario.id, li);
    });

    li.appendChild(info);
    li.appendChild(btnExcluir);
    return li;
}

function renderizarLista() {
    var lista = document.getElementById('lista-usuarios');
    while (lista.firstChild) {
        lista.removeChild(lista.firstChild);
    }
    lerUsuarios().forEach(function (usuario) {
        lista.appendChild(criarItemLista(usuario));
    });
}

function cadastrarUsuario(e) {
    e.preventDefault();
    var nome  = document.getElementById('input-nome').value.trim();
    var email = document.getElementById('input-email').value.trim();
    if (!nome || !email) return;

    var usuario = {
        id:    Date.now(),
        nome:  nome,
        email: email,
        data:  new Date().toLocaleString('pt-BR')
    };

    var usuarios = lerUsuarios();
    usuarios.push(usuario);
    salvarUsuarios(usuarios);

    document.getElementById('lista-usuarios').appendChild(criarItemLista(usuario));
    document.getElementById('form-admin').reset();
}

function excluirUsuario(id, li) {
    if (!confirm('Excluir este usuário?')) return;
    salvarUsuarios(lerUsuarios().filter(function (u) { return u.id !== id; }));
    li.parentNode.removeChild(li);
}

function limparTodos() {
    if (!confirm('Excluir todos os usuários cadastrados?')) return;
    localStorage.removeItem(CHAVE);
    var lista = document.getElementById('lista-usuarios');
    while (lista.firstChild) {
        lista.removeChild(lista.firstChild);
    }
}

function pesquisar() {
    var termo = document.getElementById('busca').value.toLowerCase();
    document.getElementById('lista-usuarios').querySelectorAll('li').forEach(function (li) {
        var bate = li.dataset.nome.includes(termo) || li.dataset.email.includes(termo);
        li.style.display = bate ? '' : 'none';
    });
}

function limparFormulario() {
    document.getElementById('form-admin').reset();
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('form-admin').addEventListener('submit', cadastrarUsuario);
    document.getElementById('btn-limpar').addEventListener('click', limparFormulario);
    document.getElementById('btn-limpar-tudo').addEventListener('click', limparTodos);
    document.getElementById('busca').addEventListener('input', pesquisar);
    renderizarLista();
});
