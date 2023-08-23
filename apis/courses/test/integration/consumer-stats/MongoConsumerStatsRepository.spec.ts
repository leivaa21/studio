import { StartedTestContainer } from 'testcontainers';

import {
  connectMongooseToContainer,
  disconnectMongoTest,
  initializeMongoContainer,
} from '../../helpers/test-containers/mongo';
import { ConsumerStatsBuilder } from '../../helpers/builders/ConsumerStatsBuilder';
import {
  createConsumerStats,
  findConsumerStats,
} from '../../helpers/persistance/mongo/consumer-stats';
import { ConsumerStatsRepository } from '../../../src/contexts/consumer-stats/domain/ConsumerStatsRepository';
import { MongoConsumerStatsRepository } from '../../../src/contexts/consumer-stats/infrastructure/persistance/mongo/MongoConsumerStatsRepository';
import { ConsumerStatsSchemaFactory } from '../../../src/contexts/consumer-stats/infrastructure/persistance/mongo/ConsumerStatsSchemaFactory';

describe('Mongo Consumer Stats Repository', () => {
  jest.setTimeout(9999999);

  let repository: ConsumerStatsRepository;
  let container: StartedTestContainer;

  beforeAll(async () => {
    repository = new MongoConsumerStatsRepository(
      new ConsumerStatsSchemaFactory()
    );
    container = await initializeMongoContainer();
    await connectMongooseToContainer(container);
  });

  afterAll(async () => {
    await disconnectMongoTest();
    await container.stop();
  });

  describe('Persisting Consumer Stats', () => {
    it('should let persist an consumer stats', async () => {
      const consumerStats = new ConsumerStatsBuilder().build();
      await repository.create(consumerStats);

      const consumerStatsFound = await findConsumerStats(consumerStats.userId);

      expect(consumerStatsFound?.toPrimitives()).toStrictEqual(
        consumerStats.toPrimitives()
      );
    });
  });

  describe('Finding Consumer Stats', () => {
    it('Should let find an consumer stats by user Id', async () => {
      const consumerStats = new ConsumerStatsBuilder().build();
      await createConsumerStats(consumerStats);

      const consumerStatsFound = await repository.find(consumerStats.userId);

      expect(consumerStatsFound?.toPrimitives()).toStrictEqual(
        consumerStats.toPrimitives()
      );
    });
  });

  describe('Updating Consumer Stats', () => {
    it('Should let update an consumer stats', async () => {
      const consumerStats = new ConsumerStatsBuilder().build();
      await createConsumerStats(consumerStats);

      consumerStats.increaseSubscribedCourses();

      await repository.update(consumerStats);

      const consumerStatsFound = await findConsumerStats(consumerStats.userId);

      expect(consumerStatsFound?.toPrimitives()).toStrictEqual(
        consumerStats.toPrimitives()
      );
      expect(consumerStatsFound?.toPrimitives()).toStrictEqual(
        expect.objectContaining({
          subscribedCourses: 1,
        })
      );
    });
  });

  describe('Deleting Consumer Stats', () => {
    it('Should let delete an consumer stats by user Id', async () => {
      const consumerStats = new ConsumerStatsBuilder().build();
      await createConsumerStats(consumerStats);

      await repository.delete(consumerStats.userId);

      const consumerStatsFound = await findConsumerStats(consumerStats.userId);

      expect(consumerStatsFound).toBeUndefined();
    });
  });
});
