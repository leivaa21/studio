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
import { createLesson } from '../../helpers/persistance/mongo/lessons';

let mongoContainer: StartedTestContainer;
const route = '/lessons/by-course/:courseId';
const formatedRoute = (id: string) => `/lessons/by-course/${id}`;

beforeAll(async () => {
  mongoContainer = await initializeMongoContainer();
  await connectMongooseToContainer(mongoContainer);
}, 99999);

afterAll(async () => {
  await disconnectMongoTest();
  await mongoContainer.stop();
});

describe(`GET ${route}`, () => {
  it('should get the lesson with courseId matching the path', async () => {
    const course = new CourseBuilder().build();
    const lesson = new LessonBuilder().withCourseId(course.id).build();
    const lesson2 = new LessonBuilder().withCourseId(course.id).build();

    await createCourse(course);
    await Promise.all([lesson, lesson2].map((lesson) => createLesson(lesson)));

    const response = await request(app)
      .get(formatedRoute(course.id.value))
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toHaveLength(2);
  });
});
