import { AuthorStats } from '../../../../src/contexts/author-stats/domain/AuthorStats';
import { AuthorStatsModel } from '../../../../src/contexts/author-stats/infrastructure/persistance/mongo/AuthorStatsSchema';
import { AuthorStatsSchemaFactory } from '../../../../src/contexts/author-stats/infrastructure/persistance/mongo/AuthorStatsSchemaFactory';
import { AuthorId } from '../../../../src/contexts/courses/domain/AuthorId';

const schemaFactory = new AuthorStatsSchemaFactory();

export async function createAuthorStats(
  authorStats: AuthorStats
): Promise<void> {
  const document = schemaFactory.createSchemaFromEntity(authorStats);
  await AuthorStatsModel.create(document);
}

export async function findAuthorStats(
  authorId: AuthorId
): Promise<AuthorStats | undefined> {
  const document = await AuthorStatsModel.findOne({ authorId: authorId.value });

  return document ? schemaFactory.createEntityFromSchema(document) : undefined;
}
