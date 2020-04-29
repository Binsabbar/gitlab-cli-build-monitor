/* eslint-disable no-use-before-define */
const { when } = require('jest-when');

const { PipelinesMonitor } = require('../../src/services');
const { GitlabConfig } = require('../../src/utils/gitlabConfig');
const { ProjectBuilder, PipelineBuilder, JobBuilder } = require('../__builders__');

jest.mock('../../src/services/filters');
const { FILTER_TYPE } = jest.requireActual('../../src/services/filters');
const { getFilter: getFilterMock } = require('../../src/services/filters');

jest.mock('../../src/client');
const { GitlabClient } = require('../../src/client');

const pipelineFilterMock = jest.fn();
const jobFilterMock = jest.fn();

describe('PipelinesMonitor', () => {
  const config = {
    baseUrl: 'https://gitlab.com',
    accessToken: 'token',
    projects: ['projectA', 'projectB'],
    updateIntervals: '34',
  };
  const gitlabClient = new GitlabClient();
  const gitlabConfig = new GitlabConfig(config);
  const monitor = new PipelinesMonitor({ gitlabClient, gitlabConfig, getFilter: getFilterMock });

  describe('check', () => {
    const error = new Error('err');

    beforeEach(() => {
      jest.resetAllMocks();
      when(gitlabClient.getProject)
        .calledWith(expect.anything()).mockRejectedValue('make your mock specific');
    });

    describe('when all projects exist', () => {
      it('returns a resolved promise with true value', () => {
        config.projects.forEach((projectId) => {
          when(gitlabClient.getProject)
            .calledWith({ projectId })
            .mockResolvedValueOnce();
        });

        return expect(monitor.check()).resolves.toEqual(true);
      });
    });

    describe('when some projects exist', () => {
      it('returns a rejected promise with list of rejection reasons', () => {
        when(gitlabClient.getProject)
          .calledWith({ projectId: config.projects[0] })
          .mockResolvedValueOnce();
        when(gitlabClient.getProject)
          .calledWith({ projectId: config.projects[1] })
          .mockRejectedValue(error);

        return expect(monitor.check()).rejects.toEqual([error]);
      });
    });

    describe('when all projects do not exist', () => {
      it('returns a rejected promise', () => {
        config.projects.forEach((projectId) => {
          when(gitlabClient.getProject).calledWith({ projectId }).mockRejectedValue(error);
        });

        return expect(monitor.check()).rejects.toEqual([error, error]);
      });
    });
  });

  /**  Think of the test again, what are you trying to test here?
   *    - pipelineFilters?
   *    - jobFilters?
   *    - the final result being passed by the filter?
   * Simple: What I get from Client must passby the filter.
   * The output of the filter is either an input to client or a returned value by the service
   * Note: redesign the job implementation. you need promise for each pipeline!
   * Could that be another service?
   *  - JobService: Responsibility is getting jobs from a client, then filters the result
   *  - PipelineService: Responsibility is getting pipelines from a client, then filters the result
   *  - ProjectMonitorService: Responsibility is getting filtered jobs
   *  - MonitorService: Responsibility is getting overall status for all projects
  */
  describe('getStatus', () => {
    const projects = [
      new ProjectBuilder().withId('projectA').build(),
      new ProjectBuilder().withId('projectB').build(),
    ];
    const projectPipeline = [
      new PipelineBuilder().withId('117').build(),
      new PipelineBuilder().withId('1327').build(),
    ];
    const jobs = [new JobBuilder().withId('1').build(), new JobBuilder().withId('2').build()];

    beforeEach(() => {
      jest.resetAllMocks();
      mockFilterFactory();
      mockGitlabClient(gitlabClient, projects, projectPipeline, jobs);
    });

    it('filters pipeline results', async () => {
      when(pipelineFilterMock).calledWith(projectPipeline).mockReturnValue(projectPipeline);

      await monitor.getStatus();

      expect(getFilterMock).toHaveBeenCalledWith({ type: FILTER_TYPE.PIPELINE });
      expect(pipelineFilterMock).toHaveBeenCalledTimes(2);
    });

    it('filters job results', async () => {
      when(pipelineFilterMock).calledWith(projectPipeline).mockReturnValue([projectPipeline[0]]);
      when(gitlabClient.getPipelineJobs)
        .calledWith({
          projectId: expect.any(String),
          pipelineId: projectPipeline[0].id,
        })
        .mockResolvedValue(jobs);
      when(jobFilterMock).calledWith(jobs).mockReturnValue(jobs);

      await monitor.getStatus();

      expect(getFilterMock).toHaveBeenCalledWith({ type: FILTER_TYPE.JOB });
      expect(jobFilterMock).toHaveBeenCalled();
    });

    it.skip('resolves promise with a list of projects pipeline status', async () => {
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

function mockGitlabClient(gitlabClient, projects, projectPipeline) {
  projects.forEach((project) => {
    when(gitlabClient.getProject)
      .calledWith({ projectId: project.id }).mockResolvedValue(project);
    when(gitlabClient.getProjectPipelines)
      .calledWith({ projectId: project.id }).mockResolvedValue(projectPipeline);
  });
}

function mockFilterFactory() {
  when(getFilterMock)
    .calledWith({ type: FILTER_TYPE.PIPELINE }).mockReturnValue({ filter: pipelineFilterMock });
  when(getFilterMock)
    .calledWith({ type: FILTER_TYPE.JOB }).mockReturnValue(jobFilterMock);
}
