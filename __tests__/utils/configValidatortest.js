const yaml = require('js-yaml');
const fs = require('fs');
const { validate } = require('../../src/utils/configValidator.js');

const path = `${__dirname}/data`;
const parseYaml = (filename) => yaml.safeLoad(fs.readFileSync(`${path}/${filename}`), 'utf8');

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
});
