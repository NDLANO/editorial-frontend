/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { PageContent } from "@ndla/primitives";
import { UpdatedArticleDTO, ArticleDTO } from "@ndla/types-backend/draft-api";
import TopicArticleForm from "./components/TopicArticleForm";
import { convertUpdateToNewDraft } from "../../../util/articleUtil";
import { toEditArticle } from "../../../util/routeHelpers";
import { useFetchArticleData } from "../../FormikForm/formikDraftHooks";
import PrivateRoute from "../../PrivateRoute/PrivateRoute";

export const Component = () => <PrivateRoute component={<CreateTopicArticle />} />;

const CreateTopicArticle = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const locale = i18n.language;
  const { createArticle } = useFetchArticleData(undefined, locale);

  const createArticleAndPushRoute = async (createdArticle: UpdatedArticleDTO): Promise<ArticleDTO> => {
    const savedArticle = await createArticle(convertUpdateToNewDraft(createdArticle));
    navigate(toEditArticle(savedArticle.id, savedArticle.articleType, createdArticle.language), {
      state: { isNewlyCreated: true },
    });
    return savedArticle;
  };

  return (
    <PageContent variant="wide">
      <title>{t("htmlTitles.createTopicArticlePage")}</title>
      <TopicArticleForm
        articleLanguage={i18n.language}
        updateArticle={createArticleAndPushRoute}
        articleChanged={false}
        supportedLanguages={[i18n.language]}
        translatedFieldsToNN={[]}
      />
    </PageContent>
  );
};
