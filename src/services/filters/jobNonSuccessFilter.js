const NON_SUCCESS_STATUS = {
  FAILED: 'failed',
  RUNNING: 'running',
  PENDING: 'pending',
};

const NONE_SUCCESS_VALUES = Object.values(NON_SUCCESS_STATUS);

const isNoneSuccess = (job) => {
  const { status } = job;
  return NONE_SUCCESS_VALUES.indexOf(status) !== -1;
};

const filter = (jobs) => jobs.filter(isNoneSuccess);

exports.filter = filter;
