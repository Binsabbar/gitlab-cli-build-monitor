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
  const clientErrors = new Table({ head: ['Project ID', 'Error Status'] });
  const otherErros = new Table({ head: ['Message'] });
  let errorsArr = errors;
  if (!Array.isArray(errors)) errorsArr = [errors];
  errorsArr.forEach((error) => {
    if (error.status && error.projectId) {
      clientErrors.push([error.projectId, error.status]);
    } else {
      otherErros.push([error.message]);
    }
  });

  return formatFinalMessage(clientErrors, otherErros);
};

exports.handleGitlabClientErrors = handleGitlabClientErrors;
