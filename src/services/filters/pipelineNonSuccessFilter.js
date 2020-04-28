const moment = require('moment');

const NON_SUCCESS_STATUS = {
  FAILED: 'failed',
  RUNNING: 'running',
  PENDING: 'pending',
};
const NONE_SUCCESS_VALUES = Object.values(NON_SUCCESS_STATUS);

const isNoneSuccess = (pipeline) => {
  const { status } = pipeline;
  return NONE_SUCCESS_VALUES.indexOf(status) !== -1;
};

const getLastUpdated = (pipelineA, pipelineB) => {
  if (moment(pipelineA.updatedAt).isAfter(pipelineB.updatedAt)) { return pipelineA; }
  return pipelineB;
};

const filter = (pipelines) => {
  const pipelinesByRefs = {};
  pipelines.forEach((pipeline) => {
    if (isNoneSuccess(pipeline)) {
      if (!pipelinesByRefs[pipeline.ref]) {
        pipelinesByRefs[pipeline.ref] = pipeline;
      } else {
        pipelinesByRefs[pipeline.ref] = getLastUpdated(pipelinesByRefs[pipeline.ref], pipeline);
      }
    }
  });

  return Object.values(pipelinesByRefs).flat();
};

exports.filter = filter;
