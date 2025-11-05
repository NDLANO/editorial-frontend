/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useFormikContext } from "formik";
import parse from "html-react-parser";
import { ReactNode, useMemo, useState } from "react";
import { renderToString } from "react-dom/server";
import { useTranslation } from "react-i18next";
import { InformationLine } from "@ndla/icons";
import { PageContent, SwitchControl, SwitchHiddenInput, SwitchLabel, SwitchRoot, SwitchThumb } from "@ndla/primitives";
import { MissingRouterContext } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { ArticleDTO } from "@ndla/types-backend/draft-api";
import { ArticleWrapper } from "@ndla/ui";
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
  article: ArticleDTO;
  customTitle?: string;
  language: string;
}

const SwitchWrapper = styled("div", {
  base: {
    display: "flex",
    marginInlineEnd: "4xlarge",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: "3xsmall",
  },
});

const TwoArticleWrapperWithDiff = styled(TwoArticleWrapper, {
  base: {
    "& del.diffmod, ins.diffmod, ins.mod": {
      background: "surface.warning",
      textDecoration: "none",
      display: "inline-block",
    },
    "& .diffins:has(img, div, figure, picture), .diffmod:has(div, img, figure, picture)": {
      // Add some padding to show the diff outline on block elements
      padding: "3xsmall",
    },
    "& .diffins": {
      background: "surface.successSubtle",
      textDecoration: "none",
      display: "inline-block",
    },
    "& .diffdel": {
      background: "surface.errorSubtle",
      textDecoration: "none",
      display: "inline-block",
    },
  },
});

const renderWithoutRouter = (node: ReactNode) => {
  return renderToString(<MissingRouterContext value={true}>{node}</MissingRouterContext>);
};

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
      title: renderWithoutRouter(currentTransformed.article?.title),
      introduction: renderWithoutRouter(currentTransformed.article?.introduction),
      content: renderWithoutRouter(currentTransformed.article?.content),
    };
  }, [diffEnable, currentTransformed]);
  const publishObj = useMemo(() => {
    if (!diffEnable) return null;
    return {
      title: renderWithoutRouter(publishedTransformed.article?.title),
      introduction: renderWithoutRouter(publishedTransformed.article?.introduction),
      content: renderWithoutRouter(publishedTransformed.article?.content),
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
        <InformationLine
          aria-hidden={false}
          aria-label={t("form.previewProductionArticle.diffInfo")}
          title={t("form.previewProductionArticle.diffInfo")}
        />
        <SwitchRoot checked={diffEnable} onCheckedChange={(details) => setDiffEnable(details.checked)}>
          <SwitchLabel>{t("form.previewProductionArticle.enableDiff")}</SwitchLabel>
          <SwitchControl>
            <SwitchThumb />
          </SwitchControl>
          <SwitchHiddenInput />
        </SwitchRoot>
      </SwitchWrapper>
      <TwoArticleWrapperWithDiff>
        <PageContent variant="content">
          <h2>
            {customTitle ??
              t("form.previewProductionArticle.version", {
                revision: article.revision,
              })}
          </h2>
          <ArticleWrapper>
            {!!publishedTransformed.article && (
              <TransformedPreviewDraft
                {...publishedTransformed}
                key={`published-${diffEnable}`}
                article={publishedTransformed.article}
                draft={publishedTransformed.draft}
              />
            )}
          </ArticleWrapper>
        </PageContent>
        <PageContent variant="content">
          <h2>{t("form.previewProductionArticle.current")}</h2>
          <ArticleWrapper>
            {!!transformedWithDiff.article && (
              <TransformedPreviewDraft
                {...transformedWithDiff}
                key={`draft-${diffEnable}`}
                article={transformedWithDiff.article}
                draft={transformedWithDiff.draft}
              />
            )}
          </ArticleWrapper>
        </PageContent>
      </TwoArticleWrapperWithDiff>
    </>
  );
};
