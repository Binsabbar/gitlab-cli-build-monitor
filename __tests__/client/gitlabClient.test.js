const mockAxios = require('axios');
const { GitlabClient } = require('../../src/client/gitlabClient');

jest.mock('axios');
const axiosGetMock = jest.fn();
const axiosCreateMock = {

  get: axiosGetMock,
};

mockAxios.create.mockReturnValue(axiosCreateMock);

describe('gitlab client', () => {
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

    it('sets baseUrl header from accessToken', () => {
      const _ = new GitlabClient(config);
      const expectedConfig = { baseURL: config.baseUrl };
      expect(mockAxios.create).toHaveBeenCalledWith(expect.objectContaining(expectedConfig));
    });
  });

  describe('Get Project', () => {
    const client = new GitlabClient('token');

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
  });
});
