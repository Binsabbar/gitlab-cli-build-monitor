const axios = require('axios').default;
const { gitlabApiPaths } = require('./gitlabApiPaths');


const sendRequest = (instance, path, config) => instance.get(path, config)
  .then((response) => response.data)
  .catch((err) => {
    if (err.response) {
      const { status, data } = err.response;
      return { status, data };
    }
    return { message: err.message };
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
    const path = gitlabApiPaths.project(projectId);
    return sendRequest(this.instance, path);
  }

  getProjectPipelines({ projectId, updatedAfter }) {
    const path = gitlabApiPaths.pipelines({ projectId });
    const requestConfig = {
      params: { updated_after: updatedAfter, sort: 'desc' },
    };
    return sendRequest(this.instance, path, requestConfig);
  }
}

exports.GitlabClient = GitlabClient;
