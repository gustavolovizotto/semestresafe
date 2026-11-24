# Roteiro da Apresentação — Operação Deploy: SemestreSafe

- **Tempo máximo:** 12 minutos (planejado para **11 minutos**, deixando 1 minuto de folga para troca de tela e apresentador)
- **Formato:** pouco texto nos slides, foco em demonstração ao vivo e evidências reais (ter os prints salvos como plano B caso a internet oscile)

## Divisão de tempo e apresentadores

| Parte | Tema | Tempo | Apresentador |
|---|---|---|---|
| 1 | Equipe, problema e objetivo | 1 min | `[NOME]` (Pessoa 5 / eu) |
| 2 | Demonstração do app | 2 min | `[NOME]` (Pessoa 2) |
| 3 | Repositório, commits e branches | 1min30 | Gustavo Lovizotto |
| 4 | Pipeline (build, testes, CI/CD) | 2min30 | Gustavo Lovizotto |
| 5 | Falha, bloqueio e recuperação | 2 min | Gustavo Lovizotto + `[NOME]` (Pessoa 4) |
| 6 | Documento, evidências e rastreabilidade | 1 min | `[NOME]` (Pessoa 3) |
| 7 | Dificuldades, aprendizados e conclusão | 1 min | `[NOME]` (Pessoa 5 / eu) |
| **Total** | | **11 min** | |

---

## Slide 1 — SemestreSafe: equipe, problema e objetivo *(1 min — eu)*

- **Tópicos:**
  - Problema: perder o limite de 25% de faltas e calcular na mão a nota necessária na P2
  - Solução: web app simples em HTML/CSS/JS puro, publicado no GitHub Pages
  - Foco da disciplina: processo com Git, PRs, testes automatizados e deploy protegido por CI/CD
- **O que mostrar na tela:** capa com nome do projeto, disciplina (ES46B – ES61), nomes dos 5 integrantes e link/QR Code do site (`https://gustavolovizotto.github.io/semestresafe/`).

---

## Slide 2 — Demonstração do SemestreSafe *(2 min — Pessoa 2)*

- **Tópicos:**
  - Cadastro de disciplina (nome, carga horária e média mínima) salvo no `localStorage`
  - Controle de faltas com atualização automática do status (*Regular*, *No limite*, *Reprovado por falta*)
  - Simulador de nota necessária na P2 a partir da nota da P1
- **O que mostrar na tela:** **aplicação ao vivo** no navegador (`https://gustavolovizotto.github.io/semestresafe/`), fazendo um cadastro rápido, somando faltas até o limite de 25% e simulando a P2. *(Print reserva: Figura 1 — app funcionando.)*

---

## Slide 3 — Repositório, commits e branches *(1min30 — Gustavo)*

- **Tópicos:**
  - Organização do repo (`src/`, `tests/`, `.github/workflows/`, `docs/`) e contrato em `regras.js`
  - Branches por tarefa (`feat/disciplinas`, `feat/regras`, `test/regras`, `docs/readme`) + commits semânticos
  - Branch `main` protegida: tudo entra via Pull Request revisado e validado pelo CI
- **O que mostrar na tela:** **repositório no GitHub ao vivo** — aba *Commits*, gráfico de branches (*Insights > Network*) e *Pull Requests* fechados. *(Print reserva: Figura 2.)*

---

## Slide 4 — Pipeline de CI/CD *(2min30 — Gustavo)*

- **Tópicos:**
  - Fluxo em `.github/workflows/ci-cd.yml`: `Build` → `Testes` → `Entrega` → `Publicação`
  - Em PR rodam só `Build` (arquivos + `node --check`) e `Testes` (`npm test` com `node:test`)
  - Em push na `main`, gera `dist/` + `versao.txt` e faz deploy automático no GitHub Pages (*Continuous Deployment*)
- **O que mostrar na tela:** arquivo `.github/workflows/ci-cd.yml` (destacando `needs` e `if`) + aba **Actions** com o grafo de uma execução verde na `main`. *(Print reserva: Figura 3.)*

---

## Slide 5 — Simulação de falha, bloqueio e recuperação *(2 min — Gustavo + Pessoa 4)*

- **Tópicos:**
  - Falha controlada: `LIMITE_FALTAS` alterado de `0.25` para `0.50` em `regras.js`
  - Pessoa 4 mostra o teste de frequência falhando no `node:test`
  - Gustavo mostra `Entrega` e `Publicação` como *skipped* (site preservado) e tudo verde após a correção
- **O que mostrar na tela:** na aba **Actions**, abrir a execução reprovada (log do teste quebrado + jobs *skipped*) e em seguida a execução verde da correção. *(Prints reserva: Figuras 4, 5 e 6.)*

---

## Slide 6 — Documentação, evidências e rastreabilidade *(1 min — Pessoa 3)*

- **Tópicos:**
  - Rastreabilidade ponta a ponta: commit no rodapé do site (`versao.txt`) ↔ execução no Actions ↔ código na `main`
  - `README.md` atualizado com badge de status, instruções e fluxo de trabalho
  - Relatório técnico completo com prints reais e links verificáveis
- **O que mostrar na tela:** rodapé do site publicado (ou `versao.txt`) lado a lado com o mesmo hash de commit na aba *Commits*/*Actions* do GitHub, além de uma passagem rápida pelo `README.md`. *(Print reserva: Figura 7.)*

---

## Slide 7 — Dificuldades, aprendizados e conclusão *(1 min — eu)*

- **Tópicos:**
  - Principais desafios: ajuste do workflow (Actions v5 / Node 22) e integração entre branches via contrato
  - Aprendizado central: testes e CI/CD evitam que erro de regra de negócio vá para produção
  - Próximos passos: pesos diferentes nas provas, exportação de dados e testes de interface
- **O que mostrar na tela:** slide limpo com 3 bullets curtos (completar com os pontos levantados pelo grupo na Seção 11 do relatório) e link final do repositório/site para perguntas.

---

## Checklist rápido antes de apresentar

- [ ] Deixar abertas em abas separadas: site publicado, `versao.txt`, repositório no GitHub (Commits + PRs), arquivo `ci-cd.yml`, execução verde no Actions, execução com falha (`skipped`) e execução da correção.
- [ ] Ter todos os prints das Figuras 1 a 7 inseridos nos slides de backup caso a rede da sala falhe.
- [ ] Fazer um ensaio cronometrado com o grupo para garantir que fique abaixo de 12 minutos.
