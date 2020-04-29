const { when } = require('jest-when');

const { JobMonitorService } = require('../../../src/services/monitors');
const { JobBuilder } = require('../../__builders__');

jest.mock('../../../src/services/filters');
jest.mock('../../../src/client');
const { FILTER_TYPE } = jest.requireActual('../../../src/services/filters');
const { getFilter: getFilterMock } = require('../../../src/services/filters');
const { GitlabClient } = require('../../../src/client');

const jobFilterMock = jest.fn();

describe('JobMonitorService', () => {
  const projectId = 'projectA';
  const pipelineId = '14';
  const unfilteredJobs = [
    new JobBuilder().withId('12').build(),
    new JobBuilder().withId('13').build(),
    new JobBuilder().withId('14').build(),
    new JobBuilder().withId('15').build(),
  ];
  const filteredJobs = [unfilteredJobs[0], unfilteredJobs[3]];
  const gitlabClient = new GitlabClient();
  const monitor = new JobMonitorService({ gitlabClient, getFilter: getFilterMock });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns resolved promise of a list of filtered jobs given project & pipeline', async () => {
    when(gitlabClient.getPipelineJobs)
      .calledWith({ projectId, pipelineId })
      .mockResolvedValue(unfilteredJobs);
    when(getFilterMock)
      .calledWith({ type: FILTER_TYPE.JOB }).mockReturnValue(jobFilterMock);
    when(jobFilterMock).calledWith(unfilteredJobs).mockReturnValue(filteredJobs);

    const jobs = await monitor.getJobs({ projectId, pipelineId });

    expect(jobs).toEqual(filteredJobs);
  });

  it('returns rejected promise when error occurs', () => {
    when(gitlabClient.getPipelineJobs)
      .calledWith({ projectId, pipelineId }).mockRejectedValue(new Error('Error Occured'));

    return expect(monitor.getJobs({ projectId, pipelineId }))
      .rejects.toThrowError('Error Occured');
  });
});
