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
import { IUpdatedArticleDTO } from "@ndla/types-backend/draft-api";
import LearningResourceForm from "./components/LearningResourceForm";
import { convertUpdateToNewDraft } from "../../../util/articleUtil";
import { toEditArticle } from "../../../util/routeHelpers";
import { useFetchArticleData } from "../../FormikForm/formikDraftHooks";
import PrivateRoute from "../../PrivateRoute/PrivateRoute";

export const Component = () => <PrivateRoute component={<CreateLearningResource />} />;

const CreateLearningResource = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const locale = i18n.language;
  const { createArticle } = useFetchArticleData(undefined, locale);

  const createArticleAndPushRoute = async (createdArticle: IUpdatedArticleDTO) => {
    const savedArticle = await createArticle(convertUpdateToNewDraft(createdArticle));
    navigate(toEditArticle(savedArticle.id, savedArticle.articleType, createdArticle.language), {
      state: { isNewlyCreated: true },
    });
    return savedArticle;
  };

  return (
    <PageContent variant="wide">
      <title>{t("htmlTitles.createLearningResourcePage")}</title>
      <LearningResourceForm
        updateArticle={createArticleAndPushRoute}
        articleChanged={false}
        articleLanguage={i18n.language}
        supportedLanguages={[i18n.language]}
        translatedFieldsToNN={[]}
      />
    </PageContent>
  );
};
