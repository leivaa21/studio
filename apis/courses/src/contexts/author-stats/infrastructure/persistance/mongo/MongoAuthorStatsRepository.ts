import { Injectable } from '@studio/dependency-injection';
import { MongoRepository } from '../../../../shared/infrastructure/mongo/MongoRepository';
import { AuthorStatsSchemaFactory } from './AuthorStatsSchemaFactory';
import { AuthorStats } from '../../../domain/AuthorStats';
import { AuthorStatsData } from './AuthorStatsData';
import { AuthorStatsModel } from './AuthorStatsSchema';
import { AuthorStatsRepository } from '../../../domain/AuthorStatsRepository';
import { AuthorId } from '../../../../courses/domain/AuthorId';
import { Nullable } from '../../../../shared/domain/Nullable';

@Injectable({ dependencies: [AuthorStatsSchemaFactory] })
export class MongoAuthorStatsRepository
  extends MongoRepository<AuthorStatsData, AuthorStats>
  implements AuthorStatsRepository
{
  constructor(authorStatsSchemaFactory: AuthorStatsSchemaFactory) {
    super(authorStatsSchemaFactory);
  }

  protected model() {
    return AuthorStatsModel;
  }

  public async create(authorStats: AuthorStats): Promise<void> {
    await this.model().create(
      this.entitySchemaFactory.createSchemaFromEntity(authorStats)
    );
  }

  public async find(authorId: AuthorId): Promise<Nullable<AuthorStats>> {
    const document = await this.model().findOne({ authorId: authorId.value });

    return document
      ? this.entitySchemaFactory.createEntityFromSchema(document)
      : null;
  }

  public async update(authorStats: AuthorStats): Promise<void> {
    await this.model().findOneAndUpdate(
      { authorId: authorStats.authorId.value },
      this.entitySchemaFactory.createSchemaFromEntity(authorStats)
    );
  }

  public async delete(authorId: AuthorId): Promise<void> {
    await this.model().findOneAndDelete({ authorId: authorId.value });
  }
}
