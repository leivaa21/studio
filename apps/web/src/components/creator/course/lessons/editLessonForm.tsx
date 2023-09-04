import { useErrorBoundary } from 'react-error-boundary';
import { useRouter } from 'next/router';
import { ChangeEvent, Fragment, useCallback, useEffect, useState } from 'react';

import Button from '@studio/ui/components/interactivity/cta/button';
import { FormTextInput } from '@studio/ui/components/interactivity/form';
import { ErrorMessage } from '@studio/ui/components/error/ErrorMessage';
import {
  CourseInfoResponse,
  LessonResponse,
  MAX_LESSON_TITLE_LENGTH,
  isLessonTitleValid,
} from '@studio/commons';

import styles from '../course.module.scss';

import { getAuthTokenCookie } from '../../../../lib/cookieUtils';
import { updateLesson } from '../../../../contexts/lessons/aplication/UpdateLesson';
import { MarkdownEditor } from '../../../markdown/editor';
import { getLessonById } from '../../../../contexts/lessons/aplication/GetLessonById';
import { getCourseById } from '../../../../contexts/courses/application/GetCourseById';

export interface NewLessonFormParams {
  courseId: string;
  lessonId: string;
}

export default function EditLessonForm({
  courseId,
  lessonId,
}: NewLessonFormParams) {
  const router = useRouter();

  const [course, setCourse] = useState<CourseInfoResponse>();
  const [lesson, setLesson] = useState<LessonResponse>();

  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>(
    '# New Lesson \n - [x] Make awesome courses \n - [ ] Use markdown to start creating!'
  );

  const [errorMessage, setErrorMessage] = useState<string>('');
  const { showBoundary } = useErrorBoundary();

  const fetchData = useCallback(async () => {
    if (!lessonId || !courseId) return;

    try {
      const lesson = await getLessonById(lessonId);
      const course = await getCourseById(courseId);

      setLesson(lesson);
      setCourse(course);
      setTitle(lesson.title);
      setContent(lesson.content);
    } catch (err) {
      showBoundary(err);
    }
  }, [lessonId, courseId, showBoundary]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (!course || !lesson) return <Fragment />;

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
    const token = getAuthTokenCookie();
    if (!token || !title || !content) return;

    await updateLesson({ title, content }, lessonId, token);

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
        Label="Update lesson!"
        onClick={onLessonSubmit}
      />
    </div>
  );
}
