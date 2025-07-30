/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, useParams } from "react-router-dom";
import { PageContent } from "@ndla/primitives";
import FrontpageArticleForm from "./components/FrontpageArticleForm";
import {
  NynorskTranslateProvider,
  TranslateType,
  useTranslateToNN,
} from "../../../components/NynorskTranslateProvider";
import { PageSpinner } from "../../../components/PageSpinner";
import { isNewArticleLanguage } from "../../../components/SlateEditor/IsNewArticleLanguageProvider";
import { WideArticleEditorProvider } from "../../../components/WideArticleEditorProvider";
import { LocaleType } from "../../../interfaces";
import { toEditArticle } from "../../../util/routeHelpers";
import { useFetchArticleData } from "../../FormikForm/formikDraftHooks";
import NotFound from "../../NotFoundPage/NotFoundPage";

const translateFields: TranslateType[] = [
  {
    field: "title.title",
    type: "text",
  },
  {
    field: "title.htmlTitle",
    type: "html",
  },
  {
    field: "metaDescription.metaDescription",
    type: "text",
  },
  {
    field: "introduction.introduction",
    type: "text",
  },
  {
    field: "introduction.htmlIntroduction",
    type: "html",
  },
  {
    field: "content.content",
    type: "html",
  },
  {
    field: "tags.tags",
    type: "text",
  },
];

export const EditFrontpageArticlePage = () => {
  return (
    <PageContent variant="wide">
      <NynorskTranslateProvider>
        <EditFrontpageArticle />
      </NynorskTranslateProvider>
    </PageContent>
  );
};

const EditFrontpageArticle = () => {
  const { t } = useTranslation();
  const params = useParams<"selectedLanguage" | "id">();
  const selectedLanguage = params.selectedLanguage as LocaleType;
  const articleId = Number(params.id!) || undefined;
  const { loading, article, setArticle, articleChanged, updateArticle, articleRevisionHistory } = useFetchArticleData(
    articleId,
    selectedLanguage,
  );
  const { translate, shouldTranslate, translating, translatedFields } = useTranslateToNN();

  useEffect(() => {
    (async () => {
      if (article && !loading && shouldTranslate) {
        await translate(article, translateFields, setArticle);
      }
    })();
  }, [article, loading, setArticle, shouldTranslate, translate]);

  if (loading || translating) {
    return <PageSpinner />;
  }

  if (!article) {
    return <NotFound />;
  }

  if (article.articleType !== "frontpage-article") {
    const replaceUrl = toEditArticle(article.id, article.articleType, selectedLanguage);
    return <Navigate replace to={replaceUrl} />;
  }
  const newLanguage = isNewArticleLanguage(selectedLanguage, article);

  return (
    <WideArticleEditorProvider initialValue={false}>
      <title>{`${article.title?.title} ${t("htmlTitles.titleTemplate")}`}</title>
      <FrontpageArticleForm
        articleLanguage={selectedLanguage}
        article={article}
        articleRevisionHistory={articleRevisionHistory}
        articleStatus={article.status}
        articleChanged={articleChanged || newLanguage}
        updateArticle={updateArticle}
        supportedLanguages={article.supportedLanguages}
        translatedFieldsToNN={translatedFields}
      />
    </WideArticleEditorProvider>
  );
};

export default EditFrontpageArticle;
