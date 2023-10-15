import { MongoRepository } from '../../../../shared/infrastructure/mongo/MongoRepository';
import { CourseStatsSchemaFactory } from './CourseStatsSchemaFactory';
import { CourseStats } from '../../../domain/CourseStats';
import { CourseStatsData } from './CourseStatsData';
import { CourseStatsModel } from './CourseStatsSchema';
import { CourseStatsRepository } from '../../../domain/CourseStatsRepository';
import { Nullable } from '../../../../shared/domain/Nullable';
import { CourseId } from '../../../../courses/domain/CourseId';

export class MongoCourseStatsRepository
  extends MongoRepository<CourseStatsData, CourseStats>
  implements CourseStatsRepository
{
  constructor(courseStatsSchemaFactory: CourseStatsSchemaFactory) {
    super(courseStatsSchemaFactory);
  }

  protected model() {
    return CourseStatsModel;
  }

  public async create(courseStats: CourseStats): Promise<void> {
    await this.model().create(
      this.entitySchemaFactory.createSchemaFromEntity(courseStats)
    );
  }

  public async find(courseId: CourseId): Promise<Nullable<CourseStats>> {
    const document = await this.model().findOne({ courseId: courseId.value });

    return document
      ? this.entitySchemaFactory.createEntityFromSchema(document)
      : null;
  }

  public async update(courseStats: CourseStats): Promise<void> {
    await this.model().findOneAndUpdate(
      { courseId: courseStats.courseId.value },
      this.entitySchemaFactory.createSchemaFromEntity(courseStats)
    );
  }

  public async delete(courseId: CourseId): Promise<void> {
    await this.model().findOneAndDelete({ courseId: courseId.value });
  }
}
