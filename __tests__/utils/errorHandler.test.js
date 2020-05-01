const { handleGitlabClientErrors } = require('../../src/utils');
const { GitlabClientError } = require('../../src/client');

describe('serviceErrorHandler', () => {
  it('returns list of projects alongside the error', () => {
    const error1 = new GitlabClientError({ status: 401, projectId: '1' });
    const error3 = new GitlabClientError({ status: 405, projectId: 'group/A' });

    const result = handleGitlabClientErrors([error1, error3]);

    expect(result).not.toMatch(/.*Message.*/);
    expect(result).toMatch(/.*Project ID.*Error Status.*/);
    expect(result).toMatch(/.*1.*401.*/);
    expect(result).toMatch(/.*group\/A.*405.*/);
  });

  it('returns message of the error if it is not of type GitlabClientError', () => {
    const error1 = new Error('Error');

    const result = handleGitlabClientErrors([error1]);

    expect(result).not.toMatch(/.*Project ID.*Error Status.*/);
    expect(result).toMatch(/.*Message.*/);
    expect(result).toMatch(/.*Error.*/);
  });

  it('returns message of the error if it is an array', () => {
    const error1 = new Error('Error');

    const result = handleGitlabClientErrors(error1);

    expect(result).not.toMatch(/.*Project ID.*Error Status.*/);
    expect(result).toMatch(/.*Message.*/);
    expect(result).toMatch(/.*Error.*/);
  });

  it('returns both GitlabClientError and Error messages', () => {
    const error1 = new Error('Error');
    const error2 = new GitlabClientError({ status: 405, projectId: 'group/A' });

    const result = handleGitlabClientErrors([error1, error2]);

    expect(result).toMatch(/.*Project ID.*Error Status.*/);
    expect(result).toMatch(/.*group\/A.*405.*/);
    expect(result).toMatch(/.*Message.*/);
    expect(result).toMatch(/.*Error.*/);
  });
});
