const { filter: pipelineNonSuccessFilter } = require('./pipelineNonSuccessFilter');
const { filter: jobNonSuccessFilter } = require('./jobNonSuccessFilter');

const FILTER_TYPE = Object.freeze({
  PIPELINE: 'pipeline',
  JOB: 'job',
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
