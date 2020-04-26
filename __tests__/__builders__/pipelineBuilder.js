const { Pipeline } = require('../../src/models');

class PipelineBuilder {
  constructor() {
    this.id = 0;
    this.ref = 'master';
    this.status = 'success';
    this.createdAt = '2020-04-24T20:38:36.373Z';
    this.updatedAt = '2020-04-24T20:48:28.483Z';
  }

  withId(id) { this.id = id; return this; }

  withRef(ref) { this.ref = ref; return this; }

  withStatus(status) { this.status = status; return this; }

  createdAt(createdAt) { this.createdAt = createdAt; return this; }

  updatedAt(updatedAt) { this.updatedAt = updatedAt; return this; }

  build() {
    return new Pipeline({
      ...this,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
    });
  }
}

exports.PipelineBuilder = PipelineBuilder;
