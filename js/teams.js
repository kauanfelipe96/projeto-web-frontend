(function () {
  var pills      = document.querySelectorAll('.filter-pill[data-region]');
  var searchInput = document.getElementById('teams-search');
  var cards      = document.querySelectorAll('.team-card-full[data-region]');
  if (!cards.length) return;

  var regionAtual = 'all';
  var termoAtual  = '';

  function aplicar() {
    var t = termoAtual.toLowerCase();
    document.querySelectorAll('.tier-section').forEach(function (sec) {
      var visiveis = 0;
      sec.querySelectorAll('.team-card-full[data-region]').forEach(function (card) {
        var bateRegiao = regionAtual === 'all' || card.dataset.region === regionAtual;
        var nome  = (card.querySelector('h3') || {}).textContent || '';
        var pais  = (card.querySelector('.team-country') || {}).textContent || '';
        var roster = (card.querySelector('.team-roster') || {}).textContent || '';
        var bateTermo = !t
          || nome.toLowerCase().indexOf(t)  !== -1
          || pais.toLowerCase().indexOf(t)  !== -1
          || roster.toLowerCase().indexOf(t) !== -1;
        var mostrar = bateRegiao && bateTermo;
        card.style.display = mostrar ? '' : 'none';
        if (mostrar) visiveis++;
      });
      sec.style.display = visiveis === 0 ? 'none' : '';
    });
  }

  pills.forEach(function (pill) {
    pill.addEventListener('click', function () {
      pills.forEach(function (p) { p.classList.remove('active'); });
      pill.classList.add('active');
      regionAtual = pill.dataset.region;
      aplicar();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', function () {
      termoAtual = searchInput.value;
      aplicar();
    });
  }
})();
