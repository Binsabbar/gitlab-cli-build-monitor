const fs = require('fs');
const yargs = require('yargs');
const yaml = require('js-yaml');

const { validate } = require('./configValidator');

const configParser = (configPath) => {
  if (!fs.existsSync(configPath)) return new Error('File does not exist');
  let config;
  try {
    config = yaml.safeLoad(fs.readFileSync(configPath, 'utf8'));
  } catch (e) {
    return new Error('Invalid Yaml');
  }
  const validation = validate(config);
  if (validation.error) return new Error(validation.error);
  return validation;
};

const commandParser = yargs
  .options({
    f: {
      alias: 'file',
      demandOption: true,
      requiresArg: true,
      describe: 'path pipeline configuration file',
      string: true,
    },
  })
  .config('file', 'path to pipeline configuration file', configParser)
  .help();

exports.commandParser = commandParser;
