import { LessonInfoResponse } from '@studio/commons';
import { NextApiRequest, NextApiResponse } from 'next';
import { CoursesApiService } from '../../../../contexts/shared/infrastructure/ApiClients/CoursesApiService';
import { SafeControllerHandling } from '../../../../lib/controllers/SafeControllerHandling';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res
      .status(404)
      .json({ status: 404, message: `Cannot ${req.method} ${req.url}` });
  }

  const { courseId } = req.query;

  const coursesApiService = new CoursesApiService();

  await SafeControllerHandling(res, async () => {
    const courses = await coursesApiService.get<LessonInfoResponse[]>(
      `/lessons/by-course/${courseId}`
    );
    res.status(200).send(courses);
  });
}
