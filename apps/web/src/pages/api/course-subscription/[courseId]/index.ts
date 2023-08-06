import { NextApiRequest, NextApiResponse } from 'next';
import { SafeControllerHandling } from '../../../../lib/controllers/SafeControllerHandling';
import { CoursesApiService } from '../../../../contexts/shared/infrastructure/ApiClients/CoursesApiService';
import { CheckIfUserIsSubscribedToCourseResponse } from '@studio/commons';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'GET':
      await checkIfUserIsSubscribedToCourse(req, res);
      break;
    default:
      return res
        .status(404)
        .json({ status: 404, message: `Cannot ${req.method} ${req.url}` });
  }
}

async function checkIfUserIsSubscribedToCourse(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const authToken = req.headers.authorization;

  const coursesApiService = new CoursesApiService();

  const { courseId } = req.query;

  await SafeControllerHandling(res, async () => {
    const response =
      await coursesApiService.get<CheckIfUserIsSubscribedToCourseResponse>(
        `/course-subscription/${courseId}`,
        undefined,
        authToken
      );

    res.status(200).send(response);
  });
}
