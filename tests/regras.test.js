import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { calcularFrequencia, calcularNotaNecessaria } from '../src/js/regras.js';

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
