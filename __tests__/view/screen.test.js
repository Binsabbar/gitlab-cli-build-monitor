/* eslint-disable no-console */
/* eslint-disable global-require */
const readline = require('readline');
const { Screen } = require('../../src/view');

jest.mock('readline');
readline.moveCursor = jest.fn((strem, x, y, callback) => callback());
readline.clearScreenDown = (output, callback) => callback();

let simulateOneLineEnteredViaStdin;
const mockReadLineOnEent = (event, callback) => {
  simulateOneLineEnteredViaStdin = callback;
};
const mockCreateInterface = { on: mockReadLineOnEent };
readline.createInterface.mockReturnValue(mockCreateInterface);


describe('Screen', () => {
  let screen;
  const realLog = console.log;
  beforeEach(() => {
    screen = new Screen();
    console.log = jest.fn();
  });
  afterEach(() => {
    console.log = realLog;
  });

  it('set x and y to -0 when nothing is no line is printed from stdin', () => {
    screen.screenWrite('three\nlines\nlog message');

    expect(readline.moveCursor).toHaveBeenCalledWith(process.stdout, -0, -0, expect.anything());
  });

  it('does not take into account the currently being written lines of output', () => {
    simulateOneLineEnteredViaStdin();
    simulateOneLineEnteredViaStdin();

    screen.screenWrite('three\nlines\nlog message');

    expect(readline.moveCursor).toHaveBeenCalledWith(process.stdout, -2, -2, expect.anything());
  });

  it('takes into account the number of previously written lines of output + curren line entered via stdin ', () => {
    screen.screenWrite('three\nlines\nlog message'); // previous lines of output
    simulateOneLineEnteredViaStdin();
    simulateOneLineEnteredViaStdin();

    screen.screenWrite('three\nlines\nlog message'); // invoke test
    expect(readline.moveCursor).toHaveBeenCalledWith(process.stdout, -5, -5, expect.anything());
  });

  it('reset # of lines entered via stdin in the subsequent write call', () => {
    simulateOneLineEnteredViaStdin();
    simulateOneLineEnteredViaStdin();
    screen.screenWrite(''); // single lines of output
    expect(readline.moveCursor).toHaveBeenCalledWith(process.stdout, -2, -2, expect.anything());

    screen.screenWrite(''); // invoke test
    expect(readline.moveCursor).toHaveBeenCalledWith(process.stdout, -1, -1, expect.anything());
  });
});
