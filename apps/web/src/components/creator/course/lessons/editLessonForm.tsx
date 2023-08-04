import { useRouter } from 'next/router';
import { ChangeEvent, useEffect, useState } from 'react';

import Button from '@studio/ui/components/interactivity/cta/button';
import { FormTextInput } from '@studio/ui/components/interactivity/form';
import { ErrorMessage } from '@studio/ui/components/error/ErrorMessage';
import { MAX_LESSON_TITLE_LENGTH, isLessonTitleValid } from '@studio/commons';

import styles from '../course.module.scss';

import { getAuthTokenCookie } from '../../../../lib/cookieUtils';
import { updateLesson } from '../../../../contexts/lessons/aplication/UpdateLesson';
import { useCourse } from '../../../../hooks/course/useCourse';
import { useLesson } from '../../../../hooks/course/useLesson';
import { MarkdownEditor } from '../../../markdown/editor';

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
  const lesson = useLesson(lessonId);

  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>(
    '# New Lesson \n - [x] Make awesome courses \n - [ ] Use markdown to start creating!'
  );

  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    if (!lesson) return;
    setTitle(lesson.title);
    setContent(lesson.content);
  }, [lesson]);

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
