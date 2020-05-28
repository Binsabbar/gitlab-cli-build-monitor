/* eslint-disable camelcase */

class Project {
  constructor({ id, path_with_namespace, name }) {
    this.id = id;
    this.pathWithNamespace = path_with_namespace;
    this.name = name;
  }
}

exports.Project = Project;
