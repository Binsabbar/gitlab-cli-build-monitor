/* eslint-disable camelcase */

const { Project, Pipeline, Job } = require('../models');

class GitlabParser {
  static parseProject(project) {
    const { id, path_with_namespace, name } = project;
    return new Project({ id, name, path_with_namespace });
  }

  static parsePipeline(pipepline) {
    const {
      id,
      ref,
      status,
      created_at,
      updated_at,
    } = pipepline;

    return new Pipeline({
      id,
      ref,
      status,
      created_at,
      updated_at,
    });
  }

  static parseJob(job) {
    const {
      id,
      name,
      stage,
      status,
      started_at,
      finished_at,
      created_at,
      ref,
    } = job;

    return new Job({
      id,
      name,
      stage,
      status,
      started_at,
      finished_at,
      created_at,
      ref,
    });
  }
}

exports.GitlabParser = GitlabParser;
