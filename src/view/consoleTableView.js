/* eslint-disable no-console */
const Table = require('cli-table3');
const chalk = require('chalk');
const moment = require('moment');

const statusToColour = {
  failed: chalk.bgRed.bold('failed'),
  running: chalk.cyan.bold('running'),
  pending: chalk.yellow.bold('pending'),
};

const calcFinishedAtDiff = (date) => {
  if (!date) return '-';
  const jobDate = moment(date);
  const current = moment().utc();

  const days = current.diff(jobDate, 'days');
  if (days > 1) return `${days} days ago`;

  const hours = current.diff(jobDate, 'hours');
  if (hours > 1) return `${hours} hours ago`;

  const minutes = current.diff(jobDate, 'minutes');
  if (minutes > 1) return `${minutes} minutes ago`;

  const second = current.diff(jobDate, 'seconds');
  return `${second} seconds ago`;
};

const tableHeader = ['project name', 'status', 'stage', 'job', 'ref', 'jobId', 'finished'];
class ConsoleTableView {
  constructor() {
    this.table = new Table({ head: tableHeader });
  }

  addStatusRow(status) {
    const project = chalk.white(status.projectId);
    const jobStatus = statusToColour[status.job.status];
    const stage = chalk.yellow(status.job.stage);
    const name = chalk.yellowBright(status.job.name);
    const ref = chalk.magentaBright(status.job.ref);
    const id = chalk.white(status.job.id);
    const timeDiff = calcFinishedAtDiff(status.job.finishedAt);
    this.table.push([project, jobStatus, stage, name, ref, id, timeDiff]);
  }

  clearRows() {
    this.table = new Table({ head: tableHeader });
  }

  toPrintableTable() {
    return `Last Updated at: ${moment().format('HH:mm:ss')}\n${this.table.toString()}`;
  }
}

exports.ConsoleTableView = ConsoleTableView;
