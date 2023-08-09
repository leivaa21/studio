import { NextApiRequest, NextApiResponse } from 'next';
import { SafeControllerHandling } from '../../../../lib/controllers/SafeControllerHandling';
import { CoursesApiService } from '../../../../contexts/shared/infrastructure/ApiClients/CoursesApiService';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'DELETE':
      await deleteOwnedCourseSubcription(req, res);
      break;
    default:
      return res
        .status(404)
        .json({ status: 404, message: `Cannot ${req.method} ${req.url}` });
  }
}

async function deleteOwnedCourseSubcription(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const authToken = req.headers.authorization;

  const coursesApiService = new CoursesApiService();

  const { id } = req.query;

  await SafeControllerHandling(res, async () => {
    await coursesApiService.delete<undefined, undefined>(
      `/course-subscription/${id}`,
      undefined,
      authToken
    );

    res.status(200).end();
  });
}
