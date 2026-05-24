# Hub IEM Cologne Major 2026

Site não-oficial de cobertura do **IEM Cologne Major 2026** — primeiro Major de CS2 de 2026 —, desenvolvido como projeto da disciplina de Programação Web Front-End. O site apresenta informações sobre o evento (calendário, times, formato, premiação e sede) e disponibiliza um sistema de **Pick'em** para fãs da comunidade, com área administrativa para gerenciar os participantes inscritos.

## Tema escolhido

O IEM Cologne Major 2026 é o primeiro Major de CS2 organizado pela Valve/ESL em 2026, realizado de **2 a 21 de junho** na **Lanxess Arena** — a *"Catedral do Counter-Strike"* em Colônia, Alemanha. O tema foi escolhido por ser um evento real em andamento, com forte apelo visual para a comunidade competitiva e conteúdo autentico para popular todas as seções do site (32 times confirmados, US$ 1.250.000 em premiação, partidas de abertura do dia 06/06).

## Tecnologias

- **HTML5** — estrutura semântica (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`)
- **CSS3 (Flexbox)** — layout, paleta de 6 cores, 2 tipografias via Google Fonts, responsividade com media query em 768 px
- **JavaScript vanilla** — DOM API + Web Storage API (LocalStorage); sem bibliotecas externas

## Estrutura do projeto

```
projeto-web-frontend/
├── index.html           # Página principal — hub do Major (hero, times, partidas, links)
├── cadastro.html        # Formulário de cadastro no Pick'em (6 campos)
├── login.html           # Login do participante
├── admin.html           # Painel administrativo — CRUD via LocalStorage
├── css/
│   └── style.css        # Estilos globais compartilhados pelas 4 páginas
├── js/
│   └── admin.js         # Lógica do painel admin (DOM API + LocalStorage)
├── assets/
│   ├── img/             # Imagens (Lanxess Arena, pôr-do-sol de Colônia)
│   └── icons/           # Ícones SVG (Heroicons — troféu, calendário, localização, etc.)
└── README.md
```

## Páginas

| Página | Descrição |
|---|---|
| `index.html` | Hub principal: seção hero com contagem regressiva, key facts do evento, cards dos times confirmados, partidas de abertura do dia 06/06 e links oficiais (ESL, Liquipedia, Twitch) |
| `cadastro.html` | Formulário de inscrição no Pick'em com 6 campos (nome, e-mail, senha, nick Steam, time favorito e data de nascimento); redireciona para `login.html` ao enviar |
| `login.html` | Tela de login com e-mail e senha; link de retorno para o cadastro |
| `admin.html` | Painel administrativo com CRUD completo: cadastrar, listar, pesquisar, excluir por item e excluir todos — dados persistidos no LocalStorage |

## Como executar localmente

**Opção A — Abrir direto no navegador**

Basta abrir o arquivo `index.html` com duplo clique. As funcionalidades de LocalStorage funcionam normalmente.

**Opção B — Servidor local (recomendado)**

```bash
python -m http.server 8000
```

Acesse `http://localhost:8000` no navegador.

## Publicação

🔗 **[https://kauanfelipe96.github.io/projeto-web-frontend/](https://kauanfelipe96.github.io/projeto-web-frontend/)**

## Validações W3C

Todos os arquivos foram validados sem erros:

- **HTML:** [validator.w3.org](https://validator.w3.org/) — 4/4 páginas sem erros
- **CSS:** [jigsaw.w3.org/css-validator](https://jigsaw.w3.org/css-validator/) — `style.css` sem erros (warnings apenas sobre `var()` e `@import` do Google Fonts — comportamento esperado do validador)

## Integrante

**KAUAN FELIPE AVELINO DE LIMA**

## Disciplina

AS62F / ES44C / EC47C — Programação Web Front-End — Convalidação
