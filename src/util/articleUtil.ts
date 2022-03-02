/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { INewArticle, IUpdatedArticle } from '@ndla/types-draft-api';

export const convertUpdateToNewDraft = (article: IUpdatedArticle): INewArticle => {
  if (!article.language || !article.title || !article.articleType) {
    // This should probably never happen, but will satisfy typescript
    throw new Error('Error when converting `UpdatedDraftApiType` to `NewDraftApiType`');
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
  };
};

export const isGrepCodeValid = (grepCode: string) => {
  return !!grepCode.match(/^(K(E|M)\d+|TT\d+)$/);
};

export const nullOrUndefined = (metaImageId?: unknown | null | undefined) => {
  return metaImageId === null ? null : undefined;
};
