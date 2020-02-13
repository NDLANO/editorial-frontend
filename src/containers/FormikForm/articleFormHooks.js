/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useRef, useState } from 'react';

import { validateDraft, deleteFile } from '../../modules/draft/draftApi';
import { formatErrorMessage } from '../../util/apiHelpers';
import { queryTopics, updateTopic } from '../../modules/taxonomy';
import * as articleStatuses from '../../util/constants/ArticleStatus';
import { isFormikFormDirty } from '../../util/formHelper';

const handleValidation = async ({
  statusChange,
  initialStatus,
  newStatus,
  values,
  newArticle,
  revision,
}) => {
  if (
    (!statusChange &&
      initialStatus === articleStatuses.QUEUED_FOR_PUBLISHING) ||
    (!statusChange && initialStatus === articleStatuses.QUALITY_ASSURED) ||
    (statusChange && newStatus === articleStatuses.QUEUED_FOR_PUBLISHING) ||
    (statusChange && newStatus === articleStatuses.QUALITY_ASSURED) ||
    (statusChange && newStatus === articleStatuses.PUBLISHED)
  ) {
    return validateDraft(values.id, {
      ...newArticle,
      revision,
    });
  }
};

const getFilePathsFromHtml = htmlString => {
  const parsed = new DOMParser().parseFromString(htmlString, 'text/html');
  const fileNodesArr = Array.from(
    parsed.querySelectorAll('embed[data-resource=file]'),
  );
  return fileNodesArr.map(e => e.getAttribute('data-path'));
};

const deleteRemovedFiles = async (oldArticleContent, newArticleContent) => {
  const oldFilePaths = getFilePathsFromHtml(oldArticleContent);
  const newFilePaths = getFilePathsFromHtml(newArticleContent);

  const pathsToDelete = oldFilePaths.filter(
    op => !newFilePaths.some(np => op === np),
  );
  return Promise.all(pathsToDelete.map(path => deleteFile(path)));
};

export function useArticleFormHooks({
  getInitialValues,
  article,
  t,
  createMessage,
  articleStatus,
  updateArticle,
  applicationError,
  updateArticleAndStatus,
  licenses,
  getArticleFromSlate,
}) {
  const { id, revision, language } = article;
  const formikRef = useRef(null);
  const [savedToServer, setSavedToServer] = useState(false);
  const initialValues = getInitialValues(article);

  useEffect(() => {
    setSavedToServer(false);
    if (formikRef.current) {
      // Instead of using enableReinitialize in Formik, we want to manually control when the
      // form is reset. We do it here when language, id or status is changed
      formikRef.current.resetForm();
    }
  }, [language, id]);

  const handleSubmit = async (values, actions) => {
    actions.setSubmitting(true);
    const initialStatus = articleStatus ? articleStatus.current : undefined;
    const newStatus = values.status.current;
    const statusChange = initialStatus !== newStatus;
    const newArticle = getArticleFromSlate({ values, initialValues, licenses });

    try {
      if (statusChange) {
        // if editor is not dirty, OR we are unpublishing, we don't save before changing status
        const skipSaving =
          newStatus === articleStatuses.UNPUBLISHED ||
          !isFormikFormDirty({
            values,
            initialValues,
            dirty: true,
          });
        await updateArticleAndStatus({
          updatedArticle: {
            ...newArticle,
            revision,
          },
          newStatus,
          dirty: !skipSaving,
        });
      } else {
        await updateArticle({
          ...newArticle,
          revision,
        });
      }

      if (
        article.articleType === 'topic-article' &&
        article.title !== newArticle.title
      ) {
        // update topic name in taxonomy
        const topics = await queryTopics(article.id, article.language);
        topics.forEach(topic =>
          updateTopic({
            ...topic,
            name: newArticle.title,
          }),
        );
      }

      await deleteRemovedFiles(article.content, newArticle.content);

      setSavedToServer(true);
      actions.resetForm();

      Object.keys(actions.values).map(fieldName => {
        return actions.setFieldTouched(fieldName, true, true);
      });

      actions.setFieldValue('notes', [], false);
    } catch (err) {
      if (err && err.status && err.status === 409) {
        createMessage({
          message: t('alertModal.needToRefresh'),
          timeToLive: 0,
        });
      } else if (err && err.json && err.json.messages) {
        createMessage(formatErrorMessage(err));
      } else {
        applicationError(err);
      }
      actions.setSubmitting(false);
      if (statusChange) {
        // if validation failed we need to set status back so it won't be saved as new status on next save
        actions.setFieldValue('status', { current: initialStatus });
      }
      setSavedToServer(false);
    }
  };

  return {
    savedToServer,
    formikRef,
    initialValues,
    handleSubmit,
  };
}
