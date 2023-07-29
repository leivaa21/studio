import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { CourseTagsRecord } from '@studio/commons';
import Button from '@studio/ui/components/interactivity/cta/button';
import {
  FormSelectMultipleInput,
  FormTextInput,
} from '@studio/ui/components/interactivity/form';

import { getAuthTokenCookie } from '../../../lib/cookieUtils';
import { createCourse } from '../../../contexts/courses/application/CreateCourse';

import styles from './course.module.scss';
import dynamic from 'next/dynamic';

import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

export default function CreateNewCourseForm() {
  const router = useRouter();

  useEffect(() => {
    if (!getAuthTokenCookie()) router.push('/');
  }, [router]);

  const [title, setTitle] = useState<string>();
  const [tags, setTags] = useState<string[]>([]);
  const [description, setDescription] = useState<string>(
    '# New Course \n - [x] Start with a brilliant idea \n - [ ] Use markdown to start creating!'
  );

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
      />
      <div className={styles.field}>
        <span className={styles.label}>Description</span>
        <MDEditor
          className={styles.markdownEditor}
          value={description}
          onChange={(e) => setDescription(e || '')}
          enableScroll
        />
      </div>
      <FormSelectMultipleInput
        Name="Tags"
        Values={CourseTagsRecord}
        OnSelect={(values) => setTags(values)}
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
