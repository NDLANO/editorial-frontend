/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useRef, useState } from 'react';

import { FormikHelpers } from 'formik';
import { Value } from 'slate';

import { WithTranslation } from 'react-i18next';
import {
  deleteFile,
  fetchStatusStateMachine,
  validateDraft,
  fetchSearchTags,
} from '../../modules/draft/draftApi';
import { formatErrorMessage } from '../../util/apiHelpers';
import { queryTopics, updateTopic } from '../../modules/taxonomy';
import * as articleStatuses from '../../util/constants/ArticleStatus';
import { isFormikFormDirty } from '../../util/formHelper';
import { NewReduxMessage, ReduxMessageError } from '../Messages/messagesSelectors';
import {
  DraftApiType,
  DraftStatus,
  DraftStatusTypes,
  UpdatedDraftApiType,
} from '../../modules/draft/draftApiInterfaces';
import {
  Author,
  AvailabilityType,
  ConvertedDraftType,
  License,
  RelatedContent,
  VisualElement,
} from '../../interfaces';
import { ApiConceptType } from '../../modules/concept/conceptApiInterfaces';

const getFilePathsFromHtml = (htmlString: string): string[] => {
  const parsed = new DOMParser().parseFromString(htmlString, 'text/html');
  const fileNodesArr = Array.from(parsed.querySelectorAll('embed[data-resource=file]'));
  const paths = fileNodesArr.map(e => e.getAttribute('data-path'));
  return paths.filter((x): x is string => x !== null);
};

const deleteRemovedFiles = async (oldArticleContent: string, newArticleContent: string) => {
  const oldFilePaths = getFilePathsFromHtml(oldArticleContent);
  const newFilePaths = getFilePathsFromHtml(newArticleContent);

  const pathsToDelete = oldFilePaths.filter(op => !newFilePaths.some(np => op === np));
  return Promise.all(pathsToDelete.map(path => deleteFile(path)));
};

export interface ArticleFormikType {
  id?: number;
  slatetitle?: Value;
  content?: Value;
  introduction?: Value;
  metaDescription?: Value;
  agreementId?: number;
  articleType: string;
  status?: DraftStatus;
  creators: Author[];
  processors: Author[];
  rightsholders: Author[];
  language?: string;
  license?: string;
  metaImageAlt?: string;
  metaImageId?: string;
  notes?: string[];
  origin?: string;
  published?: string;
  revision?: number;
  supportedLanguages: string[];
  tags: string[];
  updatePublished: boolean;
  updated?: string;
  visualElementObject?: VisualElement;
  grepCodes?: string[];
  conceptIds: ApiConceptType[];
  availability?: AvailabilityType;
  relatedContent: (DraftApiType | RelatedContent)[];
}

interface HooksInputObject {
  getInitialValues: (article: Partial<ConvertedDraftType>) => ArticleFormikType;
  article: Partial<ConvertedDraftType>;
  t: WithTranslation['t'];
  createMessage: (message: NewReduxMessage) => void;
  applicationError: (error: ReduxMessageError) => void;
  articleStatus?: DraftStatus;
  updateArticle: (art: UpdatedDraftApiType) => Promise<ConvertedDraftType>;
  updateArticleAndStatus?: (input: {
    updatedArticle: UpdatedDraftApiType;
    newStatus: DraftStatusTypes;
    dirty: boolean;
  }) => Promise<ConvertedDraftType>;
  licenses: License[];
  getArticleFromSlate: (input: {
    values: ArticleFormikType;
    initialValues: ArticleFormikType;
    licenses: License[];
    preview: boolean;
  }) => UpdatedDraftApiType;
  isNewlyCreated: boolean;
}

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
  isNewlyCreated = false,
}: HooksInputObject) {
  const { id, revision, language } = article;
  const formikRef: any = useRef<any>(null); // TODO: Formik bruker any for denne ref'en men kanskje vi skulle gjort noe kulere?
  const [savedToServer, setSavedToServer] = useState(false);
  const [saveAsNewVersion, setSaveAsNewVersion] = useState(isNewlyCreated);
  const initialValues = getInitialValues(article);

  useEffect(() => {
    setSavedToServer(false);
    if (formikRef.current) {
      // Instead of using enableReinitialize in Formik, we want to manually control when the
      // form is reset. We do it here when language, id or status is changed
      formikRef.current?.resetForm();
    }
  }, [language, id]);

  const handleSubmit = async (
    values: ArticleFormikType,
    formikHelpers: FormikHelpers<ArticleFormikType>,
  ): Promise<void> => {
    if (
      values.revision === undefined ||
      values.slatetitle === undefined ||
      revision === undefined
    ) {
      formikHelpers.setSubmitting(false);
      return;
    }

    formikHelpers.setSubmitting(true);
    const initialStatus = articleStatus ? articleStatus.current : undefined;
    const newStatus = values.status?.current;
    const statusChange = initialStatus !== newStatus;
    const slateArticle = getArticleFromSlate({
      values,
      initialValues,
      licenses,
      preview: false,
    });

    const newArticle = saveAsNewVersion
      ? { ...slateArticle, createNewVersion: true }
      : slateArticle;

    let savedArticle = {};
    try {
      if (statusChange && newStatus && updateArticleAndStatus) {
        // if editor is not dirty, OR we are unpublishing, we don't save before changing status
        const skipSaving =
          newStatus === articleStatuses.UNPUBLISHED ||
          !isFormikFormDirty({
            values,
            initialValues,
            dirty: true,
          });
        savedArticle = await updateArticleAndStatus({
          updatedArticle: {
            ...newArticle,
            revision,
          },
          newStatus,
          dirty: !skipSaving,
        });
      } else {
        savedArticle = await updateArticle({
          ...newArticle,
          revision,
        });
      }

      if (article.articleType === 'topic-article' && article.title !== newArticle.title) {
        // update topic name in taxonomy
        const topics = await queryTopics(article.id!.toString(), article.language!); // TODO: No assertions
        topics.forEach(topic =>
          updateTopic({
            ...topic,
            name: newArticle.title,
          }),
        );
      }

      await deleteRemovedFiles(article.content ?? '', newArticle.content ?? '');

      setSavedToServer(true);
      formikHelpers.resetForm({ values: getInitialValues(savedArticle) });

      formikHelpers.setFieldValue('notes', [], false);
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
      if (statusChange) {
        // if validation failed we need to set status back so it won't be saved as new status on next save
        formikHelpers.setFieldValue('status', { current: initialStatus });
      }
      setSavedToServer(false);
    }
    formikHelpers.setSubmitting(false);
    await formikHelpers.validateForm();
  };

  return {
    savedToServer,
    formikRef,
    initialValues,
    setSaveAsNewVersion,
    handleSubmit,
    fetchStatusStateMachine,
    validateDraft,
    fetchSearchTags,
  };
}
