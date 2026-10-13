import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stateLabel } from './state-label.mjs';

test('stateLabel(exploring) returns Explorando', () => {
  assert.strictEqual(stateLabel('exploring'), 'Explorando');
});

test('stateLabel(implementing) returns Implementando', () => {
  assert.strictEqual(stateLabel('implementing'), 'Implementando');
});

test('stateLabel(archived) returns Cerrado', () => {
  assert.strictEqual(stateLabel('archived'), 'Cerrado');
});

test('stateLabel(unknown) throws mentioning the state', () => {
  assert.throws(
    () => stateLabel('unknown'),
    /unknown/,
  );
});
