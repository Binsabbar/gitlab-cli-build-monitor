/* eslint-disable no-console */
const moment = require('moment');
const { ConsoleTableView } = require('../../src/view/consoleTableView');

describe('consoleTableView', () => {
  let consoleTableView;
  const mockLog = jest.fn();
  const actualLog = console.log;

  const row = {
    projectId: 'my pro',
    job: {
      id: 10946,
      name: 'build-node',
      stage: 'build',
      status: 'failed',
      finishedAt: '2000-04-22T13:39:32.939Z',
      startedAt: '2000-04-22T13:39:15.737Z',
      ref: 'my-ref',
    },
  };

  beforeEach(() => {
    consoleTableView = new ConsoleTableView();
    jest.resetAllMocks();
    console.log = mockLog;
  });

  afterEach(() => {
    console.log = actualLog;
  });

  it('includes headers in the output', () => {
    consoleTableView.print();

    expect(mockLog)
      .toHaveBeenCalledWith(expect.stringMatching(/.*project name.*status.*stage.*job.*ref.*id.*/));
  });

  it('includes current time in the output', () => {
    const expected = `Last Updated: ${moment().format('HH:mm:ss')}`;

    consoleTableView.print();

    expect(mockLog).toHaveBeenCalledWith(expect.stringMatching(expected));
  });

  it('includes status in a row in the output', () => {
    consoleTableView.addStatusRow(row);
    consoleTableView.print();

    expect(mockLog)
      .toHaveBeenCalledWith(expect.stringMatching(/.*my pro.*failed.*build.*build-node.*/));
    expect(mockLog)
      .toHaveBeenCalledWith(expect.stringMatching(/.*my pro.*.*build-node.*my-ref.*10946.*/));
    expect(mockLog)
      .toHaveBeenCalledWith(expect.stringMatching(/.*project name.*status.*stage.*job.*ref.*id.*/));
  });

  it('empty tables rows', () => {
    consoleTableView.addStatusRow(row);
    consoleTableView.clearRows();
    consoleTableView.print();

    expect(mockLog)
      .toHaveBeenCalledWith(expect.not.stringMatching(/.*my pro.*failed.*build.*build-node.*/));
    expect(mockLog)
      .toHaveBeenCalledWith(expect.not.stringMatching(/.*my pro.*.*build-node.*my-ref.*10946.*/));
    expect(mockLog)
      .toHaveBeenCalledWith(expect.stringMatching(/.*project name.*status.*stage.*job.*ref.*id.*/));
  });
});
