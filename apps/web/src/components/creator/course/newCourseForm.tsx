import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { CourseTagsRecord } from '@studio/commons';
import Button from '@studio/ui/components/interactivity/cta/button';
import {
  FormAreaTextInput,
  FormSelectMultipleInput,
  FormTextInput,
} from '@studio/ui/components/interactivity/form';

import { getAuthTokenCookie } from '../../../lib/cookieUtils';
import { createCourse } from '../../../contexts/courses/application/CreateCourse';

import styles from './course.module.scss';

export default function CreateNewCourseForm() {
  const router = useRouter();

  useEffect(() => {
    if (!getAuthTokenCookie()) router.push('/');
  }, [router]);

  const [title, setTitle] = useState<string>();
  const [tags, setTags] = useState<string[]>([]);
  const [description, setDescription] = useState<string>();

  const onSubmitCreateCourse = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();

    if (!title) {
      return;
    }
    if (!description) {
      return;
    }

    await createCourse(
      {
        title,
        tags,
        description,
      },
      getAuthTokenCookie() || ''
    );

    router.push('/creator');
  };

  return (
    <div className={styles.newCourseForm}>
      <FormTextInput
        Name="Title"
        placeholder="Title"
        type="text"
        onChange={(e) => setTitle(e.currentTarget.value)}
        className={styles.field}
      />
      <FormAreaTextInput
        Name="Description"
        placeholder="Description"
        type="text"
        onChange={(e) => setDescription(e.currentTarget.value)}
        className={styles.field}
      />
      <FormSelectMultipleInput
        Name="Tags"
        Values={CourseTagsRecord}
        OnSelect={(values) => setTags(values)}
        className={styles.field}
      />

      <Button
        Label="Create Course!"
        Size="Medium"
        Type="Primary"
        onClick={onSubmitCreateCourse}
      />
    </div>
  );
}
