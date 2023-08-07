import { NextApiRequest, NextApiResponse } from 'next';
import { SafeControllerHandling } from '../../../lib/controllers/SafeControllerHandling';
import { CoursesApiService } from '../../../contexts/shared/infrastructure/ApiClients/CoursesApiService';
import { SubscribedCourseInfoResponse } from '@studio/commons';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'GET':
      await getSubscribedCourses(req, res);
      break;
    default:
      return res
        .status(404)
        .json({ status: 404, message: `Cannot ${req.method} ${req.url}` });
  }
}

async function getSubscribedCourses(req: NextApiRequest, res: NextApiResponse) {
  const authToken = req.headers.authorization;

  const coursesApiService = new CoursesApiService();

  await SafeControllerHandling(res, async () => {
    const courses = await coursesApiService.get<SubscribedCourseInfoResponse[]>(
      '/courses/subscribed',
      undefined,
      authToken
    );
    res.status(200).send(courses);
  });
}
