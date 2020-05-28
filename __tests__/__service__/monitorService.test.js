/* eslint-disable arrow-body-style */
/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
const mockAxios = require('axios');
const { when } = require('jest-when');

const { getService, SERVICES } = require('../../src/objectsInitializer');
const { GitlabConfig } = require('../../src/utils/gitlabConfig');

jest.mock('axios');
const axiosGetMock = jest.fn();
const axiosCreateMock = { get: axiosGetMock };

const project = require('../__data__/project.json');
const pipeline = require('../__data__/pipeline.json');
const job = require('../__data__/job.json');

mockAxios.create.mockReturnValue(axiosCreateMock);

const config = new GitlabConfig({
  baseUrl: 'https://gitlab.com',
  accessToken: 'token',
  projects: [123123],
  updateIntervals: 10,
});
const monitor = getService(SERVICES.MONITOR_SERVICE, config);


describe('MonitorService', () => {
  mockGitlabResult();
  it('resolves to true when checking projects', () => {
    return expect(monitor.doProjectsExist({ projectIds: config.projects })).resolves.toBeTruthy();
  });

  it('resolves a list of jobs', () => {
    const expectedResult = [{
      projectId: 123123,
      jobs: [{
        id: 10946,
        name: 'build-node',
        stage: 'build',
        status: 'failed',
        finishedAt: '2000-04-22T13:39:32.939Z',
        startedAt: '2000-04-22T13:39:15.737Z',
        createdAt: '2000-04-22T13:39:13.283Z',
        ref: 'my-ref',
      }],
    }];

    return expect(monitor.checkStatus({ projectIds: config.projects }))
      .resolves.toEqual(expectedResult);
  });
});

function mockGitlabResult() {
  const mockProjectResult = () => {
    when(axiosGetMock)
      .calledWith('/api/v4/projects/123123/')
      .mockResolvedValue({ data: project });
  };

  const mockProjectPipelineResult = () => {
    when(axiosGetMock)
      .calledWith('/api/v4/projects/123123/pipelines/')
      .mockResolvedValue({ data: [pipeline] });
  };

  const mockPipelineJobsResult = () => {
    when(axiosGetMock)
      .calledWith('/api/v4/projects/123123/pipelines/231313/jobs')
      .mockResolvedValue({ data: [job] });
  };

  mockProjectResult();
  mockProjectPipelineResult();
  mockPipelineJobsResult();
}
