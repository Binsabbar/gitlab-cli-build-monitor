/* eslint-disable camelcase */
const chalk = require('chalk');
const Table = require('cli-table3');

const table = new Table({
  head: ['project name', 'status', 'stage', 'job'],
});

exports.insertState = (state) => {
  const project = chalk.white(state.project.name);
  const status = chalk.green.bold(state.status);
  const stage = chalk.blue(`${state.stage}`);
  const name = chalk.blue(`${state.name}`);
  table.push([project, status, stage, name]);
};

exports.render = () => {
  console.log(table.toString());
};
