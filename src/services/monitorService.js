/* eslint-disable arrow-body-style */
/* eslint-disable no-unused-vars */

const { GitlabClientError } = require('../client');

class MonitorService {
  constructor({ projectMonitorService }) {
    this.projectService = projectMonitorService;
  }

  doProjectsExist({ projectIds }) {
    const promises = projectIds.map((projectId) => {
      return this.projectService.doesProjectExist({ projectId })
        .then((result) => {
          if (!result) {
            throw new GitlabClientError({ status: 404, message: 'project not found', projectId });
          }
        });
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
