#!/usr/bin/env node
/* eslint-disable no-console */
const { handleGitlabClientErrors, commandParser, GitlabConfig } = require('./utils');
const { getService, SERVICES } = require('./objectsInitializer');
const { Screen, ConsoleTableView } = require('./view');

const gitlabConfig = new GitlabConfig({ ...commandParser.argv });
const monitor = getService(SERVICES.MONITOR_SERVICE, gitlabConfig);
const consoleTableView = new ConsoleTableView();
const screen = new Screen();

function printStatus() {
  const log = consoleTableView.toPrintableTable();
  consoleTableView.clearRows();
  screen.screenWrite(log);
}

setInterval(() => {
  monitor.checkStatus({ projectIds: gitlabConfig.projects })
    .then((status) => {
      status.forEach((s) => {
        s.jobs.forEach((job) => consoleTableView.addStatusRow({ projectId: s.projectId, job }));
      });
      printStatus();
    })
    .catch((e) => {
      console.log(handleGitlabClientErrors(e));
    });
}, gitlabConfig.updateIntervals * 1000);
