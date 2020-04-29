const { FILTER_TYPE } = require('../filters');

class JobMonitorService {
  constructor({ gitlabClient, getFilter }) {
    this.gitlabClient = gitlabClient;
    this.getFilter = getFilter;
  }

  getJobs({ project, pipeline }) {
    const { id: projectId } = project;
    const { id: pipelineId } = pipeline;
    const filter = this.getFilter({ type: FILTER_TYPE.JOB });
    return this.gitlabClient.getPipelineJobs({ projectId, pipelineId })
      .then((jobs) => filter(jobs));
  }
}

exports.JobMonitorService = JobMonitorService;
