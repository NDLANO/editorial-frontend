/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useFormikContext } from "formik";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { IArticle } from "@ndla/types-backend/draft-api";
import { FormArticle, toFormArticle } from "./PreviewDraft";
import { PreviewBaseProps, TwoArticleWrapper } from "./PreviewDraftLightboxV2";
import { TransformedPreviewDraft } from "./TransformedPreviewDraft";
import { useTransformedArticle } from "./useTransformedArticle";
import { learningResourceFormTypeToDraftApiType } from "../../containers/ArticlePage/articleTransformers";
import { LearningResourceFormType } from "../../containers/FormikForm/articleFormHooks";
import { useLicenses } from "../../modules/draft/draftQueries";

export interface VersionPreviewProps extends PreviewBaseProps {
  type: "version";
  article: IArticle;
  customTitle?: string;
}

export const PreviewVersion = ({ article, language, customTitle }: VersionPreviewProps) => {
  const { t } = useTranslation();
  const { values, initialValues } = useFormikContext<LearningResourceFormType>();
  const { data: licenses = [] } = useLicenses();
  const apiType = useMemo(
    () => learningResourceFormTypeToDraftApiType(values, initialValues, licenses),
    [initialValues, licenses, values],
  );

  const formArticle: FormArticle = {
    id: article.id,
    articleType: article.articleType,
    title: apiType.title ?? "",
    content: apiType.content ?? "",
    introduction: apiType.introduction ?? "",
    visualElement: apiType.visualElement,
    published: apiType.published,
    copyright: apiType.copyright,
  };

  const publishedArticle = toFormArticle(article, language);
  const publishedTransformed = useTransformedArticle({ draft: publishedArticle, language });
  const currentTransformed = useTransformedArticle({ draft: formArticle, language });

  return (
    <>
      <TwoArticleWrapper>
        <div>
          <div className="u-10/12 u-push-1/12">
            <h2>
              {customTitle ??
                t("form.previewProductionArticle.version", {
                  revision: article.revision,
                })}
            </h2>
          </div>
          <TransformedPreviewDraft {...publishedTransformed} label={article.articleType} />
        </div>
        <div>
          <div className="u-10/12 u-push-1/12">
            <h2>{t("form.previewProductionArticle.current")}</h2>
          </div>
          <TransformedPreviewDraft {...currentTransformed} label={article.articleType} />
        </div>
      </TwoArticleWrapper>
    </>
  );
};
