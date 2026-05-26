const CHAVE = 'pickem_usuarios';
const CHAVE_PREVISOES = 'pickem_previsoes';

const LOGOS = {
    /* Legends */
    'Team Vitality':     'vitality.png',
    'Natus Vincere':     'navi.png',
    'The MongolZ':       'mongolz.png',
    'Team Falcons':      'falcons.png',
    'MOUZ':              'mouz.png',
    'FURIA':             'furia.png',
    'PARIVISION':        'parivision.png',
    'Aurora Gaming':     'aurora.png',
    /* Challengers */
    'Team Spirit':       'spirit.png',
    'G2 Esports':        'g2.png',
    'Astralis':          'astralis.png',
    'paiN Gaming':       'pain.png',
    'Monte':             'monte.png',
    'FUT Esports':       'fut.png',
    '9z Team':           '9z.png',
    'Legacy':            'legacy.png',
    /* Contenders */
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

    var fmt = function (n) { return n.toLocaleString('pt-BR'); };
    var setText = function (id, txt) { var el = document.getElementById(id); if (el) el.textContent = txt; };

    setText('kpi-total',         fmt(usuarios.length));
    setText('kpi-pickem',        fmt(totalPickem));
    setText('kpi-total-delta',   '↑ ' + totalHoje + ' nas últimas 24h');
    setText('sidebar-users-badge', fmt(usuarios.length));
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

function carregarDadosExemplo() {
    if (lerUsuarios().length > 0 &&
        !confirm('Isso vai substituir os dados atuais por usuários de exemplo. Continuar?')) {
        return;
    }

    var EXEMPLOS = [
        { nome: 'Ana Beatriz Souza',     nick: 'zywoo_GOAT',  time: 'FURIA',            pontuacao: 96 },
        { nome: 'Bruno Carvalho',        nick: 's1mple_fan',  time: 'Team Vitality',    pontuacao: 92 },
        { nome: 'Carla Mendes',          nick: 'cologne_2014',time: 'MIBR',             pontuacao: 88 },
        { nome: 'Diego Ribeiro',         nick: 'awp_andy',    time: 'paiN Gaming',      pontuacao: 84 },
        { nome: 'Eduarda Lima',          nick: 'FalleN_BR',   time: 'Natus Vincere',    pontuacao: 80 },
        { nome: 'Felipe Andrade',        nick: 'furia4ever',  time: 'BIG',              pontuacao: 76 },
        { nome: 'Gustavo Pereira',       nick: 'mongolz_fan', time: 'The MongolZ',      pontuacao: 68 },
        { nome: 'Helena Martins',        nick: 'kscerato_25', time: 'FURIA',            pontuacao: 60 },
        { nome: 'Igor Almeida',          nick: 'niko_carry',  time: 'G2 Esports',       pontuacao: 56 },
        { nome: 'Julia Castro',          nick: 'astralis_4',  time: 'Astralis',         pontuacao: 48 },
        { nome: 'Kauan Felipe',          nick: 'kauanzera',   time: 'MIBR',             pontuacao: 42 },
        { nome: 'Larissa Nogueira',      nick: 'donk_19',     time: 'Team Spirit',      pontuacao: 36 },
        { nome: 'Matheus Oliveira',      nick: 'legacy_BR',   time: 'Legacy',           pontuacao: 28 },
        { nome: 'Natalia Vieira',        nick: 'mouz_eu',     time: 'MOUZ',             pontuacao: 20 },
        { nome: 'Otavio Barreto',        nick: 'falcons_oil', time: 'Team Falcons',     pontuacao: 12 }
    ];

    var agora = Date.now();
    var UM_DIA = 24 * 60 * 60 * 1000;
    var diasAtras = [0, 0, 0, 0, 0, 1, 1, 2, 2, 3, 4, 5, 6, 7, 10];

    var usuarios = EXEMPLOS.map(function (ex, i) {
        var ts = agora - (diasAtras[i] * UM_DIA) - (i * 60 * 1000);
        return {
            id:        ts,
            nome:      ex.nome,
            email:     ex.nick + '@exemplo.com',
            senha:     'demo1234',
            nick:      ex.nick,
            time:      ex.time,
            dataNasc:  '2000-01-01',
            data:      new Date(ts).toLocaleString('pt-BR'),
            pontuacao: ex.pontuacao
        };
    });
    salvarUsuarios(usuarios);

    /* previsões de pick'em — formato novo (stage2 + top8 + campeão) */
    var COM_PICKEM = [0, 1, 2, 4, 5, 7, 10, 11, 13];
    var TEAMS_30 = [['Team Vitality','MOUZ'], ['Natus Vincere','FURIA'], ['The MongolZ','Team Falcons']];
    var TEAMS_03 = [['THUNDERdOWNUNDER','M80'], ['Sharks','SINNERS'], ['Lynn Vision','TYLOO']];
    var previsoes = COM_PICKEM.map(function (idx) {
        var u  = usuarios[idx];
        var ts = u.id + 5 * 60 * 1000;
        return {
            email:     u.email,
            stage2_30: TEAMS_30[idx % 3],
            stage2_03: TEAMS_03[idx % 3],
            top8: ['Team Vitality','Natus Vincere','The MongolZ','Team Falcons','MOUZ','FURIA','Team Spirit','G2 Esports'],
            campeao: u.time,
            dataSalvo: new Date(ts).toLocaleString('pt-BR')
        };
    });
    localStorage.setItem(CHAVE_PREVISOES, JSON.stringify(previsoes));

    renderizarLista();
    atualizarKPIs();
    alert('Dados de exemplo carregados: ' + usuarios.length + ' usuários, ' + previsoes.length + ' com Pick\'em salvo.');
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('form-admin').addEventListener('submit', cadastrarUsuario);
    document.getElementById('btn-limpar').addEventListener('click', limparFormulario);
    document.getElementById('btn-limpar-tudo').addEventListener('click', limparTodos);
    document.getElementById('busca').addEventListener('input', pesquisar);
    var btnSeed = document.getElementById('btn-seed');
    if (btnSeed) btnSeed.addEventListener('click', carregarDadosExemplo);
    renderizarLista();
    atualizarKPIs();
});
