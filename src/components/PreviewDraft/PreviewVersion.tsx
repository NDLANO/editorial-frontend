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
import { colors, spacing } from "@ndla/core";
import { Switch } from "@ndla/switch";
import { IArticle } from "@ndla/types-backend/draft-api";
import { FormArticle, toFormArticle } from "./PreviewDraft";
import { TransformedPreviewDraft } from "./TransformedPreviewDraft";
import { TwoArticleWrapper } from "./TwoArticleWrapper";
import { useTransformedArticle } from "./useTransformedArticle";
import { learningResourceFormTypeToDraftApiType } from "../../containers/ArticlePage/articleTransformers";
import { LearningResourceFormType } from "../../containers/FormikForm/articleFormHooks";
import { useLicenses } from "../../modules/draft/draftQueries";
import { getDiff } from "../../util/diffHTML";

export interface VersionPreviewProps {
  type: "version";
  article: IArticle;
  customTitle?: string;
  language: string;
  activateButton?: ReactElement;
}

const SwitchWrapper = styled.div`
  display: flex;
  margin-right: ${spacing.xxlarge};
  justify-content: end;
`;

const TwoArticleWrapperWithDiff = styled(TwoArticleWrapper)`
  del.diffmod,
  ins.diffmod,
  ins.mod {
    background-color: ${colors.support.yellow};
    text-decoration: none;
    display: inline-block;
  }

  .diffins:has(img, div, figure, picture),
  .diffmod:has(div, img, figure, picture) {
    padding: 5px;
  }

  .diffins {
    background-color: ${colors.support.greenLight};
    text-decoration: none;
    display: inline-block;
  }

  del.diffdel {
    background-color: ${colors.support.redLight};
    text-decoration: none;
    display: inline-block;
  }
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

  const publishedArticle = toFormArticle(article, language);
  const publishedTransformed = useTransformedArticle({ draft: publishedArticle, language });
  const currentTransformed = useTransformedArticle({ draft: formArticle, language });
  const currentObj = useMemo(() => {
    if (!diffEnable) return null;
    return {
      title: renderToString(currentTransformed.article?.title as ReactElement),
      introduction: renderToString(currentTransformed.article?.introduction as ReactElement),
      content: renderToString(currentTransformed.article?.content as ReactElement),
    };
  }, [diffEnable, currentTransformed]);
  const publishObj = useMemo(() => {
    if (!diffEnable) return null;
    return {
      title: renderToString(publishedTransformed.article?.title as ReactElement),
      introduction: renderToString(publishedTransformed.article?.introduction as ReactElement),
      content: renderToString(publishedTransformed.article?.content as ReactElement),
    };
  }, [diffEnable, publishedTransformed]);

  const diffObj = useMemo(() => {
    if (publishObj && currentObj) {
      const [oldTitle, newTitle] = getDiff(publishObj.title, currentObj.title);
      const [oldIntroduction, newIntroduction] = getDiff(publishObj.introduction, currentObj.introduction);
      const [oldContent, newContent] = getDiff(publishObj.content, currentObj.content);
      return { oldTitle, newTitle, oldIntroduction, newIntroduction, oldContent, newContent };
    }
    return null;
  }, [currentObj, publishObj]);

  const changeDiff = useCallback(() => {
    setDiffEnable((p) => !p);
  }, [setDiffEnable]);

  if (diffEnable && diffObj) {
    if (publishedTransformed.article && currentTransformed.article) {
      publishedTransformed.article.title = parse(diffObj.oldTitle);
      publishedTransformed.article.introduction = parse(diffObj.oldIntroduction);
      publishedTransformed.article.content = parse(diffObj.oldContent);

      currentTransformed.article.title = parse(diffObj.newTitle);
      currentTransformed.article.introduction = parse(diffObj.newIntroduction);
      currentTransformed.article.content = parse(diffObj.newContent);
    }
  }

  return (
    <>
      <SwitchWrapper>
        <Switch
          onChange={changeDiff}
          checked={diffEnable}
          label={t("form.previewProductionArticle.enableDiff")}
          id={"diff"}
        />
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
