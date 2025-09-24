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
import LearningResourceForm from "./components/LearningResourceForm";
import { ContentTypeProvider } from "../../../components/ContentTypeProvider";
import {
  NynorskTranslateProvider,
  TranslateType,
  useTranslateToNN,
} from "../../../components/NynorskTranslateProvider";
import { PageSpinner } from "../../../components/PageSpinner";
import { isNewArticleLanguage } from "../../../components/SlateEditor/IsNewArticleLanguageProvider";
import { LocaleType } from "../../../interfaces";
import { useNodes } from "../../../modules/nodes/nodeQueries";
import { getContentTypeFromResourceTypes } from "../../../util/resourceHelpers";
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
  {
    field: "disclaimer.disclaimer",
    type: "html",
  },
];

export const Component = () => <PrivateRoute component={<EditLearningResourcePage />} />;

export const EditLearningResourcePage = () => {
  return (
    <PageContent variant="wide">
      <NynorskTranslateProvider>
        <EditLearningResource />
      </NynorskTranslateProvider>
    </PageContent>
  );
};

const EditLearningResource = () => {
  const { t } = useTranslation();
  const params = useParams<"selectedLanguage" | "id">();
  const selectedLanguage = params.selectedLanguage as LocaleType;
  const articleId = Number(params.id!) || undefined;
  const { taxonomyVersion } = useTaxonomyVersion();
  const taxonomyQuery = useNodes(
    {
      contentURI: `urn:article:${params.id}`,
      taxonomyVersion,
      language: selectedLanguage,
      includeContexts: true,
    },
    {
      enabled: !!params.selectedLanguage && !!params.id,
    },
  );
  const { loading, article, setArticle, articleChanged, updateArticle, articleRevisionHistory } = useFetchArticleData(
    articleId,
    selectedLanguage,
  );

  const { translate, shouldTranslate, translating, translatedFields } = useTranslateToNN();

  useEffect(() => {
    (async () => {
      if (article && !loading && shouldTranslate && !translating) {
        await translate(article, translateFields, setArticle);
      }
    })();
  }, [article, loading, setArticle, shouldTranslate, translate, translating]);

  if (loading || translating || taxonomyQuery.isLoading) {
    return <PageSpinner />;
  }

  if (!article || !articleId) {
    return <NotFound />;
  }

  if (article.articleType !== "standard") {
    const replaceUrl = toEditArticle(article.id, article.articleType, selectedLanguage);
    return <Navigate replace to={replaceUrl} />;
  }
  const newLanguage = isNewArticleLanguage(selectedLanguage, article);

  return (
    <ContentTypeProvider value={getContentTypeFromResourceTypes(taxonomyQuery.data?.[0]?.resourceTypes ?? [])}>
      <title>{`${article.title?.title} ${t("htmlTitles.titleTemplate")}`}</title>
      <LearningResourceForm
        articleLanguage={selectedLanguage}
        articleTaxonomy={taxonomyQuery.data}
        article={article}
        articleRevisionHistory={articleRevisionHistory}
        articleStatus={article.status}
        articleChanged={articleChanged || newLanguage}
        updateArticle={updateArticle}
        supportedLanguages={article.supportedLanguages}
        translatedFieldsToNN={translatedFields}
      />
    </ContentTypeProvider>
  );
};
