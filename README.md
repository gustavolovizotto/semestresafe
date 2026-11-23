# SemestreSafe

Controle de faltas e simulador de aprovação universitária.
Projeto da disciplina ES46B – Gerência de Configuração e Manutenção de Software (UTFPR-CP), Operação Deploy.

[![CI/CD](https://github.com/gustavolovizotto/semestresafe/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/gustavolovizotto/semestresafe/actions/workflows/ci-cd.yml)

**Aplicação publicada:** https://gustavolovizotto.github.io/semestresafe/

> README inicial. A versão completa é tarefa da Pessoa 5.

## Como rodar

```bash
npm start   # serve a pasta src em http://localhost:3000
npm test    # roda os testes automatizados (node:test, Node 18+)
```

## Pipeline (`.github/workflows/ci-cd.yml`)

| Job | Quando roda | O que faz |
|---|---|---|
| Build | todo push/PR na `main` | confere os arquivos obrigatórios e a sintaxe do JS |
| Testes | depois do build | `npm test` |
| Entrega | push na `main`, só se build e testes passarem | copia `src/` para `dist/`, grava o commit em `versao.txt` e gera o artefato |
| Publicação | depois da entrega | publica o artefato no GitHub Pages |

Se um teste falhar, Entrega e Publicação não rodam e a versão anterior continua no ar.

## Fluxo de trabalho

1. `git checkout -b <tipo>/<assunto>` (ex.: `feat/disciplinas`)
2. Commits pequenos com mensagem clara (`feat: ...`, `test: ...`, `docs: ...`)
3. Pull Request para a `main`, revisado por outro integrante
4. Ninguém faz push direto na `main`
