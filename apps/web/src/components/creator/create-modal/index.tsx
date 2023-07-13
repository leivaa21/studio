import Button from '@studio/ui/components/interactivity/cta/button';
import Form, {
  FormAreaTextInput,
  FormBody,
  FormSelectMultipleInput,
  FormTextInput,
} from '@studio/ui/components/interactivity/form';
import { Modal } from '@studio/ui/components/modal';
import { createCourse } from '../../../contexts/courses/application/CreateCourse';
import { useState } from 'react';
import { getAuthTokenCookie } from '../../../lib/cookieUtils';
import { CourseTagsRecord } from '@studio/commons';

export function CreateNewCourseModal({
  isShown,
  closeFunction,
}: {
  isShown: boolean;
  closeFunction: () => void;
}) {
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

    closeFunction();
  };

  return (
    <Modal
      title="Create a new course"
      isShown={isShown}
      closeFunction={closeFunction}
    >
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
    </Modal>
  );
}
