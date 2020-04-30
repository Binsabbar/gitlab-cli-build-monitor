/* eslint-disable no-console */
const Table = require('cli-table3');
const chalk = require('chalk');
const moment = require('moment');

class ConsoleTableView {
  constructor() {
    this.table = new Table({
      head: ['project name', 'status', 'stage', 'job', 'ref', 'id'],
    });
  }

  addStatusRow(status) {
    const project = chalk.white(status.projectId);
    const jobStatus = chalk.red.bold(status.job.status);
    const stage = chalk.blue(status.job.stage);
    const name = chalk.blue(status.job.name);
    const ref = chalk.blue(status.job.ref);
    const id = chalk.blue(status.job.id);
    this.table.push([project, jobStatus, stage, name, ref, id]);
  }

  clearRows() {
    this.table.splice(0, this.table.length);
  }

  print() {
    const output = `Last Updated: ${moment().format('HH:mm:ss')}\n${this.table.toString()}`;
    console.log(output);
  }
}

exports.ConsoleTableView = ConsoleTableView;
