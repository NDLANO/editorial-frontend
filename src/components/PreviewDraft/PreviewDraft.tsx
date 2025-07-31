/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from "react";
import { IArticleDTO } from "@ndla/types-backend/draft-api";
import { TransformedPreviewDraft } from "./TransformedPreviewDraft";
import "../DisplayEmbed/helpers/h5pResizer";
import { FormArticle } from "./types";
import { useTransformedArticle } from "./useTransformedArticle";

interface BaseProps {
  contentType?: string;
  language: string;
  previewAlt?: boolean;
  type: "article" | "formArticle";
}

interface PreviewArticleV2Props extends BaseProps {
  type: "article";
  draft: IArticleDTO;
}

interface PreviewFormArticleV2Props extends BaseProps {
  type: "formArticle";
  draft: FormArticle;
}

type Props = PreviewArticleV2Props | PreviewFormArticleV2Props;

export const toFormArticle = (article: IArticleDTO, language: string): FormArticle => {
  return {
    id: article.id,
    articleType: article.articleType,
    content: article.content?.content,
    visualElement: article.visualElement?.visualElement,
    title: article.title?.htmlTitle,
    introduction: article.introduction?.htmlIntroduction,
    published: article.published,
    copyright: article.copyright,
    language: article.title?.language ?? language,
    disclaimer: article.disclaimer?.disclaimer,
  };
};

export const PreviewDraft = (props: Props) => {
  const { type, language, contentType, previewAlt = false, draft: draftProp } = props;
  const draft = useMemo(() => {
    if (type === "article") return toFormArticle(draftProp, language);
    return draftProp;
  }, [draftProp, type, language]);

  const { article } = useTransformedArticle({
    draft,
    language,
    previewAlt,
    useDraftConcepts: false,
    contentType,
  });

  if (!article) return null;

  return <TransformedPreviewDraft article={article} contentType={contentType} draft={draft} />;
};

export default PreviewDraft;
