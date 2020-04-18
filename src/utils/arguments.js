const fs = require('fs');
const yargs = require('yargs');
const yaml = require('js-yaml');

const commandParser = yargs
  .options({
    f: {
      alias: 'file',
      demandOption: true,
      describe: 'path pipeline configuration file',
      string: true,
    },
  })
  .config('file', 'path to pipeline configuration file',
    ((configPath) => {
      const config = yaml.safeLoad(fs.readFileSync(configPath, 'utf8'));
      return config;
    }))
  .help();

exports.commandParser = commandParser;
