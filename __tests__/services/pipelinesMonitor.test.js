const { when } = require('jest-when');

const { PipelinesMonitor } = require('../../src/services');
const { GitlabClient } = require('../../src/client');
const { GitlabConfig } = require('../../src/utils/gitlabConfig');

jest.mock('../../src/client/gitlabClient.js');

const mockedHandler = jest.fn();

describe('PipelinesMonitor', () => {
  const config = {
    baseUrl: 'https://gitlab.com',
    accessToken: 'token',
    projects: ['groupA/projectA', 'groupB/projectA'],
    updateIntervals: '34',
  };
  const gitlabClient = new GitlabClient();
  const gitlabConfig = new GitlabConfig(config);

  describe('check', () => {
    const monitor = new PipelinesMonitor(
      { gitlabClient, gitlabConfig, errorHandler: mockedHandler },
    );

    beforeEach(() => {
      jest.resetAllMocks();
      when(gitlabClient.getProject)
        .calledWith(expect.anything()).mockRejectedValue('make your mock specific');
      when(mockedHandler)
        .calledWith(expect.any(Array)).mockReturnValue('mocked error message');
    });

    it('returns a resolved promise when all projects exist', () => {
      config.projects.forEach((projectId) => {
        when(gitlabClient.getProject).calledWith({ projectId }).mockResolvedValueOnce();
      });

      return expect(monitor.check()).resolves.toEqual(true);
    });

    it('returns a rejected promise when some projects do not exist', () => {
      when(gitlabClient.getProject)
        .calledWith({ projectId: config.projects[0] }).mockResolvedValueOnce();
      when(gitlabClient.getProject)
        .calledWith({ projectId: config.projects[1] }).mockRejectedValue();


      return expect(monitor.check()).rejects.toEqual('mocked error message');
    });

    it('returns a rejected promise when all projects do not exist', () => {
      config.projects.forEach((projectId) => {
        when(gitlabClient.getProject).calledWith({ projectId }).mockRejectedValue();
      });

      return expect(monitor.check()).rejects.toEqual('mocked error message');
    });
  });
});
