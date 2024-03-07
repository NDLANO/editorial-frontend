/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import parse from "html-react-parser";
import { useMemo } from "react";
import { transform } from "@ndla/article-converter";
import { ArticleType } from "@ndla/ui";
import { FormArticle } from "./PreviewDraft";
import config from "../../config";
import { usePreviewArticle } from "../../modules/article/articleGqlQueries";
import formatDate from "../../util/formatDate";
import parseMarkdown from "../../util/parseMarkdown";

export const getUpdatedLanguage = (language: string | undefined) => (language === "nb" ? "no" : language);

export const useTransformedArticle = ({ draft, language }: { draft: FormArticle; language: string }) => {
  const transformedContent = usePreviewArticle(draft.content!, language, draft.visualElement);

  const article: undefined | ArticleType = useMemo(() => {
    if (!transformedContent.data) return;
    const content = transform(transformedContent.data, {
      previewAlt: true,
      frontendDomain: config.ndlaFrontendDomain,
      articleLanguage: getUpdatedLanguage(draft.language),
    });
    return {
      title: parse(draft.title ?? ""),
      introduction: parse(parseMarkdown({ markdown: draft.introduction ?? "", inline: true })),
      content,
      copyright: draft.copyright,
      published: draft.published ? formatDate(draft.published) : "",
      footNotes: [],
    };
  }, [transformedContent.data, draft]);

  return { article, draft };
};
