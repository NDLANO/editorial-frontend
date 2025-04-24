/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { IUpdatedArticleDTO } from "@ndla/types-backend/draft-api";
import LearningResourceForm from "./components/LearningResourceForm";
import { convertUpdateToNewDraft } from "../../../util/articleUtil";
import { toEditArticle } from "../../../util/routeHelpers";
import { useFetchArticleData } from "../../FormikForm/formikDraftHooks";

const CreateLearningResource = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const locale = i18n.language;
  const { createArticle } = useFetchArticleData(undefined, locale);

  const createArticleAndPushRoute = async (createdArticle: IUpdatedArticleDTO) => {
    const savedArticle = await createArticle(convertUpdateToNewDraft(createdArticle));
    navigate(toEditArticle(savedArticle.id, savedArticle.articleType, createdArticle.language));
    return savedArticle;
  };

  return (
    <>
      <title>{t("htmlTitles.createLearningResourcePage")}</title>
      <LearningResourceForm
        updateArticle={createArticleAndPushRoute}
        articleChanged={false}
        isNewlyCreated={false}
        articleLanguage={i18n.language}
        supportedLanguages={[i18n.language]}
        translatedFieldsToNN={[]}
      />
    </>
  );
};

export default CreateLearningResource;
