import { ChangeEvent, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

import Button from '@studio/ui/components/interactivity/cta/button';
import { ErrorMessage } from '@studio/ui/components/error/ErrorMessage';

import styles from '../course.module.scss';

import { useRouter } from 'next/router';
import { getAuthTokenCookie } from '../../../../lib/cookieUtils';
import { FormTextInput } from '@studio/ui/components/interactivity/form';
import { getLessonById } from '../../../../contexts/lessons/aplication/GetLessonById';
import { updateLesson } from '../../../../contexts/lessons/aplication/UpdateLesson';
import { MAX_LESSON_TITLE_LENGTH, isLessonTitleValid } from '@studio/commons';
import { useCourse } from '../../../../hooks/course/useCourse';

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

  const course = useCourse(courseId);

  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>(
    '# New Lesson \n - [x] Make awesome courses \n - [ ] Use markdown to start creating!'
  );

  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    if (!lessonId) return;
    getLessonById(lessonId).then((lesson) => {
      setTitle(lesson.title);
      setContent(lesson.content);
    });
  }, [lessonId]);

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    if (!isLessonTitleValid(value)) {
      setErrorMessage(
        `Titles cant be longer than ${MAX_LESSON_TITLE_LENGTH} characters`
      );

      return;
    }

    setErrorMessage('');
    setTitle(value);
  };

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
      <h2>Update lesson for {course?.title}</h2>
      <ErrorMessage message={errorMessage} />
      <FormTextInput
        id="lesson-title-input"
        Name="Lesson title"
        placeholder="Lesson title"
        type="text"
        value={title}
        onChange={handleTitleChange}
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
