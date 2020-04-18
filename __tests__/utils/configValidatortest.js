const yaml = require('js-yaml');
const fs = require('fs');
const { validate } = require('../../src/utils/configValidator.js');

const path = `${__dirname}/data`;
const parseYaml = (filename) => yaml.safeLoad(fs.readFileSync(`${path}/${filename}`), 'utf8');

describe('ConfigValidator', () => {
  describe('when keys are missing', () => {
    const sharedTest = ({ missingKey, testFile }) => {
      it(`returns error given ${missingKey} is not present`, () => {
        const input = parseYaml(testFile);
        const result = validate(input);

        expect(result).toEqual({ error: `${missingKey} is missing` });
      });
    };

    [
      { missingKey: 'gitlab_access_token', testFile: 'missing-token-key.yml' },
      { missingKey: 'projects', testFile: 'missing-projects-key.yml' },
      { missingKey: 'update_intervals', testFile: 'missing-intervals-key.yml' },
    ].forEach((testCase) => sharedTest(testCase));
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
    const sharedTest = ({ filename, valueType, expected }) => {
      it(`returns error when value is ${valueType}`, () => {
        const input = parseYaml(filename);
        const result = validate(input);

        expect(result).toEqual(expected);
      });
    };

    describe('gitlab_access_token', () => {
      const expected = { error: 'gitlab_access_token must be string' };
      [
        { filename: 'invalid-token-1.yml', valueType: 'number', expected },
        { filename: 'invalid-token-2.yml', valueType: 'object', expected },
        { filename: 'invalid-token-3.yml', valueType: 'array', expected },
        { filename: 'invalid-token-4.yml', valueType: 'boolean', expected },
      ].forEach((testCase) => sharedTest(testCase));
    });

    describe('projects', () => {
      const expected = { error: 'projects must be array' };
      [
        { filename: 'invalid-projects-1.yml', valueType: 'number', expected },
        { filename: 'invalid-projects-2.yml', valueType: 'string', expected },
        { filename: 'invalid-projects-3.yml', valueType: 'object', expected },
        { filename: 'invalid-projects-4.yml', valueType: 'boolean', expected },
      ].forEach((testCase) => sharedTest(testCase));
    });

    describe('update_intervals', () => {
      const expected = { error: 'update_intervals must be number' };
      [
        { filename: 'invalid-intervals-1.yml', valueType: 'array', expected },
        { filename: 'invalid-intervals-2.yml', valueType: 'object', expected },
        { filename: 'invalid-intervals-3.yml', valueType: 'string', expected },
        { filename: 'invalid-intervals-4.yml', valueType: 'boolean', expected },
      ].forEach((testCase) => sharedTest(testCase));
    });
  });
});
