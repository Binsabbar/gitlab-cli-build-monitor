const path = require('path');
const dotenv = require('dotenv');
const { GitlabClient } = require('../../src/client/gitlabClient');

const envPath = path.resolve(__dirname, '..', '..', '.env.test');
dotenv.config({ path: envPath });

describe('Gitlab Client', () => {
  const { accessToken, baseUrl, projectId } = process.env;
  const client = new GitlabClient({ baseUrl, accessToken });

  it('returns object containing status code and data when response is not 200', async () => {
    const invalidClient = new GitlabClient({ baseUrl, accessToken: 'invalid' });
    const expectedSchema = { message: expect.any(String), projectId, status: 401 };

    return expect(invalidClient.getProject({ projectId }))
      .rejects.toEqual(expect.objectContaining(expectedSchema));
  });

  it('returns object containg error message when request is invalid', async () => {
    const invalidClient = new GitlabClient({ baseUrl: 'invalid url', accessToken });
    const expectedSchema = { message: expect.any(String), projectId, status: undefined };

    return expect(invalidClient.getProject({ projectId }))
      .rejects.toEqual(expect.objectContaining(expectedSchema));
  });

  it('returns project given valid project id', async () => {
    const expectedSchema = ['id', 'name'];

    const project = await client.getProject({ projectId });

    expect(Object.keys(project)).toEqual(expect.arrayContaining(expectedSchema));
  });

  it('returns project pipelines given valid project id and time', async () => {
    const expectedSchema = ['id', 'ref', 'status'];

    const pipelines = await client.getProjectPipelines({ projectId });

    expect(Object.keys(pipelines[0])).toEqual(expect.arrayContaining(expectedSchema));
  });

  it('returns pipeline details given project and pipeline ids', async () => {
    const pipelines = await client.getProjectPipelines({ projectId });
    const expectedSchema = [
      'id', 'ref', 'status', 'started_at',
      'finished_at', 'created_at', 'updated_at'];

    const pipeline = await client.getPipelineDetails({ projectId, pipelineId: pipelines[0].id });

    expect(Object.keys(pipeline)).toEqual(expect.arrayContaining(expectedSchema));
  });

  it('returns pipeline jobs given project and pipeline ids', async () => {
    const pipelines = await client.getProjectPipelines({ projectId });
    const expectedSchema = ['id', 'name', 'stage', 'status', 'finishedAt', 'startedAt', 'ref'];
    const jobs = await client.getPipelineJobs({ projectId, pipelineId: pipelines[0].id });

    expect(Object.keys(jobs[0])).toEqual(expect.arrayContaining(expectedSchema));
  });
});
