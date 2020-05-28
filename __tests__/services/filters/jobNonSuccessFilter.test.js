/* eslint-disable newline-per-chained-call */
const moment = require('moment');

const { JobBuilder } = require('../../__builders__');
const { jobNonSuccessFilter: filter } = require('../../../src/services/filters');

describe('jobNonSuccessFilter', () => {
  describe('Non success status', () => {
    let successJobs = [];

    beforeEach(() => {
      successJobs = [
        new JobBuilder().withId('1').atStage('test').withName('ui_test')
          .withStatus('success').build(),
        new JobBuilder().withId('3').atStage('test').withName('unit_test')
          .withStatus('created').build(),
        new JobBuilder().withId('4').atStage('test').withName('integration_test')
          .withStatus('manual').build(),
        new JobBuilder().withId('9').atStage('test').withName('functional_test')
          .withStatus('canceled').build(),
      ];
    });

    it('returns list of jobs that have failed status', () => {
      const failedJob = new JobBuilder().withId('2').atStage('build').withName('build-1')
        .withStatus('failed').build();
      successJobs.splice(2, 0, failedJob);

      const result = filter(successJobs);

      expect(result).toEqual([failedJob]);
    });

    it('returns list of jobs that have running status', () => {
      const runningJob = new JobBuilder().withId('2').atStage('build').withName('build-1')
        .withStatus('running').build();
      successJobs.splice(2, 0, runningJob);

      const result = filter(successJobs);

      expect(result).toEqual([runningJob]);
    });

    it('returns list of jobs that have pending status', () => {
      const pendingJob = new JobBuilder().withId('2').atStage('build').withName('build-1')
        .withStatus('pending').build();
      successJobs.splice(2, 0, pendingJob);

      const result = filter(successJobs);

      expect(result).toEqual([pendingJob]);
    });

    it('returns all jobs that has non success status', () => {
      const pendingJob = new JobBuilder().withId('2').atStage('build').withName('build-1')
        .withStatus('pending').build();
      const runningJob1 = new JobBuilder().withId('2').atStage('build').withName('build-2')
        .withStatus('running').build();
      const runningJob2 = new JobBuilder().withId('2').atStage('build').withName('build-3')
        .withStatus('running').build();

      successJobs.splice(2, 0, pendingJob);
      successJobs.splice(2, 0, runningJob1);
      successJobs.splice(2, 0, runningJob2);

      const result = filter(successJobs);

      expect(result).toIncludeSameMembers([pendingJob, runningJob1, runningJob2]);
    });

    it('return empty list when all jobs considered successful', () => {
      const result = filter(successJobs);

      expect(result).toEqual([]);
    });
  });

  describe('re-run jobs', () => {
    const now = moment().utc();

    it('filters re-played jobs based on job & stage names, then returns latest only', () => {
      // test Job
      const testJobBuilder = new JobBuilder().atStage('test').withName('jest');
      const failedTestJob = testJobBuilder.withStatus('failed').withId(1)
        .setCreatedAt(moment(now).subtract(10, 'm').format()).build();
      const pendingTestJob = testJobBuilder.withStatus('pending').withId(3)
        .setCreatedAt(moment(now).subtract(5, 'm').format()).build();

      // deploy Job
      const deployJobBuilder = new JobBuilder().atStage('deploy').withName('deploy-demo');
      const failedDeployJob = deployJobBuilder.withStatus('failed').withId(2)
        .setCreatedAt(moment(now).subtract(15, 'm').format()).build();
      const runningDeployJob = deployJobBuilder.withStatus('running').withId(4)
        .setCreatedAt(moment(now).subtract(1, 'm').format()).build();

      const result = filter([failedTestJob, pendingTestJob, failedDeployJob, runningDeployJob]);

      expect(result).toIncludeSameMembers([pendingTestJob, runningDeployJob]);
    });

    it('filters failed jobs only when re-run', () => {
      const testJobBuilder = new JobBuilder().atStage('test').withName('jest');
      const failedTestJob = testJobBuilder.withStatus('failed').withId(1)
        .setCreatedAt(moment(now).subtract(5, 'm').format()).build();
      const pendingTestJob1 = testJobBuilder.withStatus('pending').withId(3)
        .setCreatedAt(moment(now).subtract(2, 'm').format()).build();
      const pendingTestJob2 = testJobBuilder.withStatus('pending').withId(4)
        .setCreatedAt(moment(now).subtract(1, 'm').format()).build();

      const result = filter([failedTestJob, pendingTestJob1, pendingTestJob2]);

      expect(result).toIncludeSameMembers([pendingTestJob1, pendingTestJob2]);
    });

    it('it returns latest failed jobs if all re-run jobs have failed status', () => {
      const testJobBuilder = new JobBuilder().atStage('test').withName('jest');
      const failedTestJob1 = testJobBuilder.withStatus('failed').withId(1)
        .setCreatedAt(moment(now).subtract(5, 'm').format()).build();
      const failedTestJob2 = testJobBuilder.withStatus('failed').withId(3)
        .setCreatedAt(moment(now).subtract(2, 'm').format()).build();

      const result = filter([failedTestJob1, failedTestJob2]);

      expect(result).toIncludeSameMembers([failedTestJob2]);
    });


    it('it includes lastest failed job along currently non failed ones', () => {
      const testJobBuilder = new JobBuilder().atStage('deploy').withName('jest');
      const pendingTestJob = testJobBuilder.withStatus('pending').withId(1)
        .setCreatedAt(moment(now).subtract(5, 'm').format()).build();
      const failedTestJob = testJobBuilder.withStatus('failed').withId(2)
        .setCreatedAt(moment(now).subtract(1, 'm').format()).build();

      const result = filter([failedTestJob, pendingTestJob]);

      expect(result).toIncludeSameMembers([pendingTestJob, failedTestJob]);
    });
  });
});
