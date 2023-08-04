import { useRouter } from 'next/router';
import { ChangeEvent, useEffect, useState } from 'react';

import Button from '@studio/ui/components/interactivity/cta/button';
import { Modal } from '@studio/ui/components/modal';
import {
  FormSelectMultipleInput,
  FormTextInput,
} from '@studio/ui/components/interactivity/form';
import {
  CourseTagsRecord,
  MAX_COURSE_TITLE_LENGTH,
  MAX_TAGS_COUNT,
  isCourseTitleValid,
  validateCourseTagsBusinessRules,
} from '@studio/commons';
import { ErrorMessage } from '@studio/ui/components/error/ErrorMessage';

import styles from './course.module.scss';

import { renameCourse } from '../../../contexts/courses/application/RenameCourse';
import { updateCourseDescription } from '../../../contexts/courses/application/UpdateCourseDescription';
import { getAuthTokenCookie } from '../../../lib/cookieUtils';
import { updateCourseTags } from '../../../contexts/courses/application/UpdateCourseTags';
import { publishCourse } from '../../../contexts/courses/application/PublishCourse';
import { unpublishCourse } from '../../../contexts/courses/application/UnpublishCourse';
import { useCourse } from '../../../hooks/course/useCourse';
import { MarkdownRenderer } from '../../markdown/renderer';
import { MarkdownEditor } from '../../markdown/editor';

export interface CreatorCoursePreviewParams {
  courseId: string;
}

export function CreatorCoursePreview({ courseId }: CreatorCoursePreviewParams) {
  const router = useRouter();

  const course = useCourse(courseId);

  const [title, setTitle] = useState<string>();
  const [tags, setTags] = useState<string[]>([]);
  const [description, setDescription] = useState<string>();
  const [isPublished, setIsPublished] = useState<boolean>();
  const [publishedAt, setPublishedAt] = useState<Date | null>();

  const [renameModalShown, setRenameModalShown] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>();

  const [updateDescriptionModalShown, setUpdateDescriptionModalShown] =
    useState<boolean>(false);
  const [newDescription, setNewDescription] = useState<string>();

  const [updateTagsModalShown, setUpdateTagsModalShown] =
    useState<boolean>(false);
  const [newTags, setNewTags] = useState<string[]>();

  const [publishModalShown, setPublishModalShown] = useState<boolean>(false);

  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    if (!course) return;

    setTitle(course.title);
    setNewTitle(course.title);
    setTags(course.tags);
    setNewTags(course.tags);
    setDescription(course.description);
    setNewDescription(course.description);
    setIsPublished(course.isPublished);
    setPublishedAt(course.publishedAt);
  }, [course]);

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    if (!isCourseTitleValid(value)) {
      setErrorMessage(
        `Titles cant be longer than ${MAX_COURSE_TITLE_LENGTH} characters`
      );

      return;
    }

    setErrorMessage('');
    setNewTitle(value);
  };

  const handleTagsChange = (values: string[]) => {
    const { exceededCount } = validateCourseTagsBusinessRules(values);
    if (exceededCount) {
      setErrorMessage(`Courses can't have more than ${MAX_TAGS_COUNT} tags`);
      setNewTags(values.slice(values.length - MAX_TAGS_COUNT, values.length));
      return;
    }
    setErrorMessage('');
    setNewTags(values);
  };

  const onSubmitRenameCourse = async () => {
    if (newTitle === title || !newTitle) {
      setRenameModalShown(false);
      return;
    }

    await renameCourse(
      { title: newTitle },
      courseId,
      getAuthTokenCookie() || ''
    );
    router.reload();
  };

  const onSubmitUpdateDescription = async () => {
    if (newDescription === description || !newDescription) {
      setUpdateDescriptionModalShown(false);
      return;
    }

    await updateCourseDescription(
      { description: newDescription },
      courseId,
      getAuthTokenCookie() || ''
    );
    router.reload();
  };

  const onSubmitUpdateTags = async () => {
    if (!newTags) {
      setUpdateTagsModalShown(false);
      return;
    }

    await updateCourseTags(
      { tags: newTags },
      courseId,
      getAuthTokenCookie() || ''
    );
    router.reload();
  };

  const onSubmitPublish = async () => {
    await publishCourse(courseId, getAuthTokenCookie() || '');
    router.reload();
  };

  const onSubmitUnpublish = async () => {
    await unpublishCourse(courseId, getAuthTokenCookie() || '');
    router.reload();
  };

  return (
    <div className={styles.coursePreview}>
      <div className={styles.propertyRow}>
        <h4 className={styles.propertyName}>Title</h4>
        <span className={styles.propertyValue}>{title}</span>
        <div className={styles.propertyControls}>
          <Button
            Type="Primary"
            Size="Small"
            Label="Rename"
            onClick={() => setRenameModalShown(true)}
          />
        </div>
      </div>
      <div className={styles.propertyRow}>
        <h4 className={styles.propertyName}>Description</h4>
        <div
          className={styles.propertyValue}
          style={{ flexDirection: 'column' }}
        >
          <MarkdownRenderer content={course?.description} />
        </div>
        <div className={styles.propertyControls}>
          <Button
            Type="Primary"
            Size="Small"
            Label="Change Description"
            onClick={() => setUpdateDescriptionModalShown(true)}
          />
        </div>
      </div>
      <div className={`${styles.propertyRow} ${styles.tagsSection}`}>
        <h4 className={styles.propertyName}>Tags</h4>
        <ul className={`${styles.tags} ${styles.propertyValue}`}>
          {tags.map((tag) => (
            <li className={styles.tag} key={`Course<${courseId}>${tag}`}>
              {tag}
            </li>
          ))}
        </ul>
        <div className={styles.propertyControls}>
          <Button
            Type="Primary"
            Size="Small"
            Label="Update Tags"
            onClick={() => setUpdateTagsModalShown(true)}
          />
        </div>
      </div>
      <div className={styles.propertyRow}>
        <h4 className={styles.propertyName}>Published</h4>
        <p className={styles.propertyValue}>
          {publishedAt ? publishedAt.toString() : 'Not published yet'}
        </p>
        <div className={styles.propertyControls}>
          <Button
            Type={isPublished ? 'Cancel' : 'Primary'}
            Size="Small"
            Label={isPublished ? 'Unpublish' : 'Publish'}
            onClick={() => setPublishModalShown(true)}
          />
        </div>
      </div>
      <Modal
        isShown={renameModalShown}
        title={`Rename course`}
        closeFunction={() => {
          setErrorMessage('');
          setRenameModalShown(false);
          setNewTitle(title);
        }}
      >
        <div className={styles.modifyCourseModal}>
          <ErrorMessage message={errorMessage} />
          <FormTextInput
            Name="Course title"
            placeholder="Course title"
            type="text"
            value={newTitle}
            onChange={handleTitleChange}
          />
          <Button
            Type="Primary"
            Size="Small"
            Label="Rename course!"
            onClick={onSubmitRenameCourse}
          />
        </div>
      </Modal>
      <Modal
        isShown={updateDescriptionModalShown}
        title={`Update course description`}
        closeFunction={() => {
          setUpdateDescriptionModalShown(false);
          setNewDescription(description);
        }}
      >
        <div className={styles.modifyCourseModal}>
          <div className={styles.field}>
            <span className={styles.label}>Description</span>
            <MarkdownEditor
              className={styles.markdownEditor}
              value={description}
              onChange={(e) => setDescription(e || '')}
              enableScroll
            />
          </div>
          <Button
            Type="Primary"
            Size="Small"
            Label="Update course description!"
            onClick={onSubmitUpdateDescription}
          />
        </div>
      </Modal>
      <Modal
        isShown={updateTagsModalShown}
        title={`Update course tags`}
        closeFunction={() => {
          setUpdateTagsModalShown(false);
          setErrorMessage('');
          setNewTags(tags);
        }}
      >
        <div className={styles.modifyCourseModal}>
          <ErrorMessage message={errorMessage} />
          <FormSelectMultipleInput
            className={styles.tagsSelect}
            Values={CourseTagsRecord}
            SelectedValues={newTags}
            Name="Tags"
            OnSelect={handleTagsChange}
          />
          <Button
            Type="Primary"
            Size="Small"
            Label="Update course tags!"
            onClick={onSubmitUpdateTags}
          />
        </div>
      </Modal>
      <Modal
        isShown={publishModalShown}
        title={isPublished ? 'Unpublish course' : 'Publish course'}
        closeFunction={() => {
          setPublishModalShown(false);
        }}
      >
        <div className={styles.modifyCourseModal}>
          <Button
            Type={isPublished ? 'Cancel' : 'Primary'}
            Size="Small"
            Label={isPublished ? 'Unpublish' : 'Publish'}
            onClick={isPublished ? onSubmitUnpublish : onSubmitPublish}
          />
        </div>
      </Modal>
    </div>
  );
}
