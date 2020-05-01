/* eslint-disable no-console */
const Table = require('cli-table3');
const chalk = require('chalk');
const moment = require('moment');

const statusToColour = {
  failed: chalk.bgRed.bold('failed'),
  running: chalk.cyan.bold('running'),
  pending: chalk.yellow.bold('pending'),
};

class ConsoleTableView {
  constructor() {
    this.table = new Table({
      head: ['project name', 'status', 'stage', 'job', 'ref', 'JobId'],
    });
  }

  addStatusRow(status) {
    const project = chalk.white(status.projectId);
    const jobStatus = statusToColour[status.job.status];
    const stage = chalk.yellow(status.job.stage);
    const name = chalk.yellowBright(status.job.name);
    const ref = chalk.magentaBright(status.job.ref);
    const id = chalk.white(status.job.id);
    this.table.push([project, jobStatus, stage, name, ref, id]);
  }

  clearRows() {
    this.table.splice(0, this.table.length);
  }

  toPrintableTable() {
    return `Last Updated: ${moment().format('HH:mm:ss')}\n${this.table.toString()}`;
  }
}

exports.ConsoleTableView = ConsoleTableView;
