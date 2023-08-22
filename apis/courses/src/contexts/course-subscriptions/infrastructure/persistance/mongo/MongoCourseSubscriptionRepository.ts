import { Injectable } from '@studio/dependency-injection';
import { MongoRepository } from '../../../../shared/infrastructure/mongo/MongoRepository';
import { CourseId } from '../../../../courses/domain/CourseId';
import { Nullable } from '../../../../shared/domain/Nullable';
import { CourseSubscriptionSchemaFactory } from './CourseSubscriptionSchemaFactory';
import { CourseSubscriptionData } from './CourseSubscriptionData';
import { CourseSubscription } from '../../../domain/CourseSubscription';
import { CourseSubscriptionRepository } from '../../../domain/CourseSubscriptionRepository';
import { CourseSubscriptionModel } from './CourseSubscriptionSchema';
import { UserId } from '../../../domain/UserId';
import { CourseSubscriptionId } from '../../../domain/CourseSubscriptionId';

@Injectable({ dependencies: [CourseSubscriptionSchemaFactory] })
export class MongoCourseSubscriptionRepository
  extends MongoRepository<CourseSubscriptionData, CourseSubscription>
  implements CourseSubscriptionRepository
{
  constructor(
    courseSubscriptionSchemaFactory: CourseSubscriptionSchemaFactory
  ) {
    super(courseSubscriptionSchemaFactory);
  }

  protected model() {
    return CourseSubscriptionModel;
  }

  public async create(courseSubscription: CourseSubscription): Promise<void> {
    await this.persist(courseSubscription.id.value, courseSubscription);
  }

  public async findByUserAndCourse(
    userId: UserId,
    courseId: CourseId
  ): Promise<Nullable<CourseSubscription>> {
    const document = await this.model().findOne({
      userId: userId.value,
      courseId: courseId.value,
    });

    return document
      ? this.entitySchemaFactory.createEntityFromSchema(document)
      : null;
  }

  public async removeByCourseId(courseId: CourseId): Promise<void> {
    await this.model().deleteMany({ courseId: courseId.value });
  }

  public async findByUser(userId: UserId): Promise<CourseSubscription[]> {
    const documents = await this.model().find({
      userId: userId.value,
    });

    return documents.map((document) =>
      this.entitySchemaFactory.createEntityFromSchema(document)
    );
  }

  public async findByCourse(courseId: CourseId): Promise<CourseSubscription[]> {
    const documents = await this.model().find({
      courseId: courseId.value,
    });

    return documents.map((document) =>
      this.entitySchemaFactory.createEntityFromSchema(document)
    );
  }

  public async findById(
    id: CourseSubscriptionId
  ): Promise<Nullable<CourseSubscription>> {
    const document = await this.model().findById(id.value);

    return document
      ? this.entitySchemaFactory.createEntityFromSchema(document)
      : null;
  }

  public async removeById(id: CourseSubscriptionId): Promise<void> {
    await this.model().findByIdAndDelete(id.value);
  }

  public async update(courseSubscription: CourseSubscription): Promise<void> {
    await this.model().findByIdAndUpdate(
      courseSubscription.id.value,
      this.entitySchemaFactory.createSchemaFromEntity(courseSubscription)
    );
  }

  public async removeByUser(userId: UserId): Promise<void> {
    await this.model().deleteMany({ userId: userId.value });
  }
}
