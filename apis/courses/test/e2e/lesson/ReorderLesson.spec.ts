import { StartedTestContainer } from 'testcontainers';
import request from 'supertest';
import {
  connectMongooseToContainer,
  disconnectMongoTest,
  initializeMongoContainer,
} from '../../helpers/test-containers/mongo';
import { CourseBuilder } from '../../helpers/builders/CourseBuilder';
import { LessonBuilder } from '../../helpers/builders/LessonBuilder';
import { app } from '../../../src/api/app';
import { createCourse } from '../../helpers/persistance/mongo/courses';
import {
  createLesson,
  findLessonById,
} from '../../helpers/persistance/mongo/lessons';
import { LessonOrder } from '../../../src/contexts/lessons/domain/LessonOrder';
import { AuthorizationTokenBuilder } from '../../helpers/builders/AuthorizationTokenBuilder';
import { ErrorCodes } from '@studio/commons';

let mongoContainer: StartedTestContainer;
const route = '/lessons/:id';

beforeAll(async () => {
  mongoContainer = await initializeMongoContainer();
  await connectMongooseToContainer(mongoContainer);
}, 99999);

afterAll(async () => {
  await disconnectMongoTest();
  await mongoContainer.stop();
});

describe(`PUT ${route}/up`, () => {
  const formatedRoute = (id: string) => `/lesson/${id}/up`;

  it('should reorder up lesson', async () => {
    const course = new CourseBuilder().build();
    const lesson0 = new LessonBuilder()
      .withOrder(LessonOrder.of(0))
      .withCourseId(course.id)
      .build();
    const lesson1 = new LessonBuilder()
      .withOrder(LessonOrder.of(1))
      .withCourseId(course.id)
      .build();

    await createCourse(course);
    await Promise.all([lesson0, lesson1].map((lesson) => createLesson(lesson)));

    await request(app)
      .put(formatedRoute(lesson1.id.value))
      .set(
        'Authorization',
        new AuthorizationTokenBuilder()
          .withUserId(course.authorId.value)
          .build()
      )
      .expect('Content-Type', /json/)
      .expect(200);

    const newLesson0 = await findLessonById(lesson1.id);
    const newLesson1 = await findLessonById(lesson0.id);

    expect(newLesson0).toStrictEqual(
      expect.objectContaining({
        id: lesson1.id,
        order: LessonOrder.of(0),
      })
    );
    expect(newLesson1).toStrictEqual(
      expect.objectContaining({
        id: lesson0.id,
        order: LessonOrder.of(1),
      })
    );
  });

  it('should not let reorder up lesson if request is not authorized', async () => {
    const course = new CourseBuilder().build();
    const lesson0 = new LessonBuilder()
      .withOrder(LessonOrder.of(0))
      .withCourseId(course.id)
      .build();
    const lesson1 = new LessonBuilder()
      .withOrder(LessonOrder.of(1))
      .withCourseId(course.id)
      .build();

    await createCourse(course);
    await Promise.all([lesson0, lesson1].map((lesson) => createLesson(lesson)));

    const response = await request(app)
      .put(formatedRoute(lesson1.id.value))
      .expect('Content-Type', /json/)
      .expect(401);

    expect(response.body).toStrictEqual({
      message: `Authorization is required for request on PUT ${formatedRoute(
        lesson1.id.value
      )}`,
      status: 401,
      kind: 'UNAUTHORIZED',
      errorCode: ErrorCodes.Unauthorized,
    });
  });
});

describe(`PUT ${route}/down`, () => {
  const formatedRoute = (id: string) => `/lesson/${id}/down`;

  it('should reorder down lesson', async () => {
    const course = new CourseBuilder().build();
    const lesson0 = new LessonBuilder()
      .withOrder(LessonOrder.of(0))
      .withCourseId(course.id)
      .build();
    const lesson1 = new LessonBuilder()
      .withOrder(LessonOrder.of(1))
      .withCourseId(course.id)
      .build();

    await createCourse(course);
    await Promise.all([lesson0, lesson1].map((lesson) => createLesson(lesson)));

    await request(app)
      .put(formatedRoute(lesson0.id.value))
      .set(
        'Authorization',
        new AuthorizationTokenBuilder()
          .withUserId(course.authorId.value)
          .build()
      )
      .expect('Content-Type', /json/)
      .expect(200);

    const newLesson0 = await findLessonById(lesson1.id);
    const newLesson1 = await findLessonById(lesson0.id);

    expect(newLesson0).toStrictEqual(
      expect.objectContaining({
        id: lesson1.id,
        order: LessonOrder.of(0),
      })
    );
    expect(newLesson1).toStrictEqual(
      expect.objectContaining({
        id: lesson0.id,
        order: LessonOrder.of(1),
      })
    );
  });

  it('should not let reorder down lesson if request is not authorized', async () => {
    const course = new CourseBuilder().build();
    const lesson0 = new LessonBuilder()
      .withOrder(LessonOrder.of(0))
      .withCourseId(course.id)
      .build();
    const lesson1 = new LessonBuilder()
      .withOrder(LessonOrder.of(1))
      .withCourseId(course.id)
      .build();

    await createCourse(course);
    await Promise.all([lesson0, lesson1].map((lesson) => createLesson(lesson)));

    const response = await request(app)
      .put(formatedRoute(lesson0.id.value))
      .expect('Content-Type', /json/)
      .expect(401);

    expect(response.body).toStrictEqual({
      message: `Authorization is required for request on PUT ${formatedRoute(
        lesson0.id.value
      )}`,
      status: 401,
      kind: 'UNAUTHORIZED',
      errorCode: ErrorCodes.Unauthorized,
    });
  });
});
