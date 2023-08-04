import React from 'react';
import dynamic from 'next/dynamic';
import { Link } from './components/texts';
import {
  Header1,
  Header2,
  Header3,
  Header4,
  Header5,
  Header6,
} from './components/headers';

import '@uiw/react-markdown-preview/markdown.css';

const MarkdownPreview = dynamic(() => import('@uiw/react-markdown-preview'), {
  ssr: false,
});

const components = {
  h1: Header1,
  h2: Header2,
  h3: Header3,
  h4: Header4,
  h5: Header5,
  h6: Header6,
  a: Link,
};

export function MarkdownRenderer({ content }: { content?: string }) {
  return (
    <MarkdownPreview
      source={content}
      components={{ ...components }}
      className="markdown-preview"
      wrapperElement={{ 'data-color-mode': 'dark' }}
    />
  );
}
