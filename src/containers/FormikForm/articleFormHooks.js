/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState, useEffect, useRef, useMemo } from 'react';
import { transformArticleFromApiVersion } from '../../util/articleUtil';
import { getArticle } from '../../modules/article/articleApi';
import { validateDraft } from '../../modules/draft/draftApi';
import { formatErrorMessage } from '../../util/apiHelpers';
import { queryTopics, updateTopic } from '../../modules/taxonomy';

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
  articleStatuses,
}) {
  const { id, status, revision, language } = article;
  const formikRef = useRef(null);
  const [savedToServer, setSavedToServer] = useState(false);
  const [showResetModal, setResetModal] = useState(false);
  const initialValues = useMemo(() => getInitialValues(article), [
    id,
    status,
    revision,
    language,
  ]);

  useEffect(() => {
    setSavedToServer(false);
    if (formikRef.current) {
      formikRef.current.resetForm();
    }
  }, [language, id]);

  const onResetFormToProd = async ({ setValues }) => {
    try {
      const articleFromProd = await getArticle(id, language);
      const convertedArticle = transformArticleFromApiVersion({
        ...articleFromProd,
        language,
      });
      const initialValues = getInitialValues(convertedArticle);
      setValues(initialValues);
      setResetModal(false);
    } catch (err) {
      if (err.status === 404) {
        setResetModal(false);
        createMessage({
          message: t('errorMessage.noArticleInProd'),
          severity: 'danger',
        });
      }
    }
  };

  const handleSubmit = async (values, newStatus) => {
    const actions = formikRef.current;
    const status = articleStatus ? articleStatus.current : undefined;

    const newArticle = getArticleFromSlate({ values, initialValues, licenses });
    if (status === articleStatuses.QUEUED_FOR_PUBLISHING) {
      try {
        await validateDraft(values.id, {
          ...newArticle,
          revision,
        });
      } catch (error) {
        if (error && error.json && error.json.messages) {
          createMessage(formatErrorMessage(error));
        }
        return;
      }
    }

    try {
      if (newStatus) {
        updateArticleAndStatus(
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
      if (article.title !== newArticle.title) {
        // update topic name in taxonomy
        const topics = await queryTopics(article.id, article.language);
        topics.forEach(topic =>
          updateTopic({
            ...topic,
            name: newArticle.title,
          }),
        );
      }
      actions.resetForm();
      actions.setFieldValue('notes', [], false);
      setSavedToServer(true);
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
    onResetFormToProd,
    showResetModal,
    setResetModal,
    handleSubmit,
  };
}
