const path = require('path');
const dotenv = require('dotenv');
const { GitlabClient } = require('../../src/client/gitlabClient');

const envPath = path.resolve(__dirname, '..', '..', '.env.test');
dotenv.config({ path: envPath });

describe('Gitlab Client', () => {
  const { accessToken, baseUrl, projectId } = process.env;

  it('returns project given valid project id', async () => {
    const client = new GitlabClient({ baseUrl, accessToken });
    const expectedSchema = ['id', 'name'];

    const project = await client.getProject({ projectId });

    expect(Object.keys(project)).toEqual(expect.arrayContaining(expectedSchema));
  });
});
