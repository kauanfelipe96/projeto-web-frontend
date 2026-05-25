# Hub IEM Cologne Major 2026

Site não-oficial de cobertura do **IEM Cologne Major 2026** — primeiro Major de CS2 de 2026 —, desenvolvido como projeto da disciplina de Programação Web Front-End. O site apresenta informações sobre o evento (calendário completo de partidas, brackets dos playoffs, times participantes por tier, sede e premiação) e disponibiliza um sistema de **Pick'em** com autenticação por sessão, no qual cada usuário cadastrado salva suas previsões para a fase de abertura e o campeão. A área administrativa permite gerenciar os participantes inscritos com KPIs em tempo real.

## Tema escolhido

O IEM Cologne Major 2026 é o primeiro Major de CS2 organizado pela Valve/ESL em 2026, realizado de **2 a 21 de junho** na **Lanxess Arena** — a *"Catedral do Counter-Strike"* em Colônia, Alemanha. O tema foi escolhido por ser um evento real em andamento, com forte apelo visual para a comunidade competitiva e conteúdo autentico para popular todas as seções do site (32 times confirmados, US$ 1.250.000 em premiação, partidas de abertura do dia 06/06).

## Tecnologias

- **HTML5** — estrutura semântica (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`)
- **CSS3 (Flexbox + Grid)** — layout, paleta inspirada no HLTV, 3 tipografias via Google Fonts (`Inter`, `Barlow Condensed`, `JetBrains Mono`), responsividade com breakpoints em 1024 px / 768 px / 480 px
- **JavaScript vanilla** — DOM API + Web Storage API (LocalStorage para persistência, SessionStorage para autenticação); sem bibliotecas externas

## Estrutura do projeto

```
projeto-web-frontend/
├── index.html           # Overview — hub do Major (hero, key facts, próximas partidas, times)
├── matches.html         # Calendário completo de partidas por fase e dia
├── main-event.html      # Prize pool, brackets dos playoffs e schedule oficial
├── teams.html           # Times participantes agrupados por tier (Legends/Challengers/Contenders)
├── venue.html           # Guia da Lanxess Arena (localização, transporte, dicas)
├── pickem.html          # Pick'em — formulário de previsões com autenticação por sessão
├── cadastro.html        # Cadastro no Pick'em (6 campos)
├── login.html           # Login do participante
├── admin.html           # Painel administrativo — CRUD via LocalStorage + KPIs
├── css/
│   └── style.css        # Estilos globais (paleta, tipografia e componentes)
├── js/
│   ├── site.js          # Nav e footer compartilhados em todas as páginas
│   ├── auth.js          # Detecta sessão ativa e troca o CTA de login pelo nome do usuário
│   ├── cadastro.js      # Salva o usuário no LocalStorage e redireciona pro login
│   ├── login.js         # Autentica contra o LocalStorage e cria sessão
│   ├── pickem.js        # Lê sessão, salva e renderiza as previsões do usuário
│   └── admin.js         # CRUD, busca, KPIs e botão de dados de exemplo
├── assets/
│   ├── img/             # Lanxess Arena, Catedral de Colônia e logos dos 16 times
│   └── icons/           # Ícones SVG (Heroicons — troféu, calendário, localização, etc.)
└── README.md
```

## Páginas

| Página | Descrição |
|---|---|
| `index.html` | Overview do Major: hero com contagem regressiva, key facts (premiação, formato, sede), próximas partidas e cards dos 16 times confirmados |
| `matches.html` | Calendário completo de partidas agrupado por dia, com filtros por stage e status, busca por time/mapa e linhas no estilo HLTV |
| `main-event.html` | Distribuição do prize pool de US$ 1.250.000, chaveamento dos playoffs (Quartas → Final) e schedule oficial dia a dia |
| `teams.html` | Times participantes organizados por tier (Legends, Challengers, Contenders) com filtros por região, roster, ranking e estatísticas de Swiss |
| `venue.html` | Guia da Lanxess Arena: capacidade, histórico, transporte público de Colônia, onde ficar/comer e dicas para o evento |
| `pickem.html` | Pick'em da comunidade: seleção das 8 partidas de abertura + escolha do campeão, salvos no LocalStorage por sessão de usuário |
| `cadastro.html` | Formulário de inscrição com 6 campos (nome, e-mail, senha, nick Steam, time favorito e data de nascimento); redireciona para `login.html` |
| `login.html` | Autenticação contra usuários do LocalStorage; sessão guardada no `sessionStorage` |
| `admin.html` | Painel administrativo com CRUD completo (cadastrar, listar, pesquisar, excluir individual e em massa), 3 cards de KPIs (total, com Pick'em, cadastros do dia) e botão **Dados de exemplo** para popular o painel com usuários fictícios |

## Como executar localmente

**Opção A — Abrir direto no navegador**

Basta abrir o arquivo `index.html` com duplo clique. As funcionalidades de LocalStorage funcionam normalmente.

**Opção B — Servidor local (recomendado)**

```bash
python -m http.server 8000
```

Acesse `http://localhost:8000` no navegador.

## Avaliação: dados de demonstração

Para visualizar o painel admin já populado, abra `admin.html` e clique em **"Dados de exemplo"** (canto superior direito do painel *Participantes*). O botão preenche o LocalStorage com:

- **15 usuários fictícios** distribuídos ao longo dos últimos dias (5 cadastrados hoje, demais espalhados em 1–10 dias atrás)
- **9 previsões de Pick'em** salvas, com cada palpiteiro escolhendo as 8 partidas de abertura e um campeão

Os 3 KPIs (`Total`, `Com Pick'em`, `Cadastros hoje`) atualizam automaticamente, e a lista de participantes mostra o logo do time favorito de cada usuário. Use **"Excluir todos"** para limpar e voltar ao estado vazio.

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
