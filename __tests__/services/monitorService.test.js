const { when } = require('jest-when');

const { MonitorService } = require('../../src/services');
const { JobBuilder } = require('../__builders__');

jest.mock('../../src/services/monitors');
const { ProjectMonitorService } = require('../../src/services/monitors');


describe('MonitorService', () => {
  const projectIds = ['A', 'B', 'C'];
  const projectMonitorService = new ProjectMonitorService();
  const monitor = new MonitorService({ projectMonitorService });

  describe('doProjectExists', () => {
    it('returns a resolved promise with true if all projects exist', () => {
      projectIds.forEach((projectId) => {
        when(projectMonitorService.doesProjectExist).calledWith({ projectId })
          .mockResolvedValueOnce(true);
      });

      return expect(monitor.doProjectsExist({ projectIds })).resolves.toEqual(true);
    });

    it('returns a rejected promise if at least one project does not exist', () => {
      when(projectMonitorService.doesProjectExist).calledWith({ projectId: projectIds[0] })
        .mockResolvedValueOnce(true);
      when(projectMonitorService.doesProjectExist).calledWith({ projectId: projectIds[1] })
        .mockResolvedValueOnce(true);
      when(projectMonitorService.doesProjectExist).calledWith({ projectId: projectIds[2] })
        .mockRejectedValueOnce(new Error('error'));

      return expect(monitor.doProjectsExist({ projectIds })).rejects.toThrowError('error');
    });
  });
});
