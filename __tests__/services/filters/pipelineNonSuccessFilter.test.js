const moment = require('moment');

const { PipelineBuilder } = require('../../__builders__');
const { pipelineNonSuccessFilter: filter } = require('../../../src/services/filters');

describe('pipelineNonSuccessFilter', () => {
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

    it('return empty list when all pipelines have success, skipped or canceled status', () => {
      const canceledPipeline = new PipelineBuilder().withId('2').withStatus('cenceled').build();
      const skippedPipeline = new PipelineBuilder().withId('4').withStatus('skipped').build();
      pipelines.splice(2, 0, canceledPipeline);
      pipelines.splice(2, 0, skippedPipeline);

      const result = filter(pipelines);

      expect(result).toEqual([]);
    });
  });

  describe('filter most updated pipeline', () => {
    const now = moment().utc();
    const latestMasterPipeline = new PipelineBuilder().withRef('master').withId('19')
      .withStatus('failed')
      .setUpdatedAt(moment(now).subtract(10, 'h').format())
      .build();

    const latestDevPipeline = new PipelineBuilder().withRef('dev').withId('13')
      .withStatus('pending')
      .setUpdatedAt(moment(now).subtract(1, 'h').format())
      .build();

    it('returns most updated pipelines for a ref - case1: same ref', () => {
      const pipelines = [latestMasterPipeline,
        new PipelineBuilder()
          .withId('12')
          .withStatus('pending')
          .setUpdatedAt(moment(now).subtract(2, 'h').format())
          .build(),
      ];

      const result = filter(pipelines);

      expect(result).toIncludeAllMembers([pipelines[1]]);
    });

    it('returns most updated pipelines for a ref - case2: multi refs', () => {
      const pipelines = [latestMasterPipeline, latestDevPipeline];

      const result = filter(pipelines);

      expect(result).toIncludeAllMembers(pipelines);
    });

    it('returns most updated pipelines for a ref - case3: mult refs with mult non-success', () => {
      const pipelines = [
        latestMasterPipeline,
        new PipelineBuilder()
          .withRef('master')
          .withId('20')
          .withStatus('pending')
          .setUpdatedAt(moment(now).subtract(12, 'h').format())
          .build(),
        latestDevPipeline,
        new PipelineBuilder()
          .withRef('dev')
          .withId('12')
          .withStatus('failed')
          .setUpdatedAt(moment(now).subtract(2, 'h').format())
          .build(),
      ];
      const expected = [latestMasterPipeline, latestDevPipeline];

      const result = filter(pipelines);

      expect(result).toIncludeAllMembers(expected);
    });

    it('always includes running pipelines regardless of updated at', () => {
      const pipelines = [
        latestMasterPipeline,
        new PipelineBuilder()
          .withRef('master')
          .withId('18')
          .withStatus('running')
          .setUpdatedAt(moment(now).subtract(10, 'h').format())
          .build(),
        latestDevPipeline,
      ];

      const result = filter(pipelines);

      expect(result).toIncludeAllMembers(pipelines);
    });
  });
});
