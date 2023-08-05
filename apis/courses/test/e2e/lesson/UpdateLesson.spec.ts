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
  findLessonsByCourseId,
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

describe(`PUT ${route}`, () => {
  it('should let update a lesson', async () => {
    const course = new CourseBuilder().build();
    const lesson = new LessonBuilder().withCourseId(course.id).build();
    const { content, title } = new LessonBuilder().build();

    await createCourse(course);
    await createLesson(lesson);

    const body = {
      title: title.value,
      content: content.value,
    };

    await request(app)
      .put(formatedRoute(lesson.id.value))
      .set(
        'Authorization',
        new AuthorizationTokenBuilder()
          .withUserId(course.authorId.value)
          .build()
      )
      .send(body)
      .expect('Content-Type', /json/)
      .expect(200);

    const updatedLesson = await findLessonById(lesson.id);

    expect(updatedLesson).toStrictEqual(
      expect.objectContaining({
        id: lesson.id,
        content: content,
        title: title,
      })
    );
  });

  it.each([{ missingParam: 'title' }, { missingParam: 'content' }])(
    'should throw BadRequest Error if $missingParam is missing on body',
    async ({ missingParam }) => {
      const course = new CourseBuilder().build();
      const { title, content } = new LessonBuilder().build();

      await createCourse(course);

      const body = {
        title: missingParam === 'title' ? undefined : title.value,
        content: missingParam === 'content' ? undefined : content.value,
      };

      const response = await request(app)
        .put(route)
        .set(
          'Authorization',
          new AuthorizationTokenBuilder()
            .withUserId(course.authorId.value)
            .build()
        )
        .send(body)
        .expect('Content-Type', /json/)
        .expect(400);

      const courseLessons = await findLessonsByCourseId(course.id);

      expect(courseLessons).toHaveLength(0);

      expect(response.body).toStrictEqual({
        message: 'Params title and content are required',
        status: 400,
        kind: 'BAD_REQUEST',
        errorCode: ErrorCodes.BadRequest,
      });
    }
  );

  it('should not let update a lesson if request is not authorized', async () => {
    const course = new CourseBuilder().build();
    const lesson = new LessonBuilder().withCourseId(course.id).build();
    const { content, title } = new LessonBuilder().build();

    await createCourse(course);
    await createLesson(lesson);

    const body = {
      title: title.value,
      content: content.value,
    };

    const response = await request(app)
      .put(formatedRoute(lesson.id.value))
      .send(body)
      .expect('Content-Type', /json/)
      .expect(401);

    expect(response.body).toStrictEqual({
      message: `Authorization is required for request on PUT ${formatedRoute(
        lesson.id.value
      )}`,
      status: 401,
      kind: 'UNAUTHORIZED',
      errorCode: ErrorCodes.Unauthorized,
    });
  });
});
