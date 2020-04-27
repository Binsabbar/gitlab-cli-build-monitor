const moment = require('moment');
const { PipelineBuilder } = require('../../__builders__');
const { pipelineNonSuccessFilter: filter } = require('../../../src/services/filters');

describe('pipelineNonSuccessFilter', () => {
  const now = moment().utc();

  describe('filters non success status', () => {
    let pipelines = [];
    beforeEach(() => {
      pipelines = [
        new PipelineBuilder().withId('1').withStatus('success').build(),
        new PipelineBuilder().withId('3').withStatus('success').build(),
        new PipelineBuilder().withId('4').withStatus('success').build(),
      ];
    });

    it('returns pipeline that has failed status', () => {
      const failedPipeline = new PipelineBuilder().withId('2').withStatus('failed').build();
      pipelines.splice(2, 0, failedPipeline);

      const pipeline = filter(pipelines);

      expect(pipeline).toEqual(failedPipeline);
    });

    it('returns pipeline that has pending status', () => {
      const pendingPipeline = new PipelineBuilder().withId('2').withStatus('pending').build();
      pipelines.splice(2, 0, pendingPipeline);

      const pipeline = filter(pipelines);

      expect(pipeline).toEqual(pendingPipeline);
    });

    it('returns pipeline that has canceled status', () => {
      const canceledPipeline = new PipelineBuilder().withId('2').withStatus('canceled').build();
      pipelines.splice(2, 0, canceledPipeline);

      const pipeline = filter(pipelines);

      expect(pipeline).toEqual(canceledPipeline);
    });

    it('returns pipeline that has running status', () => {
      const runningPipeline = new PipelineBuilder().withId('2').withStatus('running').build();
      pipelines.splice(2, 0, runningPipeline);

      const pipeline = filter(pipelines);

      expect(pipeline).toEqual(runningPipeline);
    });
  });
});
