const { filter: pipelineNonSuccessFilter } = require('./pipelineNonSuccessFilter');
const { filter: jobNonSuccessFilter } = require('./jobNonSuccessFilter');

module.exports = {
  pipelineNonSuccessFilter,
  jobNonSuccessFilter,
};
