// Tela do SemestreSafe: tarefa da Pessoa 2.
// Usa só as funções de regras.js e salva no localStorage (chave "semestresafe:disciplinas").
import { validarDisciplina, validarNota, validarFaltas, calcularFrequencia, calcularNotaNecessaria } from './regras.js';

// Mostra no rodapé o commit publicado (o pipeline gera versao.txt na entrega).
fetch('versao.txt')
  .then((r) => (r.ok ? r.text() : null))
  .then((v) => { if (v) document.getElementById('versao').textContent = v.trim(); })
  .catch(() => {});
