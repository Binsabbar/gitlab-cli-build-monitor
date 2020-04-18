/* eslint-disable no-console */
const argument = require('../../src/utils/arguments');


const parse = (commandParser, arg) => new Promise((resolve) => {
  commandParser.parse(arg, (_, argvs, output) => resolve({ output, argvs }));
});

describe('script argument', () => {
  const expectedDefaultOutput = `Options:
  --version   Show version number                                      [boolean]
  -f, --file  path to pipeline configuration file            [string] [required]
  --help      Show help                                                [boolean]`;
  it('prints help menu when --help is given', async () => {
    const { output } = await parse(argument.commandParser, '--help');

    expect(output).toBe(expectedDefaultOutput);
  });

  it('highlights missing argument when -f or --file are not given', async () => {
    const { output } = await parse(argument.commandParser, '');

    expect(output).toContain('Missing required argument: f');
  });

  describe('when demand options are given', () => {
    it('does not show menu given -f', async () => {
      const { output } = await parse(argument.commandParser, '-f');

      expect(output).toEqual('');
    });

    it('does not show menu given --file', async () => {
      const { output } = await parse(argument.commandParser, '--file');

      expect(output).toEqual('');
    });
  });

  describe('when config file is passed', () => {
    it('parses the file into argvs', async () => {
      const { argvs } = await parse(argument.commandParser, '--file ./example-config.yml');
      const expectedConfigs = {
        gitlab_access_token: 'some-token-goes-here',
        update_intervals: 50,
        projects: [
          'groupA/projectA', 'userA/projectB', 'groupA/projectB', 'groupA/projectV',
        ],
      };

      expect(argvs).toMatchObject(expectedConfigs);
    });
  });
});
