import { StartedTestContainer } from 'testcontainers';

import {
  connectMongooseToContainer,
  disconnectMongoTest,
  initializeMongoContainer,
} from '../../helpers/test-containers/mongo';
import { CourseSubscriptionBuilder } from '../../helpers/builders/CourseSubscriptionBuilder';
import { CourseSubscriptionRepository } from '../../../src/contexts/course-subscriptions/domain/CourseSubscriptionRepository';
import { MongoCourseSubscriptionRepository } from '../../../src/contexts/course-subscriptions/infrastructure/persistance/mongo/MongoCourseSubscriptionRepository';
import { CourseSubscriptionSchemaFactory } from '../../../src/contexts/course-subscriptions/infrastructure/persistance/mongo/CourseSubscriptionSchemaFactory';
import {
  createCourseSubscription,
  findCourseSubscriptionById,
} from '../../helpers/persistance/mongo/course-subscriptions';
import { CourseId } from '../../../src/contexts/courses/domain/CourseId';
import { UserId } from '../../../src/contexts/course-subscriptions/domain/UserId';
import { LessonId } from '../../../src/contexts/lessons/domain/LessonId';

describe('Mongo Course Subscription Repository', () => {
  jest.setTimeout(9999999);

  let repository: CourseSubscriptionRepository;
  let container: StartedTestContainer;

  beforeAll(async () => {
    repository = new MongoCourseSubscriptionRepository(
      new CourseSubscriptionSchemaFactory()
    );
    container = await initializeMongoContainer();
    await connectMongooseToContainer(container);
  });

  afterAll(async () => {
    await disconnectMongoTest();
    await container.stop();
  });

  describe('Persisting Course Subscriptions', () => {
    it('should let persist a course subscription', async () => {
      const courseSubscription = new CourseSubscriptionBuilder().build();
      await repository.create(courseSubscription);

      const courseSubscriptionFound = await findCourseSubscriptionById(
        courseSubscription.id
      );

      expect(courseSubscriptionFound?.toPrimitives()).toStrictEqual(
        courseSubscription.toPrimitives()
      );
    });
  });

  describe('Finding Course Subscriptions', () => {
    describe('By user and course ids', () => {
      it('Should find a course subscription by their user and course id', async () => {
        const courseSubscription = new CourseSubscriptionBuilder().build();
        await createCourseSubscription(courseSubscription);

        const courseSubscriptionFound = await repository.findByUserAndCourse(
          courseSubscription.userId,
          courseSubscription.courseId
        );

        expect(courseSubscriptionFound?.toPrimitives()).toStrictEqual(
          courseSubscription.toPrimitives()
        );
      });

      it('Should not find a course subscription if their user and course id dont match', async () => {
        const courseSubscription = new CourseSubscriptionBuilder().build();
        await createCourseSubscription(courseSubscription);

        const courseSubscriptionFound = await repository.findByUserAndCourse(
          courseSubscription.userId,
          CourseId.random()
        );

        expect(courseSubscriptionFound).toBeNull();
      });
    });
    describe('By user id', () => {
      it('Should find all course subscription of a user', async () => {
        const userId = UserId.random();
        const courseSubscriptions = [
          new CourseSubscriptionBuilder().withUserId(userId).build(),
          new CourseSubscriptionBuilder().withUserId(userId).build(),
          new CourseSubscriptionBuilder().withUserId(userId).build(),
        ];

        await Promise.all(
          courseSubscriptions.map((courseSubscription) =>
            createCourseSubscription(courseSubscription)
          )
        );

        const courseSubscriptionsFound = await repository.findByUser(userId);

        expect(courseSubscriptionsFound).toHaveLength(
          courseSubscriptions.length
        );
      });

      it('Should not find a course subscription if their user id dont match', async () => {
        const userId = UserId.random();
        const courseSubscriptions = [
          new CourseSubscriptionBuilder().build(),
          new CourseSubscriptionBuilder().build(),
          new CourseSubscriptionBuilder().build(),
        ];

        await Promise.all(
          courseSubscriptions.map((courseSubscription) =>
            createCourseSubscription(courseSubscription)
          )
        );

        const courseSubscriptionsFound = await repository.findByUser(userId);

        expect(courseSubscriptionsFound).toHaveLength(0);
      });
    });
  });

  describe('Updating couseSubscription', () => {
    it('should let update a course subscription', async () => {
      const courseSubscription = new CourseSubscriptionBuilder().build();
      await createCourseSubscription(courseSubscription);

      courseSubscription.markLessonAsCompleted(LessonId.random());

      await repository.update(courseSubscription);

      const courseSubscriptionFound = await findCourseSubscriptionById(
        courseSubscription.id
      );

      expect(courseSubscriptionFound?.toPrimitives()).toStrictEqual(
        courseSubscription.toPrimitives()
      );
    });
  });
});
