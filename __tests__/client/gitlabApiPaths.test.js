const { gitlabApiPaths } = require('../../src/client/gitlabApiPaths');

describe('gitlabApiPaths', () => {
  it('returns the api path for project given id', () => {
    const projectPath = gitlabApiPaths.project({ projectId: 24 });
    const expected = '/projects/24/';

    expect(projectPath).toEqual(expected);
  });

  it('returns the api path for project pipelines given id', () => {
    const projectPath = gitlabApiPaths.pipelines({ projectId: 24 });
    const expected = '/projects/24/pipelines/';

    expect(projectPath).toEqual(expected);
  });

  it('returns the api path for a single pipeline given id', () => {
    const projectPath = gitlabApiPaths.projectPipeline({ projectId: 24, pipelineId: 44 });
    const expected = '/projects/24/pipelines/44/';

    expect(projectPath).toEqual(expected);
  });

  it('returns the api path for a single pipeline given id', () => {
    const projectPath = gitlabApiPaths.projectPipelineJobs({ projectId: 24, pipelineId: 44 });
    const expected = '/projects/24/pipelines/44/jobs';

    expect(projectPath).toEqual(expected);
  });
});
