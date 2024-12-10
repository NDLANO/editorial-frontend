/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { PageContent } from "@ndla/primitives";
import { IArticleDTO } from "@ndla/types-backend/draft-api";
import { ArticleWrapper } from "@ndla/ui";
import PreviewDraft from "./PreviewDraft";

export interface MarkupPreviewProps {
  type: "markup";
  article: IArticleDTO;
  language: string;
}

export const PreviewMarkup = ({ article, language }: MarkupPreviewProps) => {
  return (
    <PageContent variant="article">
      <PageContent variant="content" asChild>
        <ArticleWrapper>
          <PreviewDraft type="article" draft={article} language={language} previewAlt />
        </ArticleWrapper>
      </PageContent>
    </PageContent>
  );
};
