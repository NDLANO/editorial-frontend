/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, useParams } from "react-router";
import { PageContent } from "@ndla/primitives";
import TopicArticleForm from "./components/TopicArticleForm";
import {
  NynorskTranslateProvider,
  TranslateType,
  useTranslateToNN,
} from "../../../components/NynorskTranslateProvider";
import { PageSpinner } from "../../../components/PageSpinner";
import { isNewArticleLanguage } from "../../../components/SlateEditor/IsNewArticleLanguageProvider";
import { LocaleType } from "../../../interfaces";
import { useNodes } from "../../../modules/nodes/nodeQueries";
import { toEditArticle } from "../../../util/routeHelpers";
import { useFetchArticleData } from "../../FormikForm/formikDraftHooks";
import NotFound from "../../NotFoundPage/NotFoundPage";
import PrivateRoute from "../../PrivateRoute/PrivateRoute";
import { useTaxonomyVersion } from "../../StructureVersion/TaxonomyVersionProvider";

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

export const Component = () => <PrivateRoute component={<EditTopicArticlePage />} />;

export const EditTopicArticlePage = () => {
  return (
    <PageContent variant="wide">
      <NynorskTranslateProvider>
        <EditTopicArticle />
      </NynorskTranslateProvider>
    </PageContent>
  );
};

const EditTopicArticle = () => {
  const params = useParams<"id" | "selectedLanguage">();
  const articleId = Number(params.id!) || undefined;
  const selectedLanguage = params.selectedLanguage as LocaleType;
  const { t } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();
  const { loading, article, setArticle, articleChanged, updateArticle, articleRevisionHistory } = useFetchArticleData(
    articleId,
    selectedLanguage,
  );

  const { shouldTranslate, translate, translating, translatedFields } = useTranslateToNN();

  const taxonomyQuery = useNodes(
    {
      contentURI: `urn:article:${params.id}`,
      taxonomyVersion,
      filterProgrammes: true,
      language: selectedLanguage,
      includeContexts: true,
    },
    {
      enabled: !!params.selectedLanguage && !!params.id,
    },
  );

  useEffect(() => {
    (async () => {
      if (article && !loading && shouldTranslate && !translating) {
        await translate(article, translateFields, setArticle);
      }
    })();
  }, [article, loading, setArticle, shouldTranslate, translate, translating]);

  if (loading || translating || shouldTranslate) {
    return <PageSpinner />;
  }

  if (!article || !articleId) {
    return <NotFound />;
  }

  if (article.articleType !== "topic-article") {
    const redirectUrl = toEditArticle(article.id, article.articleType, article.title?.language);
    return <Navigate replace to={redirectUrl} />;
  }
  const newLanguage = isNewArticleLanguage(selectedLanguage, article);
  return (
    <>
      <title>{`${article.title?.title} ${t("htmlTitles.titleTemplate")}`}</title>
      <TopicArticleForm
        articleTaxonomy={taxonomyQuery.data}
        articleLanguage={selectedLanguage}
        articleChanged={articleChanged || newLanguage}
        article={article}
        articleRevisionHistory={articleRevisionHistory}
        updateArticle={updateArticle}
        supportedLanguages={article.supportedLanguages}
        translatedFieldsToNN={translatedFields}
      />
    </>
  );
};
