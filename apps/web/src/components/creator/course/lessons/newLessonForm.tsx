import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

import Button from '@studio/ui/components/interactivity/cta/button';

import styles from '../course.module.scss';

import { getCourseById } from '../../../../contexts/courses/application/GetCourseById';
import { useRouter } from 'next/router';
import { createLesson } from '../../../../contexts/lessons/aplication/CreateLesson';
import { getAuthTokenCookie } from '../../../../lib/cookieUtils';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

export interface NewLessonFormParams {
  courseId: string;
}

export default function NewLessonForm({ courseId }: NewLessonFormParams) {
  const router = useRouter();

  const [title, setTitle] = useState<string>();

  useEffect(() => {
    if (!courseId) return;
    getCourseById(courseId).then((course) => setTitle(course.title));
  });

  const [content, setContent] = useState<string>(
    '# New Lesson \n - [x] Make awesome courses \n - [ ] Use markdown to start creating!'
  );

  const onLessonSubmit = async () => {
    if (!title || !content) return;

    await createLesson(
      { courseId, title, content },
      getAuthTokenCookie() || ''
    );

    router.push(`/course/${courseId}/lessons`);
  };

  return (
    <div className={styles.newLessonForm}>
      <h2>New Lesson for {title}</h2>
      <div className={styles.field}>
        <label htmlFor="lesson-title-input" className={styles.label}>
          Lesson title
        </label>
        <input id="lesson-title-input" />
      </div>
      <div className={styles.field}>
        <span className={styles.label}>Content</span>
        <MDEditor
          className={styles.markdownEditor}
          value={content}
          onChange={(e) => setContent(e || '')}
          enableScroll
        />
      </div>
      <Button
        Type="Primary"
        Size="Medium"
        Label="Create lesson!"
        onClick={onLessonSubmit}
      />
    </div>
  );
}
