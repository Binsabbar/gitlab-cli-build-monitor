
const nonSuccessStatus = ['failed', 'pending', 'canceled', 'running'];

const isNoneSuccess = (pipeline) => {
  const { status } = pipeline;
  return nonSuccessStatus.indexOf(status) !== -1;
};

const filter = (pipelines) => {
  const pipeline = pipelines.filter(isNoneSuccess);
  return pipeline[0];
};

exports.filter = filter;
