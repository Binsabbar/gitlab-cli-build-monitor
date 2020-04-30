const { FILTER_TYPE } = require('../filters');

class JobMonitorService {
  constructor({ gitlabClient, getFilter }) {
    this.client = gitlabClient;
    this.getFilter = getFilter;
  }

  getJobs({ projectId, pipelineId }) {
    const filter = this.getFilter({ type: FILTER_TYPE.JOB });
    return this.client.getPipelineJobs({ projectId, pipelineId })
      .then((jobs) => filter(jobs));
  }
}

exports.JobMonitorService = JobMonitorService;
