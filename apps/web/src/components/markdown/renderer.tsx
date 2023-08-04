import { MDXRemote } from 'next-mdx-remote';
import { useSerializer } from '../../hooks/markdown/useSerializer';
import { Fragment } from 'react';

export function MarkdownRenderer({ content }: { content?: string }) {
  const markdown = useSerializer(content);

  if (markdown) {
    return <MDXRemote {...markdown} />;
  }
  return <Fragment />;
}
