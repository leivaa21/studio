import { NextApiRequest, NextApiResponse } from 'next';

import { CourseInfoResponse, UpdateCourseRequest } from '@studio/commons';

import { SafeControllerHandling } from '../../../../lib/controllers/SafeControllerHandling';
import { CoursesApiService } from '../../../../contexts/shared/infrastructure/ApiClients/CoursesApiService';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'PUT':
      await updateCourse(req, res);
      break;
    case 'GET':
      await getCourse(req, res);
      break;
    default:
      return res
        .status(404)
        .json({ status: 404, message: `Cannot ${req.method} ${req.url}` });
  }
}

async function getCourse(req: NextApiRequest, res: NextApiResponse) {
  const { id: courseId } = req.query;

  const coursesApiService = new CoursesApiService();

  await SafeControllerHandling(res, async () => {
    const course = await coursesApiService.get<CourseInfoResponse>(
      `/course/${courseId}`
    );

    res.status(200).send(course);
  });
}

async function updateCourse(req: NextApiRequest, res: NextApiResponse) {
  const { id: courseId } = req.query;

  const authToken = req.headers.authorization;

  const { body } = req;

  const coursesApiService = new CoursesApiService();

  const request: UpdateCourseRequest = {
    title: body.title,
    tags: body.tags,
    description: body.description,
  };

  await SafeControllerHandling(res, async () => {
    await coursesApiService.put<UpdateCourseRequest, void>(
      `/course/${courseId}`,
      request,
      authToken
    );

    res.status(200).end();
  });
}
