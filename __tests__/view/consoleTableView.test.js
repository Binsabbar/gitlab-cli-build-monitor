/* eslint-disable no-console */
const moment = require('moment');
const { ConsoleTableView } = require('../../src/view');

describe('consoleTableView', () => {
  let consoleTableView;
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
  });

  it('includes headers in the output', () => {
    const printableTable = consoleTableView.toPrintableTable();

    expect(printableTable)
      .toEqual(expect.stringMatching(/.*project name.*status.*stage.*job.*ref.*jobId.*finished/));
  });

  it('includes current time in the output', () => {
    const expected = `Last Updated at: ${moment().format('HH:mm:ss')}`;

    const printableTable = consoleTableView.toPrintableTable();

    expect(printableTable).toEqual(expect.stringMatching(expected));
  });

  it('includes status in a row in the output', () => {
    consoleTableView.addStatusRow(row);
    const printableTable = consoleTableView.toPrintableTable();

    expect(printableTable).toEqual(expect.stringMatching(/.*my pro.*failed.*build.*build-node.*/));
    expect(printableTable)
      .toEqual(expect.stringMatching(/.*my pro.*.*build-node.*my-ref.*10946.*/));
    expect(printableTable)
      .toEqual(expect.stringMatching(/.*project name.*status.*stage.*job.*ref.*jobId.*finished.*/));
  });

  it('empty tables rows', () => {
    consoleTableView.addStatusRow(row);
    consoleTableView.clearRows();
    const printableTable = consoleTableView.toPrintableTable();

    expect(printableTable)
      .toEqual(expect.not.stringMatching(/.*my pro.*failed.*build.*build-node.*/));
    expect(printableTable)
      .toEqual(expect.not.stringMatching(/.*my pro.*.*build-node.*my-ref.*10946.*/));
    expect(printableTable)
      .toEqual(expect.stringMatching(/.*project name.*status.*stage.*job.*ref.*jobId.*finished.*/));
  });

  describe('finished field', () => {
    it('returns "-" if finishedAt is empty', () => {
      row.job.finishedAt = undefined;
      consoleTableView.addStatusRow(row);

      const printableTable = consoleTableView.toPrintableTable();

      expect(printableTable).toEqual(expect.stringMatching(/.*-.*/));
    });

    it('returns XX seconds ago if finishedAt is less than a minute from current time', () => {
      row.job.finishedAt = moment().utc().subtract('55', 'seconds').toISOString();
      consoleTableView.addStatusRow(row);

      const printableTable = consoleTableView.toPrintableTable();

      expect(printableTable).toEqual(expect.stringMatching(/.*55 seconds ago.*/));
    });

    it('returns XX minutes ago if finishedAt is less than an hour from current time', () => {
      row.job.finishedAt = moment().utc().subtract('55', 'minutes').toISOString();
      consoleTableView.addStatusRow(row);

      const printableTable = consoleTableView.toPrintableTable();

      expect(printableTable).toEqual(expect.stringMatching(/.*55 minutes ago.*/));
    });

    it('returns XX hours ago if finishedAt is less than a day from current time', () => {
      row.job.finishedAt = moment().utc().subtract('23', 'hours').toISOString();
      consoleTableView.addStatusRow(row);

      const printableTable = consoleTableView.toPrintableTable();

      expect(printableTable).toEqual(expect.stringMatching(/.*23 hours ago.*/));
    });

    it('returns XX days ago if finishedAt is more than a day', () => {
      row.job.finishedAt = moment().utc().subtract('23', 'days').toISOString();
      consoleTableView.addStatusRow(row);

      const printableTable = consoleTableView.toPrintableTable();

      expect(printableTable).toEqual(expect.stringMatching(/.*23 days ago.*/));
    });
  });
});
