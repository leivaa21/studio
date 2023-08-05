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
import { AuthorizationTokenBuilder } from '../../helpers/builders/AuthorizationTokenBuilder';
import { createCourse } from '../../helpers/persistance/mongo/courses';
import { ErrorCodes } from '@studio/commons';
import {
  createLesson,
  findLessonById,
} from '../../helpers/persistance/mongo/lessons';

let mongoContainer: StartedTestContainer;
const route = '/lesson/:id';
const formatedRoute = (id: string) => `/lesson/${id}`;

beforeAll(async () => {
  mongoContainer = await initializeMongoContainer();
  await connectMongooseToContainer(mongoContainer);
}, 99999);

afterAll(async () => {
  await disconnectMongoTest();
  await mongoContainer.stop();
});

describe(`DELETE ${route}`, () => {
  it('should let delete an existant lesson', async () => {
    const course = new CourseBuilder().build();
    const lesson = new LessonBuilder().withCourseId(course.id).build();

    await createCourse(course);
    await createLesson(lesson);

    await request(app)
      .delete(formatedRoute(lesson.id.value))
      .set(
        'Authorization',
        new AuthorizationTokenBuilder()
          .withUserId(course.authorId.value)
          .build()
      )
      .expect('Content-Type', /json/)
      .expect(200);

    const foundLesson = await findLessonById(lesson.id);

    expect(foundLesson).toBeUndefined();
  });

  it('should not let delete a lesson if request is not authorized', async () => {
    const course = new CourseBuilder().build();
    const lesson = new LessonBuilder().withCourseId(course.id).build();

    await createCourse(course);
    await createLesson(lesson);

    const response = await request(app)
      .delete(formatedRoute(lesson.id.value))
      .expect('Content-Type', /json/)
      .expect(401);

    const foundLesson = await findLessonById(lesson.id);

    expect(foundLesson).toBeDefined();

    expect(response.body).toStrictEqual({
      message: `Authorization is required for request on DELETE /lesson/${lesson.id}`,
      status: 401,
      kind: 'UNAUTHORIZED',
      errorCode: ErrorCodes.Unauthorized,
    });
  });
});
