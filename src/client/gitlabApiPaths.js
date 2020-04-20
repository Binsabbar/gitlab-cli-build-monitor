const apiPath = '/api/v4';

const gitlabApiPaths = {
  project: ({ projectId }) => `${apiPath}/projects/${projectId}/`,
  pipelines: ({ projectId }) => `${apiPath}/projects/${projectId}/pipelines/`,
  projectPipeline:
    ({ projectId, pipelineId }) => `${apiPath}/projects/${projectId}/pipelines/${pipelineId}/`,
  projectPipelineJobs:
    ({ projectId, pipelineId }) => `${apiPath}/projects/${projectId}/pipelines/${pipelineId}/jobs`,
};

exports.gitlabApiPaths = gitlabApiPaths;
