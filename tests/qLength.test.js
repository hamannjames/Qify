import Qify from '../index.js';
import testObject from './testObject.js';

let Qified;

beforeEach(() => {
  jest.useFakeTimers();
  Qified = Qify(testObject);
});

test('Qified will call wait and chain two methods after, which will add one function to the method queue', () => {
  Qified.add(1,2).wait(1000).add(1,2).add(3,4);

  expect(setTimeout).toHaveBeenCalledTimes(1);
  expect(Qified.qLength()).toBe(2);
});

test('Qified will call wait and chain two methods after, which will add one function to the method queue', () => {
  Qified.add(1,2,{qSet: 'number'}).wait(1000).add(1,{qGet: 'number', qSet:'number'}).add(3,4);

  expect(setTimeout).toHaveBeenCalledTimes(1);
  expect(Qified.qLength()).toBe(2);
});