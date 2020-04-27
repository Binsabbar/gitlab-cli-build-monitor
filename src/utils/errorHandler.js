const Table = require('cli-table3');

const formatFinalMessage = (clientErrors, otherErros) => {
  if (clientErrors.length > 0 && otherErros.length === 0) {
    return clientErrors.toString();
  } if (otherErros.length > 0 && clientErrors.length === 0) {
    return otherErros.toString();
  }
  return `${clientErrors.toString()}\n${otherErros.toString()}`;
};

const handleGitlabClientErrors = (errors) => {
  const clientErrors = new Table({ head: ['Project ID', 'Status'] });
  const otherErros = new Table({ head: ['Message'] });

  errors.forEach((error) => {
    if (error.status && error.projectId) {
      clientErrors.push([error.projectId, error.status]);
    } else {
      otherErros.push([error.message]);
    }
  });

  return formatFinalMessage(clientErrors, otherErros);
};

exports.handleGitlabClientErrors = handleGitlabClientErrors;
