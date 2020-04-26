const { when } = require('jest-when');

const { PipelinesMonitor } = require('../../src/services');
const { GitlabClient } = require('../../src/client');
const { GitlabConfig } = require('../../src/utils/gitlabConfig');

jest.mock('../../src/client/gitlabClient.js');

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


  describe('start', () => {

  });
});
