import { Injectable } from '@studio/dependency-injection';
import { EntitySchemaFactory } from '../../../../shared/infrastructure/mongo/EntitySchemaFactory';
import { CourseSubscription } from '../../../domain/CourseSubscription';
import { CourseSubscriptionData } from './CourseSubscriptionData';

@Injectable()
export class CourseSubscriptionSchemaFactory
  implements EntitySchemaFactory<CourseSubscriptionData, CourseSubscription>
{
  createSchemaFromEntity(
    courseSubscription: CourseSubscription
  ): CourseSubscriptionData {
    const { id: _id, ...rest } = courseSubscription.toPrimitives();

    return {
      _id,
      ...rest,
    };
  }
  createEntityFromSchema(schema: CourseSubscriptionData): CourseSubscription {
    return CourseSubscription.fromPrimitives({
      id: schema._id,
      userId: schema.userId,
      courseId: schema.courseId,
      subscribedAt: schema.subscribedAt,
      updatedAt: schema.updatedAt,
      completedLessons: schema.completedLessons,
      completed: schema.completed,
    });
  }
}
