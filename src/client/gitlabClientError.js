class GitlabClientError extends Error {
  constructor({ status, message, projectId }) {
    super(message);
    this.status = status;
    this.projectId = projectId;
  }
}

exports.GitlabClientError = GitlabClientError;
