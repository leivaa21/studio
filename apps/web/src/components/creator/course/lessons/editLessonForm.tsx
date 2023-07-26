import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

import Button from '@studio/ui/components/interactivity/cta/button';

import styles from '../course.module.scss';

import { getCourseById } from '../../../../contexts/courses/application/GetCourseById';
import { useRouter } from 'next/router';
import { getAuthTokenCookie } from '../../../../lib/cookieUtils';
import { FormTextInput } from '@studio/ui/components/interactivity/form';
import { getLessonById } from '../../../../contexts/lessons/aplication/GetLessonById';
import { updateLesson } from '../../../../contexts/lessons/aplication/UpdateLesson';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

export interface NewLessonFormParams {
  courseId: string;
  lessonId: string;
}

export default function EditLessonForm({
  courseId,
  lessonId,
}: NewLessonFormParams) {
  const router = useRouter();

  const [courseTitle, setCourseTitle] = useState<string>();

  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>(
    '# New Lesson \n - [x] Make awesome courses \n - [ ] Use markdown to start creating!'
  );

  useEffect(() => {
    if (!courseId || !lessonId) return;
    getCourseById(courseId).then((course) => setCourseTitle(course.title));
    getLessonById(lessonId).then((lesson) => {
      setTitle(lesson.title);
      setContent(lesson.content);
    });
  }, []);

  const onLessonSubmit = async () => {
    if (!title || !content) return;

    await updateLesson(
      { title, content },
      lessonId,
      getAuthTokenCookie() || ''
    );

    router.push(`/creator/course/${courseId}/lessons`);
  };

  return (
    <div className={styles.newLessonForm}>
      <h2>Update lesson for {courseTitle}</h2>
      <FormTextInput
        id="lesson-title-input"
        Name="Lesson title"
        placeholder="Lesson title"
        type="text"
        value={title}
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
        Label="Update lesson!"
        onClick={onLessonSubmit}
      />
    </div>
  );
}
