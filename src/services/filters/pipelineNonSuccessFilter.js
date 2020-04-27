const moment = require('moment');

const NON_SUCCESS_STATUS = {
  FAILED: 'failed',
  RUNNING: 'running',
  PENDING: 'pending',
};

const isNoneSuccess = (pipeline) => {
  const { status } = pipeline;
  return Object.values(NON_SUCCESS_STATUS).indexOf(status) !== -1;
};

const getLatestUpdated = (pipelines) => {
  let latestUpdatedPipeline;
  let currentUpdatedDate = moment(0);

  pipelines.forEach((pipeline) => {
    if (moment(pipeline.updatedAt).isAfter(currentUpdatedDate)) {
      latestUpdatedPipeline = pipeline;
      currentUpdatedDate = pipeline.updatedAt;
    }
  });

  return [latestUpdatedPipeline];
};
const filter = (pipelines) => {
  const nonSuccPipelines = pipelines.filter(isNoneSuccess);
  if (nonSuccPipelines.length === 0) return nonSuccPipelines;
  return getLatestUpdated(nonSuccPipelines);
};

exports.filter = filter;
