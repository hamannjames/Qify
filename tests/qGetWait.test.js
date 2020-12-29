import Qify from '../index.js';
import testObject from './testObject.js';

beforeEach(() => {
  jest.useFakeTimers();
});

test('Qified will sum 1, and 2, set qQet to 3, then add 4 and set qGet to 7. Qified will wait for 1000 milliseconds, and qGet will remain 3 during that time. Qified will add 3 and set qGet to 10. ', () => {
  const Qified = Qify(testObject);

  Qified.add(1, 2, {qSet: 'number'}).addAgain(4, {qGet: 'number', qSet: 'number'});
  
  expect(Qified.qGet('number')).toBe(7);

  Qified.wait(1000).addAgain(3, {qGet: 'number', qSet: 'number'});

  expect(Qified.qLength()).toBe(1);
  expect(Qified.qGet('number')).toBe(7);
  expect(setTimeout).toHaveBeenCalledTimes(1);
  expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 1000);

  jest.advanceTimersByTime(1000);

  expect(Qified.qGet('number')).toBe(10);
});

test('Qified will sum 1, and 2, set qQet to 3. Qified will wait 1000 milliseconds then add 4 and qGet, setting it to 7. Qified will wait 1000 more milliseconds and add 3 and qGet, setting it to 10', () => {
  const Qified = Qify(testObject);

  Qified.add(1, 2, {qSet: 'number'});
  
  expect(Qified.qGet('number')).toBe(3);

  Qified.wait(1000).addAgain(4, {qGet: 'number', qSet: 'number'}).wait(1000).addAgain(3, {qGet: 'number', qSet: 'number'});

  expect(Qified.qGet('number')).toBe(3);
  expect(setTimeout).toHaveBeenCalledTimes(1);
  expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 1000);

  jest.advanceTimersByTime(1000);

  expect(Qified.qGet('number')).toBe(7);
  expect(setTimeout).toHaveBeenCalledTimes(2);
  expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 1000);

  jest.advanceTimersByTime(1000);

  expect(Qified.qGet('number')).toBe(10);
});