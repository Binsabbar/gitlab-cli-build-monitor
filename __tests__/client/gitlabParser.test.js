const { Project, Job, Pipeline } = require('../../src/models');
const { GitlabParser } = require('../../src/client/gitlabParser');

const project = require('../__data__/project.json');
const pipeline = require('../__data__/pipeline.json');
const job = require('../__data__/job.json');

describe('GitlabParser', () => {
  it('parses project json into Project model', () => {
    const expected = new Project({
      id: 123123,
      path_with_namespace: 'mygroup/my-project',
      name: 'my-project',
    });

    const result = GitlabParser.parseProject(project);

    expect(result).toEqual(expected);
  });

  it('parses pipeline json into Pipeline model', () => {
    const expected = new Pipeline({
      id: 231313,
      ref: 'my-ref',
      status: 'failed',
      created_at: '2000-04-22T13:39:13.272Z',
      updated_at: '2000-04-22T13:39:33.245Z',
    });

    const result = GitlabParser.parsePipeline(pipeline);

    expect(result).toEqual(expected);
  });

  it('parses jpb json into Job model', () => {
    const expected = new Job({
      id: 10946,
      name: 'build-node',
      stage: 'build',
      status: 'failed',
      started_at: '2000-04-22T13:39:15.737Z',
      finished_at: '2000-04-22T13:39:32.939Z',
      ref: 'my-ref',
    });

    const result = GitlabParser.parseJob(job);

    expect(result).toEqual(expected);
  });
});
