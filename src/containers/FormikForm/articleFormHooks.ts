/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FormikHelpers } from "formik";
import { TFunction } from "i18next";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Descendant } from "slate";
import { UseQueryResult } from "@tanstack/react-query";
import {
  IArticleDTO,
  ILicenseDTO,
  IStatusDTO,
  IUpdatedArticleDTO,
  IAuthorDTO,
  ICommentDTO,
  ArticleRevisionHistoryDTO,
  Priority,
} from "@ndla/types-backend/draft-api";
import { getWarnings, RulesType } from "../../components/formikValidationSchema";
import { PUBLISHED } from "../../constants";
import { RelatedContent } from "../../interfaces";
import { useLicenses } from "../../modules/draft/draftQueries";
import { NdlaErrorPayload } from "../../util/resolveJsonOrRejectWithError";
import { useMessages } from "../Messages/MessagesProvider";
import { hasUnpublishedConcepts } from "./utils";

export type SlateCommentType = Omit<ICommentDTO, "content"> & { content: Descendant[] };

export interface ArticleFormType {
  articleType: string;
  conceptIds: number[];
  content: Descendant[];
  creators: IAuthorDTO[];
  grepCodes: string[];
  id?: number;
  introduction: Descendant[];
  language: string;
  license: string;
  metaDescription: Descendant[];
  metaImageAlt: string;
  metaImageId: string;
  notes: string[];
  processors: IAuthorDTO[];
  published?: string;
  relatedContent: RelatedContent[];
  revision?: number;
  rightsholders: IAuthorDTO[];
  status?: IStatusDTO;
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
  responsibleId?: string;
  // This field is only used for error checking in revisions
  revisionError?: string;
  slug?: string;
  comments?: (Omit<ICommentDTO, "content"> & { content: Descendant[] })[];
  priority: Priority;
  processed: boolean;
  origin?: string;
  disclaimer?: Descendant[];
  saveAsNew: boolean;
}

export interface LearningResourceFormType extends ArticleFormType {}

export interface TopicArticleFormType extends ArticleFormType {
  visualElement: Descendant[];
}

export interface FrontpageArticleFormType extends ArticleFormType {}

type HooksInputObject<T extends ArticleFormType> = {
  getInitialValues: (article: IArticleDTO | undefined, language: string, ndlaId: string | undefined) => T;
  article?: IArticleDTO;
  t: TFunction;
  articleStatus?: IStatusDTO;
  updateArticle: (art: IUpdatedArticleDTO) => Promise<IArticleDTO>;
  licenses?: ILicenseDTO[];
  getArticleFromSlate: (values: T, initialValues: T, licenses: ILicenseDTO[], preview?: boolean) => IUpdatedArticleDTO;
  articleLanguage: string;
  rules?: RulesType<T, IArticleDTO>;
  ndlaId?: string;
  articleRevisionHistory: UseQueryResult<ArticleRevisionHistoryDTO> | undefined;
};

export type HandleSubmitFunc<T> = (values: T, formikHelpers: FormikHelpers<T>) => Promise<void>;

export function useArticleFormHooks<T extends ArticleFormType>({
  getInitialValues,
  article,
  t,
  articleStatus,
  updateArticle,
  getArticleFromSlate,
  articleLanguage,
  rules,
  ndlaId,
  articleRevisionHistory,
}: HooksInputObject<T>) {
  const { id, revision } = article ?? {};
  const formikRef: any = useRef<any>(null);
  const { createMessage, applicationError } = useMessages();
  const { data: licenses } = useLicenses({ placeholderData: [] });
  const [savedToServer, setSavedToServer] = useState(false);
  const initialValues = useMemo(
    () => getInitialValues(article, articleLanguage, ndlaId),
    [article, articleLanguage, getInitialValues, ndlaId],
  );

  useEffect(() => {
    setSavedToServer(false);
    if (formikRef.current) {
      // Instead of using enableReinitialize in Formik, we want to manually control when the
      // form is reset. We do it here when language, id or status is changed
      formikRef.current?.resetForm();
    }
  }, [articleLanguage, id]);

  const handleSubmit: HandleSubmitFunc<T> = useCallback(
    async (values, formikHelpers) => {
      if (formikRef?.current?.isSubmitting) return;
      formikHelpers.setSubmitting(true);
      const initialStatus = articleStatus?.current;
      const newStatus = values.status?.current;
      const statusChange = initialStatus !== newStatus;
      const slateArticle = getArticleFromSlate(values, initialValues, licenses!, false);

      const newArticle = values.saveAsNew ? { ...slateArticle, createNewVersion: true } : slateArticle;

      let savedArticle: IArticleDTO;
      try {
        savedArticle = await updateArticle({
          ...newArticle,
          revision: revision || newArticle.revision,
          ...(statusChange ? { status: newStatus } : {}),
        });

        articleRevisionHistory?.refetch();

        setSavedToServer(true);
        const newInitialValues = getInitialValues(savedArticle, articleLanguage, ndlaId);
        formikHelpers.resetForm({ values: newInitialValues });

        if (newStatus === PUBLISHED && newStatus !== initialStatus) {
          const unpublishedConcepts = await hasUnpublishedConcepts(savedArticle);
          if (unpublishedConcepts) {
            createMessage({ message: t("form.unpublishedConcepts"), timeToLive: 0, severity: "warning" });
          }
        }

        if (rules) {
          const newInitialWarnings = getWarnings(newInitialValues, rules, t, [], savedArticle);
          formikHelpers.setStatus({ warnings: newInitialWarnings });
        }
        formikHelpers.setFieldValue("notes", [], false);
      } catch (e) {
        const err = e as NdlaErrorPayload;
        if (err && err.status && err.status === 409) {
          createMessage({
            message: t("alertDialog.needToRefresh"),
            timeToLive: 0,
          });
        } else {
          applicationError(err);
        }
        if (statusChange) {
          if (newStatus === PUBLISHED) {
            // if validation failed we need to set status back so it won't be saved as new status on next save
            formikHelpers.setFieldValue("status", { current: initialStatus });
          }
        }
        setSavedToServer(false);
      }
      formikHelpers.setSubmitting(false);
      await formikHelpers.validateForm();
    },
    [
      applicationError,
      article?.content?.content,
      articleRevisionHistory,
      articleLanguage,
      articleStatus,
      createMessage,
      getArticleFromSlate,
      getInitialValues,
      initialValues,
      licenses,
      ndlaId,
      revision,
      rules,
      t,
      updateArticle,
    ],
  );

  return {
    savedToServer,
    formikRef,
    initialValues,
    handleSubmit,
  };
}
