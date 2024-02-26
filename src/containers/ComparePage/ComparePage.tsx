/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import styled from "@emotion/styled";
import { spacing } from "@ndla/core";
import { HelmetWithTracker } from "@ndla/tracker";
import PreviewDraft from "../../components/PreviewDraft/PreviewDraft";
import Spinner from "../../components/Spinner";
import {
  draftApiTypeToLearningResourceFormType,
  learningResourceFormTypeToDraftApiType,
} from "../../containers/ArticlePage/articleTransformers";
import { LearningResourceFormType, useArticleFormHooks } from "../../containers/FormikForm/articleFormHooks";
import { useDraft, useLicenses } from "../../modules/draft/draftQueries";

const StyledPreviewWrapper = styled.div`
  width: 100%;
  max-width: 100%;
  display: inline-flex;
  justify-content: center;
  & .c-article {
    padding: 0;
    margin-top: 20px;
    line-height: unset;
    font-family: unset;
    > section {
      width: unset !important;
      left: unset !important;
    }
    & .c-article__header {
      margin-bottom: unset;
    }
  }
`;

const TwoArticleWrapper = styled(StyledPreviewWrapper)`
  > div {
    margin: 0 2.5%;
    width: 40%;
    > h2 {
      margin: 0;
      margin-left: ${spacing.large};
    }
    > article {
      max-width: unset;
    }
  }
`;

const PreviewTitleWrapper = styled.div`
  height: 90px;
`;

const ComparePage = () => {
  const { t } = useTranslation();
  const params = useParams<"draftId" | "language">();
  const draftId = Number(params.draftId!);
  const language = params.language!;
  const { data: article, isLoading } = useDraft({ id: draftId, language: language });
  const [previewLanguage, setPreviewLanguage] = useState<string>(article?.supportedLanguages[0]!);
  const { initialValues } = useArticleFormHooks<LearningResourceFormType>({
    getInitialValues: draftApiTypeToLearningResourceFormType,
    article,
    t,
    updateArticle: () => Promise.resolve(article!),
    getArticleFromSlate: learningResourceFormTypeToDraftApiType,
    articleLanguage: language,
  });
  const draft = useDraft({ id: article?.id!, language: previewLanguage });
  const { data: licenses = [] } = useLicenses();
  const formArticle = useMemo(() => {
    const apiType = learningResourceFormTypeToDraftApiType(initialValues, initialValues, licenses);
    return {
      id: article?.id!,
      title: apiType.title ?? "",
      content: apiType.content ?? "",
      introduction: apiType.introduction ?? "",
      visualElement: apiType.visualElement,
      published: apiType.published,
      copyright: apiType.copyright,
    };
  }, [initialValues, licenses, article?.id]);

  useEffect(() => {
    setPreviewLanguage(article?.supportedLanguages.find((l) => l !== language) ?? article?.supportedLanguages[0]!);
  }, [article, language]);

  if (!article || isLoading) return <Spinner />;

  return (
    <>
      <HelmetWithTracker title={t("htmlTitles.comparePage")} />
      <TwoArticleWrapper>
        <div>
          <PreviewTitleWrapper className="u-4/6@desktop u-push-1/6@desktop">
            <h2>
              {t(`form.previewLanguageArticle.title`, {
                language: t(`languages.${language}`).toLowerCase(),
              })}
            </h2>
          </PreviewTitleWrapper>
          <PreviewDraft
            type="formArticle"
            draft={formArticle}
            language={language}
            label={t(`articleType.${article.articleType}`)}
          />
        </div>
        <div>
          <PreviewTitleWrapper className="u-4/6@desktop u-push-1/6@desktop">
            <h2>
              {t("form.previewLanguageArticle.title", {
                language: t(`languages.${previewLanguage}`).toLowerCase(),
              })}
            </h2>
            <select onChange={(evt) => setPreviewLanguage(evt.target.value)} value={previewLanguage}>
              {article.supportedLanguages.map((language) => (
                <option key={language} value={language}>
                  {t(`languages.${language}`)}
                </option>
              ))}
            </select>
          </PreviewTitleWrapper>
          {draft.data && (
            <PreviewDraft
              type="article"
              draft={draft.data}
              language={previewLanguage}
              label={t(`articleType.${draft.data.articleType}`)}
            />
          )}
        </div>
      </TwoArticleWrapper>
    </>
  );
};

export default ComparePage;
