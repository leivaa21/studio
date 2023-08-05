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
import { ErrorCodes } from '@studio/commons';
import { createLesson } from '../../helpers/persistance/mongo/lessons';

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

describe(`GET ${route}`, () => {
  it('should get the persisted lesson with id matching the path', async () => {
    const course = new CourseBuilder().build();
    const lesson = new LessonBuilder().withCourseId(course.id).build();

    await createCourse(course);
    await createLesson(lesson);

    const response = await request(app)
      .get(formatedRoute(lesson.id.value))
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toStrictEqual(
      expect.objectContaining({
        title: lesson.title.value,
        id: lesson.id.value,
      })
    );
  });

  it('should response with 404 if theres no lesson matching that id', async () => {
    const course = new CourseBuilder().build();
    const lesson = new LessonBuilder().withCourseId(course.id).build();

    await createCourse(course);

    const response = await request(app)
      .get(formatedRoute(lesson.id.value))
      .expect('Content-Type', /json/)
      .expect(404);

    expect(response.body).toStrictEqual({
      message: `Lesson with id = <${lesson.id.value}> couldn't be found`,
      status: 404,
      kind: 'NOT_FOUND',
      errorCode: ErrorCodes.LessonNotFound,
    });
  });
});
