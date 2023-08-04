import dynamic from 'next/dynamic';

import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

interface MarkdownEditorParams {
  value?: string;
  enableScroll: boolean;
  onChange: (text?: string) => void;
  className: string;
}

export function MarkdownEditor(props: MarkdownEditorParams) {
  return <MDEditor {...props} />;
}
