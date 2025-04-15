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
import FrontpageArticleForm from "./components/FrontpageArticleForm";
import { TranslateType, useTranslateToNN } from "../../../components/NynorskTranslateProvider";
import { PageSpinner } from "../../../components/PageSpinner";
import { isNewArticleLanguage } from "../../../components/SlateEditor/IsNewArticleLanguageProvider";
import { useWideArticle, articleIsWide } from "../../../components/WideArticleEditorProvider";
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
interface Props {
  isNewlyCreated?: boolean;
}

const EditFrontpageArticle = ({ isNewlyCreated }: Props) => {
  const { t } = useTranslation();
  const params = useParams<"selectedLanguage" | "id">();
  const selectedLanguage = params.selectedLanguage as LocaleType;
  const articleId = Number(params.id!) || undefined;
  const { loading, article, setArticle, articleChanged, updateArticle, articleHistory } = useFetchArticleData(
    articleId,
    selectedLanguage,
  );
  const { translate, shouldTranslate, translating, translatedFields } = useTranslateToNN();
  const { setWideArticle } = useWideArticle();

  useEffect(() => {
    (async () => {
      if (article && !loading && shouldTranslate) {
        await translate(article, translateFields, setArticle);
      }
    })();
  }, [article, loading, setArticle, shouldTranslate, translate]);

  useEffect(() => {
    if (article && articleIsWide(article.id)) {
      setWideArticle(true);
    }
  }, [article, setWideArticle]);

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
    <>
      <title>{`${article.title?.title} ${t("htmlTitles.titleTemplate")}`}</title>
      <FrontpageArticleForm
        articleLanguage={selectedLanguage}
        article={article}
        articleHistory={articleHistory}
        articleStatus={article.status}
        articleChanged={articleChanged || newLanguage}
        isNewlyCreated={!!isNewlyCreated}
        updateArticle={updateArticle}
        supportedLanguages={article.supportedLanguages}
        translatedFieldsToNN={translatedFields}
      />
    </>
  );
};

export default EditFrontpageArticle;
