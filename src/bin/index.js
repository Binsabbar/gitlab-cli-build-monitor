#!/usr/bin/env node

const { handleGitlabClientErrors, commandParser, GitlabConfig } = require('../utils');
const { getService, SERVICES } = require('../objectsInitializer');
const { Screen, ConsoleTableView } = require('../view');

const gitlabConfig = new GitlabConfig({ ...commandParser.argv });
const monitor = getService(SERVICES.MONITOR_SERVICE, gitlabConfig);
const consoleTableView = new ConsoleTableView();
const screen = new Screen();

function printStatus() {
  const log = consoleTableView.toPrintableTable();
  consoleTableView.clearRows();
  screen.screenWrite(log);
}

const projectIds = gitlabConfig.projects;
const checkStatus = () => {
  monitor.checkStatus({ projectIds })
    .then((status) => {
      status.forEach((s) => {
        s.jobs.forEach((job) => consoleTableView.addStatusRow({ projectId: s.projectId, job }));
      });
      printStatus();
    })
    .catch((e) => {
      screen.screenWrite(handleGitlabClientErrors(e));
      setTimeout(() => process.exit(-1), 500);
    });
};

let intervalId;
monitor.doProjectsExist({ projectIds })
  .then(() => {
    checkStatus();
    intervalId = setInterval(checkStatus, gitlabConfig.updateIntervals * 1000);
  })
  .catch((e) => {
    screen.screenWrite(handleGitlabClientErrors(e));
    setTimeout(() => process.exit(-1), 500);
  });

process.on('SIGINT', () => {
  clearInterval(intervalId);
  screen.screenWrite('Existing ...');
  process.exit();
});
