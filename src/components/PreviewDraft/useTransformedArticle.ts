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
import config from "../../config";
import { usePreviewArticle } from "../../modules/article/articleGqlQueries";
import formatDate from "../../util/formatDate";
import { FormArticle } from "./types";

export const getUpdatedLanguage = (language: string | undefined) => (language === "nb" ? "no" : language);

export type UseTranslationOptions<T extends FormArticle | undefined> = {
  draft: T;
  language: string;
  previewAlt: boolean;
  useDraftConcepts: boolean;
};

export const useTransformedArticle = <T extends FormArticle | undefined>({
  draft,
  language,
  previewAlt,
  useDraftConcepts,
}: UseTranslationOptions<T>): { draft: T; article: ArticleType | undefined } => {
  const transformedContent = usePreviewArticle(draft?.content ?? "", language, draft?.visualElement, useDraftConcepts, {
    enabled: !!draft,
  });
  const disclaimerContent = usePreviewArticle(draft?.disclaimer ?? "", language, undefined, false, {
    enabled: !!draft?.disclaimer,
  });

  const article: undefined | ArticleType = useMemo(() => {
    if (!transformedContent.data || !draft) return;
    const content = transform(transformedContent.data, {
      previewAlt,
      frontendDomain: config.ndlaFrontendDomain,
      articleLanguage: getUpdatedLanguage(draft.language),
    });

    const disclaimer = transform(disclaimerContent?.data ?? "", {});

    return {
      title: draft.title ? parse(draft.title) : "",
      introduction: draft.introduction ? parse(draft.introduction) : "",
      content,
      copyright: draft.copyright,
      published: draft.published ? formatDate(draft.published) : "",
      footNotes: [],
      disclaimer,
    };
  }, [transformedContent.data, draft, previewAlt]);

  return { article, draft };
};
