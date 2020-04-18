const yaml = require('js-yaml');
const fs = require('fs');
const { validate } = require('../../src/utils/configValidator.js');

const path = `${__dirname}/data`;
const parseYaml = (filename) => yaml.safeLoad(fs.readFileSync(`${path}/${filename}`), 'utf8');

const sharedExmaple = (filename, testcase, expected) => {
  it(`returns error when value is ${testcase}`, () => {
    const input = parseYaml(filename);
    const result = validate(input);

    expect(result).toEqual(expected);
  });
};

describe('ConfigValidator', () => {
  describe('when keys are missing', () => {
    it('returns error given gitlab_access_token is not present  ', () => {
      const input = parseYaml('missing-token-key.yml');
      const result = validate(input);

      expect(result).toEqual({ error: 'gitlab_access_token is missing' });
    });

    it('returns error given projects is not present  ', () => {
      const input = parseYaml('missing-projects-key.yml');
      const result = validate(input);

      expect(result).toEqual({ error: 'projects is missing' });
    });

    it('returns error given update_intervals is not present  ', () => {
      const input = parseYaml('missing-intervals-key.yml');
      const result = validate(input);

      expect(result).toEqual({ error: 'update_intervals is missing' });
    });
  });

  describe('when keys are valid', () => {
    it('returns configuration object', () => {
      const input = parseYaml('valid-config.yml');
      const result = validate(input);

      const expected = {
        gitlab_access_token: 'some-token-goes-here',
        projects: ['groupA/projectA'],
        update_intervals: 50,
      };

      expect(result).toEqual(expected);
    });
  });

  describe('when keys type are wrong', () => {
    describe('gitlab_access_token', () => {
      const expected = { error: 'gitlab_access_token must be string' };
      [
        ['invalid-token-1.yml', 'number', expected],
        ['invalid-token-2.yml', 'object', expected],
        ['invalid-token-3.yml', 'array', expected],
        ['invalid-token-4.yml', 'boolean', expected],
      ].forEach((v) => sharedExmaple(...v));
    });

    describe('projects', () => {
      const expected = { error: 'projects must be array' };
      [
        ['invalid-projects-1.yml', 'number', expected],
        ['invalid-projects-2.yml', 'string', expected],
        ['invalid-projects-3.yml', 'object', expected],
        ['invalid-projects-4.yml', 'boolean', expected],
      ].forEach((v) => sharedExmaple(...v));
    });

    describe('update_intervals', () => {
      const expected = { error: 'update_intervals must be number' };
      [
        ['invalid-intervals-1.yml', 'array', expected],
        ['invalid-intervals-2.yml', 'object', expected],
        ['invalid-intervals-3.yml', 'string', expected],
        ['invalid-intervals-4.yml', 'boolean', expected],
      ].forEach((v) => sharedExmaple(...v));
    });
  });
});
