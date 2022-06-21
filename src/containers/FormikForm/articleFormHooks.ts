/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useRef, useState } from 'react';
import { TFunction } from 'i18next';
import { FormikHelpers } from 'formik';
import { Descendant } from 'slate';
import { IArticle, ILicense, IStatus, IUpdatedArticle, IAuthor } from '@ndla/types-draft-api';
import { deleteFile } from '../../modules/draft/draftApi';
import { formatErrorMessage } from '../../util/apiHelpers';
import * as articleStatuses from '../../util/constants/ArticleStatus';
import { isFormikFormDirty } from '../../util/formHelper';
import { DraftStatusType, RelatedContent } from '../../interfaces';
import { useMessages } from '../Messages/MessagesProvider';
import { useLicenses } from '../../modules/draft/draftQueries';
import { getWarnings, RulesType } from '../../components/formikValidationSchema';

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

export interface ArticleFormType {
  agreementId?: number;
  articleType: string;
  availability: string;
  conceptIds: number[];
  content: Descendant[];
  creators: IAuthor[];
  grepCodes: string[];
  id?: number;
  introduction: Descendant[];
  language: string;
  license: string;
  metaDescription: Descendant[];
  metaImageAlt: string;
  metaImageId: string;
  notes: string[];
  processors: IAuthor[];
  published?: string;
  relatedContent: RelatedContent[];
  revision?: number;
  rightsholders: IAuthor[];
  status?: IStatus;
  supportedLanguages: string[];
  tags: string[];
  title: Descendant[];
  updatePublished: boolean;
  updated?: string;
  revisionMeta: {
    note: string;
    revisionDate: string;
    status: string;
    new?: boolean;
  }[];
  // This field is only used for error checking in revisions
  revisionError?: string;
}

export interface LearningResourceFormType extends ArticleFormType {
  origin?: string;
}

export interface TopicArticleFormType extends ArticleFormType {
  visualElement: Descendant[];
}

type HooksInputObject<T extends ArticleFormType> = {
  getInitialValues: (article: IArticle | undefined, language: string) => T;
  article?: IArticle;
  t: TFunction;
  articleStatus?: IStatus;
  updateArticle: (art: IUpdatedArticle) => Promise<IArticle>;
  updateArticleAndStatus?: (input: {
    updatedArticle: IUpdatedArticle;
    newStatus: DraftStatusType;
    dirty: boolean;
  }) => Promise<IArticle>;
  licenses?: ILicense[];
  getArticleFromSlate: (
    values: T,
    initialValues: T,
    licenses: ILicense[],
    preview?: boolean,
  ) => IUpdatedArticle;
  articleLanguage: string;
  rules?: RulesType<T, IArticle>;
};

export function useArticleFormHooks<T extends ArticleFormType>({
  getInitialValues,
  article,
  t,
  articleStatus,
  updateArticle,
  updateArticleAndStatus,
  getArticleFromSlate,
  articleLanguage,
  rules,
}: HooksInputObject<T>) {
  const { id, revision } = article ?? {};
  const formikRef: any = useRef<any>(null); // TODO: Formik bruker any for denne ref'en men kanskje vi skulle gjort noe kulere?
  const { createMessage, applicationError } = useMessages();
  const { data: licenses } = useLicenses({ placeholderData: [] });
  const [savedToServer, setSavedToServer] = useState(false);
  const initialValues = getInitialValues(article, articleLanguage);

  useEffect(() => {
    setSavedToServer(false);
    if (formikRef.current) {
      // Instead of using enableReinitialize in Formik, we want to manually control when the
      // form is reset. We do it here when language, id or status is changed
      formikRef.current?.resetForm();
    }
  }, [articleLanguage, id]);

  const handleSubmit = async (
    values: T,
    formikHelpers: FormikHelpers<T>,
    saveAsNew = false,
  ): Promise<void> => {
    formikHelpers.setSubmitting(true);
    const initialStatus = articleStatus?.current;
    const newStatus = values.status?.current;
    const statusChange = initialStatus !== newStatus;
    const slateArticle = getArticleFromSlate(values, initialValues, licenses!, false);

    const newArticle = saveAsNew ? { ...slateArticle, createNewVersion: true } : slateArticle;

    let savedArticle: IArticle;
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
            revision: revision || newArticle.revision,
          },
          newStatus,
          dirty: !skipSaving,
        });
      } else {
        savedArticle = await updateArticle({
          ...newArticle,
          revision: revision || newArticle.revision,
        });
      }

      await deleteRemovedFiles(article?.content?.content ?? '', newArticle.content ?? '');

      setSavedToServer(true);
      const newInitialValues = getInitialValues(savedArticle, articleLanguage);
      formikHelpers.resetForm({ values: newInitialValues });
      if (rules) {
        const newInitialWarnings = getWarnings(newInitialValues, rules, t, savedArticle);
        formikHelpers.setStatus({ warnings: newInitialWarnings });
      }
      formikHelpers.setFieldValue('notes', [], false);
    } catch (e) {
      const err = e as any;
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
    handleSubmit,
  };
}
