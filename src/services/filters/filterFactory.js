const { pipelineNonSuccessFilter, jobNonSuccessFilter } = require('.');

const FILTER_TYPE = Object.freeze({
  PIPELINE: Symbol('pipeline'),
  JOB: Symbol('job'),
});

const getFilter = ({ type }) => {
  switch (type) {
    case FILTER_TYPE.PIPELINE:
      return pipelineNonSuccessFilter;
    case FILTER_TYPE.JOB:
      return jobNonSuccessFilter;
    default:
      return {};
  }
};

exports.getFilter = getFilter;
exports.FILTER_TYPE = FILTER_TYPE;
