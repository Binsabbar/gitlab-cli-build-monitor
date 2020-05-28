const { Job } = require('../../src/models');

class JobBuilder {
  constructor() {
    this.id = 0;
    this.ref = 'master';
    this.name = 'build';
    this.status = 'success';
    this.stage = '2020-04-24T20:38:36.373Z';
    this.startedAt = '2020-04-24T20:48:28.483Z';
    this.finishedAt = '2020-04-24T20:48:28.483Z';
    this.createdAt = '2020-03-24T20:48:28.483Z';
  }

  withId(id) { this.id = id; return this; }

  withRef(ref) { this.ref = ref; return this; }

  withName(name) { this.name = name; return this; }

  withStatus(status) { this.status = status; return this; }

  atStage(stage) { this.stage = stage; return this; }

  setStartedAt(startedAt) { this.startedAt = startedAt; return this; }

  setFinishedAt(finishedAt) { this.finishedAt = finishedAt; return this; }

  setCreatedAt(createdAt) { this.createdAt = createdAt; return this; }

  build() {
    return new Job(
      {
        ...this,
        started_at: this.startedAt,
        finished_at: this.finishedAt,
        created_at: this.createdAt,
      },
    );
  }
}

exports.JobBuilder = JobBuilder;
