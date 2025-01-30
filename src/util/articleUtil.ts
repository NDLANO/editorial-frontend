/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { INewArticleDTO, IUpdatedArticleDTO } from "@ndla/types-backend/draft-api";

export const convertUpdateToNewDraft = (article: IUpdatedArticleDTO): INewArticleDTO => {
  if (!article.language || !article.title || !article.articleType) {
    // This should probably never happen, but will satisfy typescript
    throw new Error("Error when converting `UpdatedDraftApiType` to `NewDraftApiType`");
  }

  return {
    ...article,
    requiredLibraries: article.requiredLibraries ?? [],
    tags: article.tags ?? [],
    language: article.language,
    title: article.title,
    metaImage: article.metaImage ?? undefined,
    articleType: article.articleType,
    notes: article.notes ?? [],
    editorLabels: article.editorLabels ?? [],
    grepCodes: article.grepCodes ?? [],
    conceptIds: article.conceptIds ?? [],
    relatedContent: article.relatedContent ?? [],
    responsibleId: article.responsibleId ?? undefined,
    comments: article.comments ?? [],
    prioritized: article.prioritized ?? false,
  };
};

export const isGrepCodeValid = (grepCode: string, prefixFilter: string[]) => {
  const regex = new RegExp(`^(${prefixFilter.join("|")})\\d+$`);
  return !!grepCode.match(regex);
};

export const nullOrUndefined = (metaImageId?: unknown | null | undefined) => {
  return metaImageId === null ? null : undefined;
};

export const getSlugFromTitle = (title: string) => {
  const onlySingleSpace = /\s\s+/g;
  const noIllegalCharacters = /[^a-zA-Z0-9- ]/g;
  return title.replace(onlySingleSpace, " ").replace(noIllegalCharacters, "").trim().replace(/\s/g, "-");
};
