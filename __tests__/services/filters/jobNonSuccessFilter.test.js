const moment = require('moment');

const { JobBuilder } = require('../../__builders__');
const { jobNonSuccessFilter: filter } = require('../../../src/services/filters');

describe('jobNonSuccessFilter', () => {
  describe('Non success status', () => {
    let jobs = [];

    beforeEach(() => {
      jobs = [
        new JobBuilder().withId('1').withStatus('success').build(),
        new JobBuilder().withId('3').withStatus('success').build(),
        new JobBuilder().withId('4').withStatus('success').build(),
      ];
    });

    it('returns list of jobs that have failed status', () => {
      const failedJob = new JobBuilder().withId('2').withStatus('failed').build();
      jobs.splice(2, 0, failedJob);

      const result = filter(jobs);

      expect(result).toEqual([failedJob]);
    });

    it('returns list of jobs that have running status', () => {
      const runningJob = new JobBuilder().withId('2').withStatus('running').build();
      jobs.splice(2, 0, runningJob);

      const result = filter(jobs);

      expect(result).toEqual([runningJob]);
    });

    it('returns list of jobs that have manual status', () => {
      const manualJob = new JobBuilder().withId('2').withStatus('manual').build();
      jobs.splice(2, 0, manualJob);

      const result = filter(jobs);

      expect(result).toEqual([manualJob]);
    });

    it('returns list of jobs that have created status', () => {
      const createdJob = new JobBuilder().withId('2').withStatus('created').build();
      jobs.splice(2, 0, createdJob);

      const result = filter(jobs);

      expect(result).toEqual([createdJob]);
    });

    it('returns list of jobs that have skipped status', () => {
      const skippedJob = new JobBuilder().withId('2').withStatus('skipped').build();
      jobs.splice(2, 0, skippedJob);

      const result = filter(jobs);

      expect(result).toEqual([skippedJob]);
    });

    it('return empty list when all jobs have success or canceled status', () => {
      const canceledJob = new JobBuilder().withId('2').withStatus('cenceled').build();
      jobs.splice(2, 0, canceledJob);

      const result = filter(jobs);

      expect(result).toEqual([]);
    });
  });
});
