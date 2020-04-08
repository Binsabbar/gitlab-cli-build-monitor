const chalk = require("chalk");
const createBox = require("./box");

exports.statusView = (pipeline) => {
  return createBox(chalk.white.bold(pipeline.status));
}