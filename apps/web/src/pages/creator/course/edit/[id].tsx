import { Fragment, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { CourseTagsRecord } from '@studio/commons';

import { getAuthTokenCookie } from '../../../../lib/cookieUtils';
import { Header } from '../../../../components/header/header';
import Button from '@studio/ui/components/interactivity/cta/button';
import Form, {
  FormAreaTextInput,
  FormBody,
  FormSelectMultipleInput,
  FormTextInput,
} from '@studio/ui/components/interactivity/form';
import { updateCourse } from '../../../../contexts/courses/application/UpdateCourse';
import { getCourseById } from '../../../../contexts/courses/application/GetCourseById';

export default function UpdateCourseForm() {
  const router = useRouter();

  const courseId = router.query.id as string;
  const [title, setTitle] = useState<string>();
  const [tags, setTags] = useState<string[]>([]);
  const [description, setDescription] = useState<string>();

  useEffect(() => {
    if (!getAuthTokenCookie()) router.push('/');
    if (!courseId) return;

    getCourseById(courseId).then((course) => {
      setTitle(course.title);
      setTags(course.tags);
      setDescription(course.description);
    });
  }, [router, courseId]);

  const onSubmitUpdateCourse = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();

    if (!title) {
      return;
    }
    if (!description) {
      return;
    }

    await updateCourse(
      {
        title,
        tags,
        description,
      },
      courseId,
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
            value={title}
            onChange={(e) => setTitle(e.currentTarget.value)}
          />
          <FormAreaTextInput
            Name="Description"
            placeholder="Description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.currentTarget.value)}
          />
          <FormSelectMultipleInput
            Name="Tags"
            Values={CourseTagsRecord}
            SelectedValues={tags}
            OnSelect={(values) => setTags(values)}
          />

          <Button
            Label="Update Course!"
            Size="Medium"
            Type="Primary"
            onClick={onSubmitUpdateCourse}
          />
        </FormBody>
      </Form>
    </Fragment>
  );
}
