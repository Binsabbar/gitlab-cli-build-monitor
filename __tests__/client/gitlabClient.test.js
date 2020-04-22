/* eslint-disable no-unused-vars */
const mockAxios = require('axios');
const { GitlabClient } = require('../../src/client/gitlabClient');
const { Project, Pipeline, Job } = require('../../src/models');

const project = require('./data/project.json');
const pipeline = require('./data/pipeline.json');
const job = require('./data/job.json');

jest.mock('axios');
const axiosGetMock = jest.fn();
const axiosCreateMock = {

  get: axiosGetMock,
};

mockAxios.create.mockReturnValue(axiosCreateMock);

describe('GitlabClient', () => {
  let client;
  beforeEach(() => {
    client = new GitlabClient('token');
  });

  afterEach(() => {
    axiosGetMock.mockReset();
  });

  describe('Constructor', () => {
    const config = {
      baseUrl: 'https://gitlab.com',
      accessToken: 'my-token',
    };

    it('sets token header from accessToken', () => {
      const _ = new GitlabClient(config);
      const expectedConfig = {
        headers: {
          'Private-Token': config.accessToken,
        },
      };

      expect(mockAxios.create).toHaveBeenCalledWith(expect.objectContaining(expectedConfig));
    });

    it('sets baseURL header from baseUrl', () => {
      const _ = new GitlabClient(config);
      const expectedConfig = { baseURL: config.baseUrl };

      expect(mockAxios.create).toHaveBeenCalledWith(expect.objectContaining(expectedConfig));
    });
  });

  describe('getProject', () => {
    it('returns project object when response is successful', async () => {
      axiosGetMock.mockResolvedValue({ data: project });
      const expected = new Project(
        { id: 123123, path_with_namespace: 'mygroup/my-project', name: 'my-project' },
      );

      const response = await client.getProject({ projectId: 23 });

      expect(response).toEqual(expected);
    });
  });

  describe('getProjectPipelines', () => {
    const requestArgs = { projectId: 23, updatedAfter: 'some-date' };

    it('returns projects pipeline', async () => {
      axiosGetMock.mockResolvedValue({ data: [pipeline, { ...pipeline, id: 1 }] });
      const expected = {
        id: 231313,
        ref: 'my-ref',
        status: 'failed',
        created_at: '2000-04-22T13:39:13.272Z',
        updated_at: '2000-04-22T13:39:33.245Z',
      };

      const response = await client.getProjectPipelines(requestArgs);

      expect(response).toEqual([new Pipeline(expected), new Pipeline({ ...expected, id: 1 })]);
    });

    it('passes updated_after and sort when getting projects pipelines', async () => {
      axiosGetMock.mockResolvedValue({ data: [pipeline] });

      await client.getProjectPipelines(requestArgs);

      expect(axiosGetMock).toHaveBeenCalledWith(expect.anything(String), expect.objectContaining({
        params: {
          updated_after: 'some-date',
          sort: 'desc',
        },
      }));
    });
  });

  describe('getPipelineDetails', () => {
    const mockedResponse = { data: { pipeline: { pipelineId: 1, status: 'failed' } } };
    const requestArgs = { projectId: 23, pipelineId: 12 };

    it('returns pipeline details', async () => {
      axiosGetMock.mockResolvedValue(mockedResponse);

      const response = await client.getPipelineDetails(requestArgs);

      expect(response).toEqual({ pipeline: { pipelineId: 1, status: 'failed' } });
    });
  });

  describe('getPipelineJobs', () => {
    const requestArgs = { projectId: 23, pipelineId: 12 };

    it('returns pipeline details', async () => {
      axiosGetMock.mockResolvedValue({ data: [job, { ...job, id: 1 }] });
      const expected = {
        id: 10946,
        name: 'build-node',
        stage: 'build',
        status: 'failed',
        started_at: '2000-04-22T13:39:15.737Z',
        finished_at: '2000-04-22T13:39:32.939Z',
        ref: 'my-ref',
      };

      const response = await client.getPipelineJobs(requestArgs);

      expect(response).toEqual([new Job(expected), new Job({ ...expected, id: 1 })]);
    });
  });

  describe('Errors', () => {
    const projectId = 12;
    const pipelineId = 12;
    const updatedAfter = 'some-date';

    const sharedTests = (name, method) => {
      describe(`${name}`, () => {
        it('returns response status and data when response error occurs', async () => {
          const mockedErrResp = { response: { status: 404, data: 'error message', headers: {} } };
          axiosGetMock.mockRejectedValue(mockedErrResp);
          const expected = new Error({ status: 404, data: 'error message' });

          return expect(method())
            .rejects.toEqual(expected);
        });

        it('returns error message when error is not a response error', async () => {
          const mockedErrResp = { message: 'error occured' };
          axiosGetMock.mockRejectedValue(mockedErrResp);
          const expected = new Error({ message: 'error occured' });

          return expect(method()).rejects.toEqual(expected);
        });
      });
    };

    [
      {
        name: 'getProject',
        method: () => client.getProject({ projectId }),
      },
      {
        name: 'getProjectPipelines',
        method: () => client.getProjectPipelines({ projectId, updatedAfter }),
      },
      {
        name: 'getPipelineDetails',
        method: () => client.getPipelineDetails({ projectId, pipelineId }),
      },
      {
        name: 'getPipelineJobs',
        method: () => client.getPipelineJobs({ projectId, pipelineId }),
      },
    ].forEach((testCase) => sharedTests(testCase.name, testCase.method));
  });
});
