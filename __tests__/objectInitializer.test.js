const { getService, SERVICES } = require('../src/objectsInitializer');
const { GitlabClient } = require('../src/client');
const { MonitorService } = require('../src/services');
const {
  ProjectMonitorService,
  PipelineMonitorService,
  JobMonitorService,
} = require('../src/services/monitors');
const { GitlabConfig } = require('../src/utils/gitlabConfig');
const { getFilter } = require('../src/services/filters');

describe('Object Initializer', () => {
  const config = new GitlabConfig(
    {
      baseUrl: 'url', accessToken: 'token', projects: [1, 2], updateIntervals: 10,
    },
  );

  it('returns GitLabClient', () => {
    const gitlabClient = getService(SERVICES.GITLAB_CLIENT, config);

    expect(gitlabClient).toBeInstanceOf(GitlabClient);
    expect(gitlabClient.instance.defaults.baseURL).toEqual('url');
    expect(gitlabClient.instance.defaults.headers['Private-Token']).toEqual('token');
  });

  it('returns fully initialized MonitorService', () => {
    const service = getService(SERVICES.MONITOR_SERVICE, config);

    expect(service).toBeInstanceOf(MonitorService);

    expect(service.projectService).toBeInstanceOf(ProjectMonitorService);
    expect(service.projectService.client).toBeInstanceOf(GitlabClient);
    expect(service.projectService.client).toBeInstanceOf(GitlabClient);

    expect(service.projectService.pipelineService).toBeInstanceOf(PipelineMonitorService);
    expect(service.projectService.pipelineService.client).toBeInstanceOf(GitlabClient);
    expect(service.projectService.pipelineService.getFilter).toEqual(getFilter);

    expect(service.projectService.jobService).toBeInstanceOf(JobMonitorService);
    expect(service.projectService.jobService.client).toBeInstanceOf(GitlabClient);
    expect(service.projectService.jobService.getFilter).toEqual(getFilter);
  });
});
