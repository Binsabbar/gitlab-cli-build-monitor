const axios = require('axios').default;
const { gitlabApiPaths } = require('./gitlabApiPaths');
const { GitlabParser } = require('./gitlabParser');
const { GitlabClientError } = require('./gitlabClientError');

const sendRequest = (instance, path, projectId, config) => instance.get(path, config)
  .then((response) => response.data)
  .catch((err) => {
    if (err.response) {
      const { status, data } = err.response;
      return Promise.reject(new GitlabClientError({ message: data, status, projectId }));
    }
    return Promise.reject(new GitlabClientError({ message: err.message, projectId }));
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
    const encodedId = encodeURIComponent(projectId);
    const path = gitlabApiPaths.project({ projectId: encodedId });

    return sendRequest(this.instance, path, projectId)
      .then((data) => GitlabParser.parseProject(data));
  }

  getProjectPipelines({ projectId }) {
    const encodedId = encodeURIComponent(projectId);
    const path = gitlabApiPaths.pipelines({ projectId: encodedId });
    const requestConfig = { params: { sort: 'desc' } };

    return sendRequest(this.instance, path, projectId, requestConfig)
      .then((data) => {
        const pipelines = [];
        data.forEach((pipeline) => {
          pipelines.push(GitlabParser.parsePipeline(pipeline));
        });
        return pipelines;
      });
  }

  getPipelineDetails({ projectId, pipelineId }) {
    const encodedId = encodeURIComponent(projectId);
    const path = gitlabApiPaths.projectPipeline({ projectId: encodedId, pipelineId });
    return sendRequest(this.instance, path, projectId);
  }

  getPipelineJobs({ projectId, pipelineId }) {
    const encodedId = encodeURIComponent(projectId);
    const path = gitlabApiPaths.projectPipelineJobs({ projectId: encodedId, pipelineId });

    return sendRequest(this.instance, path, projectId)
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
