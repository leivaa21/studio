import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import styles from './course.module.scss';

import { getCourseById } from '../../../contexts/courses/application/GetCourseById';
import Button from '@studio/ui/components/interactivity/cta/button';
import { Modal } from '@studio/ui/components/modal';
import { FormSelectMultipleInput } from '@studio/ui/components/interactivity/form';
import { CourseTagsRecord } from '@studio/commons';
import { renameCourse } from '../../../contexts/courses/application/RenameCourse';
import { updateCourseDescription } from '../../../contexts/courses/application/UpdateCourseDescription';
import { getAuthTokenCookie } from '../../../lib/cookieUtils';
import { updateCourseTags } from '../../../contexts/courses/application/UpdateCourseTags';

export interface CreatorCoursePreviewParams {
  courseId: string;
}

export function CreatorCoursePreview({ courseId }: CreatorCoursePreviewParams) {
  const router = useRouter();

  const [title, setTitle] = useState<string>();
  const [tags, setTags] = useState<string[]>([]);
  const [description, setDescription] = useState<string>();

  const [renameModalShown, setRenameModalShown] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>();

  const [updateDescriptionModalShown, setUpdateDescriptionModalShown] =
    useState<boolean>(false);
  const [newDescription, setNewDescription] = useState<string>();

  const [updateTagsModalShown, setUpdateTagsModalShown] =
    useState<boolean>(false);
  const [newTags, setNewTags] = useState<string[]>();

  useEffect(() => {
    if (!courseId) return;

    getCourseById(courseId).then((course) => {
      setTitle(course.title);
      setNewTitle(course.title);
      setTags(course.tags);
      setNewTags(course.tags);
      setDescription(course.description);
      setNewDescription(course.description);
      console.log(course);
    });
  }, [router, courseId]);

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
        <p className={styles.propertyValue}>{description}</p>
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

      <Modal
        isShown={renameModalShown}
        title={`Rename course`}
        closeFunction={() => {
          setRenameModalShown(false);
        }}
      >
        <div className={styles.modifyCourseModal}>
          <input
            value={newTitle}
            onChange={(e) => {
              setNewTitle(e.currentTarget.value);
            }}
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
        }}
      >
        <div className={styles.modifyCourseModal}>
          <textarea
            value={newDescription}
            onChange={(e) => {
              setNewDescription(e.currentTarget.value);
            }}
          />
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
        }}
      >
        <div className={styles.modifyCourseModal}>
          <FormSelectMultipleInput
            className={styles.tagsSelect}
            Values={CourseTagsRecord}
            SelectedValues={newTags}
            Name="Tags"
            OnSelect={(e) => {
              setNewTags(e);
            }}
          />
          <Button
            Type="Primary"
            Size="Small"
            Label="Update course tags!"
            onClick={onSubmitUpdateTags}
          />
        </div>
      </Modal>
    </div>
  );
}
