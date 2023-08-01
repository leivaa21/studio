import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import styles from './course.module.scss';

import { getCourseById } from '../../../contexts/courses/application/GetCourseById';
import Button from '@studio/ui/components/interactivity/cta/button';
import { Modal } from '@studio/ui/components/modal';
import {
  FormSelectMultipleInput,
  FormTextInput,
} from '@studio/ui/components/interactivity/form';
import { CourseTagsRecord } from '@studio/commons';
import { renameCourse } from '../../../contexts/courses/application/RenameCourse';
import { updateCourseDescription } from '../../../contexts/courses/application/UpdateCourseDescription';
import { getAuthTokenCookie } from '../../../lib/cookieUtils';
import { updateCourseTags } from '../../../contexts/courses/application/UpdateCourseTags';

import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import dynamic from 'next/dynamic';

import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { publishCourse } from '../../../contexts/courses/application/PublishCourse';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

export interface CreatorCoursePreviewParams {
  courseId: string;
}

export function CreatorCoursePreview({ courseId }: CreatorCoursePreviewParams) {
  const router = useRouter();

  const [title, setTitle] = useState<string>();
  const [tags, setTags] = useState<string[]>([]);
  const [description, setDescription] = useState<string>();
  const [isPublished, setIsPublished] = useState<boolean>();
  const [publishedAt, setPublishedAt] = useState<Date | null>();
  const [descriptionMdx, setDescriptionMdx] =
    useState<
      MDXRemoteSerializeResult<Record<string, unknown>, Record<string, unknown>>
    >();

  const [renameModalShown, setRenameModalShown] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>();

  const [updateDescriptionModalShown, setUpdateDescriptionModalShown] =
    useState<boolean>(false);
  const [newDescription, setNewDescription] = useState<string>();

  const [updateTagsModalShown, setUpdateTagsModalShown] =
    useState<boolean>(false);
  const [newTags, setNewTags] = useState<string[]>();

  const [publishModalShown, setPublishModalShown] = useState<boolean>(false);

  useEffect(() => {
    if (!courseId) return;

    getCourseById(courseId).then((course) => {
      setTitle(course.title);
      setNewTitle(course.title);
      setTags(course.tags);
      setNewTags(course.tags);
      setDescription(course.description);
      setNewDescription(course.description);
      setIsPublished(course.isPublished);
      setPublishedAt(course.publishedAt);
      serialize(course.description, { mdxOptions: { development: true } }).then(
        (mdxSource) => setDescriptionMdx(mdxSource)
      );
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

  const onSubmitPublish = async () => {
    await publishCourse(courseId, getAuthTokenCookie() || '');
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
        {descriptionMdx ? (
          <div
            className={styles.propertyValue}
            style={{ flexDirection: 'column' }}
          >
            <MDXRemote {...descriptionMdx} />
          </div>
        ) : (
          <p className={styles.propertyValue}>{description}</p>
        )}
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
          setRenameModalShown(false);
        }}
      >
        <div className={styles.modifyCourseModal}>
          <FormTextInput
            Name="Course title"
            placeholder="Course title"
            type="text"
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
          <div className={styles.field}>
            <span className={styles.label}>Description</span>
            <MDEditor
              className={styles.markdownEditor}
              value={newDescription}
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
            onClick={isPublished ? undefined : onSubmitPublish}
          />
        </div>
      </Modal>
    </div>
  );
}
