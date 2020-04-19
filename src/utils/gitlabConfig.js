
class GitlabConfig {
  constructor({
    baseUrl, accessToken,
    projects, updateIntervals,
  }) {
    this.baseUrl = baseUrl;
    this.accessToken = accessToken;
    this.projects = projects;
    this.updateIntervals = updateIntervals;
  }
}
