import { Injectable } from '@studio/dependency-injection';
import { EntitySchemaFactory } from '../../../../shared/infrastructure/mongo/EntitySchemaFactory';
import { AuthorStatsData } from './AuthorStatsData';
import { AuthorStats } from '../../../domain/AuthorStats';

@Injectable()
export class AuthorStatsSchemaFactory
  implements EntitySchemaFactory<AuthorStatsData, AuthorStats>
{
  createSchemaFromEntity(lesson: AuthorStats): AuthorStatsData {
    return lesson.toPrimitives();
  }
  createEntityFromSchema(schema: AuthorStatsData): AuthorStats {
    return AuthorStats.fromPrimitives(schema);
  }
}
