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
import { PageContent, Spinner } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { ArticleWrapper } from "@ndla/ui";
import PreviewDraft from "../../components/PreviewDraft/PreviewDraft";
import { useDraft } from "../../modules/draft/draftQueries";
import PrivateRoute from "../PrivateRoute/PrivateRoute";

const TwoArticleWrapper = styled("div", {
  base: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",

    "& span[lang]": {
      textDecoration: "underline",
      textDecorationColor: "stroke.subtle",
      _after: {
        content: `"(" attr(lang) ")"`,
        color: "text.subtle",
        fontStyle: "italic",
      },
    },
  },
});

const PreviewTitleWrapper = styled("div", {
  base: {
    height: "surface.4xsmall",
    position: "relative",
  },
});

export const Component = () => <PrivateRoute component={<ComparePage />} />;

const ComparePage = () => {
  const { t } = useTranslation();
  const params = useParams<"draftId" | "language">();
  const draftId = Number(params.draftId!);
  const language = params.language!;
  const { data: article, isLoading } = useDraft({ id: draftId, language: language });
  const [previewLanguage, setPreviewLanguage] = useState<string>(article?.supportedLanguages[0] ?? "");
  const draft = useDraft({ id: article?.id ?? -1, language: previewLanguage }, { enabled: !!article?.id });
  const formArticle = useMemo(() => {
    if (!article) return undefined;
    return {
      id: article.id,
      title: article.title?.htmlTitle ?? "",
      content: article.content?.content ?? "",
      introduction: article.introduction?.htmlIntroduction ?? "",
      visualElement: article.visualElement?.visualElement ?? "",
      published: article.published,
      copyright: article.copyright,
      disclaimer: article.disclaimer?.disclaimer ?? "",
    };
  }, [article]);

  useEffect(() => {
    if (!article) return;
    setPreviewLanguage(article.supportedLanguages.find((l) => l !== language) ?? article.supportedLanguages[0]);
  }, [article, language]);

  if (!article || isLoading || !formArticle) return <Spinner />;

  return (
    <>
      <title>{t("htmlTitles.comparePage")}</title>
      <TwoArticleWrapper>
        <PageContent variant="content" asChild>
          <ArticleWrapper>
            <PreviewTitleWrapper>
              <h2>
                {t(`form.previewLanguageArticle.title`, {
                  language: t(`languages.${language}`).toLowerCase(),
                })}
              </h2>
            </PreviewTitleWrapper>
            <PreviewDraft type="formArticle" draft={formArticle} language={language} previewAlt />
          </ArticleWrapper>
        </PageContent>
        <PageContent variant="content" asChild>
          <ArticleWrapper>
            <PreviewTitleWrapper>
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
            {!!draft.data && <PreviewDraft type="article" draft={draft.data} language={previewLanguage} previewAlt />}
          </ArticleWrapper>
        </PageContent>
      </TwoArticleWrapper>
    </>
  );
};
