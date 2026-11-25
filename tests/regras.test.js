import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { calcularFrequencia } from '../src/js/regras.js';

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
