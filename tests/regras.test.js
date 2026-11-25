import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import {
  calcularFrequencia,
  calcularNotaNecessaria,
  validarNota,
  validarDisciplina,
  validarFaltas,
} from '../src/js/regras.js';

describe('calcularFrequencia', () => {
  test('reprova por falta quando passa de 25% (60h, 16 faltas)', () => {
    assert.equal(calcularFrequencia(60, 16).status, 'Reprovado por falta');
  });

  test('fica no limite de 25% sem faltas restantes (60h, 15 faltas)', () => {
    const resultado = calcularFrequencia(60, 15);

    assert.equal(resultado.status, 'No limite');
    assert.equal(resultado.faltasRestantes, 0);
  });

  test('mantém frequência regular, 5 faltas restantes e 83.3% de presença (60h, 10 faltas)', () => {
    assert.deepEqual(calcularFrequencia(60, 10), {
      percentualPresenca: 83.3,
      faltasRestantes: 5,
      status: 'Regular',
    });
  });
});

describe('calcularNotaNecessaria', () => {
  test('exige nota 8 na P2 para atingir média 6 com P1 igual a 4', () => {
    assert.equal(calcularNotaNecessaria(6, 4), 8);
  });

  test('reprova quando a nota necessária na P2 passa de 10 (média 6, P1 igual a 1)', () => {
    assert.equal(calcularNotaNecessaria(6, 1), 'Reprovado');
  });

  test('aprova quando a P1 já garante a média (média 5, P1 igual a 10)', () => {
    assert.equal(calcularNotaNecessaria(5, 10), 'Aprovado');
  });

  test('lança erro de nota inválida quando P1 é 11', () => {
    assert.throws(() => calcularNotaNecessaria(6, 11), {
      name: 'Error',
      message: 'Nota inválida',
    });
  });
});

describe('validarNota', () => {
  for (const nota of [-1, 11]) {
    test(`rejeita nota ${nota} por estar fora do intervalo de 0 a 10`, () => {
      assert.equal(validarNota(nota), false);
    });
  }

  for (const nota of [0, 7.5, 10]) {
    test(`aceita nota ${nota} dentro do intervalo de 0 a 10`, () => {
      assert.equal(validarNota(nota), true);
    });
  }
});

describe('validarDisciplina', () => {
  test('retorna os três erros na ordem nome, carga horária e média mínima', () => {
    assert.deepEqual(
      validarDisciplina({ nome: '  ', cargaHoraria: 0, mediaMinima: 12 }),
      [
        'Informe o nome da disciplina.',
        'A carga horária deve ser maior que zero.',
        'A média mínima deve estar entre 0 e 10.',
      ],
    );
  });

  test('não retorna erros para uma disciplina válida', () => {
    assert.deepEqual(
      validarDisciplina({ nome: 'Gerência de Configuração', cargaHoraria: 60, mediaMinima: 6 }),
      [],
    );
  });
});

describe('validarFaltas', () => {
  test('rejeita faltas negativas', () => {
    assert.equal(validarFaltas(-1, 60), false);
  });

  test('rejeita faltas acima da carga horária (61 faltas em 60h)', () => {
    assert.equal(validarFaltas(61, 60), false);
  });

  test('rejeita faltas fracionárias (2.5 faltas)', () => {
    assert.equal(validarFaltas(2.5, 60), false);
  });

  test('aceita zero faltas', () => {
    assert.equal(validarFaltas(0, 60), true);
  });

  test('aceita faltas iguais à carga horária (60 faltas em 60h)', () => {
    assert.equal(validarFaltas(60, 60), true);
  });
});
