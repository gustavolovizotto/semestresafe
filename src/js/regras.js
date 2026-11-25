// Regras de negócio do SemestreSafe: tarefa da Pessoa 3.
// Funções puras (sem document/window/localStorage). Os nomes e retornos são o
// contrato do grupo: a tela (app.js) e os testes dependem deles.

/** Limite de faltas: 25% da carga horária. Use esta constante no cálculo. */
export const LIMITE_FALTAS = 0.50;

/** true se o valor é do tipo number e não é NaN. */
const ehNumero = (valor) => typeof valor === 'number' && !Number.isNaN(valor);

/** Arredonda para 1 casa decimal (ex.: 83.333 → 83.3). */
const arredondar1 = (valor) => Math.round(valor * 10) / 10;

/** true se n é número entre 0 e 10. */
export function validarNota(n) {
  return ehNumero(n) && n >= 0 && n <= 10;
}

/** true se faltas é inteiro, >= 0 e <= cargaHoraria. */
export function validarFaltas(faltas, cargaHoraria) {
  return Number.isInteger(faltas) && faltas >= 0 && faltas <= cargaHoraria;
}

/**
 * Lista de mensagens de erro (vazia = válida):
 * "Informe o nome da disciplina." | "A carga horária deve ser maior que zero." |
 * "A média mínima deve estar entre 0 e 10."
 */
export function validarDisciplina({ nome, cargaHoraria, mediaMinima }) {
  const erros = [];

  if (typeof nome !== 'string' || nome.trim() === '') {
    erros.push('Informe o nome da disciplina.');
  }
  if (!ehNumero(cargaHoraria) || cargaHoraria <= 0) {
    erros.push('A carga horária deve ser maior que zero.');
  }
  if (!ehNumero(mediaMinima) || mediaMinima < 0 || mediaMinima > 10) {
    erros.push('A média mínima deve estar entre 0 e 10.');
  }

  return erros;
}

/**
 * { percentualPresenca, faltasRestantes, status }
 * maxFaltas = Math.floor(cargaHoraria * LIMITE_FALTAS)
 * status: faltas > max → "Reprovado por falta"; faltas === max → "No limite"; senão "Regular"
 * Carga horária <= 0 ou faltas inválidas → throw new Error("Dados de frequência inválidos").
 */
export function calcularFrequencia(cargaHoraria, faltas) {
  if (!ehNumero(cargaHoraria) || cargaHoraria <= 0 || !validarFaltas(faltas, cargaHoraria)) {
    throw new Error('Dados de frequência inválidos');
  }

  const maxFaltas = Math.floor(cargaHoraria * LIMITE_FALTAS);
  const percentualPresenca = arredondar1(((cargaHoraria - faltas) / cargaHoraria) * 100);
  const faltasRestantes = Math.max(0, maxFaltas - faltas);

  let status = 'Regular';
  if (faltas > maxFaltas) {
    status = 'Reprovado por falta';
  } else if (faltas === maxFaltas) {
    status = 'No limite';
  }

  return { percentualPresenca, faltasRestantes, status };
}

/**
 * P2 necessária = 2 * mediaMinima - p1 (1 casa decimal).
 * <= 0 → "Aprovado"; > 10 → "Reprovado"; p1 ou mediaMinima inválida → throw new Error("Nota inválida").
 */
export function calcularNotaNecessaria(mediaMinima, p1) {
  if (!validarNota(mediaMinima) || !validarNota(p1)) {
    throw new Error('Nota inválida');
  }

  const necessaria = arredondar1(2 * mediaMinima - p1);

  if (necessaria <= 0) return 'Aprovado';
  if (necessaria > 10) return 'Reprovado';
  return necessaria;
}
