const moment = require('moment');

const NON_SUCCESS_STATUS = {
  FAILED: 'failed',
  RUNNING: 'running',
  PENDING: 'pending',
};

const NONE_SUCCESS_VALUES = Object.values(NON_SUCCESS_STATUS);

const isNoneSuccess = (job) => NONE_SUCCESS_VALUES.indexOf(job.status) !== -1;
const isFailedJob = (job) => job.status === NON_SUCCESS_STATUS.FAILED;
const isNotFailedJob = (job) => job.status !== NON_SUCCESS_STATUS.FAILED;

const initGroupJobs = (acc, job) => {
  const jobKey = `${job.stage}.${job.name}`;
  acc[jobKey] = [];
  return acc;
};

const compareCreatedAt = (jobA, jobB) => {
  if (moment(jobA.createdAt).isBefore(jobB.createdAt)) return -1;
  return 1;
};

const filter = (jobs) => {
  const nonSuccess = jobs.filter(isNoneSuccess);
  const groupedJobs = nonSuccess.reduce(initGroupJobs, {});

  nonSuccess.forEach((job) => groupedJobs[`${job.stage}.${job.name}`].push(job));

  const result = [];
  Object.keys(groupedJobs).forEach((key) => {
    const stageJobs = groupedJobs[key];
    if (stageJobs.length === 1) result.push(stageJobs[0]);
    else {
      const sortedJobs = stageJobs.sort(compareCreatedAt);
      const lastRunJob = sortedJobs.slice(-1)[0];

      if (isFailedJob(lastRunJob)) result.push(lastRunJob);
      const noneFailed = sortedJobs.filter(isNotFailedJob);
      result.push(noneFailed);
    }
  });

  return result.flatMap((r) => r);
};

exports.filter = filter;
