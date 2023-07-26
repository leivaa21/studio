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
import { FormTextInput } from '@studio/ui/components/interactivity/form';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

export interface NewLessonFormParams {
  courseId: string;
}

export default function NewLessonForm({ courseId }: NewLessonFormParams) {
  const router = useRouter();

  const [courseTitle, setCourseTitle] = useState<string>();

  useEffect(() => {
    if (!courseId) return;
    getCourseById(courseId).then((course) => setCourseTitle(course.title));
  });

  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>(
    '# New Lesson \n - [x] Make awesome courses \n - [ ] Use markdown to start creating!'
  );

  const onLessonSubmit = async () => {
    if (!title || !content) return;

    await createLesson(
      { courseId, title, content },
      getAuthTokenCookie() || ''
    );

    router.push(`/creator/course/${courseId}/lessons`);
  };

  return (
    <div className={styles.newLessonForm}>
      <h2>New Lesson for {courseTitle}</h2>
      <FormTextInput
        id="lesson-title-input"
        Name="Lesson title"
        placeholder="Lesson title"
        type="text"
        onChange={(e) => setTitle(e.currentTarget.value)}
      />
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