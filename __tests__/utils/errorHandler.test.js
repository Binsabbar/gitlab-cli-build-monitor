const { handleGitlabClientErrors } = require('../../src/utils/errorHandler.js');
const { GitlabClientError } = require('../../src/client');

describe('serviceErrorHandler', () => {
  it('returns list of projects alongside the error', () => {
    const error1 = new GitlabClientError({ status: 401, projectId: '1' });
    const error2 = new GitlabClientError({ status: 404, projectId: '2' });
    const error3 = new GitlabClientError({ status: 405, projectId: 'group/A' });

    const expected = 'The following errors occured\n'
    + 'projectId: status\n'
    + '1: 401\n'
    + '2: 404\n'
    + 'group/A: 405\n';

    const result = handleGitlabClientErrors([error1, error2, error3]);

    expect(result).toBe(expected);
  });
});
