const yargs = require('yargs');

const commandParser = yargs
  .options({
    f: {
      alias: 'file',
      demandOption: true,
      describe: 'pipeline configuration file',
      string: true,
    },
  })
  .help();

exports.commandParser = commandParser;
