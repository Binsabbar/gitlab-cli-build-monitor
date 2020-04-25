
class PipelinesMonitor {
  constructor({ gitlabClient, gitlabConfig, errorHandler }) {
    this.gitlabConfig = gitlabConfig;
    this.gitlabClient = gitlabClient;
    this.errorHandler = errorHandler;
  }

  check() {
    const { projects } = this.gitlabConfig;
    const promises = [];
    projects.forEach((projectId) => {
      promises.push(this.gitlabClient.getProject({ projectId }));
    });

    return Promise.allSettled(promises).then((values) => this.handleCheck(values));
  }

  handleCheck(values) {
    const rejected = values.filter((v) => v.status === 'rejected');
    if (rejected.length === 0) return true;

    const reasons = [];
    rejected.forEach((reason) => reasons.push(reason));
    return Promise.reject(this.errorHandler(reasons));
  }
}

exports.PipelinesMonitor = PipelinesMonitor;
