const moment = require('moment');

const NON_SUCCESS_STATUS = {
  FAILED: 'failed',
  RUNNING: 'running',
  PENDING: 'pending',
};
const NONE_SUCCESS_VALUES = Object.values(NON_SUCCESS_STATUS);

const isRunning = (pipeline) => pipeline.status === NON_SUCCESS_STATUS.RUNNING;
const isNoneSuccess = (pipeline) => {
  const { status } = pipeline;
  return NONE_SUCCESS_VALUES.indexOf(status) !== -1;
};

const getLastUpdated = (pipelineA, pipelineB) => {
  if (moment(pipelineA.updatedAt).isAfter(pipelineB.updatedAt)) return pipelineA;
  return pipelineB;
};

const filter = (pipelines) => {
  const latestUpdatedInRef = {};
  const runningPipelines = [];

  pipelines.forEach((pipeline) => {
    if (isRunning(pipeline)) runningPipelines.push(pipeline);
    else {
      const { ref } = pipeline;
      const piplineToCompareWith = latestUpdatedInRef[ref] || pipeline;
      latestUpdatedInRef[pipeline.ref] = getLastUpdated(piplineToCompareWith, pipeline);
    }
  });

  return Object.values(latestUpdatedInRef).filter(isNoneSuccess).concat(runningPipelines);
};

exports.filter = filter;
