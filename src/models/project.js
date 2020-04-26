/* eslint-disable camelcase */

class Project {
  constructor({ id, path_with_namespace, name }) {
    this.id = id;
    this.pathWithNamespace = path_with_namespace;
    this.name = name;
    this.pipelines = [];
    this.currentPipelineId = undefined;
  }
}

exports.Project = Project;
