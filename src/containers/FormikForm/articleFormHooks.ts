/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  ArticleDTO,
  LicenseDTO,
  StatusDTO,
  UpdatedArticleDTO,
  AuthorDTO,
  CommentDTO,
  ArticleRevisionHistoryDTO,
  Priority,
} from "@ndla/types-backend/draft-api";
import { Node } from "@ndla/types-taxonomy";
import { UseQueryResult } from "@tanstack/react-query";
import { FormikHelpers } from "formik";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Descendant } from "slate";
import { getWarnings, RulesType } from "../../components/formikValidationSchema";
import { PUBLISHED } from "../../constants";
import { RelatedContent } from "../../interfaces";
import { useLicenses } from "../../modules/draft/draftQueries";
import { NdlaErrorPayload } from "../../util/resolveJsonOrRejectWithError";
import { useMessages } from "../Messages/MessagesProvider";
import { useSession } from "../Session/SessionProvider";
import { hasUnpublishedConcepts } from "./utils";

export type SlateCommentType = Omit<CommentDTO, "content"> & { content: Descendant[] };

export interface ArticleFormType {
  articleType: string;
  conceptIds: number[];
  content: Descendant[];
  creators: AuthorDTO[];
  grepCodes: string[];
  id?: number;
  introduction: Descendant[];
  language: string;
  license: string;
  metaDescription: Descendant[];
  metaImageAlt: string;
  metaImageId: string;
  notes: string[];
  processors: AuthorDTO[];
  published?: string;
  relatedContent: RelatedContent[];
  revision?: number;
  rightsholders: AuthorDTO[];
  status?: StatusDTO;
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
  comments?: (Omit<CommentDTO, "content"> & { content: Descendant[] })[];
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

export interface FrontpageArticleFormType extends ArticleFormType {
  visualElement: Descendant[];
}

type HooksInputObject<T extends ArticleFormType> = {
  getInitialValues: (article: ArticleDTO | undefined, language: string, ndlaId: string | undefined) => T;
  article?: ArticleDTO;
  updateArticle: (art: UpdatedArticleDTO) => Promise<ArticleDTO>;
  getArticleFromSlate: (values: T, initialValues: T, licenses: LicenseDTO[], preview?: boolean) => UpdatedArticleDTO;
  articleLanguage: string;
  rules?: RulesType<T, ArticleDTO>;
  node?: Node;
  articleRevisionHistory: UseQueryResult<ArticleRevisionHistoryDTO> | undefined;
};

export type HandleSubmitFunc<T> = (values: T, formikHelpers: FormikHelpers<T>) => Promise<void>;

export function useArticleFormHooks<T extends ArticleFormType>({
  getInitialValues,
  article,
  updateArticle,
  getArticleFromSlate,
  articleLanguage,
  rules,
  node,
  articleRevisionHistory,
}: HooksInputObject<T>) {
  const { id, revision } = article ?? {};
  const formikRef: any = useRef<any>(null);
  const { ndlaId } = useSession();
  const { t } = useTranslation();
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
      const initialStatus = article?.status?.current;
      const newStatus = values.status?.current;
      const statusChange = initialStatus !== newStatus;
      const slateArticle = getArticleFromSlate(values, initialValues, licenses!, false);

      const newArticle = values.saveAsNew ? { ...slateArticle, createNewVersion: true } : slateArticle;

      let savedArticle: ArticleDTO;
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
          const lowQualityEvaluation = [3, 4, 5].includes(node?.qualityEvaluation?.grade ?? 0);
          if (lowQualityEvaluation) {
            createMessage({ message: t("form.lowQualityEvaluation"), timeToLive: 0, severity: "warning" });
          }
          const compDate = new Date(Date.now());
          compDate.setDate(compDate.getDate() - 30);
          // do not display this when running with playwright
          if (values.published && new Date(values.published) < compDate && !navigator.webdriver) {
            createMessage({ message: t("form.lastPublishedDiscrepancy"), timeToLive: 0, severity: "warning" });
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
      article,
      articleRevisionHistory,
      articleLanguage,
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
