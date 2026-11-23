// Garante que regras.js expõe o contrato combinado pelo grupo.
// Os testes de comportamento ficam em regras.test.js (Pessoa 4).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as regras from '../src/js/regras.js';

const funcoes = ['validarNota', 'validarFaltas', 'validarDisciplina', 'calcularFrequencia', 'calcularNotaNecessaria'];

for (const nome of funcoes) {
  test(`regras.js exporta a função ${nome}`, () => {
    assert.equal(typeof regras[nome], 'function');
  });
}

test('regras.js exporta LIMITE_FALTAS como número', () => {
  assert.equal(typeof regras.LIMITE_FALTAS, 'number');
});
