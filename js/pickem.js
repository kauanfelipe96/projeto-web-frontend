var CHAVE_SESSAO   = 'usuario_logado';
var CHAVE_PREVISOES = 'pickem_previsoes';

var CONFRONTOS = [
    { campo: 'p1', times: ['GamerLegion', 'NRG'] },
    { campo: 'p2', times: ['B8', 'TYLOO'] },
    { campo: 'p3', times: ['HEROIC', 'Sharks'] },
    { campo: 'p4', times: ['BetBoom', 'Gaimin Gladiators'] },
    { campo: 'p5', times: ['BIG', 'Team Liquid'] },
    { campo: 'p6', times: ['M80', 'Lynn Vision'] },
    { campo: 'p7', times: ['MIBR', 'THUNDERdOWNUNDER'] },
    { campo: 'p8', times: ['SINNERS', 'FlyQuest'] }
];

function lerPrevisoes() {
    return JSON.parse(localStorage.getItem(CHAVE_PREVISOES)) || [];
}

function salvarPrevisoes(previsoes) {
    localStorage.setItem(CHAVE_PREVISOES, JSON.stringify(previsoes));
}

function preencherFormulario(picks) {
    document.getElementById('pick-campeao').value = picks.campeao || '';
    picks.partidas.forEach(function (p) {
        var radio = document.querySelector('input[name="' + p.campo + '"][value="' + p.escolha + '"]');
        if (radio) radio.checked = true;
    });
}

function renderizarPrevisoes(picks) {
    var area = document.getElementById('previsoes-salvas');
    var conteudo = document.getElementById('previsoes-conteudo');

    while (conteudo.firstChild) {
        conteudo.removeChild(conteudo.firstChild);
    }

    var campeaoEl = document.createElement('p');
    var campeaoLabel = document.createElement('strong');
    campeaoLabel.textContent = 'Campeão: ';
    var campeaoValor = document.createTextNode(picks.campeao);
    campeaoEl.appendChild(campeaoLabel);
    campeaoEl.appendChild(campeaoValor);
    conteudo.appendChild(campeaoEl);

    var lista = document.createElement('ul');
    picks.partidas.forEach(function (p) {
        var li = document.createElement('li');
        var label = document.createElement('strong');
        label.textContent = p.confronto + ': ';
        var valor = document.createTextNode(p.escolha);
        li.appendChild(label);
        li.appendChild(valor);
        lista.appendChild(li);
    });
    conteudo.appendChild(lista);

    var dataEl = document.createElement('p');
    dataEl.className = 'previsao-data';
    dataEl.textContent = 'Salvo em: ' + picks.dataSalvo;
    conteudo.appendChild(dataEl);

    area.hidden = false;
}

function salvarPicks(e) {
    e.preventDefault();

    var usuario = JSON.parse(sessionStorage.getItem(CHAVE_SESSAO));
    var campeao = document.getElementById('pick-campeao').value;

    var partidas = [];
    var completo = true;
    CONFRONTOS.forEach(function (c) {
        var radio = document.querySelector('input[name="' + c.campo + '"]:checked');
        if (!radio) { completo = false; return; }
        partidas.push({
            campo:     c.campo,
            confronto: c.times[0] + ' vs ' + c.times[1],
            escolha:   radio.value
        });
    });

    if (!campeao || !completo) {
        alert('Preencha todos os palpites antes de salvar.');
        return;
    }

    var picks = {
        email:     usuario.email,
        campeao:   campeao,
        partidas:  partidas,
        dataSalvo: new Date().toLocaleString('pt-BR')
    };

    var previsoes = lerPrevisoes().filter(function (p) { return p.email !== usuario.email; });
    previsoes.push(picks);
    salvarPrevisoes(previsoes);

    renderizarPrevisoes(picks);
    alert('Pick\'em salvo com sucesso!');
}

document.addEventListener('DOMContentLoaded', function () {
    var sessao = sessionStorage.getItem(CHAVE_SESSAO);

    if (!sessao) {
        document.getElementById('aviso-login').hidden = false;
        return;
    }

    document.getElementById('aviso-login').hidden = true;
    document.getElementById('form-pickem-area').hidden = false;

    var usuario = JSON.parse(sessao);
    var picksExistentes = lerPrevisoes().find(function (p) { return p.email === usuario.email; });

    if (picksExistentes) {
        preencherFormulario(picksExistentes);
        renderizarPrevisoes(picksExistentes);
    }

    document.getElementById('form-pickem').addEventListener('submit', salvarPicks);
});
