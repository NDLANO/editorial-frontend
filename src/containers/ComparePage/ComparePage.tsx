/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Formik, Form } from "formik";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { HelmetWithTracker } from "@ndla/tracker";
import { PreviewCompare } from "../../components/PreviewDraft/PreviewDraftLightboxV2";
import Spinner from "../../components/Spinner";
import {
  draftApiTypeToLearningResourceFormType,
  learningResourceFormTypeToDraftApiType,
} from "../../containers/ArticlePage/articleTransformers";
import { LearningResourceFormType, useArticleFormHooks } from "../../containers/FormikForm/articleFormHooks";
import { useDraft } from "../../modules/draft/draftQueries";

const ComparePage = () => {
  const params = useParams<"draftId" | "language">();
  const draftId = Number(params.draftId!);
  const language = params.language!;
  const { data: article, isLoading } = useDraft({ id: draftId, language: language });
  const { t } = useTranslation();
  const { initialValues, handleSubmit } = useArticleFormHooks<LearningResourceFormType>({
    getInitialValues: draftApiTypeToLearningResourceFormType,
    article,
    t,
    updateArticle: () => Promise.resolve(article!),
    getArticleFromSlate: learningResourceFormTypeToDraftApiType,
    articleLanguage: language,
  });

  if (!article || isLoading) return <Spinner />;

  return (
    <>
      <HelmetWithTracker title={t("htmlTitles.comparePage")} />
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {(_data) => (
          <Form>
            <PreviewCompare article={article} language={language} type="compare" />
          </Form>
        )}
      </Formik>
    </>
  );
};

export default ComparePage;
