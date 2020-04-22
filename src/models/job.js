/* eslint-disable camelcase */

class Job {
  constructor({
    id, name, stage, status, started_at, finished_at, ref,
  }) {
    this.id = id;
    this.name = name;
    this.stage = stage;
    this.status = status;
    this.finishedAt = finished_at;
    this.startedAt = started_at;
    this.ref = ref;
  }
}

exports.Job = Job;
