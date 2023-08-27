import { NextApiRequest, NextApiResponse } from 'next';

import { SafeControllerHandling } from '../../../lib/controllers/SafeControllerHandling';
import { CoursesApiService } from '../../../contexts/shared/infrastructure/ApiClients/CoursesApiService';
import { CurrentCourseStatsResponse } from '@studio/commons';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'GET':
      await getCurrentCourseStats(req, res);
      break;
    default:
      return res
        .status(404)
        .json({ status: 404, message: `Cannot ${req.method} ${req.url}` });
  }
}

async function getCurrentCourseStats(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id: courseId } = req.query;

  const coursesApiService = new CoursesApiService();

  await SafeControllerHandling(res, async () => {
    const course = await coursesApiService.get<CurrentCourseStatsResponse>(
      `/course-stats/${courseId}`
    );

    res.status(200).send(course);
  });
}
