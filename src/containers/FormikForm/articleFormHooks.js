/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState, useEffect, useRef, useMemo } from 'react';

import { validateDraft } from '../../modules/draft/draftApi';
import { formatErrorMessage } from '../../util/apiHelpers';
import { queryTopics, updateTopic } from '../../modules/taxonomy';
import * as articleStatuses from '../../util/constants/ArticleStatus';

export function useArticleFormHooks({
  getInitialValues,
  article,
  t,
  createMessage,
  articleStatus,
  onUpdate,
  applicationError,
  updateArticleAndStatus,
  licenses,
  getArticleFromSlate,
}) {
  const { id, revision, language } = article;
  const formikRef = useRef(null);
  const [savedToServer, setSavedToServer] = useState(false);
  const initialValues = useMemo(() => getInitialValues(article), [
    id,
    language,
  ]);

  useEffect(() => {
    setSavedToServer(false);
    if (formikRef.current) {
      // Instead of using enableReinitialize in Formik, we want to manually control when the
      // form is reset. We do it here when language, id or status is changed
      formikRef.current.resetForm();
    }
  }, [language, id]);

  const handleSubmit = async (values, actions, newStatus) => {
    actions.setSubmitting(true);
    const status = articleStatus ? articleStatus.current : undefined;

    const newArticle = getArticleFromSlate({ values, initialValues, licenses });
    if (
      (!newStatus && status === articleStatuses.QUEUED_FOR_PUBLISHING) ||
      (!newStatus && status === articleStatuses.QUALITY_ASSURED) ||
      newStatus === articleStatuses.QUEUED_FOR_PUBLISHING ||
      newStatus === articleStatuses.QUALITY_ASSURED ||
      newStatus === articleStatuses.PUBLISHED
    ) {
      try {
        await validateDraft(values.id, {
          ...newArticle,
          revision,
        });
      } catch (error) {
        actions.setSubmitting(false);
        if (error && error.json && error.json.messages) {
          createMessage(formatErrorMessage(error));
        }
        return;
      }
    }

    try {
      if (newStatus) {
        await updateArticleAndStatus(
          {
            ...newArticle,
            revision,
          },
          newStatus,
        );
      } else {
        await onUpdate({
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
      setSavedToServer(true);
      actions.resetForm();
      actions.setFieldValue('notes', [], false);
    } catch (err) {
      applicationError(err);
      actions.setSubmitting(false);
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
