const moment = require('moment');

const { JobBuilder } = require('../../__builders__');
const { jobNonSuccessFilter: filter } = require('../../../src/services/filters');

describe('jobNonSuccessFilter', () => {
  describe('Non success status', () => {
    let successJobs = [];

    beforeEach(() => {
      successJobs = [
        new JobBuilder().withId('1').withStatus('success').build(),
        new JobBuilder().withId('3').withStatus('created').build(),
        new JobBuilder().withId('4').withStatus('manual').build(),
        new JobBuilder().withId('9').withStatus('canceled').build(),
      ];
    });

    it('returns list of jobs that have failed status', () => {
      const failedJob = new JobBuilder().withId('2').withStatus('failed').build();
      successJobs.splice(2, 0, failedJob);

      const result = filter(successJobs);

      expect(result).toEqual([failedJob]);
    });

    it('returns list of jobs that have running status', () => {
      const runningJob = new JobBuilder().withId('2').withStatus('running').build();
      successJobs.splice(2, 0, runningJob);

      const result = filter(successJobs);

      expect(result).toEqual([runningJob]);
    });

    it('returns list of jobs that have pending status', () => {
      const pendingJob = new JobBuilder().withId('2').withStatus('pending').build();
      successJobs.splice(2, 0, pendingJob);

      const result = filter(successJobs);

      expect(result).toEqual([pendingJob]);
    });

    it('return empty list when all jobs considered successful', () => {
      const result = filter(successJobs);

      expect(result).toEqual([]);
    });
  });
});
