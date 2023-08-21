import { StartedTestContainer } from 'testcontainers';

import {
  connectMongooseToContainer,
  disconnectMongoTest,
  initializeMongoContainer,
} from '../../helpers/test-containers/mongo';
import { AuthorStatsRepository } from '../../../src/contexts/author-stats/domain/AuthorStatsRepository';
import { MongoAuthorStatsRepository } from '../../../src/contexts/author-stats/infrastructure/persistance/mongo/MongoAuthorStatsRepository';
import { AuthorStatsSchemaFactory } from '../../../src/contexts/author-stats/infrastructure/persistance/mongo/AuthorStatsSchemaFactory';
import { AuthorStatsBuilder } from '../../helpers/builders/AuthorStatsBuilder';
import {
  createAuthorStats,
  findAuthorStats,
} from '../../helpers/persistance/mongo/author-stats';

describe('Mongo Author Stats Repository', () => {
  jest.setTimeout(9999999);

  let repository: AuthorStatsRepository;
  let container: StartedTestContainer;

  beforeAll(async () => {
    repository = new MongoAuthorStatsRepository(new AuthorStatsSchemaFactory());
    container = await initializeMongoContainer();
    await connectMongooseToContainer(container);
  });

  afterAll(async () => {
    await disconnectMongoTest();
    await container.stop();
  });

  describe('Persisting Author Stats', () => {
    it('should let persist an author stats', async () => {
      const authorStats = new AuthorStatsBuilder().build();
      await repository.create(authorStats);

      const authorStatsFound = await findAuthorStats(authorStats.authorId);

      expect(authorStatsFound?.toPrimitives()).toStrictEqual(
        authorStats.toPrimitives()
      );
    });
  });

  describe('Finding Author Stats', () => {
    it('Should let find an author stats by author Id', async () => {
      const authorStats = new AuthorStatsBuilder().build();
      await createAuthorStats(authorStats);

      const authorStatsFound = await repository.find(authorStats.authorId);

      expect(authorStatsFound?.toPrimitives()).toStrictEqual(
        authorStats.toPrimitives()
      );
    });
  });

  describe('Updating Author Stats', () => {
    it('Should let update an author stats', async () => {
      const authorStats = new AuthorStatsBuilder().build();
      await createAuthorStats(authorStats);

      authorStats.increaseCoursesCreated();

      await repository.update(authorStats);

      const authorStatsFound = await findAuthorStats(authorStats.authorId);

      expect(authorStatsFound?.toPrimitives()).toStrictEqual(
        authorStats.toPrimitives()
      );
      expect(authorStatsFound?.toPrimitives()).toStrictEqual(
        expect.objectContaining({
          coursesCreated: 1,
        })
      );
    });
  });

  describe('Deleting Author Stats', () => {
    it('Should let delete an author stats by author Id', async () => {
      const authorStats = new AuthorStatsBuilder().build();
      await createAuthorStats(authorStats);

      await repository.delete(authorStats.authorId);

      const authorStatsFound = await findAuthorStats(authorStats.authorId);

      expect(authorStatsFound).toBeUndefined();
    });
  });
});
