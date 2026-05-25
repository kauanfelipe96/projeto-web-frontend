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

function carregarDadosExemplo() {
    if (lerUsuarios().length > 0 &&
        !confirm('Isso vai substituir os dados atuais por usuários de exemplo. Continuar?')) {
        return;
    }

    var EXEMPLOS = [
        { nome: 'Ana Beatriz Souza',     nick: 'anasz',       time: 'FURIA' },
        { nome: 'Bruno Carvalho',        nick: 'b_carva',     time: 'Team Vitality' },
        { nome: 'Carla Mendes',          nick: 'kmends',      time: 'MIBR' },
        { nome: 'Diego Ribeiro',         nick: 'dr1bz',       time: 'paiN Gaming' },
        { nome: 'Eduarda Lima',          nick: 'duudz',       time: 'Natus Vincere' },
        { nome: 'Felipe Andrade',        nick: 'fefe_csgo',   time: 'BIG' },
        { nome: 'Gustavo Pereira',       nick: 'gustp',       time: 'The MongolZ' },
        { nome: 'Helena Martins',        nick: 'helmart',     time: 'FURIA' },
        { nome: 'Igor Almeida',          nick: 'iggynh',      time: 'G2 Esports' },
        { nome: 'Julia Castro',          nick: 'jucastro',    time: 'Astralis' },
        { nome: 'Kauan Felipe',          nick: 'kauanzera',   time: 'MIBR' },
        { nome: 'Larissa Nogueira',      nick: 'larih',       time: 'Team Spirit' },
        { nome: 'Matheus Oliveira',      nick: 'matt_ow',     time: 'Legacy' },
        { nome: 'Natalia Vieira',        nick: 'natpop',      time: 'MOUZ' },
        { nome: 'Otavio Barreto',        nick: 'otavz',       time: 'Team Falcons' }
    ];

    var agora = Date.now();
    var UM_DIA = 24 * 60 * 60 * 1000;
    var diasAtras = [0, 0, 0, 0, 0, 1, 1, 2, 2, 3, 4, 5, 6, 7, 10];

    var usuarios = EXEMPLOS.map(function (ex, i) {
        var ts = agora - (diasAtras[i] * UM_DIA) - (i * 60 * 1000);
        return {
            id:       ts,
            nome:     ex.nome,
            email:    ex.nick + '@exemplo.com',
            senha:    'demo1234',
            nick:     ex.nick,
            time:     ex.time,
            dataNasc: '2000-01-01',
            data:     new Date(ts).toLocaleString('pt-BR')
        };
    });
    salvarUsuarios(usuarios);

    var PARTIDAS_BASE = [
        { campo: 'p1', confronto: 'GamerLegion vs NRG',           opcoes: ['GamerLegion', 'NRG'] },
        { campo: 'p2', confronto: 'B8 vs TYLOO',                  opcoes: ['B8', 'TYLOO'] },
        { campo: 'p3', confronto: 'HEROIC vs Sharks',             opcoes: ['HEROIC', 'Sharks'] },
        { campo: 'p4', confronto: 'BetBoom vs Gaimin Gladiators', opcoes: ['BetBoom', 'Gaimin Gladiators'] },
        { campo: 'p5', confronto: 'BIG vs Team Liquid',           opcoes: ['BIG', 'Team Liquid'] },
        { campo: 'p6', confronto: 'M80 vs Lynn Vision',           opcoes: ['M80', 'Lynn Vision'] },
        { campo: 'p7', confronto: 'MIBR vs THUNDERdOWNUNDER',     opcoes: ['MIBR', 'THUNDERdOWNUNDER'] },
        { campo: 'p8', confronto: 'SINNERS vs FlyQuest',          opcoes: ['SINNERS', 'FlyQuest'] }
    ];
    var COM_PICKEM = [0, 1, 2, 4, 5, 7, 10, 11, 13];
    var previsoes = COM_PICKEM.map(function (idx) {
        var u  = usuarios[idx];
        var ts = u.id + 5 * 60 * 1000;
        return {
            email:     u.email,
            campeao:   u.time,
            partidas:  PARTIDAS_BASE.map(function (p, j) {
                return {
                    campo:     p.campo,
                    confronto: p.confronto,
                    escolha:   p.opcoes[(idx + j) % 2]
                };
            }),
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
