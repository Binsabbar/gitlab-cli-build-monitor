jest.mock('../../../src/services/filters/pipelineNonSuccessFilter');
jest.mock('../../../src/services/filters/jobNonSuccessFilter');
const { getFilter, FILTER_TYPE } = jest.requireActual('../../../src/services/filters');
// eslint-disable-next-line max-len
const { filter: pipelineFilter } = require('../../../src/services/filters/pipelineNonSuccessFilter');
const { filter: jobNonFilter } = require('../../../src/services/filters/jobNonSuccessFilter');

describe('filterFactory', () => {
  pipelineFilter.mockReturnValue(1);
  jobNonFilter.mockReturnValue(2);

  it('returns pipeline filter function when given pipeline type', () => {
    const type = FILTER_TYPE.PIPELINE;

    const filter = getFilter({ type });

    expect(filter).toEqual(pipelineFilter);
    expect(filter()).toEqual(1);
  });

  it('returns pipeline filter function when given job type', () => {
    const type = FILTER_TYPE.JOB;

    const filter = getFilter({ type });

    expect(filter).toEqual(jobNonFilter);
    expect(filter()).toEqual(2);
  });
});
