const CHAVE = 'pickem_usuarios';
const CHAVE_PREVISOES = 'pickem_previsoes';

const LOGOS = {
    'GamerLegion':       'gamerlegion.png',
    'NRG':               'nrg.png',
    'B8':                'b8.png',
    'TYLOO':             'tyloo.png',
    'HEROIC':            'heroic.png',
    'Sharks':            'sharks.png',
    'BetBoom':           'betboom.png',
    'Gaimin Gladiators': 'gaimingladiators.png',
    'BIG':               'big.png',
    'Team Liquid':       'liquid.png',
    'M80':               'm80.png',
    'Lynn Vision':       'lynnvision.png',
    'MIBR':              'mibr.png',
    'THUNDERdOWNUNDER':  'thunderdownunder.png',
    'SINNERS':           'sinners.png',
    'FlyQuest':          'flyquest.png'
};

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
        timeEl.className = 'usuario-time';
        var logoFile = LOGOS[usuario.time];
        if (logoFile) {
            var logoImg = document.createElement('img');
            logoImg.src       = 'assets/img/' + logoFile;
            logoImg.alt       = 'Logo do ' + usuario.time;
            logoImg.className = 'logo-mini';
            timeEl.appendChild(logoImg);
        }
        timeEl.appendChild(document.createTextNode(usuario.time));
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

function atualizarKPIs() {
    var usuarios  = lerUsuarios();
    var previsoes = JSON.parse(localStorage.getItem(CHAVE_PREVISOES)) || [];
    var emailsComPick = {};
    previsoes.forEach(function (p) { emailsComPick[p.email] = true; });

    var hoje = new Date();
    var diaHoje = hoje.getDate();
    var mesHoje = hoje.getMonth();
    var anoHoje = hoje.getFullYear();

    var totalHoje = 0;
    var totalPickem = 0;
    usuarios.forEach(function (u) {
        if (emailsComPick[u.email]) totalPickem++;
        var d = new Date(u.id);
        if (d.getDate() === diaHoje && d.getMonth() === mesHoje && d.getFullYear() === anoHoje) {
            totalHoje++;
        }
    });

    document.getElementById('kpi-total').textContent  = usuarios.length;
    document.getElementById('kpi-pickem').textContent = totalPickem;
    document.getElementById('kpi-hoje').textContent   = totalHoje;
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
    atualizarKPIs();
}

function excluirUsuario(id, li) {
    if (!confirm('Excluir este usuário?')) return;
    salvarUsuarios(lerUsuarios().filter(function (u) { return u.id !== id; }));
    li.parentNode.removeChild(li);
    atualizarKPIs();
}

function limparTodos() {
    if (!confirm('Excluir todos os usuários cadastrados?')) return;
    localStorage.removeItem(CHAVE);
    var lista = document.getElementById('lista-usuarios');
    while (lista.firstChild) {
        lista.removeChild(lista.firstChild);
    }
    atualizarKPIs();
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
    atualizarKPIs();
});
