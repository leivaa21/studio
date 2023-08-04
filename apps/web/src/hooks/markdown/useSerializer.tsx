import { useEffect, useState } from 'react';
import { MDXRemoteSerializeResult } from 'next-mdx-remote/dist/types';

import { internalApiClient } from '../../lib/InternalApiClient';

type mdxSerialized = MDXRemoteSerializeResult<
  Record<string, unknown>,
  Record<string, unknown>
>;

export function useSerializer(content?: string) {
  const [mdx, setMdx] = useState<mdxSerialized>();

  useEffect(() => {
    if (!content) return;
    internalApiClient
      .post<{ content: string }, { mdx: mdxSerialized }>(
        '/api/markdown/serializer',
        {
          content,
        }
      )
      .then((response) => setMdx(response.mdx));
  }, [content]);

  return mdx;
}
