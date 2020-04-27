/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */

const handleStatus = (values) => {
  const promiseResult = values.map((v) => v.value);
  return promiseResult;
};

const handleCheck = (values) => {
  const rejected = values.filter((v) => v.status === 'rejected');
  if (rejected.length === 0) return true;

  const reasons = rejected.map((rejectedPromise) => rejectedPromise.reason);
  return Promise.reject(reasons);
};

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

    return Promise.allSettled(promises).then((values) => handleCheck(values));
  }

  getStatus() {
    const { projects } = this.gitlabConfig;
    const promises = [];

    projects.forEach((projectId) => {
      const jobPromise = this.gitlabClient.getProject({ projectId })
        .then((project) => this._getPipelines(project))
        .then(([project, pipelines]) => this._getPipelineJobs(project, pipelines))
        .then(([project, jobs]) => this._getRecentStatus(project, jobs));
      promises.push(jobPromise);
    });

    return Promise.allSettled(promises).then(handleStatus);
  }

  _getPipelines(project) {
    const pipelines = this.gitlabClient.getProjectPipelines({ projectId: project.id });
    return Promise.all([project, pipelines]);
  }

  _getPipelineJobs(project, pipelines) {
    const jobs = this.gitlabClient.getPipelineJobs({
      projectId: project.id,
      pipelineId: pipelines[0].id,
    });
    return Promise.all([project, jobs]);
  }

  _getRecentStatus(project, jobs) {
    return { project, ...jobs[0] };
  }
}

exports.PipelinesMonitor = PipelinesMonitor;
