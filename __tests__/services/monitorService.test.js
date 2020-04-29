const { when } = require('jest-when');

const { MonitorService } = require('../../src/services');
const { JobBuilder } = require('../__builders__');

jest.mock('../../src/services/monitors');
const { ProjectMonitorService } = require('../../src/services/monitors');


describe('MonitorService', () => {
  const projectIds = ['A', 'B', 'C'];
  const projectMonitorService = new ProjectMonitorService();

  const monitor = new MonitorService({ projectMonitorService });

  beforeEach(() => {
    jest.resetAllMocks();
  });

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

  describe('checkStatus', () => {
    const jobsForA = [new JobBuilder().withId(1).build(), new JobBuilder().withId(2).build()];
    const jobsForB = [new JobBuilder().withId(21).build(), new JobBuilder().withId(22).build()];
    const jobsForC = [new JobBuilder().withId(31).build(), new JobBuilder().withId(32).build()];

    it('returns a resolved promise with list of jobs for each project', () => {
      when(projectMonitorService.getJobs).calledWith({ projectId: projectIds[0] })
        .mockResolvedValueOnce(jobsForA);
      when(projectMonitorService.getJobs).calledWith({ projectId: projectIds[1] })
        .mockResolvedValueOnce(jobsForB);
      when(projectMonitorService.getJobs).calledWith({ projectId: projectIds[2] })
        .mockResolvedValueOnce(jobsForC);

      const expected = [
        { projectId: 'A', jobs: jobsForA },
        { projectId: 'B', jobs: jobsForB },
        { projectId: 'C', jobs: jobsForC },
      ];
      return expect(monitor.checkStatus({ projectIds }))
        .resolves.toIncludeSameMembers(expected);
    });

    it('returns a rejected promise when an error occurs for at least one project', () => {
      when(projectMonitorService.getJobs).calledWith({ projectId: projectIds[0] })
        .mockResolvedValueOnce(jobsForA);
      when(projectMonitorService.getJobs).calledWith({ projectId: projectIds[1] })
        .mockResolvedValueOnce(jobsForB);
      when(projectMonitorService.getJobs).calledWith({ projectId: projectIds[2] })
        .mockRejectedValueOnce(new Error('error'));

      return expect(monitor.checkStatus({ projectIds }))
        .rejects.toThrowError('error');
    });
  });
});
