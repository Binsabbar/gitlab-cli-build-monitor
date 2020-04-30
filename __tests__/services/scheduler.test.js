/* eslint-disable no-unused-vars */
const { loopTask, stopTask } = require('../../src/services');

jest.useFakeTimers();

describe('scheduler', () => {
  const twoSeconds = 2;
  const advanceTimeByMs = twoSeconds * 1000 * 5;

  it('executes a callback every x seconds', (done) => {
    const spyFunc = jest.fn(() => Promise.resolve(1));
    loopTask(spyFunc, {}, twoSeconds).then((result) => { expect(result).toBe(1); done(); });

    expect(spyFunc).not.toBeCalled();

    jest.advanceTimersByTime(advanceTimeByMs);
    expect(spyFunc).toHaveBeenCalledTimes(5);
  });

  it('stops a scheduler', (done) => {
    const spyFunc = jest.fn(() => Promise.resolve(1));
    loopTask(spyFunc, {}, twoSeconds).then((_) => done());

    jest.advanceTimersByTime(advanceTimeByMs);
    expect(spyFunc).toHaveBeenCalledTimes(5);
    stopTask();

    jest.advanceTimersByTime(advanceTimeByMs);
    expect(spyFunc).toHaveBeenCalledTimes(5);
  });
});
