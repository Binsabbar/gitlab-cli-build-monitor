const { FILTER_TYPE } = require('../filters');

class PipelineMonitorService {
  constructor({ gitlabClient, getFilter }) {
    this.client = gitlabClient;
    this.getFilter = getFilter;
  }

  getPipelines({ projectId }) {
    const filter = this.getFilter({ type: FILTER_TYPE.PIPELINE });
    return this.client.getProjectPipelines({ projectId })
      .then((pipelines) => filter(pipelines));
  }
}

exports.PipelineMonitorService = PipelineMonitorService;
