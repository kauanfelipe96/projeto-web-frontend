var CHAVE_SESSAO    = 'usuario_logado';
var CHAVE_PREVISOES = 'pickem_previsoes';
var CHAVE_USUARIOS  = 'pickem_usuarios';

/* ===== Logos ===== */
var LOGO_FILES = {
  'GamerLegion':'gamerlegion.png', 'NRG':'nrg.png',
  'B8':'b8.png',                   'TYLOO':'tyloo.png',
  'HEROIC':'heroic.png',           'Sharks':'sharks.png',
  'BetBoom':'betboom.png',         'Gaimin Gladiators':'gaimingladiators.png',
  'BIG':'big.png',                 'Team Liquid':'liquid.png',
  'M80':'m80.png',                 'Lynn Vision':'lynnvision.png',
  'MIBR':'mibr.png',               'THUNDERdOWNUNDER':'thunderdownunder.png',
  'SINNERS':'sinners.png',         'FlyQuest':'flyquest.png'
};

var ABBREV = {
  'GamerLegion':       'GAMERLEGION',
  'NRG':               'NRG',
  'B8':                'B8',
  'TYLOO':             'TYLOO',
  'HEROIC':            'HEROIC',
  'Sharks':            'SHARKS',
  'BetBoom':           'BETBOOM',
  'Gaimin Gladiators': 'GAIMIN',
  'BIG':               'BIG',
  'Team Liquid':       'LIQUID',
  'M80':               'M80',
  'Lynn Vision':       'LYNN VI',
  'MIBR':              'MIBR',
  'THUNDERdOWNUNDER':  'THUNDER',
  'SINNERS':           'SINNERS',
  'FlyQuest':          'FLYQUEST'
};

function logoImg(team) {
  var file = LOGO_FILES[team];
  if (!file) return '<span>' + (team || '?').slice(0,3).toUpperCase() + '</span>';
  return '<img src="assets/img/' + file + '" alt="' + team + '">';
}
function teamAbbrev(team) { return ABBREV[team] || (team || '').toUpperCase(); }

/* ===== Seeds (1 = melhor, 16 = pior). Pareamento 1×16, 2×15, ... ===== */
var SEEDS = {
  'GamerLegion':        1,
  'B8':                 2,
  'HEROIC':             3,
  'BetBoom':            4,
  'BIG':                5,
  'M80':                6,
  'MIBR':               7,
  'SINNERS':            8,
  'FlyQuest':           9,
  'THUNDERdOWNUNDER':  10,
  'Lynn Vision':       11,
  'Team Liquid':       12,
  'Gaimin Gladiators': 13,
  'Sharks':            14,
  'TYLOO':             15,
  'NRG':               16
};
function seed(team) { return SEEDS[team] || 999; }
function higherSeed(a, b) { return seed(a) < seed(b) ? a : b; }

/* ===== Stage 1 — confrontos fixos (1×16, 2×15, ...) ===== */
var STAGE1_MATCHES = [
  ['GamerLegion', 'NRG'],
  ['B8', 'TYLOO'],
  ['HEROIC', 'Sharks'],
  ['BetBoom', 'Gaimin Gladiators'],
  ['BIG', 'Team Liquid'],
  ['M80', 'Lynn Vision'],
  ['MIBR', 'THUNDERdOWNUNDER'],
  ['SINNERS', 'FlyQuest']
];

/* ===== Estado ===== */
var state = {
  s1:    [null, null, null, null, null, null, null, null], // 0-0
  s2_10: [null, null, null, null],                          // 1-0
  s2_01: [null, null, null, null],                          // 0-1
  s3_20: [null, null],                                      // 2-0
  s3_11: [null, null, null, null],                          // 1-1
  s3_02: [null, null],                                      // 0-2
  s3_21: [null, null, null],                                // 2-1
  s3_12: [null, null, null],                                // 1-2
  s3_22: [null, null, null]                                 // 2-2
};

/* ===== Pareamento por seed (best × worst) ===== */
function buildMatches(bucketTeams, numMatches) {
  var known = bucketTeams.filter(Boolean).slice();
  known.sort(function (a, b) { return seed(a) - seed(b); });
  var matches = [];
  var k = known.length;
  var half = Math.floor(k / 2);
  for (var i = 0; i < numMatches; i++) {
    if (i < half) matches.push([known[i], known[k - 1 - i]]);
    else if (i === half && k % 2 === 1) matches.push([known[i], null]);
    else matches.push([null, null]);
  }
  return matches;
}
function loserOf(matchPair, picked) {
  if (!picked || !matchPair[0] || !matchPair[1]) return null;
  return matchPair[0] === picked ? matchPair[1] : matchPair[0];
}

/* ===== Buckets ===== */
function s1Match(i)  { return STAGE1_MATCHES[i]; }
function s1Winner(i) { return state.s1[i]; }
function s1Loser(i)  { return loserOf(s1Match(i), state.s1[i]); }
function bucket10() { return [0,1,2,3,4,5,6,7].map(s1Winner); }
function bucket01() { return [0,1,2,3,4,5,6,7].map(s1Loser); }

function s2_10Match(i) { return buildMatches(bucket10(), 4)[i]; }
function s2_01Match(i) { return buildMatches(bucket01(), 4)[i]; }
function s2_10Winner(i) { return state.s2_10[i]; }
function s2_10Loser(i)  { return loserOf(s2_10Match(i), state.s2_10[i]); }
function s2_01Winner(i) { return state.s2_01[i]; }
function s2_01Loser(i)  { return loserOf(s2_01Match(i), state.s2_01[i]); }

function bucket20() { return [0,1,2,3].map(s2_10Winner); }
function bucket11() {
  return [s2_10Loser(0), s2_10Loser(1), s2_10Loser(2), s2_10Loser(3),
          s2_01Winner(0), s2_01Winner(1), s2_01Winner(2), s2_01Winner(3)];
}
function bucket02() { return [0,1,2,3].map(s2_01Loser); }

function s3_20Match(i) { return buildMatches(bucket20(), 2)[i]; }
function s3_11Match(i) { return buildMatches(bucket11(), 4)[i]; }
function s3_02Match(i) { return buildMatches(bucket02(), 2)[i]; }
function s3_20Winner(i) { return state.s3_20[i]; }
function s3_20Loser(i)  { return loserOf(s3_20Match(i), state.s3_20[i]); }
function s3_11Winner(i) { return state.s3_11[i]; }
function s3_11Loser(i)  { return loserOf(s3_11Match(i), state.s3_11[i]); }
function s3_02Winner(i) { return state.s3_02[i]; }
function s3_02Loser(i)  { return loserOf(s3_02Match(i), state.s3_02[i]); }

function bucket21() {
  return [s3_20Loser(0), s3_20Loser(1),
          s3_11Winner(0), s3_11Winner(1), s3_11Winner(2), s3_11Winner(3)];
}
function bucket12() {
  return [s3_11Loser(0), s3_11Loser(1), s3_11Loser(2), s3_11Loser(3),
          s3_02Winner(0), s3_02Winner(1)];
}

function s3_21Match(i) { return buildMatches(bucket21(), 3)[i]; }
function s3_12Match(i) { return buildMatches(bucket12(), 3)[i]; }
function s3_21Winner(i) { return state.s3_21[i]; }
function s3_21Loser(i)  { return loserOf(s3_21Match(i), state.s3_21[i]); }
function s3_12Winner(i) { return state.s3_12[i]; }
function s3_12Loser(i)  { return loserOf(s3_12Match(i), state.s3_12[i]); }

function bucket22() {
  return [s3_21Loser(0), s3_21Loser(1), s3_21Loser(2),
          s3_12Winner(0), s3_12Winner(1), s3_12Winner(2)];
}
function s3_22Match(i)  { return buildMatches(bucket22(), 3)[i]; }
function s3_22Winner(i) { return state.s3_22[i]; }
function s3_22Loser(i)  { return loserOf(s3_22Match(i), state.s3_22[i]); }

function sortBySeed(arr) {
  return arr.filter(Boolean).slice().sort(function (a, b) { return seed(a) - seed(b); });
}
function card30() { return sortBySeed([s3_20Winner(0), s3_20Winner(1)]); }
function card03() { return sortBySeed([s3_02Loser(0),  s3_02Loser(1)]); }
function card31() { return sortBySeed([s3_21Winner(0), s3_21Winner(1), s3_21Winner(2)]); }
function card13() { return sortBySeed([s3_12Loser(0),  s3_12Loser(1),  s3_12Loser(2)]); }
function card32() { return sortBySeed([s3_22Winner(0), s3_22Winner(1), s3_22Winner(2)]); }
function card23() { return sortBySeed([s3_22Loser(0),  s3_22Loser(1),  s3_22Loser(2)]); }

/* ===== Validação em cascata ===== */
function validateAll() {
  function fix(picks, getMatch) {
    for (var i = 0; i < picks.length; i++) {
      if (picks[i] === null) continue;
      var m = getMatch(i);
      if (!m || !m[0] || !m[1] || (picks[i] !== m[0] && picks[i] !== m[1])) {
        picks[i] = null;
      }
    }
  }
  fix(state.s2_10, s2_10Match);
  fix(state.s2_01, s2_01Match);
  fix(state.s3_20, s3_20Match);
  fix(state.s3_11, s3_11Match);
  fix(state.s3_02, s3_02Match);
  fix(state.s3_21, s3_21Match);
  fix(state.s3_12, s3_12Match);
  fix(state.s3_22, s3_22Match);
}

/* ===== Travas / status ===== */
function isComplete(arr) { return arr.every(function (v) { return v !== null; }); }
function isStarted(arr)  { return arr.some(function (v)  { return v !== null; }); }

function s1Done()  { return isComplete(state.s1); }
function s2Done()  { return s1Done()  && isComplete(state.s2_10) && isComplete(state.s2_01); }
function s3aDone() { return s2Done()  && isComplete(state.s3_20) && isComplete(state.s3_11) && isComplete(state.s3_02); }
function s3bDone() { return s3aDone() && isComplete(state.s3_21) && isComplete(state.s3_12); }
function s3Done()  { return s3bDone() && isComplete(state.s3_22); }

function lockState() {
  return {
    s2_10: !s1Done(),  s2_01: !s1Done(),
    s3_20: !s2Done(),  s3_11: !s2Done(),  s3_02: !s2Done(),
    s3_21: !s3aDone(), s3_12: !s3aDone(),
    s3_22: !s3bDone(),
    stages: {
      '1': false,
      '2': !s1Done(),
      '3': !s2Done()
    }
  };
}

function getStageStatus(stage) {
  if (stage === 'playoffs') return 'soon';
  if (stage === 1) return s1Done() ? 'complete' : 'active';
  if (stage === 2) {
    if (s2Done()) return 'complete';
    if (s1Done()) return 'active';
    return 'locked';
  }
  if (stage === 3) {
    if (s3Done()) return 'complete';
    if (s2Done()) return 'active';
    return 'locked';
  }
  return 'locked';
}

/* Stage corrente para "Random Stage N": primeira incompleta */
function currentStageNum() {
  if (!s1Done()) return 1;
  if (!s2Done()) return 2;
  if (!s3Done()) return 3;
  return 0;
}

/* ===== Pills (só logo, circular) ===== */
function makeTeamPill(team, opts) {
  opts = opts || {};
  var cls = ['team-pill'];
  var content;

  if (!team) {
    cls.push('empty');
    content = '?';
  } else {
    content = logoImg(team);
    if (opts.locked)        cls.push('locked-team');
    else if (opts.isWinner) cls.push('winner');
    else if (opts.isLoser)  cls.push('loser');
  }

  var attrs = '';
  if (opts.pickKey)              attrs += ' data-pick-key="' + opts.pickKey + '"';
  if (opts.matchIdx !== undefined) attrs += ' data-match-idx="' + opts.matchIdx + '"';
  if (team) {
    var safe = team.replace(/"/g, '&quot;');
    attrs += ' data-team="' + safe + '"';
    attrs += ' title="' + safe + '"';
    attrs += ' aria-label="' + safe + '"';
  } else {
    attrs += ' title="Aguardando" aria-label="Aguardando"';
  }
  if (opts.locked || !team || opts.display) attrs += ' disabled';

  return '<button type="button" class="' + cls.join(' ') + '"' + attrs + '>' + content + '</button>';
}

function renderBucketMatches(elId, count, getMatch, picks, pickKey, locked) {
  var el = document.getElementById(elId);
  if (!el) return;
  var html = '';
  for (var i = 0; i < count; i++) {
    var m = getMatch(i);
    var winner = picks[i];
    var pillA = makeTeamPill(m[0], {
      pickKey: pickKey, matchIdx: i,
      isWinner: winner && winner === m[0],
      isLoser:  winner && winner === m[1],
      locked:   locked
    });
    var pillB = makeTeamPill(m[1], {
      pickKey: pickKey, matchIdx: i,
      isWinner: winner && winner === m[1],
      isLoser:  winner && winner === m[0],
      locked:   locked
    });
    html += '<div class="match-row">' + pillA + '<span class="match-vs">VS</span>' + pillB + '</div>';
  }
  el.innerHTML = html;
}

function renderCardSlots(elId, teams, totalSlots) {
  var el = document.getElementById(elId);
  if (!el) return;
  var html = '';
  for (var i = 0; i < totalSlots; i++) {
    var t = teams[i] || null;
    html += makeTeamPill(t, { display: true });
  }
  el.innerHTML = html;
}

function setBucketLock(bucketAttr, locked) {
  var el = document.querySelector('[data-bucket="' + bucketAttr + '"]');
  if (el) el.classList.toggle('locked', locked);
}

/* ===== Status cards ===== */
function updateStatusCards() {
  var mapping = { '1': 1, '2': 2, '3': 3, 'playoffs': 'playoffs' };
  Object.keys(mapping).forEach(function (key) {
    var card = document.getElementById('status-card-' + key);
    if (!card) return;
    var status = getStageStatus(mapping[key]);
    card.classList.remove('complete', 'active', 'locked', 'soon');
    card.classList.add(status);
    var stateEl = card.querySelector('.status-state');
    if (stateEl) {
      stateEl.textContent =
        status === 'complete' ? 'FINALIZADO' :
        status === 'active'   ? 'AGUARDANDO' :
        status === 'soon'     ? 'EM BREVE' :
                                'BLOQUEADO';
    }
  });
}

/* ===== Action bar (random stage N, contadores) ===== */
function updateActionBar() {
  var n = currentStageNum();
  var randomBtn = document.getElementById('btn-random-stage');
  var span = document.getElementById('random-stage-num');
  if (n === 0) {
    randomBtn.disabled = true;
    if (span) span.textContent = '—';
  } else {
    randomBtn.disabled = false;
    if (span) span.textContent = n;
  }
  var picks = totalPicks();
  var quali = card30().length + card31().length + card32().length;
  var el;
  if ((el = document.getElementById('ab-picks-count'))) el.textContent = picks;
  if ((el = document.getElementById('ab-quali')))       el.textContent = quali;
}

/* ===== Render principal ===== */
function renderAll() {
  validateAll();
  var locks = lockState();

  /* Stage 1 */
  renderBucketMatches('bucket-00', 8, s1Match, state.s1, 's1', false);

  /* Stage 2 */
  setBucketLock('10', locks.s2_10);
  setBucketLock('01', locks.s2_01);
  renderBucketMatches('bucket-10', 4, s2_10Match, state.s2_10, 's2_10', locks.s2_10);
  renderBucketMatches('bucket-01', 4, s2_01Match, state.s2_01, 's2_01', locks.s2_01);

  /* Stage 3a */
  setBucketLock('20', locks.s3_20);
  setBucketLock('11', locks.s3_11);
  setBucketLock('02', locks.s3_02);
  renderBucketMatches('bucket-20', 2, s3_20Match, state.s3_20, 's3_20', locks.s3_20);
  renderBucketMatches('bucket-11', 4, s3_11Match, state.s3_11, 's3_11', locks.s3_11);
  renderBucketMatches('bucket-02', 2, s3_02Match, state.s3_02, 's3_02', locks.s3_02);

  /* Stage 3b */
  setBucketLock('21', locks.s3_21);
  setBucketLock('12', locks.s3_12);
  renderBucketMatches('bucket-21', 3, s3_21Match, state.s3_21, 's3_21', locks.s3_21);
  renderBucketMatches('bucket-12', 3, s3_12Match, state.s3_12, 's3_12', locks.s3_12);
  renderCardSlots('card-30', card30(), 2);
  renderCardSlots('card-03', card03(), 2);

  /* Stage 3c */
  setBucketLock('22', locks.s3_22);
  renderBucketMatches('bucket-22', 3, s3_22Match, state.s3_22, 's3_22', locks.s3_22);
  renderCardSlots('card-31', card31(), 3);
  renderCardSlots('card-13', card13(), 3);
  renderCardSlots('card-32', card32(), 3);
  renderCardSlots('card-23', card23(), 3);

  updateStatusCards();
  updateActionBar();
  atualizarKPIs();
}

/* ===== KPIs ===== */
function totalPicks() {
  return state.s1.filter(Boolean).length
       + state.s2_10.filter(Boolean).length
       + state.s2_01.filter(Boolean).length
       + state.s3_20.filter(Boolean).length
       + state.s3_11.filter(Boolean).length
       + state.s3_02.filter(Boolean).length
       + state.s3_21.filter(Boolean).length
       + state.s3_12.filter(Boolean).length
       + state.s3_22.filter(Boolean).length;
}
function stageAtualLabel() {
  if (!s1Done()) return 'Stage 1';
  if (!s2Done()) return 'Stage 2';
  if (!s3aDone()) return 'Stage 3 · 2-0/1-1/0-2';
  if (!s3bDone()) return 'Stage 3 · 2-1/1-2';
  if (!s3Done())  return 'Stage 3 · 2-2';
  return 'Concluído';
}
function atualizarKPIs() {
  var total = totalPicks();
  var quali = card30().length + card31().length + card32().length;
  var elim  = card03().length + card13().length + card23().length;

  var el;
  if ((el = document.getElementById('kpi-picks'))) el.textContent = total + ' / 33';
  if ((el = document.getElementById('kpi-stage'))) el.textContent = stageAtualLabel();
  if ((el = document.getElementById('kpi-quali'))) el.textContent = quali + ' / 8';
  if ((el = document.getElementById('kpi-elim')))  el.textContent = elim  + ' / 8';
  if ((el = document.getElementById('ab-count'))) el.textContent = total + ' / 33';
}

/* ===== Cliques nos times ===== */
function stateArrayFor(key) {
  switch (key) {
    case 's1':    return state.s1;
    case 's2_10': return state.s2_10;
    case 's2_01': return state.s2_01;
    case 's3_20': return state.s3_20;
    case 's3_11': return state.s3_11;
    case 's3_02': return state.s3_02;
    case 's3_21': return state.s3_21;
    case 's3_12': return state.s3_12;
    case 's3_22': return state.s3_22;
  }
  return null;
}
function onTeamClick(e) {
  var btn = e.target.closest('.team-pill');
  if (!btn || btn.disabled) return;
  var pickKey  = btn.dataset.pickKey;
  var matchIdx = parseInt(btn.dataset.matchIdx, 10);
  var team     = btn.dataset.team;
  if (!pickKey || isNaN(matchIdx) || !team) return;
  var arr = stateArrayFor(pickKey);
  if (!arr) return;
  arr[matchIdx] = (arr[matchIdx] === team) ? null : team;
  renderAll();
}

/* ===== Random Stage (cascata para o Stage 3) ===== */
function stageBuckets(stage) {
  switch (stage) {
    case '1':  return [{picks: state.s1, matchFn: s1Match, count: 8}];
    case '2':  return [
      {picks: state.s2_10, matchFn: s2_10Match, count: 4},
      {picks: state.s2_01, matchFn: s2_01Match, count: 4}
    ];
    case '3':  return [
      {picks: state.s3_20, matchFn: s3_20Match, count: 2},
      {picks: state.s3_11, matchFn: s3_11Match, count: 4},
      {picks: state.s3_02, matchFn: s3_02Match, count: 2},
      {picks: state.s3_21, matchFn: s3_21Match, count: 3},
      {picks: state.s3_12, matchFn: s3_12Match, count: 3},
      {picks: state.s3_22, matchFn: s3_22Match, count: 3}
    ];
  }
  return [];
}
function applyStageAction(stage, action) {
  var buckets = stageBuckets(stage);
  buckets.forEach(function (b) {
    for (var i = 0; i < b.count; i++) {
      if (action === 'reset') {
        b.picks[i] = null;
      } else {
        var m = b.matchFn(i);
        if (!m || !m[0] || !m[1]) continue;
        if (action === 'random')           b.picks[i] = Math.random() < 0.5 ? m[0] : m[1];
        else if (action === 'higher-seed') b.picks[i] = higherSeed(m[0], m[1]);
      }
    }
  });
  renderAll();
}
function onRandomStage() {
  var n = currentStageNum();
  if (n === 0) return;
  applyStageAction(String(n), 'random');
}

/* ===== Persistência ===== */
function lerUsuarios()  { return JSON.parse(localStorage.getItem(CHAVE_USUARIOS))  || []; }
function lerPrevisoes() { return JSON.parse(localStorage.getItem(CHAVE_PREVISOES)) || []; }
function salvarPrevisoes(p) { localStorage.setItem(CHAVE_PREVISOES, JSON.stringify(p)); }

function snapshotState() {
  return {
    s1:    state.s1.slice(),
    s2_10: state.s2_10.slice(), s2_01: state.s2_01.slice(),
    s3_20: state.s3_20.slice(), s3_11: state.s3_11.slice(), s3_02: state.s3_02.slice(),
    s3_21: state.s3_21.slice(), s3_12: state.s3_12.slice(),
    s3_22: state.s3_22.slice()
  };
}
function loadIntoState(p) {
  if (!p) return;
  ['s1','s2_10','s2_01','s3_20','s3_11','s3_02','s3_21','s3_12','s3_22'].forEach(function (k) {
    if (Array.isArray(p[k]) && p[k].length === state[k].length) {
      for (var i = 0; i < p[k].length; i++) state[k][i] = p[k][i] || null;
    }
  });
}
function salvarPicks() {
  var usuario = JSON.parse(sessionStorage.getItem(CHAVE_SESSAO) || 'null');
  if (!usuario) { Toast.show('Faça login para salvar os picks.', 'error'); return; }
  var picks = snapshotState();
  picks.email = usuario.email;
  picks.dataSalvo = new Date().toLocaleString('pt-BR');
  var todas = lerPrevisoes().filter(function (p) { return p.email !== usuario.email; });
  todas.push(picks);
  salvarPrevisoes(todas);
  Toast.show('Picks salvos em ' + picks.dataSalvo, 'success');
}
function resetarTudo() {
  Toast.confirm('Resetar todos os picks?', function () {
    state.s1.fill(null);
    state.s2_10.fill(null); state.s2_01.fill(null);
    state.s3_20.fill(null); state.s3_11.fill(null); state.s3_02.fill(null);
    state.s3_21.fill(null); state.s3_12.fill(null);
    state.s3_22.fill(null);
    renderAll();
    Toast.show('Picks resetados.', 'success', 2200);
  });
}

/* ===== Leaderboard ===== */
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
}
function ligarTabsLeaderboard() {
  var tabs = document.querySelectorAll('.lb-tab');
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');
    });
  });
}

/* ===== Boot ===== */
document.addEventListener('DOMContentLoaded', function () {
  var sessao = sessionStorage.getItem(CHAVE_SESSAO);
  if (!sessao) {
    document.getElementById('aviso-login').hidden = false;
    return;
  }
  document.getElementById('aviso-login').hidden     = true;
  document.getElementById('form-pickem-area').hidden = false;

  var usuario = JSON.parse(sessao);
  var salvos = lerPrevisoes().find(function (p) { return p.email === usuario.email; });
  if (salvos) loadIntoState(salvos);

  renderAll();
  renderizarLeaderboard(usuario);
  ligarTabsLeaderboard();

  document.querySelector('.sim-wrap').addEventListener('click', onTeamClick);
  document.getElementById('btn-salvar').addEventListener('click', salvarPicks);
  document.getElementById('btn-sim-reset').addEventListener('click', resetarTudo);
  document.getElementById('btn-random-stage').addEventListener('click', onRandomStage);
});
