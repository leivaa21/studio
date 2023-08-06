import { CourseSubscription } from '../../../../src/contexts/course-subscriptions/domain/CourseSubscription';
import { CourseSubscriptionModel } from '../../../../src/contexts/course-subscriptions/infrastructure/persistance/mongo/CourseSubscriptionSchema';
import { CourseSubscriptionSchemaFactory } from '../../../../src/contexts/course-subscriptions/infrastructure/persistance/mongo/CourseSubscriptionSchemaFactory';
import { CourseSubscriptionId } from '../../../../src/contexts/course-subscriptions/domain/CourseSubscriptionId';
import { UserId } from '../../../../src/contexts/course-subscriptions/domain/UserId';

const schemaFactory = new CourseSubscriptionSchemaFactory();

export async function createCourseSubscription(
  courseSubscription: CourseSubscription
): Promise<void> {
  const document = schemaFactory.createSchemaFromEntity(courseSubscription);
  await CourseSubscriptionModel.create(document);
}

export async function findCourseSubscriptionById(
  id: CourseSubscriptionId
): Promise<CourseSubscription | undefined> {
  const document = await CourseSubscriptionModel.findById(id.value);

  return document ? schemaFactory.createEntityFromSchema(document) : undefined;
}

export async function findCourseSubscriptionsByUserId(
  id: UserId
): Promise<CourseSubscription[]> {
  const documents = await CourseSubscriptionModel.find({ userId: id.value });

  return documents.map((document) =>
    schemaFactory.createEntityFromSchema(document)
  );
}
