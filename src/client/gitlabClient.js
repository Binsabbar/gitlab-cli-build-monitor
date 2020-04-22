const axios = require('axios').default;
const { gitlabApiPaths } = require('./gitlabApiPaths');
const { GitlabParser } = require('./gitlabParser');

const sendRequest = (instance, path, config) => instance.get(path, config)
  .then((response) => response.data)
  .catch((err) => {
    if (err.response) {
      const { status, data } = err.response;
      return Promise.reject(new Error({ status, data }));
    }
    return Promise.reject(new Error({ message: err.message }));
  });

class GitlabClient {
  constructor({ baseUrl, accessToken }) {
    this.gitlabToken = accessToken;
    this.instance = axios.create({
      baseURL: baseUrl,
      headers: { 'Private-Token': accessToken },
    });
  }

  getProject({ projectId }) {
    const path = gitlabApiPaths.project({ projectId });

    return sendRequest(this.instance, path)
      .then((data) => GitlabParser.parseProject(data));
  }

  getProjectPipelines({ projectId, updatedAfter }) {
    const path = gitlabApiPaths.pipelines({ projectId });
    const requestConfig = {
      params: { updated_after: updatedAfter, sort: 'desc' },
    };
    return sendRequest(this.instance, path, requestConfig)
      .then((data) => {
        const pipelines = [];
        data.forEach((pipeline) => {
          pipelines.push(GitlabParser.parsePipeline(pipeline));
        });
        return pipelines;
      });
  }

  getPipelineDetails({ projectId, pipelineId }) {
    const path = gitlabApiPaths.projectPipeline({ projectId, pipelineId });
    return sendRequest(this.instance, path);
  }

  getPipelineJobs({ projectId, pipelineId }) {
    const path = gitlabApiPaths.projectPipelineJobs({ projectId, pipelineId });
    return sendRequest(this.instance, path)
      .then((data) => {
        const jobs = [];
        data.forEach((job) => {
          jobs.push(GitlabParser.parseJob(job));
        });
        return jobs;
      });
  }
}

exports.GitlabClient = GitlabClient;
