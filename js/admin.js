const CHAVE = 'pickem_usuarios';

function lerUsuarios() {
    return JSON.parse(localStorage.getItem(CHAVE)) || [];
}

function salvarUsuarios(usuarios) {
    localStorage.setItem(CHAVE, JSON.stringify(usuarios));
}

function criarItemLista(usuario) {
    const li = document.createElement('li');

    const info = document.createElement('span');
    info.textContent = usuario.nome + ' — ' + usuario.email + ' (' + usuario.data + ')';
    info.dataset.nome = usuario.nome.toLowerCase();
    info.dataset.email = usuario.email.toLowerCase();

    const btnExcluir = document.createElement('button');
    btnExcluir.type = 'button';
    btnExcluir.textContent = 'Excluir';
    btnExcluir.addEventListener('click', function () {
        excluirUsuario(usuario.id, li);
    });

    li.dataset.id = usuario.id;
    li.appendChild(info);
    li.appendChild(btnExcluir);
    return li;
}

function renderizarLista() {
    const lista = document.getElementById('lista-usuarios');
    while (lista.firstChild) {
        lista.removeChild(lista.firstChild);
    }
    const usuarios = lerUsuarios();
    usuarios.forEach(function (usuario) {
        lista.appendChild(criarItemLista(usuario));
    });
}

function cadastrarUsuario(e) {
    e.preventDefault();
    const nome = document.getElementById('input-nome').value.trim();
    const email = document.getElementById('input-email').value.trim();
    if (!nome || !email) return;

    const usuario = {
        id: Date.now(),
        nome: nome,
        email: email,
        data: new Date().toLocaleString('pt-BR')
    };

    const usuarios = lerUsuarios();
    usuarios.push(usuario);
    salvarUsuarios(usuarios);

    const lista = document.getElementById('lista-usuarios');
    lista.appendChild(criarItemLista(usuario));

    document.getElementById('form-admin').reset();
}

function excluirUsuario(id, li) {
    if (!confirm('Excluir este usuário?')) return;
    const usuarios = lerUsuarios().filter(function (u) { return u.id !== id; });
    salvarUsuarios(usuarios);
    li.parentNode.removeChild(li);
}

function limparTodos() {
    if (!confirm('Excluir todos os usuários cadastrados?')) return;
    localStorage.removeItem(CHAVE);
    const lista = document.getElementById('lista-usuarios');
    while (lista.firstChild) {
        lista.removeChild(lista.firstChild);
    }
}

function pesquisar() {
    const termo = document.getElementById('busca').value.toLowerCase();
    const itens = document.getElementById('lista-usuarios').querySelectorAll('li');
    itens.forEach(function (li) {
        const info = li.querySelector('span');
        const bate = info.dataset.nome.includes(termo) || info.dataset.email.includes(termo);
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
