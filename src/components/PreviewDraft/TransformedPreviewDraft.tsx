/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect } from "react";
import { ArticleType, ArticleTitle, ArticleContent, ArticleFooter, ArticleByline } from "@ndla/ui";
import { FormArticle } from "./PreviewDraft";
import { getUpdatedLanguage } from "./useTransformedArticle";

interface Props {
  article: ArticleType;
  draft: FormArticle;
  contentType?: string;
}

export const TransformedPreviewDraft = ({ article, draft, contentType }: Props) => {
  useEffect(() => {
    if (window.MathJax) {
      window.MathJax.typesetPromise();
    }
  }, [article]);

  const authors =
    article.copyright?.creators.length || article.copyright?.rightsholders.length
      ? article.copyright.creators
      : article.copyright?.processors;

  return (
    <>
      <ArticleTitle
        id={draft.id.toString()}
        contentType={contentType}
        title={article.title}
        introduction={article.introduction}
        lang={getUpdatedLanguage(draft.language)}
      />
      <ArticleContent>{article.content ?? ""}</ArticleContent>
      <ArticleFooter>
        <ArticleByline
          footnotes={article.footNotes}
          authors={authors}
          suppliers={article.copyright?.rightsholders}
          published={article.published}
        />
      </ArticleFooter>
    </>
  );
};
