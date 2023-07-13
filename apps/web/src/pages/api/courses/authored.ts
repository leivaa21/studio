import { NextApiRequest, NextApiResponse } from 'next';
import { SafeControllerHandling } from '../../../lib/controllers/SafeControllerHandling';
import { CoursesApiService } from '../../../contexts/shared/infrastructure/ApiClients/CoursesApiService';
import { CourseInfoResponse } from '@studio/commons';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res
      .status(404)
      .json({ status: 404, message: `Cannot ${req.method} ${req.url}` });
  }

  const authToken = req.headers.authorization;
  const params = new Map([
    ['page', req.query.page as string],
    ['count', req.query.pageSize as string],
    ['title', (req.query.title as string) || ''],
    ['tags', (req.query.tags as string) || ''],
  ]);

  const coursesApiService = new CoursesApiService();

  await SafeControllerHandling(res, async () => {
    const courses = await coursesApiService.get<CourseInfoResponse[]>(
      '/courses/authored',
      params,
      authToken
    );
    res.status(200).send(courses);
  });
}
