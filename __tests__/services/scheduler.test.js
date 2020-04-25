const { loopTask, stopTask } = require('../../src/services');

jest.useFakeTimers();

describe('scheduler', () => {
  const twoSeconds = 2;
  const advanceTimeByMs = twoSeconds * 1000 * 5;

  it('executes a callback every x seconds', () => {
    const spyFunc = jest.fn();

    loopTask(spyFunc, twoSeconds);

    expect(spyFunc).not.toBeCalled();
    jest.advanceTimersByTime(advanceTimeByMs);
    expect(spyFunc).toHaveBeenCalledTimes(5);
  });

  it('stops a scheduler', () => {
    const spyFunc = jest.fn();

    loopTask(spyFunc, twoSeconds);
    jest.advanceTimersByTime(advanceTimeByMs);

    stopTask();
    jest.advanceTimersByTime(advanceTimeByMs);
    expect(spyFunc).toHaveBeenCalledTimes(5);
  });
});
