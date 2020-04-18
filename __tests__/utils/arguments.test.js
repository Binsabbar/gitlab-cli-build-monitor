/* eslint-disable no-console */
const argument = require('../../src/utils/arguments');

const parse = (commandParser, arg) => new Promise((resolve) => {
  commandParser.parse(arg, (_, __, output) => resolve(output));
});

describe('script argument', () => {
  const expectedDefaultOutput = `Options:
  --version   Show version number                                      [boolean]
  -f, --file  pipeline configuration file                             [required]
  --help      Show help                                                [boolean]`;
  it('prints help menu when --help is given', async () => {
    const result = await parse(argument.commandParser, '--help');

    expect(result).toBe(expectedDefaultOutput);
  });

  it('highlights missing argument when -f or --file are not given', async () => {
    const result = await parse(argument.commandParser, '');

    expect(result).toContain('Missing required argument: f');
  });

  describe('when demand options are given', () => {
    it('does not show menu given -f', async () => {
      const result = await parse(argument.commandParser, '-f');

      expect(result).toEqual('');
    });

    it('does not show menu given --file', async () => {
      const result = await parse(argument.commandParser, '--file');

      expect(result).toEqual('');
    });
  });
});
