/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, useParams } from "react-router-dom";
import { HelmetWithTracker } from "@ndla/tracker";
import TopicArticleForm from "./components/TopicArticleForm";
import { TranslateType, useTranslateToNN } from "../../../components/NynorskTranslateProvider";
import { isNewArticleLanguage } from "../../../components/SlateEditor/IsNewArticleLanguageProvider";
import Spinner from "../../../components/Spinner";
import { LocaleType } from "../../../interfaces";
import { useNodes } from "../../../modules/nodes/nodeQueries";
import { toEditArticle } from "../../../util/routeHelpers";
import { useFetchArticleData } from "../../FormikForm/formikDraftHooks";
import NotFound from "../../NotFoundPage/NotFoundPage";
import { useTaxonomyVersion } from "../../StructureVersion/TaxonomyVersionProvider";

interface Props {
  isNewlyCreated?: boolean;
}

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

const EditTopicArticle = ({ isNewlyCreated }: Props) => {
  const params = useParams<"id" | "selectedLanguage">();
  const articleId = Number(params.id!) || undefined;
  const selectedLanguage = params.selectedLanguage as LocaleType;
  const { t } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();
  const { loading, article, setArticle, articleChanged, updateArticle, articleHistory } = useFetchArticleData(
    articleId,
    selectedLanguage,
  );

  const { shouldTranslate, translate, translating } = useTranslateToNN();

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

  useEffect(() => {
    (async () => {
      if (article && !loading && shouldTranslate) {
        await translate(article, translateFields, setArticle);
      }
    })();
  }, [article, loading, setArticle, shouldTranslate, translate]);

  if (loading || translating || shouldTranslate) {
    return <Spinner withWrapper />;
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
      <HelmetWithTracker title={`${article.title?.title} ${t("htmlTitles.titleTemplate")}`} />
      <TopicArticleForm
        articleTaxonomy={taxonomyQuery.data}
        articleStatus={article.status}
        articleLanguage={selectedLanguage}
        articleChanged={articleChanged || newLanguage}
        article={article}
        articleHistory={articleHistory}
        isNewlyCreated={!!isNewlyCreated}
        updateArticle={updateArticle}
        supportedLanguages={article.supportedLanguages}
      />
    </>
  );
};

export default EditTopicArticle;
