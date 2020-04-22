/* eslint-disable camelcase */

class Job {
  constructor({
    id, name, stage, status, started_at, finished_at,
  }) {
    this.id = id;
    this.name = name;
    this.stage = stage;
    this.status = status;
    this.finishedAt = finished_at;
    this.startedAt = started_at;
  }
}

exports.Job = Job;
