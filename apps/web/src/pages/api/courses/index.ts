import { NextApiRequest, NextApiResponse } from 'next';
import { SafeControllerHandling } from '../../../lib/controllers/SafeControllerHandling';
import { CoursesApiService } from '../../../contexts/shared/infrastructure/ApiClients/CoursesApiService';
import { CourseInfoResponse, CreateCourseRequest } from '@studio/commons';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'POST':
      await createCourse(req, res);
      break;
    case 'GET':
      await getPublishedCourses(req, res);
      break;
    default:
      return res
        .status(404)
        .json({ status: 404, message: `Cannot ${req.method} ${req.url}` });
  }
}

async function createCourse(req: NextApiRequest, res: NextApiResponse) {
  const authToken = req.headers.authorization;

  const coursesApiService = new CoursesApiService();

  const { body } = req;

  const request: CreateCourseRequest = {
    title: body.title,
    tags: body.tags,
    description: body.description,
  };

  await SafeControllerHandling(res, async () => {
    await coursesApiService.post<CreateCourseRequest, void>(
      '/courses',
      request,
      authToken
    );

    res.status(201).end();
  });
}

async function getPublishedCourses(req: NextApiRequest, res: NextApiResponse) {
  const params = new Map([
    ['title', (req.query.title as string) || ''],
    ['tags', (req.query.tags as string) || ''],
  ]);

  const coursesApiService = new CoursesApiService();

  await SafeControllerHandling(res, async () => {
    const courses = await coursesApiService.get<CourseInfoResponse[]>(
      '/courses',
      params
    );
    res.status(200).send(courses);
  });
}
