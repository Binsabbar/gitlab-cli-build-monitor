/* eslint-disable no-unused-vars */
const mockAxios = require('axios');
const { GitlabClient } = require('../../src/client/gitlabClient');

jest.mock('axios');
const axiosGetMock = jest.fn();
const axiosCreateMock = {

  get: axiosGetMock,
};

mockAxios.create.mockReturnValue(axiosCreateMock);

describe('gitlab client', () => {
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

  describe('Get Project', () => {
    it('returns project object when response is successful', async () => {
      const mockedResponse = { data: { projectId: 12, path: '/sample/project' } };
      axiosGetMock.mockResolvedValue(mockedResponse);

      const response = await client.getProject({ projectId: 23 });

      expect(response).toEqual(mockedResponse.data);
    });

    it('returns response status and data when response error occurs', async () => {
      const mockedResponse = { response: { status: 404, data: 'error message', headers: {} } };
      axiosGetMock.mockRejectedValue(mockedResponse);

      const response = await client.getProject({ projectId: 23 });

      expect(response).toEqual({ status: 404, data: 'error message' });
    });

    it('returns error message when error is not a response error', async () => {
      const mockedResponse = { message: 'error occured' };
      axiosGetMock.mockRejectedValue(mockedResponse);

      const response = await client.getProject({ projectId: 23 });

      expect(response).toEqual({ message: 'error occured' });
    });
  });

  describe('Get Project Pipelines', () => {
    const mockedResponse = { data: { pipelines: [{ pipelineId: 1 }, { pipelineId: 2 }] } };
    const requestArgs = { projectId: 23, updatedAfter: 'some-date' };

    it('returns projects pipeline', async () => {
      axiosGetMock.mockResolvedValue(mockedResponse);

      const response = await client.getProjectPipelines(requestArgs);

      expect(response).toEqual({ pipelines: [{ pipelineId: 1 }, { pipelineId: 2 }] });
    });

    it('passes updated_after and sort when getting projects pipelines', async () => {
      axiosGetMock.mockResolvedValue(expect.anything);

      await client.getProjectPipelines(requestArgs);

      expect(axiosGetMock).toHaveBeenCalledWith(expect.anything(String), expect.objectContaining({
        params: {
          updated_after: 'some-date',
          sort: 'desc',
        },
      }));
    });

    it('returns response status and data when response error occurs', async () => {
      const mockedErrResp = { response: { status: 404, data: 'error message', headers: {} } };
      axiosGetMock.mockRejectedValue(mockedErrResp);

      const response = await client.getProjectPipelines(requestArgs);

      expect(response).toEqual({ status: 404, data: 'error message' });
    });

    it('returns error message when error is not a response error', async () => {
      const mockedErrResp = { message: 'error occured' };
      axiosGetMock.mockRejectedValue(mockedErrResp);

      const response = await client.getProjectPipelines(requestArgs);

      expect(response).toEqual({ message: 'error occured' });
    });
  });
});
