const axios = require('axios').default;
const { gitlabApiPaths } = require('./gitlabApiPaths');

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
    return this.instance.get(path)
      .then((response) => response.data)
      .catch((err) => {
        if (err.response) {
          const { status, data } = err.response;
          return { status, data };
        }
      });
  }
}

exports.GitlabClient = GitlabClient;
