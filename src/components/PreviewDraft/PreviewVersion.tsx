/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useFormikContext } from "formik";
import parse from "html-react-parser";
import { ReactElement, useMemo, useState } from "react";
import { renderToString } from "react-dom/server";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { colors, spacing } from "@ndla/core";
import { InformationOutline } from "@ndla/icons/common";
import { Switch } from "@ndla/switch";
import { IArticle } from "@ndla/types-backend/draft-api";
import { toFormArticle } from "./PreviewDraft";
import { TwoArticleWrapper } from "./styles";
import { TransformedPreviewDraft } from "./TransformedPreviewDraft";
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
}

const SwitchWrapper = styled.div`
  display: flex;
  margin-right: ${spacing.xxlarge};
  justify-content: flex-end;
  align-items: center;
  gap: ${spacing.xsmall};
`;

const CenterWrapper = styled.div`
  position: relative;
  width: 83.333%;
  right: auto;
  left: 8.333%;
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
    // Add some padding to show the diff outline on block elements
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
  const [diffEnable, setDiffEnable] = useState(false);
  const { t } = useTranslation();
  const { values, initialValues } = useFormikContext<LearningResourceFormType>();
  const { data: licenses = [] } = useLicenses();
  const apiType = useMemo(
    () => learningResourceFormTypeToDraftApiType(values, initialValues, licenses),
    [initialValues, licenses, values],
  );

  const publishedArticle = toFormArticle(article, language);
  const publishedTransformed = useTransformedArticle({
    draft: publishedArticle,
    language,
    previewAlt: true,
    useDraftConcepts: true,
  });
  const currentTransformed = useTransformedArticle({
    draft: { ...apiType, id: article.id },
    language,
    previewAlt: true,
    useDraftConcepts: true,
  });
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
      const titleDiff = getDiff(publishObj.title, currentObj.title);
      const introductionDiff = getDiff(publishObj.introduction, currentObj.introduction);
      const contentDiff = getDiff(publishObj.content, currentObj.content);
      return { titleDiff, introductionDiff, contentDiff };
    }
    return null;
  }, [currentObj, publishObj]);

  const transformedWithDiff = useMemo(() => {
    if (diffEnable && diffObj && publishedTransformed.article && currentTransformed.article) {
      return {
        ...currentTransformed,
        article: {
          ...currentTransformed.article,
          title: parse(diffObj.titleDiff),
          introduction: parse(diffObj.introductionDiff),
          content: parse(diffObj.contentDiff),
        },
      };
    }
    return currentTransformed;
  }, [currentTransformed, diffEnable, diffObj, publishedTransformed]);

  return (
    <>
      <SwitchWrapper>
        <InformationOutline
          aria-hidden={false}
          aria-label={t("form.previewProductionArticle.diffInfo")}
          title={t("form.previewProductionArticle.diffInfo")}
        />
        <Switch
          onChange={() => setDiffEnable((p) => !p)}
          checked={diffEnable}
          label={t("form.previewProductionArticle.enableDiff")}
          id={"diff"}
        />
      </SwitchWrapper>
      <TwoArticleWrapperWithDiff>
        <div>
          <CenterWrapper>
            <h2>
              {customTitle ??
                t("form.previewProductionArticle.version", {
                  revision: article.revision,
                })}
            </h2>
          </CenterWrapper>
          <TransformedPreviewDraft {...publishedTransformed} label={article.articleType} />
        </div>
        <div>
          <CenterWrapper>
            <h2>{t("form.previewProductionArticle.current")}</h2>
          </CenterWrapper>
          <TransformedPreviewDraft {...transformedWithDiff} label={article.articleType} />
        </div>
      </TwoArticleWrapperWithDiff>
    </>
  );
};
