/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useFormikContext } from "formik";
import parse from "html-react-parser";
import { ReactElement, useMemo, useState, useCallback } from "react";
import { renderToString } from "react-dom/server";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { spacing } from "@ndla/core";
import { Switch } from "@ndla/switch";
import { IArticle } from "@ndla/types-backend/draft-api";
import { FormArticle, toFormArticle } from "./PreviewDraft";
import { PreviewBaseProps, TwoArticleWrapper } from "./PreviewDraftLightboxV2";
import { TransformedPreviewDraft } from "./TransformedPreviewDraft";
import { useTransformedArticle } from "./useTransformedArticle";
import { learningResourceFormTypeToDraftApiType } from "../../containers/ArticlePage/articleTransformers";
import { LearningResourceFormType } from "../../containers/FormikForm/articleFormHooks";
import { useLicenses } from "../../modules/draft/draftQueries";
import { getDiff } from "../../util/diffHTML";

export interface VersionPreviewProps extends PreviewBaseProps {
  type: "version";
  article: IArticle;
  customTitle?: string;
}

const SwitchWrapper = styled.div`
  display: flex;
  margin-right: ${spacing.xxlarge};
  justify-content: end;
`;

export const PreviewVersion = ({ article, language, customTitle }: VersionPreviewProps) => {
  const [diffEnable, setDiffEnable] = useState(true);
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

  const TwoArticleWrapperWithDiff = styled(TwoArticleWrapper)`
    del.diffmod,
    ins.diffmod {
      background-color: #ffffac;
      text-decoration: none;
      display: inline-block;
    }

    .diffins:has(img, div, figure, picture),
    .diffmod:has(div, img, figure, picture) {
      padding: 5px;
    }

    .diffins {
      background-color: #bdf6bd;
      text-decoration: none;
      display: inline-block;
    }

    del.diffdel {
      background-color: #ffa2a2;
      text-decoration: none;
      display: inline-block;
    }
  `;

  const publishedArticle = toFormArticle(article, language);
  const publishedTransformed = useTransformedArticle({ draft: publishedArticle, language });
  const currentTransformed = useTransformedArticle({ draft: formArticle, language });
  const currentStr = useMemo(
    () => renderToString(currentTransformed.article?.content as ReactElement),
    [currentTransformed],
  );
  const publishStr = useMemo(
    () => renderToString(publishedTransformed.article?.content as ReactElement),
    [publishedTransformed],
  );

  const { oldDiff, newDiff } = useMemo(() => {
    if (diffEnable) return getDiff(publishStr, currentStr);
    return { oldDiff: publishStr, newDiff: currentStr };
  }, [publishStr, currentStr, diffEnable]);

  const changeDiff = useCallback(() => {
    setDiffEnable((p) => !p);
  }, [setDiffEnable]);

  if (diffEnable) {
    if (publishedTransformed?.article?.content && currentTransformed?.article?.content) {
      publishedTransformed.article.content = parse(oldDiff);
      currentTransformed.article.content = parse(newDiff);
    }
  }

  return (
    <>
      <SwitchWrapper>
        <Switch onChange={changeDiff} checked={diffEnable} label={t("Marker forskjeller")} id={"favorites"} />
      </SwitchWrapper>
      <TwoArticleWrapperWithDiff>
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
      </TwoArticleWrapperWithDiff>
    </>
  );
};
