/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState, useEffect, useRef } from 'react';

import { validateDraft } from '../../modules/draft/draftApi';
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
  refetchArticle,
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
      await handleValidation({
        statusChange,
        initialStatus,
        newStatus,
        values,
        newArticle,
        revision,
      });
      let updatedArticle;

      if (statusChange) {
        // if editor is not dirty, OR we are unpublishing, we don't save before changing status
        const skipSaving =
          newStatus === articleStatuses.UNPUBLISHED ||
          !isFormikFormDirty({
            values,
            initialValues,
            dirty: true,
          });
        updatedArticle = await updateArticleAndStatus({
          updatedArticle: {
            ...newArticle,
            revision,
          },
          newStatus,
          dirty: !skipSaving,
        });
      } else {
        updatedArticle = await updateArticle({
          ...newArticle,
          revision,
        });
      }

      if (updatedArticle.revision === article.revision) {
        // we need to refetch article since it is not properly updated
        await refetchArticle();
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

      setSavedToServer(true);
      actions.resetForm();
      actions.setFieldValue('notes', [], false);
    } catch (err) {
      if (err && err.json && err.json.messages) {
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
