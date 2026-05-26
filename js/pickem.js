var CHAVE_SESSAO    = 'usuario_logado';
var CHAVE_PREVISOES = 'pickem_previsoes';
var CHAVE_USUARIOS  = 'pickem_usuarios';

/* abreviações de times (mesmo conjunto usado em matches.html / teams.html) */
var ABREV = {
  'Team Vitality':'VIT','Natus Vincere':'NAV','The MongolZ':'MGZ','Team Falcons':'FAL',
  'MOUZ':'MOU','FURIA':'FUR','PARIVISION':'PAR','Aurora Gaming':'AUR',
  'Team Spirit':'SPI','G2 Esports':'G2','Astralis':'AST','paiN Gaming':'PAI',
  'Monte':'MON','FUT Esports':'FUT','9z Team':'9Z','Legacy':'LEG',
  'GamerLegion':'GL','Team Liquid':'TL','HEROIC':'HRO','BIG':'BIG',
  'MIBR':'MBR','NRG':'NRG','BetBoom':'BB','Gaimin Gladiators':'GG',
  'B8':'B8','M80':'M80','SINNERS':'SIN','FlyQuest':'FLY',
  'TYLOO':'TYL','Lynn Vision':'LV','Sharks':'SHK','THUNDERdOWNUNDER':'TDU'
};

var LEGENDS = ['Team Vitality','Natus Vincere','The MongolZ','Team Falcons','MOUZ','FURIA','PARIVISION','Aurora Gaming'];
var CHALLENGERS = ['Team Spirit','G2 Esports','Astralis','paiN Gaming','Monte','FUT Esports','9z Team','Legacy'];
var CONTENDERS = ['GamerLegion','Team Liquid','HEROIC','BIG','MIBR','NRG','BetBoom','Gaimin Gladiators','B8','M80','SINNERS','FlyQuest','TYLOO','Lynn Vision','Sharks','THUNDERdOWNUNDER'];
var TODOS_TIMES = LEGENDS.concat(CHALLENGERS).concat(CONTENDERS);
var TIMES_TOP8  = LEGENDS.concat(CHALLENGERS);  /* candidatos a top 8 do Stage 3 */

function lerUsuarios()  { return JSON.parse(localStorage.getItem(CHAVE_USUARIOS))  || []; }
function lerPrevisoes() { return JSON.parse(localStorage.getItem(CHAVE_PREVISOES)) || []; }
function salvarPrevisoes(prev) { localStorage.setItem(CHAVE_PREVISOES, JSON.stringify(prev)); }

function abrev(time) { return ABREV[time] || time.slice(0,3).toUpperCase(); }

function montarGrid(opts) {
  /* opts: { gridId, name, value? prefix, tipo: 'checkbox'|'radio', times } */
  var grid = document.getElementById(opts.gridId);
  if (!grid) return;
  opts.times.forEach(function (time, i) {
    var id = opts.idPrefix + i;
    var cell = document.createElement('div');
    cell.className = 'top8-cell';
    cell.innerHTML =
      '<input type="' + opts.tipo + '" id="' + id + '" name="' + opts.name + '" value="' + time + '">' +
      '<label for="' + id + '">' +
        '<span class="logo">' + abrev(time) + '</span>' +
        '<span class="name">' + time + '</span>' +
      '</label>';
    grid.appendChild(cell);
  });
}

function montarTodosGrids() {
  montarGrid({ gridId: 'stage2-30-grid', name: 'stage2_30', idPrefix: 's2_30_', tipo: 'checkbox', times: TODOS_TIMES });
  montarGrid({ gridId: 'stage2-03-grid', name: 'stage2_03', idPrefix: 's2_03_', tipo: 'checkbox', times: TODOS_TIMES });
  montarGrid({ gridId: 'top8-grid',      name: 'top8',      idPrefix: 'top8_',  tipo: 'checkbox', times: TIMES_TOP8 });
  montarGrid({ gridId: 'playoffs-grid',  name: 'campeao',   idPrefix: 'champ_', tipo: 'radio',    times: TODOS_TIMES });
}

/* avatar — pega 2 letras do nick (sem números/underscore) */
function iniciais(nick) {
  var clean = (nick || '').replace(/[^A-Za-zÀ-ÿ]/g, '').toUpperCase();
  return clean.slice(0, 2) || '??';
}

function renderizarLeaderboard(usuarioAtual) {
  var lista = document.getElementById('lb-list');
  if (!lista) return;
  while (lista.firstChild) lista.removeChild(lista.firstChild);

  var ranking = lerUsuarios()
    .filter(function (u) { return typeof u.pontuacao === 'number'; })
    .sort(function (a, b) { return b.pontuacao - a.pontuacao; });

  if (!ranking.length) {
    var vazio = document.createElement('li');
    vazio.className = 'lb-row';
    vazio.innerHTML = '<span class="rank">—</span><div class="av">??</div><span class="nick">Sem participantes</span><span class="pts">—</span>';
    lista.appendChild(vazio);
    return;
  }

  var posUsuario = -1;
  if (usuarioAtual) {
    for (var i = 0; i < ranking.length; i++) {
      if (ranking[i].email === usuarioAtual.email) { posUsuario = i + 1; break; }
    }
  }

  ranking.slice(0, 8).forEach(function (u, idx) {
    var pos = idx + 1;
    var ehMim = usuarioAtual && u.email === usuarioAtual.email;
    var li = document.createElement('li');
    li.className = 'lb-row' + (ehMim ? ' me' : '');
    li.innerHTML =
      '<span class="rank">' + pos + '</span>' +
      '<div class="av">' + iniciais(u.nick || u.nome) + '</div>' +
      '<span class="nick">' + (u.nick || u.nome) + '</span>' +
      '<span class="pts">' + u.pontuacao + '</span>';
    lista.appendChild(li);
  });

  /* update KPI ranking + sua pontuação */
  var kpiPontos = document.getElementById('kpi-pontos');
  var kpiRank   = document.getElementById('kpi-rank');
  if (usuarioAtual) {
    var meu = ranking.find(function (u) { return u.email === usuarioAtual.email; });
    if (meu) {
      if (kpiPontos) kpiPontos.textContent = meu.pontuacao + ' pts';
      if (kpiRank)   kpiRank.textContent   = '#' + posUsuario;
    } else {
      if (kpiPontos) kpiPontos.textContent = '0 pts';
      if (kpiRank)   kpiRank.textContent   = '—';
    }
  }
}

function atualizarStatus(stage, atual, total) {
  var el = document.getElementById('status-' + stage);
  if (el) el.textContent = atual + ' / ' + total + ' picks';
  if (stage === 'stage2') {
    var ab = document.getElementById('ab-count');
    if (ab) ab.textContent = atual + ' / ' + total;
  }
}

function contarChecked(nome) {
  return document.querySelectorAll('input[name="' + nome + '"]:checked').length;
}

function contarPicksStage2() {
  return contarChecked('stage2_30') + contarChecked('stage2_03');
}

function ligarLimite(name, max, rotuloErro) {
  document.querySelectorAll('input[name="' + name + '"]').forEach(function (cb) {
    cb.addEventListener('change', function () {
      if (cb.checked && contarChecked(name) > max) {
        cb.checked = false;
        alert(rotuloErro);
      }
      if (name === 'stage2_30' || name === 'stage2_03') {
        atualizarStatus('stage2', contarPicksStage2(), 4);
      } else if (name === 'top8') {
        atualizarStatus('stage3', contarChecked('top8'), 8);
      }
    });
  });
}

function ligarContadores() {
  ligarLimite('stage2_30', 2, 'Você só pode escolher 2 times para o pick de 3 — 0.');
  ligarLimite('stage2_03', 2, 'Você só pode escolher 2 times para o pick de 0 — 3.');
  ligarLimite('top8',      8, 'Você só pode escolher 8 times no Top 8.');
  document.querySelectorAll('input[name="campeao"]').forEach(function (rd) {
    rd.addEventListener('change', function () {
      atualizarStatus('playoffs', rd.checked ? 1 : 0, 1);
    });
  });
}

function marcarChecked(nome, valores) {
  if (!valores || !valores.length) return;
  valores.forEach(function (v) {
    var el = document.querySelector('input[name="' + nome + '"][value="' + v + '"]');
    if (el) el.checked = true;
  });
}

function preencherPicks(picks) {
  if (!picks) return;
  marcarChecked('stage2_30', picks.stage2_30);
  marcarChecked('stage2_03', picks.stage2_03);
  marcarChecked('top8',      picks.top8);
  if (picks.campeao) {
    var el = document.querySelector('input[name="campeao"][value="' + picks.campeao + '"]');
    if (el) el.checked = true;
  }
  atualizarStatus('stage2',   contarPicksStage2(), 4);
  atualizarStatus('stage3',   contarChecked('top8'), 8);
  atualizarStatus('playoffs', picks.campeao ? 1 : 0, 1);
}

function coletarValores(name) {
  var arr = [];
  document.querySelectorAll('input[name="' + name + '"]:checked').forEach(function (el) {
    arr.push(el.value);
  });
  return arr;
}

function coletarPicks() {
  var campRadio = document.querySelector('input[name="campeao"]:checked');
  return {
    stage2_30: coletarValores('stage2_30'),
    stage2_03: coletarValores('stage2_03'),
    top8:      coletarValores('top8'),
    campeao:   campRadio ? campRadio.value : '',
    dataSalvo: new Date().toLocaleString('pt-BR')
  };
}

function salvarPicks(e) {
  e.preventDefault();
  var usuario = JSON.parse(sessionStorage.getItem(CHAVE_SESSAO) || 'null');
  if (!usuario) return;

  var top8Count = contarChecked('top8');
  if (top8Count > 0 && top8Count !== 8) {
    alert('Para o Top 8 você precisa escolher exatamente 8 times (atualmente ' + top8Count + ').');
    return;
  }

  var picks = coletarPicks();
  picks.email = usuario.email;

  var todas = lerPrevisoes().filter(function (p) { return p.email !== usuario.email; });
  todas.push(picks);
  salvarPrevisoes(todas);

  var msg = document.getElementById('pk-saved-msg');
  if (msg) {
    msg.hidden = false;
    msg.textContent = '✓ Picks salvos com sucesso em ' + picks.dataSalvo;
    setTimeout(function () { msg.hidden = true; }, 4000);
  }
}

function resetar() {
  if (!confirm('Resetar todos os picks de Stage 2, Top 8 e Campeão?')) return;
  document.querySelectorAll(
    'input[name="stage2_30"]:checked, input[name="stage2_03"]:checked, ' +
    'input[name="top8"]:checked, input[name="campeao"]:checked'
  ).forEach(function (el) { el.checked = false; });
  atualizarStatus('stage2', 0, 4);
  atualizarStatus('stage3', 0, 8);
  atualizarStatus('playoffs', 0, 1);
}

function ligarTabsLeaderboard() {
  var tabs = document.querySelectorAll('.lb-tab');
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');
      /* Demo: ambas as tabs mostram o mesmo leaderboard global */
    });
  });
}

document.addEventListener('DOMContentLoaded', function () {
  var sessao = sessionStorage.getItem(CHAVE_SESSAO);

  if (!sessao) {
    document.getElementById('aviso-login').hidden    = false;
    return;
  }

  document.getElementById('aviso-login').hidden    = true;
  document.getElementById('form-pickem-area').hidden = false;

  var usuario = JSON.parse(sessao);

  montarTodosGrids();
  ligarContadores();
  ligarTabsLeaderboard();

  var picksExistentes = lerPrevisoes().find(function (p) { return p.email === usuario.email; });
  if (picksExistentes) preencherPicks(picksExistentes);

  renderizarLeaderboard(usuario);

  document.getElementById('form-pickem').addEventListener('submit', salvarPicks);
  document.getElementById('btn-resetar').addEventListener('click', resetar);
});
