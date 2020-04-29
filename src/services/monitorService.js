/* eslint-disable no-unused-vars */
class MonitorService {
  constructor({ projectMonitorService }) {
    this.projectService = projectMonitorService;
  }

  doProjectsExist({ projectIds }) {
    const promises = [];
    projectIds.forEach((projectId) => {
      promises.push(this.projectService.doesProjectExist({ projectId }));
    });
    return Promise.all(promises).then((_) => true);
  }
}
exports.MonitorService = MonitorService;
