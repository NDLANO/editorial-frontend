/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  DraftApiType,
  NewDraftApiType,
  UpdatedDraftApiType,
} from '../modules/draft/draftApiInterfaces';
import { AudioApiType, PodcastSeriesApiType } from '../modules/audio/audioApiInterfaces';
import { ImageApiType } from '../modules/image/imageApiInterfaces';
import { ConceptApiType } from '../modules/concept/conceptApiInterfaces';
import { WarningType } from '../interfaces';

export const convertUpdateToNewDraft = (article: UpdatedDraftApiType): NewDraftApiType => {
  if (!article.language || !article.title || !article.articleType) {
    // This should probably never happen, but will satisfy typescript
    throw new Error('Error when converting `UpdatedDraftApiType` to `NewDraftApiType`');
  }

  return {
    ...article,
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

export const getFieldsWithWrongLanguage = (
  content:
    | DraftApiType
    | AudioApiType
    | ImageApiType
    | ConceptApiType
    | PodcastSeriesApiType
    | undefined,
  language: string,
): WarningType[] => {
  if (!content) return [];
  // @ts-ignore
  return (
    (Object.keys(content) as Array<keyof typeof content>)
      // @ts-ignore
      .filter(field => content[field]?.language && content[field]?.language !== language)
      // @ts-ignore
      .map(field => ({ [field]: content[field].language }))
  );
};
