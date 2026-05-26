# Hub IEM Cologne Major 2026

Site não-oficial de cobertura do **IEM Cologne Major 2026** — primeiro Major de CS2 de 2026 —, desenvolvido como projeto da disciplina de Programação Web Front-End. O site cobre o evento em 5 páginas de conteúdo (overview, calendário completo de partidas, brackets dos playoffs, 32 times participantes por tier e guia da sede) e oferece um sistema de **Pick'em Challenge** com autenticação por sessão, leaderboard global e regras de pontuação por stage. A área administrativa **Control Panel** permite gerenciar os participantes com KPIs em tempo real, sparklines e painel de matches.

## Tema escolhido

O IEM Cologne Major 2026 é o primeiro Major de CS2 organizado pela Valve/ESL em 2026, realizado de **2 a 21 de junho** na **Lanxess Arena** — a *"Catedral do Counter-Strike"* em Colônia, Alemanha. O tema foi escolhido por ser um evento real em andamento, com forte apelo visual para a comunidade competitiva e conteúdo autêntico para popular todas as seções do site (32 times confirmados conforme o HLTV, US$ 1.250.000 em premiação, partidas de abertura do dia 06/06).

## Tecnologias

- **HTML5** — estrutura semântica (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`)
- **CSS3 (Flexbox + Grid)** — layout, paleta inspirada no HLTV, 3 tipografias via Google Fonts (`Inter`, `Barlow Condensed`, `JetBrains Mono`), responsividade com breakpoints em 1024 px / 768 px / 480 px
- **JavaScript vanilla** — DOM API + Web Storage API (LocalStorage para persistência, SessionStorage para autenticação); sem bibliotecas externas

## Estrutura do projeto

```
projeto-web-frontend/
├── index.html           # Overview — hub do Major (hero, key facts, partidas em destaque, top 8)
├── matches.html         # Calendário completo de partidas por fase e dia (5 day-groups)
├── main-event.html      # Prize pool, brackets dos playoffs e schedule oficial
├── teams.html           # Os 32 times agrupados por tier (Legends/Challengers/Contenders)
├── venue.html           # Guia da Lanxess Arena (localização, transporte, dicas)
├── pickem.html          # Pick'em Challenge (KPIs, stages, leaderboard, pontuação)
├── cadastro.html        # Cadastro no Pick'em (6 campos)
├── login.html           # Login do participante
├── admin.html           # Control Panel — CRUD + KPIs com sparklines + painel de matches
├── css/
│   └── style.css        # Estilos globais (paleta, tipografia e componentes)
├── js/
│   ├── site.js          # Nav e footer compartilhados em todas as páginas (drawer mobile)
│   ├── auth.js          # Detecta sessão ativa e troca o CTA de login pelo nome do usuário
│   ├── cadastro.js      # Salva o usuário no LocalStorage e redireciona pro login
│   ├── login.js         # Autentica contra o LocalStorage e cria sessão
│   ├── pickem.js        # Slots do Stage 2, leaderboard, save/restore de previsões
│   ├── teams.js         # Filtro funcional de regiões e busca por nome/país/jogador
│   └── admin.js         # CRUD, busca, KPIs com formatação BR e seed de demonstração
├── assets/
│   ├── img/             # Lanxess Arena, Catedral de Colônia e logos dos 16 times do Contenders Stage
│   └── icons/           # Ícones SVG (Heroicons — troféu, calendário, localização, etc.)
└── README.md
```

## Páginas

| Página | Descrição |
|---|---|
| `index.html` | Overview do Major: hero com contagem regressiva, key facts (premiação, formato, sede), partidas em destaque com indicador live e cards dos 8 times do Legends Stage |
| `matches.html` | Calendário em 5 day-groups — Stage 1 R1 (06 Jun · 8 matches com 2 LIVE), Stage 1 R2 (07 Jun), Stage 2 Challengers (09 Jun), Stage 3 Legends (14 Jun com 2 LIVE Vitality vs NAVI / MongolZ vs Falcons) e Playoffs (19–21 Jun) |
| `main-event.html` | Distribuição do prize pool de US$ 1.250.000, chaveamento dos playoffs (Quartas → Final) e schedule oficial dia a dia |
| `teams.html` | Os **32 times participantes** organizados por tier (8 Legends, 8 Challengers, 16 Contenders) com roster em chips, ranking e região — **filtro funcional por região** (All / EU / SA / NA / CIS / Asia / MEA) + busca por nome/país/jogador |
| `venue.html` | Guia da Lanxess Arena: capacidade, histórico, transporte público de Colônia, onde ficar/comer e dicas para o evento |
| `pickem.html` | **Pick'em Challenge** com 4 KPIs (sua pontuação, ranking global, picks corretos, próximo prazo), 4 stages, **leaderboard global** ordenado por pontuação dos usuários cadastrados, e card "Como pontuar" com as regras (8/4/2/40 pts) |
| `cadastro.html` | Formulário de inscrição com 6 campos (nome, e-mail, senha, nick Steam, time favorito agrupado por stage e data de nascimento) |
| `login.html` | Autenticação contra usuários do LocalStorage; sessão guardada no `sessionStorage` |
| `admin.html` | **Control Panel** com header e badge "Acesso Restrito", sidebar com seções (Conteúdo / Comunidade / Sistema), 4 KPIs com sparklines + delta (Usuários ativos, Picks Stage 2, Matches hoje, Reports abertos), painel de Matches (cosmético) com filtros de status/stage, CRUD de usuários com seed de exemplo e lista com busca |

## Pick'em — mecânica e pontuação

O Pick'em foi montado com 4 stages, cada um com regras próprias:

- **Stage 1 · Swiss** — **locked** (já resolvido). Mostra um exemplo do usuário com 4 picks resolvidos (2 de 3–0 corretos, 1 de 0–3 errado, 1 de 0–3 correto) totalizando 20 pts.
- **Stage 2 · Swiss** — **aberto**, único stage interativo. 4 slots em branco (2 para 3–0, 2 para 0–3); um pool de chips com os 32 times abaixo. Clique num chip preenche o próximo slot vazio; clique num slot vazio primeiro o destaca pra preencher direcionado; clique num slot preenchido devolve o time pra pool.
- **Stage 3 · Swiss** — **preview bloqueado**. 4 cards com cadeado e badge "Disponível em 7 dias".
- **Playoffs** — **preview bloqueado**. 1 card wide com ícone de troféu e "Bloqueado até 18 Jun".

| Regra | Pontuação |
|---|---|
| Pick de 3 — 0 (qualificado rápido) | **8 pts** cada |
| Pick de 0 — 3 (eliminado rápido) | **4 pts** cada |
| Top 8 do Stage 3 (avança aos Playoffs) | **2 pts** cada |
| Campeão correto do Major | **40 pts** |

Os picks são persistidos em `localStorage` na chave `pickem_previsoes` (um item por usuário, indexado por e-mail). O **leaderboard** é montado a partir de `pickem_usuarios` ordenado por `pontuacao` (decrescente), com a linha do usuário logado destacada em amarelo.

## Como executar localmente

**Opção A — Abrir direto no navegador**

Basta abrir o arquivo `index.html` com duplo clique. As funcionalidades de LocalStorage funcionam normalmente.

**Opção B — Servidor local (recomendado)**

```bash
python -m http.server 8000
```

Acesse `http://localhost:8000` no navegador.

> Se algum recurso ficar em cache antigo após atualização do código, force reload com `Cmd + Shift + R` (macOS) ou `Ctrl + Shift + R` (Windows/Linux). Os scripts são versionados com `?v=N` em cada release para minimizar esse problema.

## Avaliação: dados de demonstração

Para visualizar o **Control Panel** e o **Pick'em Challenge** já populados, abra `admin.html` e clique em **"Dados de exemplo"** (canto superior direito do painel *Participantes*). O botão preenche o `localStorage` com:

- **15 usuários fictícios** com nicks no estilo CS (`zywoo_GOAT`, `s1mple_fan`, `cologne_2014`, `awp_andy`, `FalleN_BR`, `furia4ever`, `kauanzera`, etc.), pontuação distribuída entre 12 e 96 pts e data de cadastro espalhada entre hoje e 10 dias atrás
- **9 previsões de Pick'em** salvas no formato novo (`stage2_30`, `stage2_03` como arrays + `top8` e `campeao`)

Após carregar:

- **No admin** os 4 KPIs atualizam (Usuários ativos = 15 com delta `↑ N nas últimas 24h`, Picks Stage 2 = 9, Matches hoje e Reports abertos seguem como valores demo), o badge da sidebar mostra o total e a lista de participantes exibe cada usuário com logo do time favorito (18px circular)
- **No pickem** (após login com qualquer e-mail seedeado, ex.: `s1mple_fan@exemplo.com` com senha `demo1234`) o leaderboard popula top 8 ordenado por pontuação com o usuário logado destacado em amarelo

Use **"Excluir todos"** no admin para limpar e voltar ao estado vazio.

## Publicação

🔗 **[https://kauanfelipe96.github.io/projeto-web-frontend/](https://kauanfelipe96.github.io/projeto-web-frontend/)**

## Validações W3C

Todos os arquivos foram validados sem erros:

- **HTML:** [validator.w3.org](https://validator.w3.org/) — 9/9 páginas sem erros
- **CSS:** [jigsaw.w3.org/css-validator](https://jigsaw.w3.org/css-validator/) — `style.css` sem erros (warnings apenas sobre `var()` e `@import` do Google Fonts — comportamento esperado do validador)

## Integrante

**KAUAN FELIPE AVELINO DE LIMA**

## Disciplina

AS62F / ES44C / EC47C — Programação Web Front-End — Convalidação
