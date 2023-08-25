import { Injectable } from '@studio/dependency-injection';
import { EntitySchemaFactory } from '../../../../shared/infrastructure/mongo/EntitySchemaFactory';
import { CourseStatsData } from './CourseStatsData';
import { CourseStats } from '../../../domain/CourseStats';

@Injectable()
export class CourseStatsSchemaFactory
  implements EntitySchemaFactory<CourseStatsData, CourseStats>
{
  createSchemaFromEntity(courseStats: CourseStats): CourseStatsData {
    return courseStats.toPrimitives();
  }
  createEntityFromSchema(schema: CourseStatsData): CourseStats {
    return CourseStats.fromPrimitives(schema);
  }
}
