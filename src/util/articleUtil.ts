/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import formatDate from './formatDate';
import { convertFieldWithFallback } from './convertFieldWithFallback';
import * as articleStatuses from './constants/ArticleStatus';
import {
  DraftApiType,
  DraftStatus,
  NewDraftApiType,
  UpdatedDraftApiType,
} from '../modules/draft/draftApiInterfaces';
import { ArticleType, ConvertedDraftType, RelatedContent } from '../interfaces';
import { ConceptApiType } from '../modules/concept/conceptApiInterfaces';
import { ArticleTaxonomy } from '../containers/FormikForm/formikDraftHooks';
import { fetchConcept } from '../modules/concept/conceptApi';
import { fetchDraft } from '../modules/draft/draftApi';

export const isDraftPublished = (status?: DraftStatus) =>
  (status?.other && status.other.includes(articleStatuses.PUBLISHED)) ||
  status?.current === articleStatuses.PUBLISHED;

// TODO: Currently only used from javascript files. Fix `any` type when caller(s) get types.
export const transformArticleToApiVersion = (article: any): DraftApiType => ({
  ...article,
  title: { title: article.title, language: article.language },
  introduction: { introduction: article.introduction },
  tags: { tags: article.tags, language: article.language },
  content: {
    content: article.content,
    language: article.language,
  },
  visualElement: article.visualElement
    ? { visualElement: article.visualElement, language: article.language }
    : undefined,
  metaDescription: {
    metaDescription: article.metaDescription,
  },
  conceptIds: article.conceptIds.map((e: any) => e.conceptId),
  relatedContent: article.relatedContent.map((e: any) => (e.articleId ? e.articleId : e)),
});

const fetchConceptList = async (
  conceptIds: number[],
): Promise<(ConceptApiType & { articleType: 'concept' })[]> => {
  const fetchedConcepts = Promise.all(
    conceptIds
      .filter(a => !!a)
      .map(async elementId => {
        return fetchConcept(elementId, '');
      }),
  );

  return fetchedConcepts.then(concepts => {
    return concepts.map(concept => {
      return { ...concept, articleType: 'concept' };
    });
  });
};

const fetchArticleList = async (
  articleIds: (RelatedContent | number)[],
): Promise<(RelatedContent | DraftApiType)[]> => {
  return Promise.all(
    (articleIds || []).map(async element => {
      if (typeof element === 'number') {
        return fetchDraft(element);
      } else {
        return element;
      }
    }),
  );
};

const convertMetaImage = (metaImage?: {
  url: string;
  alt: string;
  language: string;
}): { id: string; alt: string } | null | undefined => {
  if (!metaImage) return null;

  const idFromUrl = metaImage.url.split('/').pop();
  if (!idFromUrl) return undefined;

  return {
    id: idFromUrl,
    alt: metaImage.alt,
  };
};

export const transformArticleFromApiVersion = async (
  article: DraftApiType & { taxonomy?: ArticleTaxonomy },
  locale?: string,
): Promise<ConvertedDraftType> => {
  const visualElement = convertFieldWithFallback<'visualElement'>(article, 'visualElement', '');
  const metaImage = convertMetaImage(article.metaImage);
  const conceptIds = await fetchConceptList(article.conceptIds);
  const relatedContent = await fetchArticleList(article.relatedContent);
  const title = convertFieldWithFallback<'title'>(article, 'title', '');
  const introduction = convertFieldWithFallback<'introduction'>(article, 'introduction', '');
  const content = convertFieldWithFallback<'content'>(article, 'content', '');
  const tags = convertFieldWithFallback<'tags', string[]>(article, 'tags', []);
  const metaDescription = convertFieldWithFallback<'metaDescription'>(
    article,
    'metaDescription',
    '',
  );

  return {
    ...article,
    title,
    introduction,
    visualElement,
    content,
    metaDescription,
    metaImage,
    tags,
    conceptIds,
    relatedContent,
    language: locale,
  };
};

export const transformArticle = (article: ArticleType) => {
  return {
    ...article,
    created: formatDate(article.created),
    updated: formatDate(article.updated),
    published: formatDate(article.published),
    footNotes: article.metaData?.footnotes ?? [],
    requiredLibraries: article.requiredLibraries
      ? article.requiredLibraries.map(lib => {
          if (lib.url.startsWith('http://')) {
            return {
              ...lib,
              url: lib.url.replace('http://', 'https://'),
            };
          }
          return lib;
        })
      : [],
  };
};

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
