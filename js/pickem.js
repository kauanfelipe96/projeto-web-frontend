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

/* ===== STAGE 2 — slots + chip pool ===== */
var stage2Picks  = { '30': [null, null], '03': [null, null] };
var stage2Active = null;

function stage2UsedTeams() {
  return stage2Picks['30'].concat(stage2Picks['03']).filter(Boolean);
}

function renderStage2Slots() {
  document.querySelectorAll('.pick-slot[data-cat]').forEach(function (slot) {
    var cat  = slot.dataset.cat;
    var idx  = parseInt(slot.dataset.slot, 10);
    var team = stage2Picks[cat][idx];
    slot.classList.toggle('filled', !!team);
    slot.classList.toggle('active', !team && slot === stage2Active);
    while (slot.firstChild) slot.removeChild(slot.firstChild);
    if (team) {
      var logo = document.createElement('span');
      logo.className = 'slot-team-logo';
      logo.textContent = abrev(team);
      var name = document.createElement('span');
      name.className = 'slot-team-name';
      name.textContent = team;
      var rem = document.createElement('span');
      rem.className = 'slot-remove';
      rem.textContent = '×';
      slot.appendChild(logo);
      slot.appendChild(name);
      slot.appendChild(rem);
    } else {
      var ico = document.createElement('span');
      ico.className = 'slot-empty-icon';
      ico.textContent = '+';
      var txt = document.createElement('span');
      txt.textContent = 'Escolher time';
      slot.appendChild(ico);
      slot.appendChild(txt);
    }
  });
}

function renderStage2Chips() {
  var grid = document.getElementById('stage2-chips');
  if (!grid) return;
  var usados = stage2UsedTeams();
  while (grid.firstChild) grid.removeChild(grid.firstChild);
  TODOS_TIMES.forEach(function (time) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'chip' + (usados.indexOf(time) !== -1 ? ' used' : '');
    btn.dataset.team = time;
    btn.innerHTML =
      '<span class="chip-logo">' + abrev(time) + '</span>' +
      '<span class="chip-name">' + time + '</span>';
    btn.addEventListener('click', function () { onChipClick(time); });
    grid.appendChild(btn);
  });
}

function atualizarBadgeStage2() {
  var n = stage2UsedTeams().length;
  var badge = document.getElementById('badge-stage2');
  if (badge) badge.textContent = n + '/4';
  atualizarStatus('stage2', n, 4);
}

function renderStage2() {
  renderStage2Slots();
  renderStage2Chips();
  atualizarBadgeStage2();
}

function onSlotClick(e) {
  var slot = e.currentTarget;
  var cat  = slot.dataset.cat;
  var idx  = parseInt(slot.dataset.slot, 10);
  if (stage2Picks[cat][idx]) {
    stage2Picks[cat][idx] = null;
    stage2Active = null;
  } else {
    stage2Active = (stage2Active === slot) ? null : slot;
  }
  renderStage2();
}

function onChipClick(team) {
  if (stage2UsedTeams().indexOf(team) !== -1) return;
  var cat, idx;
  if (stage2Active) {
    cat = stage2Active.dataset.cat;
    idx = parseInt(stage2Active.dataset.slot, 10);
  } else {
    /* preenche o primeiro slot vazio: 3-0 primeiro, depois 0-3 */
    if      (stage2Picks['30'][0] === null) { cat = '30'; idx = 0; }
    else if (stage2Picks['30'][1] === null) { cat = '30'; idx = 1; }
    else if (stage2Picks['03'][0] === null) { cat = '03'; idx = 0; }
    else if (stage2Picks['03'][1] === null) { cat = '03'; idx = 1; }
    else return;
  }
  stage2Picks[cat][idx] = team;
  stage2Active = null;
  renderStage2();
}

function ligarStage2() {
  document.querySelectorAll('.pick-slot[data-cat]').forEach(function (slot) {
    slot.addEventListener('click', onSlotClick);
  });
  renderStage2();
}

function resetarStage2() {
  stage2Picks  = { '30': [null, null], '03': [null, null] };
  stage2Active = null;
  renderStage2();
}

function montarTodosGrids() {
  ligarStage2();
  /* Stage 3 e Playoffs estão bloqueados (preview) — sem grid interativo */
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

function ligarContadores() {
  /* Stage 3 e Playoffs estão bloqueados — sem contadores ativos */
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
  /* Stage 2 — restaura os slots (única seção interativa) */
  if (picks.stage2_30 && picks.stage2_30.length) {
    stage2Picks['30'][0] = picks.stage2_30[0] || null;
    stage2Picks['30'][1] = picks.stage2_30[1] || null;
  }
  if (picks.stage2_03 && picks.stage2_03.length) {
    stage2Picks['03'][0] = picks.stage2_03[0] || null;
    stage2Picks['03'][1] = picks.stage2_03[1] || null;
  }
  renderStage2();
}

function coletarValores(name) {
  var arr = [];
  document.querySelectorAll('input[name="' + name + '"]:checked').forEach(function (el) {
    arr.push(el.value);
  });
  return arr;
}

function coletarPicks() {
  return {
    stage2_30: stage2Picks['30'].filter(Boolean),
    stage2_03: stage2Picks['03'].filter(Boolean),
    dataSalvo: new Date().toLocaleString('pt-BR')
  };
}

function salvarPicks(e) {
  e.preventDefault();
  var usuario = JSON.parse(sessionStorage.getItem(CHAVE_SESSAO) || 'null');
  if (!usuario) return;

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
  if (!confirm('Resetar todos os picks do Stage 2?')) return;
  resetarStage2();
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
