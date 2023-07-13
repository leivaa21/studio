import { Fragment, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { CourseTagsRecord } from '@studio/commons';

import { getAuthTokenCookie } from '../../lib/cookieUtils';
import { Header } from '../../components/header/header';
import Button from '@studio/ui/components/interactivity/cta/button';
import Form, {
  FormAreaTextInput,
  FormBody,
  FormSelectMultipleInput,
  FormTextInput,
} from '@studio/ui/components/interactivity/form';
import { createCourse } from '../../contexts/courses/application/CreateCourse';

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
    <Fragment>
      <Header />
      <Form>
        <FormBody>
          <FormTextInput
            Name="Title"
            placeholder="Title"
            type="text"
            onChange={(e) => setTitle(e.currentTarget.value)}
          />
          <FormAreaTextInput
            Name="Description"
            placeholder="Description"
            type="text"
            onChange={(e) => setDescription(e.currentTarget.value)}
          />
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
        </FormBody>
      </Form>
    </Fragment>
  );
}
