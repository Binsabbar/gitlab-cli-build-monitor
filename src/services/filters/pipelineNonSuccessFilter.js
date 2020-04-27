const NON_SUCCESS_STATUS = {
  FAILED: 'failed',
  RUNNING: 'running',
  PENDING: 'pending',
};

const isNoneSuccess = (pipeline) => {
  const { status } = pipeline;
  return Object.values(NON_SUCCESS_STATUS).indexOf(status) !== -1;
};

const filter = (pipelines) => {
  const pipeline = pipelines.filter(isNoneSuccess);
  return pipeline[0];
};

exports.filter = filter;
