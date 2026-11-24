# SemestreSafe

Controle de faltas e simulador de aprovação universitária.  
Projeto da disciplina **ES46B – Gerência de Configuração e Manutenção de Software** (turma **ES61**, UTFPR – Câmpus Cornélio Procópio), atividade **Operação Deploy**.

[![CI/CD](https://github.com/gustavolovizotto/semestresafe/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/gustavolovizotto/semestresafe/actions/workflows/ci-cd.yml)

**Aplicação publicada:** https://gustavolovizotto.github.io/semestresafe/

## Objetivo e problema que resolve

Durante o semestre, é comum o estudante perder a conta de quantas faltas já acumulou em cada disciplina e acabar ultrapassando o limite de 25% exigido para aprovação por frequência. Também é frequente precisar calcular na mão qual nota será necessária na segunda prova (P2) depois de receber o resultado da primeira (P1).

O **SemestreSafe** resolve isso em uma página simples, sem cadastro nem instalação: o aluno registra suas disciplinas (nome, carga horária e média mínima), acompanha o percentual de presença e quantas faltas ainda restam dentro do limite de 25%, e simula a nota necessária na P2.

No contexto da disciplina, o principal objetivo do projeto é aplicar na prática um fluxo de Gerência de Configuração e CI/CD: trabalho em branches, revisão por Pull Request, testes automatizados e publicação automática bloqueada sempre que algum teste falhar.

## Integrantes

| Integrante | Responsabilidade principal |
|---|---|
| Gustavo Tesin | Configuração do repositório, pipeline de CI/CD, GitHub Pages e demonstração de falha |
| João Vitor Romani | Interface web (`src/index.html`, `src/css/style.css` e `src/js/app.js`) |
| Felipe Gomes | Regras de negócio (`src/js/regras.js`) |
| Samuel Ueno | Testes automatizados (`tests/`) |
| João Vitor Trindade | Documentação (`README.md`, relatório técnico e roteiro da apresentação) |

> Além da responsabilidade principal, todos os integrantes participam da revisão de Pull Requests e da validação das entregas.

## Tecnologias utilizadas

- **HTML5, CSS3 e JavaScript puro (ES Modules):** interface e regras de negócio sem frameworks nem etapa de empacotamento.
- **localStorage:** persistência dos dados das disciplinas no próprio navegador (chave `semestresafe:disciplinas`).
- **Node.js (18+ local / 22 no CI):** execução dos testes automatizados e do servidor local.
- **`node:test` e `node:assert/strict`:** suíte de testes nativa do Node.js, sem dependências externas.
- **Git e GitHub:** versionamento com branches por tarefa, Pull Requests e proteção da branch `main`.
- **GitHub Actions:** pipeline de integração contínua, geração do artefato e deploy.
- **GitHub Pages:** hospedagem estática da aplicação.

## Como executar

### Pelo site publicado

Acesse diretamente: https://gustavolovizotto.github.io/semestresafe/

### Localmente

Pré-requisito: **Node.js 18 ou superior**.

```bash
git clone https://github.com/gustavolovizotto/semestresafe.git
cd semestresafe
npm start
```

O comando `npm start` executa `npx serve src` e disponibiliza a aplicação em `http://localhost:3000`.

## Como rodar os testes

```bash
npm test
```

O comando executa `node --test`, rodando todos os arquivos de teste dentro da pasta `tests/`. Não é necessário instalar pacotes com `npm install`, pois o projeto usa apenas módulos nativos do Node.js.

## Pipeline (`.github/workflows/ci-cd.yml`)

O pipeline é disparado em `push` e `pull_request` para a branch `main`, além de poder ser executado manualmente via `workflow_dispatch`.

| Job | Quando roda | O que faz |
|---|---|---|
| Build | todo push/PR na `main` | confere os arquivos obrigatórios e a sintaxe do JS |
| Testes | depois do build | `npm test` |
| Entrega | push na `main`, só se build e testes passarem | copia `src/` para `dist/`, grava o commit em `versao.txt` e gera o artefato |
| Publicação | depois da entrega | publica o artefato no GitHub Pages |

### Como funciona a entrega e a publicação

1. **Verificação (CI):** em qualquer `push` ou `pull_request` para a `main`, o job `build` confere se os arquivos obrigatórios existem (`src/index.html`, `src/css/style.css`, `src/js/app.js`, `src/js/regras.js` e `package.json`) e valida a sintaxe de todos os arquivos `.js` com `node --check`. Em seguida, o job `test` executa `npm test`.
2. **Bloqueio em caso de falha:** o job `entrega` depende explicitamente de `build` e `test` (`needs: [build, test]`) e só roda fora de Pull Requests (`if: github.event_name != 'pull_request'`). Se qualquer verificação ou teste falhar, **Entrega e Publicação não rodam** (ficam marcadas como *skipped*) e a versão anterior continua no ar no GitHub Pages.
3. **Artefato e rastreabilidade (CD):** quando os testes passam em um `push` na `main`, o job `entrega` copia `src/` para `dist/`, grava os 7 primeiros caracteres do hash do commit junto com a data UTC em `dist/versao.txt` e envia o artefato via `actions/upload-pages-artifact`. O job `publicacao` faz o deploy no GitHub Pages com `actions/deploy-pages`.
4. **Conferência no site:** o script `src/js/app.js` lê `versao.txt` e exibe o commit publicado no rodapé da página, permitindo conferir exatamente qual versão do repositório está no ar.

## Limitações conhecidas

- **Dados apenas no navegador:** as disciplinas são salvas no `localStorage`. Se o usuário limpar os dados do navegador ou acessar de outro dispositivo, os registros não são sincronizados.
- **Sem autenticação ou backend:** não há login, contas de usuário nem banco de dados remoto.
- **Simulador simplificado:** o cálculo de nota considera apenas duas avaliações (P1 e P2) com o mesmo peso (`2 * mediaMinima - p1`), sem suporte a pesos diferentes ou exame final.

## Fluxo de trabalho

1. Crie uma branch a partir da `main` seguindo o padrão `<tipo>/<assunto>` (ex.: `feat/disciplinas`, `feat/regras`, `test/regras`, `docs/readme`):
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feat/minha-tarefa
   ```
2. Faça commits pequenos e claros em português (`feat:`, `fix:`, `test:`, `docs:`, `ci:`, `style:`, `chore:`).
3. Envie a branch e abra um Pull Request para a `main`.
4. Aguarde o pipeline de CI (`Build` e `Testes`) passar e a revisão de outro integrante antes do merge.
5. Ninguém faz `push` direto na `main` (branch protegida).
