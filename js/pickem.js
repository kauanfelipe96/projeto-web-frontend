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

function montarOptgroup(label, times) {
  var og = document.createElement('optgroup');
  og.label = label;
  times.forEach(function (t) {
    var opt = document.createElement('option');
    opt.value = t; opt.textContent = t;
    og.appendChild(opt);
  });
  return og;
}

function popularSelects() {
  var selectsStage2  = document.querySelectorAll('select[data-stage="stage2"]');
  var selectCampeao  = document.getElementById('pick-campeao');

  selectsStage2.forEach(function (sel) {
    sel.appendChild(montarOptgroup('Legends Stage',    LEGENDS));
    sel.appendChild(montarOptgroup('Challengers Stage', CHALLENGERS));
    sel.appendChild(montarOptgroup('Contenders Stage',  CONTENDERS));
  });

  if (selectCampeao) {
    selectCampeao.appendChild(montarOptgroup('Legends Stage',    LEGENDS));
    selectCampeao.appendChild(montarOptgroup('Challengers Stage', CHALLENGERS));
    selectCampeao.appendChild(montarOptgroup('Contenders Stage',  CONTENDERS));
  }
}

function montarTop8Grid() {
  var grid = document.getElementById('top8-grid');
  if (!grid) return;
  TIMES_TOP8.forEach(function (time, i) {
    var id = 'top8-' + i;
    var cell = document.createElement('div');
    cell.className = 'top8-cell';
    cell.innerHTML =
      '<input type="checkbox" id="' + id + '" name="top8" value="' + time + '">' +
      '<label for="' + id + '">' +
        '<span class="logo">' + abrev(time) + '</span>' +
        '<span class="name">' + time + '</span>' +
      '</label>';
    grid.appendChild(cell);
  });
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

function contarPicksStage2() {
  var selects = document.querySelectorAll('select[data-stage="stage2"]');
  var c = 0;
  selects.forEach(function (s) { if (s.value) c++; });
  return c;
}

function contarTop8() {
  return document.querySelectorAll('input[name="top8"]:checked').length;
}

function ligarContadores() {
  document.querySelectorAll('select[data-stage="stage2"]').forEach(function (s) {
    s.addEventListener('change', function () {
      atualizarStatus('stage2', contarPicksStage2(), 4);
    });
  });
  document.querySelectorAll('input[name="top8"]').forEach(function (cb) {
    cb.addEventListener('change', function () {
      var n = contarTop8();
      if (n > 8 && cb.checked) {
        cb.checked = false;
        alert('Você só pode escolher 8 times no Top 8.');
        return;
      }
      atualizarStatus('stage3', contarTop8(), 8);
    });
  });
  var campeao = document.getElementById('pick-campeao');
  if (campeao) {
    campeao.addEventListener('change', function () {
      atualizarStatus('playoffs', campeao.value ? 1 : 0, 1);
    });
  }
}

function preencherPicks(picks) {
  if (!picks) return;
  if (picks.stage2) {
    Object.keys(picks.stage2).forEach(function (k) {
      var sel = document.querySelector('select[name="' + k + '"]');
      if (sel) sel.value = picks.stage2[k];
    });
  }
  if (picks.top8 && picks.top8.length) {
    picks.top8.forEach(function (time) {
      var cb = document.querySelector('input[name="top8"][value="' + time + '"]');
      if (cb) cb.checked = true;
    });
  }
  if (picks.campeao) {
    var c = document.getElementById('pick-campeao');
    if (c) c.value = picks.campeao;
  }
  atualizarStatus('stage2',   contarPicksStage2(), 4);
  atualizarStatus('stage3',   contarTop8(),        8);
  atualizarStatus('playoffs', picks.campeao ? 1 : 0, 1);
}

function coletarPicks() {
  var stage2 = {};
  document.querySelectorAll('select[data-stage="stage2"]').forEach(function (s) {
    if (s.value) stage2[s.name] = s.value;
  });
  var top8 = [];
  document.querySelectorAll('input[name="top8"]:checked').forEach(function (cb) {
    top8.push(cb.value);
  });
  var campeao = (document.getElementById('pick-campeao') || {}).value || '';
  return { stage2: stage2, top8: top8, campeao: campeao, dataSalvo: new Date().toLocaleString('pt-BR') };
}

function salvarPicks(e) {
  e.preventDefault();
  var usuario = JSON.parse(sessionStorage.getItem(CHAVE_SESSAO) || 'null');
  if (!usuario) return;

  var top8Count = contarTop8();
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
  document.querySelectorAll('select[data-stage="stage2"], #pick-campeao').forEach(function (s) {
    s.value = '';
  });
  document.querySelectorAll('input[name="top8"]:checked').forEach(function (cb) { cb.checked = false; });
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

  popularSelects();
  montarTop8Grid();
  ligarContadores();
  ligarTabsLeaderboard();

  var picksExistentes = lerPrevisoes().find(function (p) { return p.email === usuario.email; });
  if (picksExistentes) preencherPicks(picksExistentes);

  renderizarLeaderboard(usuario);

  document.getElementById('form-pickem').addEventListener('submit', salvarPicks);
  document.getElementById('btn-resetar').addEventListener('click', resetar);
});
