jest.mock('../../../src/services/filters');
const { getFilter, FILTER_TYPE } = jest.requireActual('../../../src/services/filters');
const { pipelineNonSuccessFilter, jobNonSuccessFilter } = require('../../../src/services/filters');


describe('filterFactory', () => {
  it('returns pipeline filter function when given pipeline type', () => {
    const type = FILTER_TYPE.PIPELINE;

    const filter = getFilter({ type });

    expect(filter).toEqual(pipelineNonSuccessFilter);
  });

  it('returns pipeline filter function when given job type', () => {
    const type = FILTER_TYPE.JOB;

    const filter = getFilter({ type });

    expect(filter).toEqual(jobNonSuccessFilter);
  });
});
