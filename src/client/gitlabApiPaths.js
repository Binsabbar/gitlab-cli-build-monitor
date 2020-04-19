const gitlabApiPaths = {
  project: ({ projectId }) => `/projects/${projectId}/`,
  pipelines: ({ projectId }) => `/projects/${projectId}/pipelines/`,
  projectPipeline: ({ projectId, pipelineId }) => `/projects/${projectId}/pipelines/${pipelineId}/`,
  projectPipelineJobs:
    ({ projectId, pipelineId }) => `/projects/${projectId}/pipelines/${pipelineId}/jobs`,
};

exports.gitlabApiPaths = gitlabApiPaths;
