const { when } = require('jest-when');

const { PipelineMonitorService } = require('../../../src/services/monitors');
const { PipelineBuilder } = require('../../__builders__');

jest.mock('../../../src/services/filters');
jest.mock('../../../src/client');
const { FILTER_TYPE } = jest.requireActual('../../../src/services/filters');
const { getFilter: getFilterMock } = require('../../../src/services/filters');
const { GitlabClient } = require('../../../src/client');

const pipelineFilterMock = jest.fn();

describe('PipelineMonitorService', () => {
  const projectId = 'projectA';
  const unfilteredPipelines = [
    new PipelineBuilder().withId('projectA').build(),
    new PipelineBuilder().withId('projectB').build(),
    new PipelineBuilder().withId('projectC').build(),
    new PipelineBuilder().withId('projectD').build(),
  ];
  const filteredPipelines = [unfilteredPipelines[0], unfilteredPipelines[1]];

  const gitlabClient = new GitlabClient();
  const monitor = new PipelineMonitorService({ gitlabClient, getFilter: getFilterMock });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns resolved promise of a list of filtered pipelines given a project', async () => {
    when(gitlabClient.getProjectPipelines)
      .calledWith({ projectId }).mockResolvedValue(unfilteredPipelines);
    when(getFilterMock)
      .calledWith({ type: FILTER_TYPE.PIPELINE }).mockReturnValue(pipelineFilterMock);
    when(pipelineFilterMock).calledWith(unfilteredPipelines).mockReturnValue(filteredPipelines);

    const Pipelines = await monitor.getPipelines({ projectId });

    expect(Pipelines).toEqual(filteredPipelines);
  });

  it('returns rejected promise when error occurs', () => {
    when(gitlabClient.getProjectPipelines)
      .calledWith({ projectId })
      .mockRejectedValue(new Error('Error Occured'));

    return expect(monitor.getPipelines({ projectId })).rejects.toThrowError('Error Occured');
  });
});
