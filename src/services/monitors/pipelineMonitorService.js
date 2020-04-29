const { FILTER_TYPE } = require('../filters');

class PipelineMonitorService {
  constructor({ gitlabClient, getFilter }) {
    this.gitlabClient = gitlabClient;
    this.getFilter = getFilter;
  }

  getPipelines({ project }) {
    const { id: projectId } = project;
    const filter = this.getFilter({ type: FILTER_TYPE.PIPELINE });
    return this.gitlabClient.getProjectPipelines({ projectId })
      .then((pipelines) => filter(pipelines));
  }
}

exports.PipelineMonitorService = PipelineMonitorService;
