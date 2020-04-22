const path = require('path');
const dotenv = require('dotenv');
const { GitlabClient } = require('../../src/client/gitlabClient');

const envPath = path.resolve(__dirname, '..', '..', '.env.test');
dotenv.config({ path: envPath });

describe('Gitlab Client', () => {
  const { accessToken, baseUrl, projectId } = process.env;

  it('returns object containing status code and data when response is not 200', async () => {
    const client = new GitlabClient({ baseUrl, accessToken: 'invalid' });
    const expectedSchema = {
      status: expect.any(Number),
      data: expect.objectContaining({ message: expect.any(String) }),
    };

    const result = await client.getProject({ projectId });

    expect(result).toMatchObject(expectedSchema);
  });

  it('returns object containg error message when request is invalid', async () => {
    const client = new GitlabClient({ baseUrl: 'invalid url', accessToken });
    const expectedSchema = { message: expect.any(String) };

    const result = await client.getProject({ projectId });

    expect(result).toMatchObject(expectedSchema);
  });

  it('returns project given valid project id', async () => {
    const client = new GitlabClient({ baseUrl, accessToken });
    const expectedSchema = ['id', 'name'];

    const project = await client.getProject({ projectId });

    expect(Object.keys(project)).toEqual(expect.arrayContaining(expectedSchema));
  });

  it('returns project pipelines given valid project id and time', async () => {
    const updatedAfter = new Date('2020-04-21T15:19:01.975Z').toISOString();
    const client = new GitlabClient({ baseUrl, accessToken });
    const expectedSchema = ['id', 'ref', 'status'];

    const pipelines = await client.getProjectPipelines({ projectId, updatedAfter });

    expect(Object.keys(pipelines[0])).toEqual(expect.arrayContaining(expectedSchema));
  });

  it('returns project pipelines given valid project id and time', async () => {
    const client = new GitlabClient({ baseUrl, accessToken });
    const updatedAfter = new Date('2020-04-21T15:19:01.975Z').toISOString();
    const pipelines = await client.getProjectPipelines({ projectId, updatedAfter });
    const expectedSchema = [
      'id', 'ref', 'status', 'started_at',
      'finished_at', 'created_at', 'updated_at'];

    const pipeline = await client.getPipelineDetails({ projectId, pipelineId: pipelines[0].id });

    expect(Object.keys(pipeline)).toEqual(expect.arrayContaining(expectedSchema));
  });
});
