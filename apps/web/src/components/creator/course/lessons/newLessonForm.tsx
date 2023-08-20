import { useRouter } from 'next/router';
import { ChangeEvent, Fragment, useCallback, useEffect, useState } from 'react';
import { useErrorBoundary } from 'react-error-boundary';

import Button from '@studio/ui/components/interactivity/cta/button';
import { FormTextInput } from '@studio/ui/components/interactivity/form';
import { ErrorMessage } from '@studio/ui/components/error/ErrorMessage';
import {
  CourseInfoResponse,
  MAX_LESSON_TITLE_LENGTH,
  isLessonTitleValid,
} from '@studio/commons';

import styles from '../course.module.scss';

import { createLesson } from '../../../../contexts/lessons/aplication/CreateLesson';
import { getAuthTokenCookie } from '../../../../lib/cookieUtils';
import { MarkdownEditor } from '../../../markdown/editor';
import { getCourseById } from '../../../../contexts/courses/application/GetCourseById';

export interface NewLessonFormParams {
  courseId: string;
}

export default function NewLessonForm({ courseId }: NewLessonFormParams) {
  const router = useRouter();
  const [course, setCourse] = useState<CourseInfoResponse>();

  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>(
    '# New Lesson \n - [x] Make awesome courses \n - [ ] Use markdown to start creating!'
  );

  const [errorMessage, setErrorMessage] = useState<string>('');
  const { showBoundary } = useErrorBoundary();

  const fetchData = useCallback(async () => {
    if (!courseId) return;

    try {
      const course = await getCourseById(courseId);

      setCourse(course);
    } catch (err) {
      showBoundary(err);
    }
  }, [courseId, showBoundary]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (!course) return <Fragment />;

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

    await createLesson(
      { courseId, title, content },
      getAuthTokenCookie() || ''
    );

    router.push(`/creator/course/${courseId}/lessons`);
  };

  return (
    <div className={styles.newLessonForm}>
      <h2>New Lesson for {course.title}</h2>
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
        <MarkdownEditor
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
