/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useMemo } from "react";
import { ContentTypeBadge, Article, FrontpageArticle, ArticleType } from "@ndla/ui";
import { FormArticle } from "./PreviewDraft";
import { getUpdatedLanguage } from "./useTransformedArticle";
import { articleIsWide } from "../WideArticleEditorProvider";

interface Props {
  article: ArticleType | undefined;
  draft: FormArticle;
  label: string;
  contentType?: string;
}

export const TransformedPreviewDraft = ({ article, draft, contentType, label }: Props) => {
  const isWide = useMemo(() => articleIsWide(draft.id), [draft.id]);

  useEffect(() => {
    if (window.MathJax) {
      window.MathJax.typesetPromise();
    }
  }, [article]);

  if (!!article && draft.articleType === "frontpage-article") {
    return <FrontpageArticle article={article} id={draft.id.toString()} isWide={isWide} />;
  }

  if (!article) return null;

  return (
    <Article
      article={article}
      icon={contentType ? <ContentTypeBadge type={contentType} background size="large" /> : null}
      id={draft.id.toString()}
      messages={{ label }}
      lang={getUpdatedLanguage(draft.language)}
    />
  );
};
