const moment = require('moment');

const { PipelineBuilder } = require('../../__builders__');
const { pipelineNonSuccessFilter: filter } = require('../../../src/services/filters');

describe('pipelineNonSuccessFilter', () => {
  const now = moment().utc();

  describe('Non success status', () => {
    let pipelines = [];
    beforeEach(() => {
      pipelines = [
        new PipelineBuilder().withId('1').withStatus('success').build(),
        new PipelineBuilder().withId('3').withStatus('success').build(),
        new PipelineBuilder().withId('4').withStatus('success').build(),
      ];
    });

    it('returns list of pipelines that have failed status', () => {
      const failedPipeline = new PipelineBuilder().withId('2').withStatus('failed').build();
      pipelines.splice(2, 0, failedPipeline);

      const result = filter(pipelines);

      expect(result).toEqual([failedPipeline]);
    });

    it('returns list of pipelines that have pending status', () => {
      const pendingPipeline = new PipelineBuilder().withId('2').withStatus('pending').build();
      pipelines.splice(2, 0, pendingPipeline);

      const result = filter(pipelines);

      expect(result).toEqual([pendingPipeline]);
    });

    it('returns list of pipelines that have running status', () => {
      const runningPipeline = new PipelineBuilder().withId('2').withStatus('running').build();
      pipelines.splice(2, 0, runningPipeline);

      const result = filter(pipelines);

      expect(result).toEqual([runningPipeline]);
    });

    it('return empty list when all pipelines have success or canceled status', () => {
      const canceledPipeline = new PipelineBuilder().withId('2').withStatus('cenceled').build();
      pipelines.splice(2, 0, canceledPipeline);

      const result = filter(pipelines);

      expect(result).toEqual([]);
    });
  });

  // always include running pipeline
  describe('filters non success based on latest update and ref', () => {
    // return list of pipelines that contains latest updated pipeline - same ref
    it('returns pipelines list that has latest updated pipeline for a ref - same ref', () => {
      const pipelines = [
        new PipelineBuilder()
          .withId('19')
          .withStatus('failed')
          .withRef('master')
          .setUpdatedAt(now.clone().subtract(10, 'h').toISOString())
          .build(),
        new PipelineBuilder()
          .withId('12')
          .withStatus('pending')
          .withRef('master')
          .setUpdatedAt(now.clone().subtract(2, 'h').toISOString())
          .build(),
      ];

      const result = filter(pipelines);

      expect(result).toHaveLength(1);
      expect(result[0].id).toEqual('12');
      expect(result[0].status).toEqual('pending');
    });
  });
});
