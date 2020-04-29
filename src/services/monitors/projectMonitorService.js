/* eslint-disable no-unused-vars */

class ProjectMonitorService {
  constructor({ gitlabClient, pipelineMonitorService, jobMonitorService }) {
    this.client = gitlabClient;
    this.pipelineService = pipelineMonitorService;
    this.jobService = jobMonitorService;
  }

  doesProjectExist({ projectId }) {
    return this.client.getProject({ projectId })
      .then((_) => true)
      .catch((error) => {
        if (error.status === 404) return false;
        return Promise.reject(error);
      });
  }

  getJobs({ projectId }) {
    return this.pipelineService.getPipelines({ projectId })
      .then((pipelines) => {
        const promises = [];
        pipelines.forEach((pipeline) => {
          promises.push(this.jobService.getJobs({ projectId, pipelineId: pipeline.id }));
        });
        return Promise.all(promises).then((values) => values.flat());
      });
  }
}

exports.ProjectMonitorService = ProjectMonitorService;
