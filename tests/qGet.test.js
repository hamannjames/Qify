import { TestScheduler } from 'jest';
import Qify from '../index.js';
import testObject from './testObject.js';

test('function add will set qGet: "number" to 3', () => {
  expect(Qify(testObject).add(1, 2, {qSet: 'number'}).qGet('number')).toBe(3);
});

test('function addAgain will get 3, add 4, and set qGet: "number" to be 7', () => {
  expect(Qify(testObject).add(1, 2, {qSet: 'number'}).addAgain(4, {qGet: 'number', qSet: 'number'}).qGet('number')).toBe(7);
});