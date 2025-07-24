/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { IUpdatedArticleDTO, IArticleDTO } from "@ndla/types-backend/draft-api";
import TopicArticleForm from "./components/TopicArticleForm";
import { convertUpdateToNewDraft } from "../../../util/articleUtil";
import { toEditArticle } from "../../../util/routeHelpers";
import { useFetchArticleData } from "../../FormikForm/formikDraftHooks";

const CreateTopicArticle = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const locale = i18n.language;
  const { createArticle } = useFetchArticleData(undefined, locale);

  const createArticleAndPushRoute = async (createdArticle: IUpdatedArticleDTO): Promise<IArticleDTO> => {
    const savedArticle = await createArticle(convertUpdateToNewDraft(createdArticle));
    navigate(toEditArticle(savedArticle.id, savedArticle.articleType, createdArticle.language), {
      state: { isNewlyCreated: true },
    });
    return savedArticle;
  };

  return (
    <>
      <title>{t("htmlTitles.createTopicArticlePage")}</title>
      <TopicArticleForm
        articleLanguage={i18n.language}
        updateArticle={createArticleAndPushRoute}
        articleChanged={false}
        supportedLanguages={[i18n.language]}
        translatedFieldsToNN={[]}
      />
    </>
  );
};

export default CreateTopicArticle;
