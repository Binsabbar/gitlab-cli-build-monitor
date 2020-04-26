const { Project } = require('../../src/models');

class ProjectBuilder {
  constructor() {
    this.id = '12';
    this.pathWithNamespace = 'groupaA/projectA';
    this.name = 'awesome project';
    this.pipelines = [];
    this.currentPipelineId = undefined;
  }

  withId(id) { this.id = id; return this; }

  withPathNamespace(pathWithNamespace) { this.pathWithNamespace = pathWithNamespace; return this; }

  withName(name) { this.name = name; return this; }

  addPipeline(pipeline) { this.pipelines.push(pipeline); return this; }

  withCurrentPipelineId(currentPipelineId) {
    this.currentPipelineId = currentPipelineId;
    return this;
  }

  build() {
    return new Project({ ...this });
  }
}

exports.ProjectBuilder = ProjectBuilder;
