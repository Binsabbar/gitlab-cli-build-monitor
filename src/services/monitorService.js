/* eslint-disable arrow-body-style */
/* eslint-disable no-unused-vars */
class MonitorService {
  constructor({ projectMonitorService }) {
    this.projectService = projectMonitorService;
  }

  doProjectsExist({ projectIds }) {
    const promises = projectIds.map((projectId) => {
      return this.projectService.doesProjectExist({ projectId });
    });
    return Promise.all(promises).then((_) => true);
  }

  checkStatus({ projectIds }) {
    const promises = projectIds.map((projectId) => {
      return this.projectService.getJobs({ projectId })
        .then((jobs) => ({ projectId, jobs }));
    });
    return Promise.all(promises).then((values) => values.flat());
  }
}
exports.MonitorService = MonitorService;
