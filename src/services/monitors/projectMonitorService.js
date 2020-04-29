/* eslint-disable no-unused-vars */

class ProjectMonitorService {
  constructor({ gitlabClient }) {
    this.gitlabClient = gitlabClient;
  }

  doesProjectExist({ project }) {
    const { id: projectId } = project;
    return this.gitlabClient.getProject({ projectId })
      .then((_) => true)
      .catch((error) => {
        if (error.status && error.status === 404) return false;
        return Promise.reject(error);
      });
  }
}

exports.ProjectMonitorService = ProjectMonitorService;
