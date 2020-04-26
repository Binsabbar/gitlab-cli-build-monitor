const handleGitlabClientErrors = (gitlabClientError) => {
  let message = 'The following errors occured\n';
  message += 'projectId: status\n';
  gitlabClientError.forEach((error) => {
    message += `${error.projectId}: ${error.status}\n`;
  });
  return message;
};

exports.handleGitlabClientErrors = handleGitlabClientErrors;
