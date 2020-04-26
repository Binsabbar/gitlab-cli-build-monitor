const s = require('./scheduler');

class PipelinesMonitor {
  constructor({ gitlabClient, gitlabConfig }) {
    this.gitlabConfig = gitlabConfig;
    this.gitlabClient = gitlabClient;
  }

  check() {
    const { projects } = this.gitlabConfig;
    const promises = [];
    projects.forEach((projectId) => {
      promises.push(this.gitlabClient.getProject({ projectId }));
    });

    return Promise.allSettled(promises).then((values) => PipelinesMonitor.handleCheck(values));
  }

  static handleCheck(values) {
    const rejected = values.filter((v) => v.status === 'rejected');
    if (rejected.length === 0) return true;

    const reasons = rejected.map((rejectedPromise) => rejectedPromise.reason);
    return Promise.reject(reasons);
  }
}

exports.PipelinesMonitor = PipelinesMonitor;
