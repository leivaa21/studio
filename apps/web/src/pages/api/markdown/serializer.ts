// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'next-mdx-remote/serialize';
import { env } from '../../../lib/env';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'POST':
      await serializeContent(req, res);
      break;
    default:
      return res
        .status(404)
        .json({ status: 404, message: `Cannot ${req.method} ${req.url}` });
  }
}

async function serializeContent(req: NextApiRequest, res: NextApiResponse) {
  const { content } = req.body;
  const mdx = await serialize(content, {
    mdxOptions: { development: env.app.isDevelopment },
  });

  res.status(200).json({ mdx });
}
