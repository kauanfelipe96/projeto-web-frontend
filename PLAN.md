# PLANO DE EXECUÇÃO — Projeto Web Front-End

## Visão geral

**Tema:** Hub não-oficial do **IEM Cologne Major 2026** — site fictício de cobertura do Major (2–21 de junho de 2026, Lanxess Arena, Colônia, Alemanha) com sistema de Pick'em para fãs da comunidade.

**Integrante:** KAUAN FELIPE AVELINO DE LIMA
**Repositório:** https://github.com/kauanfelipe96/projeto-web-frontend
**Stack:** HTML5, CSS3 (Flexbox), JavaScript vanilla (DOM API + Web Storage API)
**Disciplina:** AS62F/ES44C/EC47C — Programação Web Front-End

**Premissa narrativa:** o site oferece informações sobre o Major (calendário, times, formato, premiação, sede) e permite que fãs se cadastrem para participar do Pick'em da comunidade. A área administrativa permite gerenciar os participantes inscritos.

**Fatos do evento a usar como conteúdo real:**
- Primeiro Major de CS2 de 2026 (chancelado pela Valve, organizado pela ESL).
- Datas: 2 a 21 de junho de 2026 (playoffs de 18 a 21/06).
- Sede: Lanxess Arena, Colônia, Alemanha — apelidada de *"Cathedral of Counter-Strike"*.
- 32 times participantes; premiação total US$ 1.250.000; campeão atual: Team Vitality.
- Formato: três Swiss Stages de 16 times + playoffs eliminatórios de 8 times.
- Partidas de abertura (06/06): GamerLegion vs NRG, B8 vs TYLOO, HEROIC vs Sharks, BetBoom vs Gaimin Gladiators, BIG vs Team Liquid, M80 vs Lynn Vision, MIBR vs THUNDERdOWNUNDER, SINNERS vs FlyQuest.

---

## Convenções

- Commits em português, padrão **Conventional Commits**, **sem assinatura** (sem `Co-authored-by`, sem rodapé "Generated with…").
- Tipos usados: `feat`, `style`, `fix`, `docs`, `chore`.
- Cada fase do plano termina com **um único commit** ao final.
- Todos os arquivos HTML e CSS devem passar nos validadores W3C (https://validator.w3.org/ e https://jigsaw.w3.org/css-validator/).
- JavaScript da página `admin.html` usa **somente** DOM API e Web Storage API — nenhuma biblioteca externa.

---

## Estrutura final do projeto

```
projeto-web-frontend/
├── index.html           # Página principal (Major hub)
├── cadastro.html        # Cadastro do Pick'em (5+ campos)
├── login.html           # Login do participante
├── admin.html           # Área administrativa (CRUD + LocalStorage)
├── css/
│   └── style.css        # Estilos globais (compartilhados pelas 4 páginas)
├── js/
│   └── admin.js         # Lógica do admin (DOM + LocalStorage)
├── assets/
│   ├── img/             # Imagens (arena, times, banner do Major)
│   └── icons/           # Ícones SVG (troféu, calendário, etc.)
├── .gitignore
├── PLAN.md              # Este arquivo
└── README.md
```

---

## Decisões de design

**Referência de design:** **HLTV.org** (https://www.hltv.org/major) — site referência da comunidade competitiva de CS desde 2002. O projeto adota a linguagem visual reconhecível do HLTV (navy + laranja, layout denso e tabular) **sem copiar pixel a pixel** — captura-se a identidade e adapta-se pro escopo das 4 páginas.

**Paleta (6 cores — atende ao mínimo de 3):**
- `#1f1f23` — navy-black profundo (background principal do site)
- `#2d3036` — grafite-azulado (cards, painéis, formulários)
- `#3a3d44` — borda/divider (separadores sutis entre seções e linhas tabulares)
- `#e4e4e4` — off-white (texto principal)
- `#a8a8a8` — cinza médio (metadados, datas, texto secundário)
- `#fa8c1d` — laranja HLTV (accent único: links, hover, botões, indicadores "ao vivo")

**Tipografia (2 fontes via Google Fonts — atende ao mínimo de 2):**
- `Inter` (humanista, neutra, alta legibilidade) — corpo de texto, formulários, labels, metadados, tabelas
- `Oswald` (condensada, geométrica) — títulos de seção, nomes de times em destaque, números do placar/contagem

**Layout:** Flexbox em todos os containers principais. Densidade alta (espaçamentos curtos, paddings reduzidos) e divisores horizontais finos (`border-bottom: 1px solid var(--cor-divider)`) separando seções e linhas — característica central do HLTV. Mobile-first com media query de quebra em `768px`.

**Justificativa estética (defesa oral):** a estética **navy + laranja + densa** é a assinatura do HLTV há mais de duas décadas e funciona porque privilegia leitura rápida de dados (placares, horários, brackets) — exatamente o que um hub de Major precisa entregar. Inter mantém leitura confortável em telas em qualquer tamanho; Oswald em peso médio cria hierarquia sem soar "gamer" demais; ícones SVG inline garantem nitidez sem dependência externa.

---

## FASE 0 — Setup do projeto

### Objetivo
Clonar o repositório, criar a estrutura inicial de pastas e versionar o plano.

### Tarefas
- [ ] Clonar `https://github.com/kauanfelipe96/projeto-web-frontend.git`
- [ ] Criar as pastas: `css/`, `js/`, `assets/img/`, `assets/icons/`
- [ ] Criar `.gitignore` (mínimo: `.DS_Store`, `Thumbs.db`, `*.log`, `node_modules/`)
- [ ] Mover este `PLAN.md` para a raiz do repositório

### Commit
```
chore: inicializa estrutura de pastas e plano do projeto
```

---

## FASE 1 — HTML semântico (4 páginas)

### Objetivo
Construir o esqueleto HTML5 das 4 páginas com tags semânticas, **sem estilo ainda**. Validar cada página no W3C HTML Validator.

### Tags semânticas obrigatórias
`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>` (quando fizer sentido), `<footer>`. **Evitar** `<div>`/`<span>` quando houver uma tag semântica adequada.

### Página `index.html` — Página Principal

- `<header>` com logo "IEM COLOGNE MAJOR 2026" e `<nav>` contendo links: **Início**, **Cadastro**, **Login**, **Admin**
- `<main>` contendo:
  - `<section id="hero">` com `<h1>`, subtítulo "Catedral do Counter-Strike — 2 a 21 de junho de 2026" e um placeholder para contagem regressiva
  - `<section id="sobre">` com 3+ caixas de texto (`<p>`) — premiação, formato, sede
  - `<section id="times">` com cards (`<article>`) de pelo menos 3 times (Team Vitality, MIBR, NAVI, FaZe Clan, The MongolZ)
  - `<section id="partidas">` com `<ul>` listando confrontos do dia 06/06
  - **2+ ícones SVG inline** (troféu, calendário, localização)
  - **3+ imagens** com `alt` descritivo (Lanxess Arena, logo do Major, banner com times)
  - **3+ links externos** (ESL oficial, página do Major no Liquipedia/HLTV, Twitch ESL_CSGO)
- `<footer>` com:
  - Link para currículo (LinkedIn)
  - Link para o repositório no GitHub
  - Texto de copyright

### Página `cadastro.html` — Cadastro do Pick'em

- Mesmo `<header>` e `<footer>` do index
- `<main>` com `<h1>` "Cadastro no Pick'em"
- `<form action="login.html" method="get">` com **mínimo 5 campos**:
  1. Nome completo — `<input type="text" required>`
  2. E-mail — `<input type="email" required>`
  3. Senha — `<input type="password" required>`
  4. Nick no Steam — `<input type="text" required>`
  5. Time favorito — `<select>` com pelo menos 8 opções (Vitality, MIBR, NAVI, FaZe, G2, The MongolZ, Liquid, FURIA, Spirit, etc.)
  6. Data de nascimento — `<input type="date">` *(6º campo, opcional)*
- Botão `<button type="submit">Cadastrar</button>` — ao enviar, redireciona para `login.html` (via `action` do form)

### Página `login.html` — Login

- Mesmo `<header>` e `<footer>`
- `<main>` com `<h1>` "Entrar"
- `<form>` com 2 campos (e-mail, senha) e botão "Entrar"
- Link "Ainda não tem conta? Cadastre-se" apontando para `cadastro.html`

### Página `admin.html` — Estrutura (a lógica JS vem na Fase 4)

- Mesmo `<header>` e `<footer>`
- `<main>` com `<h1>` "Painel Administrativo — Pick'em IEM Cologne"
- `<form id="form-admin">`:
  - `<input id="input-nome" name="nome" type="text" required>` (Nome do usuário)
  - `<input id="input-email" name="email" type="email" required>` (E-mail)
  - `<button id="btn-cadastrar" type="submit">Cadastrar</button>`
  - `<button id="btn-limpar" type="button">Limpar campos</button>`
- Área de controles da lista:
  - `<input id="busca" type="search" placeholder="Pesquisar por nome ou e-mail...">`
  - `<button id="btn-limpar-tudo" type="button">Excluir todos</button>`
- `<ul id="lista-usuarios">` (vazia inicialmente, populada via JS)

### Validação
Validar cada um dos 4 arquivos `.html` em https://validator.w3.org/ (aba "Validate by Direct Input"). Corrigir todos os erros (warnings podem ser avaliados caso a caso).

### Commit
```
feat: adiciona estrutura html semântica das quatro páginas
```

---

## FASE 2 — CSS com Flexbox e identidade visual

### Objetivo
Aplicar paleta, tipografia e construir todos os layouts com **Flexbox** (uso explícito de `display: flex`, `justify-content`, `align-items`, `flex-direction`, `flex-wrap`, `gap`). Validar no W3C CSS Validator.

### Setup global (`css/style.css`)

- Importar Google Fonts no topo: `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Oswald:wght@500;600;700&display=swap');`
- Variáveis CSS na raiz (`:root`) para as 6 cores e as 2 fontes:
  ```css
  :root {
    --cor-navy: #1f1f23;
    --cor-grafite: #2d3036;
    --cor-divider: #3a3d44;
    --cor-off-white: #e4e4e4;
    --cor-cinza-medio: #a8a8a8;
    --cor-laranja: #fa8c1d;
    --fonte-corpo: 'Inter', sans-serif;
    --fonte-titulo: 'Oswald', sans-serif;
  }
  ```
- Reset básico: `* { margin: 0; padding: 0; box-sizing: border-box; }`
- `body`: fundo `--cor-preto`, cor `--cor-off-white`, fonte `--fonte-corpo`, `min-height: 100vh`

### Header (Flexbox)

```css
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 2rem;
  background: var(--cor-grafite);
  border-bottom: 1px solid var(--cor-divider);
}
header nav ul {
  display: flex;
  gap: 1.5rem;
  list-style: none;
}
header nav a {
  color: var(--cor-off-white);
  text-decoration: none;
  font-weight: 500;
  text-transform: uppercase;
  font-size: 0.85rem;
  letter-spacing: 0.05em;
}
header nav a:hover { color: var(--cor-laranja); }
```
- Logo à esquerda em Oswald 600, cor laranja HLTV (`var(--cor-laranja)`)
- Itens da nav em caixa-alta, pequenos (~13–14px), estilo barra de navegação utilitária
- Item "Admin" com a cor laranja sempre ativa (destaque permanente, sugerindo "área restrita")

### Footer (Flexbox)

```css
footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
}
```

### Página principal

- **Hero:** `display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 50vh;` — fundo navy sólido com imagem do Lanxess Arena ao fundo + overlay escuro 70%. Título grande em Oswald (caixa-alta), subtítulo "Catedral do Counter-Strike — 2 a 21 de junho de 2026" e bloco de contagem regressiva placeholder em Inter.
- **Seção "key facts":** 3 blocos lado a lado (`display: flex; gap: 1rem; justify-content: space-between;`) — **Premiação** (US$ 1.250.000), **Formato** (3 Swiss + Playoffs), **Sede** (Lanxess Arena, Colônia). Cada bloco com ícone SVG no topo, valor em destaque (Oswald grande) e descrição abaixo. Esse padrão imita o cabeçalho de páginas de evento no HLTV.
- **Seção "times confirmados":** `display: flex; flex-wrap: wrap; gap: 0.5rem;` — cards **compactos** (largura fixa ~180px, padding reduzido), borda fina `1px solid var(--cor-divider)`, hover muda a borda para laranja. Cada card: logo do time centralizado, nome (Oswald), país/região (Inter pequeno cinza-médio). Densidade alta — vários cards visíveis sem rolagem, como no HLTV.
- **Seção "partidas de abertura" (estilo tabela HLTV):** lista vertical de linhas horizontais. Cada `<article>` é uma linha com `display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1rem; border-bottom: 1px solid var(--cor-divider);`. Estrutura da linha: **logo+nome do time A** à esquerda — **horário/data em laranja** no centro — **logo+nome do time B** à direita. Linhas alternadas com leve diferença de background (`:nth-child(odd)`) para reforçar a leitura tabular.

### Formulários (cadastro, login, admin)

```css
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 480px;
  margin: 2rem auto;
  padding: 1.5rem;
  background: var(--cor-grafite);
  border: 1px solid var(--cor-divider);
}
form label {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.8rem;
  color: var(--cor-cinza-medio);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
form input, form select {
  padding: 0.6rem 0.75rem;
  background: var(--cor-navy);
  border: 1px solid var(--cor-divider);
  color: var(--cor-off-white);
  font-family: var(--fonte-corpo);
}
form input:focus, form select:focus {
  border-color: var(--cor-laranja);
  outline: none;
}
form button {
  padding: 0.75rem 1.5rem;
  background: var(--cor-laranja);
  color: var(--cor-navy);
  border: none;
  font-family: var(--fonte-titulo);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: filter 0.2s ease;
}
form button:hover { filter: brightness(1.1); }
```
- Labels em caixa-alta pequenina, estilo HLTV (etiqueta acima do input)
- Inputs com fundo navy mais escuro (afundado no card grafite) — efeito visual de "campo de dado"
- Botão principal laranja sólido com texto navy escuro — alto contraste, identidade HLTV inconfundível

### Responsividade

```css
@media (max-width: 768px) {
  header { flex-direction: column; gap: 0.75rem; padding: 0.75rem 1rem; }
  header nav ul { flex-wrap: wrap; justify-content: center; gap: 1rem; }
  #hero h1 { font-size: 1.75rem; }
  /* "key facts" empilha em mobile */
  #sobre { flex-direction: column; }
  /* cards de times já empilham via flex-wrap */
  /* linhas de partida: empilhar time A / horário / time B */
  #partidas > article {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
}
```

### Validação
Validar `css/style.css` em https://jigsaw.w3.org/css-validator/. Aceitar warnings apenas se forem relacionados a vendor prefixes ou Google Fonts.

### Commit
```
style: aplica layout flexbox, paleta e tipografia em todas as páginas
```

---

## FASE 3 — Conteúdo visual (imagens, ícones, currículo)

### Objetivo
Adicionar todas as imagens, ícones SVG e o link de currículo no rodapé.

### Tarefas

- [ ] Adicionar **3+ imagens** em `assets/img/`:
  - `lanxess-arena.jpg` (a "Catedral")
  - `iem-cologne-logo.png` (logo do Major)
  - `teams-banner.jpg` (banner com times confirmados)
- [ ] Adicionar **2+ ícones SVG** em `assets/icons/` (ou inline no HTML):
  - troféu, calendário, localização, partida (escolher 2+)
  - Fonte sugerida: Heroicons (https://heroicons.com) ou Tabler Icons (https://tabler-icons.io) — baixar SVG, copiar inline
- [ ] Garantir `alt` descritivo em **todas** as imagens
- [ ] Inserir o link do currículo no `<footer>` do `index.html`:
  ```html
  <a href="https://www.linkedin.com/in/kauan-felipe-fullstack/" target="_blank" rel="noopener">Currículo (LinkedIn)</a>
  ```

### Commit
```
feat: adiciona imagens, ícones e link de currículo no rodapé
```

---

## FASE 4 — JavaScript do Admin (DOM + LocalStorage)

### Objetivo
Implementar todas as funcionalidades exigidas em `js/admin.js`, usando **somente** DOM API e Web Storage API. **Nenhuma biblioteca externa.**

### Estrutura do dado no LocalStorage

- Chave: `"pickem_usuarios"`
- Valor: `JSON.stringify(array)` onde cada item é:
  ```json
  { "id": 1717000000000, "nome": "...", "email": "...", "data": "24/05/2026 19:30" }
  ```

### Vincular o script
No `admin.html`, antes do `</body>`:
```html
<script src="js/admin.js"></script>
```

### Funcionalidades a implementar

**1. Cadastrar usuário** *(rubrica 1,5)*
- Listener `submit` no `#form-admin`
- `e.preventDefault()`
- Capturar `nome` e `email`, validar não-vazios (`trim()`)
- Criar objeto com `id` (`Date.now()`), `nome`, `email`, `data` (`new Date().toLocaleString('pt-BR')`)
- Recuperar array do LocalStorage (`JSON.parse(localStorage.getItem('pickem_usuarios')) || []`), `push`, salvar de volta
- Renderizar `<li>` na `<ul id="lista-usuarios">` via `document.createElement` (NUNCA `innerHTML` com dado do usuário)
- Limpar o formulário ao final (`form.reset()`)

**2. Renderizar lista ao carregar a página**
- Listener `DOMContentLoaded`
- Ler LocalStorage, iterar e criar os `<li>`

**3. Excluir um item** *(rubrica 1,0)*
- Cada `<li>` recebe um botão "Excluir" criado via `createElement`
- Click → `confirm('Excluir este usuário?')` → remover do array no LocalStorage **e** do DOM
- Identificar pelo `id` (timestamp), não pelo índice

**4. Excluir todos** *(rubrica 0,5)*
- Botão `#btn-limpar-tudo`
- `confirm('Excluir todos os usuários cadastrados?')` → `localStorage.removeItem('pickem_usuarios')` → limpar `<ul>` (`while (lista.firstChild) lista.removeChild(lista.firstChild)`)

**5. Pesquisar** *(rubrica 1,0)*
- Listener `input` no campo `#busca`
- Filtrar `<li>` por `nome` OU `email` (`toLowerCase().includes(termo)`)
- Itens que não batem: `li.style.display = 'none'`; itens que batem: `li.style.display = ''`

**6. Limpar campos do formulário** *(rubrica 0,5)*
- Botão `#btn-limpar` (type="button") → `form.reset()`

### Boas práticas obrigatórias
- **Não usar** jQuery, frameworks ou qualquer lib externa.
- **Não usar** `innerHTML` com strings construídas a partir de input do usuário (vetor de XSS).
- Preferir `textContent` e `appendChild`.
- Organizar o código em funções nomeadas (`cadastrarUsuario`, `renderizarLista`, `excluirUsuario`, `limparTodos`, `pesquisar`, `limparFormulario`).

### Commit
```
feat: implementa crud do admin com dom e localstorage
```

---

## FASE 5 — Validações finais e ajustes

### Objetivo
Garantir que todos os arquivos passam nos validadores W3C e que o site funciona em diferentes tamanhos de tela.

### Tarefas
- [ ] Rodar **cada** HTML em https://validator.w3.org/ — corrigir erros
- [ ] Rodar `css/style.css` em https://jigsaw.w3.org/css-validator/ — corrigir erros
- [ ] Testar no DevTools nos breakpoints: 360px (mobile), 768px (tablet), 1280px (desktop)
- [ ] Testar manualmente todas as funções do admin:
  - Cadastrar 3 usuários
  - Recarregar a página → lista persiste
  - Pesquisar por trecho do nome
  - Pesquisar por trecho do e-mail
  - Excluir 1 usuário
  - Excluir todos
  - Limpar campos do formulário
- [ ] Verificar consistência visual entre as 4 páginas (header/footer idênticos, mesmas cores e fontes)

### Commit (só se houver correções)
```
fix: ajustes de validação w3c e responsividade
```

---

## FASE 6 — README e documentação

### Objetivo
Documentar o projeto no `README.md` da raiz, conforme o critério (0,5 ponto).

### Conteúdo do README

1. **Título** — "Hub IEM Cologne Major 2026"
2. **Descrição** — site de cobertura do primeiro CS2 Major de 2026, com sistema de Pick'em e área administrativa para gerenciar participantes
3. **Tema escolhido** — breve justificativa do tema (Major real acontecendo em junho/2026, cenário competitivo de CS2)
4. **Tecnologias** — HTML5, CSS3 (Flexbox), JavaScript vanilla (DOM API + Web Storage API)
5. **Estrutura do projeto** — árvore de arquivos com explicação rápida de cada pasta/arquivo
6. **Páginas** — descrição curta de cada uma das 4 páginas (index, cadastro, login, admin)
7. **Como executar localmente**:
   - Opção A: abrir `index.html` direto no navegador
   - Opção B: `python -m http.server 8000` na raiz e abrir `http://localhost:8000`
8. **Link da publicação (GitHub Pages)** — preenchido na Fase 7
9. **Validações W3C** — links dos validadores e confirmação de que o projeto passa em ambos
10. **Integrante** — KAUAN FELIPE AVELINO DE LIMA
11. **Disciplina** — AS62F/ES44C/EC47C — Programação Web Front-End — Convalidação

### Commit
```
docs: adiciona readme completo com descrição e estrutura
```

---

## FASE 7 — Publicação no GitHub Pages

### Objetivo
Publicar o site e linkar no README (critério 0,5 ponto).

### Tarefas
- [ ] `git push origin main` (garantir que todos os commits anteriores foram pushados)
- [ ] No GitHub web: `Settings` → `Pages` → Source: **Deploy from a branch** → Branch: `main` → Pasta: `/ (root)` → **Save**
- [ ] Aguardar ~1 minuto e abrir `https://kauanfelipe96.github.io/projeto-web-frontend/`
- [ ] Verificar se as 4 páginas, CSS, imagens e o JS do admin funcionam no ambiente publicado (atenção a caminhos relativos: `css/style.css`, **não** `/css/style.css`)
- [ ] Atualizar o README substituindo o placeholder pelo link público

### Commit
```
docs: adiciona link do github pages no readme
```

---

## Checklist final (rubrica de avaliação)

| Critério | Pontos | Onde é cumprido |
|---|---|---|
| HTML+CSS adequados — página principal, com tags semânticas | 1,5 | Fases 1, 2 |
| HTML+CSS adequados — página de cadastro, com tags semânticas | 1,5 | Fases 1, 2 |
| Flexbox para organização, alinhamento e responsividade | 1,0 | Fase 2 |
| Publicação no GitHub Pages | 0,5 | Fase 7 |
| README do repositório bem documentado | 0,5 | Fase 6 |
| Currículo via link no rodapé da página principal | 0,5 | Fase 3 |
| JS — incluir dados do form em lista e no LocalStorage | 1,5 | Fase 4 |
| JS — excluir um item da lista e do LocalStorage | 1,0 | Fase 4 |
| JS — excluir todos os itens | 0,5 | Fase 4 |
| JS — pesquisar um campo do formulário | 1,0 | Fase 4 |
| JS — limpar os campos do formulário | 0,5 | Fase 4 |
| **TOTAL** | **10,0** | |

---

## Tópicos para a defesa oral (presencial)

- **Estrutura HTML:** uso de `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>` para SEO, acessibilidade e legibilidade do código.
- **Flexbox:** principais propriedades aplicadas (`display: flex`, `justify-content`, `align-items`, `flex-direction`, `flex-wrap`, `gap`) e justificativa de tê-lo escolhido em vez de `float`/`inline-block` (Flexbox é unidimensional, lida nativamente com alinhamento em dois eixos, tem suporte universal e simplifica responsividade com `flex-wrap`).
- **Local Storage:** API síncrona key/value, armazena apenas strings, persiste entre sessões e abas da mesma origem, limite típico de 5–10 MB. Por isso o array de usuários é serializado com `JSON.stringify` ao salvar e desserializado com `JSON.parse` ao ler.
- **Decisões visuais:** referência direta ao **HLTV.org** (https://www.hltv.org/major), site da comunidade competitiva de CS desde 2002 — paleta navy + laranja, layout denso e tabular, tipografia utilitária. A escolha conecta o projeto ao "look and feel" reconhecido pela comunidade do jogo e justifica densidade alta de informação (cards compactos, linhas tabulares de partida) em vez de cards inflados com muito espaço em branco. Fontes: Inter (corpo, neutralidade) e Oswald (títulos, ênfase de hierarquia). Ícones em SVG inline para nitidez sem dependência externa.
- **Por que IEM Cologne Major 2026:** primeiro Major de CS2 de 2026 (2 a 21/06), realizado na Lanxess Arena, apelidada de "Catedral do Counter-Strike"; 32 times, premiação de US$ 1.250.000, campeão atual Team Vitality. Tema com forte apelo visual, comunidade ativa e conteúdo real para popular as páginas.
- **Segurança básica do JS:** uso de `textContent` em vez de `innerHTML` ao renderizar dados do usuário para evitar XSS — boa prática mesmo em projeto local.
