const { GitlabClient } = require('./client');
const { MonitorService } = require('./services');
const {
  JobMonitorService,
  PipelineMonitorService,
  ProjectMonitorService,
} = require('./services/monitors');
const { getFilter } = require('./services/filters');

const SERVICES = {
  GITLAB_CLIENT: 'GitlabClient',
  MONITOR_SERVICE: 'MonitorService',
};

let initializer;
const initializeMonitorService = (config) => {
  const gitlabClient = initializer[SERVICES.GITLAB_CLIENT](config);
  const jobMonitorService = new JobMonitorService({ gitlabClient, getFilter });
  const pipelineMonitorService = new PipelineMonitorService({ gitlabClient, getFilter });

  const projectMonitorService = new ProjectMonitorService({
    gitlabClient,
    pipelineMonitorService,
    jobMonitorService,
  });

  return new MonitorService({ projectMonitorService });
};

initializer = {
  [SERVICES.GITLAB_CLIENT]: (args) => {
    const { accessToken, baseUrl } = args;
    return new GitlabClient({ accessToken, baseUrl });
  },
  [SERVICES.MONITOR_SERVICE]: (args) => initializeMonitorService(args),
};

const getService = (service, args) => initializer[service](args);

exports.getService = getService;
exports.SERVICES = SERVICES;
