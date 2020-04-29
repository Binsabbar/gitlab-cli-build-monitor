/* eslint-disable no-unused-vars */
const { when } = require('jest-when');

jest.mock('../../../src/services/monitors');
const { ProjectMonitorService } = jest.requireActual('../../../src/services/monitors');
const { JobMonitorService, PipelineMonitorService } = require('../../../src/services/monitors');
const { ProjectBuilder, PipelineBuilder, JobBuilder } = require('../../__builders__');

jest.mock('../../../src/client');
const { GitlabClient } = require('../../../src/client');

const { GitlabClientError } = jest.requireActual('../../../src/client');

describe('ProjectMonitorService', () => {
  const project = new ProjectBuilder().withId('projectA').build();
  const pipelines = [
    new PipelineBuilder().withId('12').build(),
    new PipelineBuilder().withId('13').build(),
  ];
  const Jobs = [new JobBuilder().withId(12).build(), new JobBuilder().withId(14).build()];
  const gitlabClient = new GitlabClient();
  const monitor = new ProjectMonitorService({ gitlabClient });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('doesProjectExist', () => {
    it('returns a resolved promise with true if project exists', () => {
      when(gitlabClient.getProject).calledWith({ projectId: project.id }).mockResolvedValue(true);

      return expect(monitor.doesProjectExist({ project })).resolves.toBeTruthy();
    });

    it('returns a resolved promise with false if project does not exist', () => {
      when(gitlabClient.getProject)
        .calledWith({ projectId: project.id })
        .mockRejectedValue(new GitlabClientError({ status: 404, project: project.id }));

      return expect(monitor.doesProjectExist({ project })).resolves.toBeFalsy();
    });

    it('returns a rejected promise if non 404 error occurs', () => {
      when(gitlabClient.getProject)
        .calledWith({ projectId: project.id })
        .mockRejectedValue(new GitlabClientError({ status: 505, project: project.id }));

      return expect(monitor.doesProjectExist({ project })).rejects.toThrow();
    });
  });
});
