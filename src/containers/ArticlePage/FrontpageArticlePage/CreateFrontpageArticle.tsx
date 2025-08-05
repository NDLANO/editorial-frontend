/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { PageContent } from "@ndla/primitives";
import { IUpdatedArticleDTO } from "@ndla/types-backend/draft-api";
import FrontpageArticleForm from "./components/FrontpageArticleForm";
import { WideArticleEditorProvider } from "../../../components/WideArticleEditorProvider";
import { convertUpdateToNewDraft } from "../../../util/articleUtil";
import { toEditArticle } from "../../../util/routeHelpers";
import { useFetchArticleData } from "../../FormikForm/formikDraftHooks";
import PrivateRoute from "../../PrivateRoute/PrivateRoute";

export const Component = () => <PrivateRoute component={<CreateFrontpageArticle />} />;

const CreateFrontpageArticle = () => {
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
    <WideArticleEditorProvider initialValue={false}>
      <PageContent variant="wide">
        <title>{t("htmlTitles.createFrontPageArticePage")}</title>
        <FrontpageArticleForm
          updateArticle={createArticleAndPushRoute}
          articleChanged={false}
          articleLanguage={i18n.language}
          supportedLanguages={[i18n.language]}
          translatedFieldsToNN={[]}
        />
      </PageContent>
    </WideArticleEditorProvider>
  );
};
