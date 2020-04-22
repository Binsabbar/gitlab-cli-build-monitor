/* eslint-disable camelcase */

class Pipeline {
  constructor({
    id, ref, status, updated_at, created_at,
  }) {
    this.id = id;
    this.ref = ref;
    this.status = status;
    this.updatedAt = updated_at;
    this.createdAt = created_at;
    this.jobs = undefined;
  }
}

exports.Pipeline = Pipeline;
