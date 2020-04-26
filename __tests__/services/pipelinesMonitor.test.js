const moment = require('moment');
const { when } = require('jest-when');

const { PipelinesMonitor } = require('../../src/services');
const { GitlabClient } = require('../../src/client');
const { GitlabConfig } = require('../../src/utils/gitlabConfig');
const { ProjectBuilder, PipelineBuilder, JobBuilder } = require('../__builders__');

jest.mock('../../src/client/gitlabClient.js');

describe('PipelinesMonitor', () => {
  describe('check', () => {
    const config = {
      baseUrl: 'https://gitlab.com',
      accessToken: 'token',
      projects: ['groupA/projectA', 'groupB/projectA'],
      updateIntervals: '34',
    };
    const gitlabClient = new GitlabClient();
    const gitlabConfig = new GitlabConfig(config);
    const monitor = new PipelinesMonitor(
      { gitlabClient, gitlabConfig },
    );

    beforeEach(() => {
      jest.resetAllMocks();
      when(gitlabClient.getProject)
        .calledWith(expect.anything()).mockRejectedValue('make your mock specific');
    });

    describe('when all projects exist', () => {
      it('returns a resolved promise to true', () => {
        config.projects.forEach((projectId) => {
          when(gitlabClient.getProject).calledWith({ projectId }).mockResolvedValueOnce();
        });

        return expect(monitor.check()).resolves.toEqual(true);
      });
    });

    describe('when some projects exist', () => {
      it('returns a rejected promise with list of rejection reasons', () => {
        when(gitlabClient.getProject)
          .calledWith({ projectId: config.projects[0] }).mockResolvedValueOnce();
        when(gitlabClient.getProject)
          .calledWith({ projectId: config.projects[1] }).mockRejectedValue(new Error('err'));


        return expect(monitor.check()).rejects.toEqual([new Error('err')]);
      });
    });

    describe('when all projects do not exist', () => {
      it('returns a rejected promise when all projects do not exist', () => {
        const err = new Error('err');
        config.projects.forEach((projectId) => {
          when(gitlabClient.getProject).calledWith({ projectId }).mockRejectedValue(err);
        });

        return expect(monitor.check()).rejects.toEqual([err, err]);
      });
    });
  });


  describe('getStatus', () => {
    const config = {
      baseUrl: 'https://gitlab.com',
      accessToken: 'token',
      projects: ['projectA'],
      updateIntervals: '34',
    };
    const gitlabClient = new GitlabClient();
    const gitlabConfig = new GitlabConfig(config);
    const monitor = new PipelinesMonitor(
      { gitlabClient, gitlabConfig },
    );

    const now = moment.utc();
    const projects = [
      new ProjectBuilder().withId('projectA').build(),
    ];

    const projectOnePipelines = [
      new PipelineBuilder()
        .withId('115')
        .setCreatedAt(now.subtract('10', 'm').format())
        .setUpdatedAt(now.subtract('4', 'm').format())
        .withStatus('running')
        .build(),
      new PipelineBuilder()
        .withId('117')
        .setCreatedAt(now.subtract('20', 'm').format())
        .setUpdatedAt(now.subtract('15', 'm').format())
        .build(),
    ];

    const pipeline115Jobs = [
      new JobBuilder()
        .setStartedAt(now.subtract('4', 'm').format())
        .setFinishedAt(null)
        .withStatus('running')
        .atStage('deploy')
        .withName('deploy_ms1')
        .build(),
      new JobBuilder()
        .setStartedAt(now.subtract('7', 'm').format())
        .setFinishedAt(now.subtract('6', 'm').format())
        .build(),
      new JobBuilder()
        .setStartedAt(now.subtract('9', 'm').format())
        .setFinishedAt(now.subtract('8', 'm').format())
        .build(),
    ];


    it('resolves promise with a list of projects pipeline status', async () => {
      when(gitlabClient.getProject)
        .calledWith({ projectId: projects[0].id }).mockResolvedValueOnce(projects[0]);
      when(gitlabClient.getProjectPipelines)
        .calledWith({ projectId: projects[0].id }).mockResolvedValueOnce(projectOnePipelines);
      when(gitlabClient.getPipelineJobs)
        .calledWith({ projectId: projects[0].id, pipelineId: projectOnePipelines[0].id })
        .mockResolvedValueOnce(pipeline115Jobs);

      const status = await monitor.getStatus();

      expect(status)
        .toEqual([{ project: projects[0], ...pipeline115Jobs[0] }]);
    });
  });
});
