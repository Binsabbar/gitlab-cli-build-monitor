const { GitlabParser } = require('../../src/client/gitlabParser');

const project = require('../__data__/project.json');
const pipeline = require('../__data__/pipeline.json');
const job = require('../__data__/job.json');

describe('GitlabParser', () => {
  it('parses project json into Project model', () => {
    const expected = {
      id: 123123,
      pathWithNamespace: 'mygroup/my-project',
      name: 'my-project',
    };

    const result = GitlabParser.parseProject(project);

    expect(result).toEqual(expected);
  });

  it('parses pipeline json into Pipeline model', () => {
    const expected = {
      id: 231313,
      ref: 'my-ref',
      status: 'failed',
      createdAt: '2000-04-22T13:39:13.272Z',
      updatedAt: '2000-04-22T13:39:33.245Z',
    };

    const result = GitlabParser.parsePipeline(pipeline);

    expect(result).toEqual(expected);
  });

  it('parses job json into Job model', () => {
    const expected = {
      id: 10946,
      name: 'build-node',
      stage: 'build',
      status: 'failed',
      startedAt: '2000-04-22T13:39:15.737Z',
      finishedAt: '2000-04-22T13:39:32.939Z',
      createdAt: '2000-04-22T13:39:13.283Z',
      ref: 'my-ref',
    };

    const result = GitlabParser.parseJob(job);

    expect(result).toEqual(expected);
  });
});
