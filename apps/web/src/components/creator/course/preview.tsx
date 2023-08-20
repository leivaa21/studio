import { useErrorBoundary } from 'react-error-boundary';
import { ChangeEvent, Fragment, useCallback, useEffect, useState } from 'react';

import Button from '@studio/ui/components/interactivity/cta/button';
import { Modal } from '@studio/ui/components/modal';
import {
  FormSelectMultipleInput,
  FormTextInput,
} from '@studio/ui/components/interactivity/form';
import {
  CourseInfoResponse,
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
import { MarkdownRenderer } from '../../markdown/renderer';
import { MarkdownEditor } from '../../markdown/editor';
import { formatDate } from '../../../utils/formatDate';
import { getCourseById } from '../../../contexts/courses/application/GetCourseById';

export interface CreatorCoursePreviewParams {
  courseId: string;
}

export function CreatorCoursePreview({ courseId }: CreatorCoursePreviewParams) {
  const [course, setCourse] = useState<CourseInfoResponse>();

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
  const { showBoundary } = useErrorBoundary();

  const fetchData = useCallback(async () => {
    if (!courseId) return;

    try {
      const course = await getCourseById(courseId);
      setCourse(course);

      setNewTitle(course.title);
      setNewTags(course.tags);
      setNewDescription(course.description);
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
    if (newTitle === course.title || !newTitle) {
      setRenameModalShown(false);
      return;
    }

    await renameCourse(
      { title: newTitle },
      courseId,
      getAuthTokenCookie() || ''
    );
    await fetchData();
    setRenameModalShown(false);
  };

  const onSubmitUpdateDescription = async () => {
    if (newDescription === course.description || !newDescription) {
      setUpdateDescriptionModalShown(false);
      return;
    }

    await updateCourseDescription(
      { description: newDescription },
      courseId,
      getAuthTokenCookie() || ''
    );
    await fetchData();
    setUpdateDescriptionModalShown(false);
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
    await fetchData();
    setUpdateTagsModalShown(false);
  };

  const onSubmitPublish = async () => {
    await publishCourse(courseId, getAuthTokenCookie() || '');
    await fetchData();
    setPublishModalShown(false);
  };

  const onSubmitUnpublish = async () => {
    await unpublishCourse(courseId, getAuthTokenCookie() || '');
    await fetchData();
    setPublishModalShown(false);
  };

  return (
    <div className={styles.coursePreview}>
      <div className={styles.propertyRow}>
        <h4 className={styles.propertyName}>Title</h4>
        <span className={styles.propertyValue}>{course.title}</span>
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
          {course.tags.map((tag) => (
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
          {course.publishedAt
            ? formatDate(new Date(course.publishedAt))
            : 'Not published yet'}
        </p>
        <div className={styles.propertyControls}>
          <Button
            Type={course.isPublished ? 'Cancel' : 'Primary'}
            Size="Small"
            Label={course.isPublished ? 'Unpublish' : 'Publish'}
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
          setNewTitle(course.title);
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
          setNewDescription(course.description);
        }}
      >
        <div className={styles.modifyCourseModal}>
          <div className={styles.field}>
            <span className={styles.label}>Description</span>
            <MarkdownEditor
              className={styles.markdownEditor}
              value={course.description}
              onChange={(e) => setNewDescription(e || '')}
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
          setNewTags(course.tags);
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
        title={course.isPublished ? 'Unpublish course' : 'Publish course'}
        closeFunction={() => {
          setPublishModalShown(false);
        }}
      >
        <div className={styles.modifyCourseModal}>
          <Button
            Type={course.isPublished ? 'Cancel' : 'Primary'}
            Size="Small"
            Label={course.isPublished ? 'Unpublish' : 'Publish'}
            onClick={course.isPublished ? onSubmitUnpublish : onSubmitPublish}
          />
        </div>
      </Modal>
    </div>
  );
}
