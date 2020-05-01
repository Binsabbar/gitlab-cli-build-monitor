/* eslint-disable no-console */
const { commandParser } = require('../../src/utils');


const parse = (parser, arg) => new Promise((resolve, reject) => {
  parser.parse(arg, (error, argvs, output) => {
    if (error) reject(error);
    resolve({ output, argvs });
  });
});

describe('script argument', () => {
  const expectedDefaultOutput = `Options:
  --version   Show version number                                      [boolean]
  -f, --file  path to pipeline configuration file            [string] [required]
  --help      Show help                                                [boolean]`;

  it('prints help menu when --help is given', async () => {
    const { output } = await parse(commandParser, '--help');

    expect(output).toBe(expectedDefaultOutput);
  });

  it('demands -f or --file when they are not given', async () => {
    await expect(parse(commandParser, '')).rejects.toThrow('Missing required argument: f');
  });

  describe('when arg for a given option is missing', () => {
    const sharedTest = (opt) => {
      it(`shows error when ${opt} args are missing`, async () => {
        const errMsg = opt.replace(/-/g, '');
        await expect(parse(commandParser, `${opt}`))
          .rejects.toThrow(`Not enough arguments following: ${errMsg}`);
      });
    };

    ['-f', '--file'].forEach(sharedTest);
  });

  describe('when arugments are passed to options', () => {
    const sharedTest = (opt) => {
      it(`does not show error for ${opt}`, async () => {
        const { output } = await parse(commandParser, `${opt} ./example-config.yml`);
        expect(output).toEqual('');
      });
    };

    ['-f', '--file'].forEach(sharedTest);
  });

  describe('when config file is given', () => {
    it('parses the file into argvs', async () => {
      const { argvs } = await parse(commandParser, '--file ./example-config.yml');
      const expectedConfigs = {
        baseUrl: 'https://gitlab.com',
        accessToken: 'some-token-goes-here',
        updateIntervals: 50,
        projects: [
          'groupA/projectA', 'userA/projectB', 'groupA/projectB', 'groupA/projectV',
        ],
      };

      expect(argvs).toMatchObject(expectedConfigs);
    });

    it('returns error when configuration file is invalid', async () => {
      const configFile = `${__dirname}/data/invalid-intervals-3.yml`;
      await expect(parse(commandParser, `--file ${configFile}`)).rejects.toThrow();
    });

    it('returns error when configuration file does not exist', async () => {
      const configFile = `${__dirname}/data/i-do-no-exist.yml`;
      await expect(parse(commandParser, `--file ${configFile}`))
        .rejects.toThrow('File does not exist');
    });

    it('returns error when configuration file is not a valid yaml', async () => {
      const configFile = `${__dirname}/data/invalid-yaml.yml`;
      await expect(parse(commandParser, `--file ${configFile}`))
        .rejects.toThrow('Invalid Yaml');
    });
  });
});
