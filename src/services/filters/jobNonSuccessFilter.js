const moment = require('moment');

const NON_SUCCESS_STATUS = {
  FAILED: 'failed',
  RUNNING: 'running',
  SKIPPED: 'skipped',
  MANUAL: 'manual',
  CREATED: 'created',
};
const NONE_SUCCESS_VALUES = Object.values(NON_SUCCESS_STATUS);

const isRunning = (job) => job.status === NON_SUCCESS_STATUS.RUNNING;
const isNoneSuccess = (job) => {
  const { status } = job;
  return NONE_SUCCESS_VALUES.indexOf(status) !== -1;
};

const getLastUpdated = (jobA, jobB) => {
  if (moment(jobA.updatedAt).isAfter(jobB.updatedAt)) return jobA;
  return jobB;
};

const filter = (jobs) => {
  const jobsByRefs = {};
  const runningJobs = [];

  jobs.forEach((job) => {
    if (isRunning(job)) runningJobs.push(job);
    else if (isNoneSuccess(job)) {
      const { ref } = job;
      jobsByRefs[job.ref] = getLastUpdated(jobsByRefs[ref] || job, job);
    }
  });

  return Object.values(jobsByRefs).flat().concat(runningJobs);
};

exports.filter = filter;
