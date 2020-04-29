/* eslint-disable no-unused-vars */
const { when } = require('jest-when');

jest.mock('../../../src/services/monitors');
const { ProjectMonitorService } = jest.requireActual('../../../src/services/monitors');
const { JobMonitorService, PipelineMonitorService } = require('../../../src/services/monitors');
const { PipelineBuilder, JobBuilder } = require('../../__builders__');

jest.mock('../../../src/client');
const { GitlabClient } = require('../../../src/client');

const { GitlabClientError } = jest.requireActual('../../../src/client');

describe('ProjectMonitorService', () => {
  const projectId = 'projectA';

  const pipelines = [
    new PipelineBuilder().withId('12').build(),
    new PipelineBuilder().withId('13').build(),
  ];
  const jobsForPipeline12 = [
    new JobBuilder().withId(12).build(),
    new JobBuilder().withId(14).build(),
  ];
  const jobsForPipeline13 = [
    new JobBuilder().withId(15).build(),
    new JobBuilder().withId(16).build(),
  ];

  const gitlabClient = new GitlabClient();
  const pipelineMonitorService = new PipelineMonitorService();
  const jobMonitorService = new JobMonitorService();
  const monitor = new ProjectMonitorService(
    { gitlabClient, pipelineMonitorService, jobMonitorService },
  );

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('doesProjectExist', () => {
    it('returns a resolved promise with true if project exists', () => {
      when(gitlabClient.getProject).calledWith({ projectId }).mockResolvedValue(true);

      return expect(monitor.doesProjectExist({ projectId })).resolves.toBeTruthy();
    });

    it('returns a resolved promise with false if project does not exist', () => {
      when(gitlabClient.getProject)
        .calledWith({ projectId })
        .mockRejectedValue(new GitlabClientError({ status: 404, projectId }));

      return expect(monitor.doesProjectExist({ projectId })).resolves.toBeFalsy();
    });

    it('returns a rejected promise if non 404 error occurs', () => {
      when(gitlabClient.getProject)
        .calledWith({ projectId })
        .mockRejectedValue(new GitlabClientError({ status: 505, projectId }));

      return expect(monitor.doesProjectExist({ projectId })).rejects.toThrow();
    });
  });

  describe('getJobs', () => {
    it('returns a resolved promise with jobs from all pipelines', () => {
      when(pipelineMonitorService.getPipelines)
        .calledWith({ projectId }).mockResolvedValue(pipelines);
      when(jobMonitorService.getJobs)
        .calledWith({ projectId, pipeline: pipelines[0] }).mockResolvedValue(jobsForPipeline12);
      when(jobMonitorService.getJobs)
        .calledWith({ projectId, pipeline: pipelines[1] }).mockResolvedValue(jobsForPipeline13);

      return expect(monitor.getJobs({ projectId })).resolves
        .toIncludeSameMembers(jobsForPipeline12.concat(jobsForPipeline13));
    });

    it('returns a resolved promise with empty array if no pipeline exists', () => {
      when(pipelineMonitorService.getPipelines)
        .calledWith({ projectId }).mockResolvedValue([]);

      return expect(monitor.getJobs({ projectId })).resolves.toEqual([]);
    });

    it('returns a resolved promise with empty array if no jobs exists', () => {
      when(pipelineMonitorService.getPipelines)
        .calledWith({ projectId }).mockResolvedValue(pipelines);
      when(jobMonitorService.getJobs)
        .calledWith({ projectId, pipeline: pipelines[0] }).mockResolvedValue([]);
      when(jobMonitorService.getJobs)
        .calledWith({ projectId, pipeline: pipelines[1] }).mockResolvedValue([]);

      return expect(monitor.getJobs({ projectId })).resolves.toEqual([]);
    });

    it('returns a rejected promise if error occurs when getting pipelines', () => {
      when(pipelineMonitorService.getPipelines)
        .calledWith({ projectId }).mockRejectedValue(new Error('error happens'));

      return expect(monitor.getJobs({ projectId })).rejects.toThrow();
    });

    it('returns a rejected promise if error occurs when getting jobs', () => {
      when(pipelineMonitorService.getPipelines)
        .calledWith({ projectId }).mockResolvedValue(pipelines);
      when(jobMonitorService.getJobs)
        .calledWith({ projectId, pipeline: pipelines[0] }).mockResolvedValue([]);
      when(jobMonitorService.getJobs)
        .calledWith({ projectId, pipeline: pipelines[1] }).mockRejectedValue(new Error('err'));

      return expect(monitor.getJobs({ projectId })).rejects.toThrow();
    });
  });
});
