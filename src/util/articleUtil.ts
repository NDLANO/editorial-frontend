/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import defined from 'defined';
import formatDate from './formatDate';
import { convertFieldWithFallback } from './convertFieldWithFallback';
import * as articleStatuses from './constants/ArticleStatus';
import {
  DraftApiType,
  DraftStatus,
  UpdatedDraftApiType,
} from '../modules/draft/draftApiInterfaces';
import { ArticleType, ConvertedDraftType, LocaleType, RelatedContent } from '../interfaces';
import { ApiConceptType } from '../modules/concept/conceptApiInterfaces';
import { ArticleTaxonomy } from '../containers/FormikForm/formikDraftHooks';
import { fetchConcept } from '../modules/concept/conceptApi';
import { fetchDraft } from '../modules/draft/draftApi';

export const isDraftPublished = (status?: DraftStatus) =>
  (status?.other && status.other.includes(articleStatuses.PUBLISHED)) ||
  status?.current === articleStatuses.PUBLISHED;

// TODO: Disse typene er nok feil så fiks dem
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
): Promise<(ApiConceptType & { articleType: 'concept' })[]> => {
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
    articleIds.map(async element => {
      if (typeof element === 'number') {
        return fetchDraft(element);
      } else {
        return element;
      }
    }),
  );
};

export const transformArticleFromApiVersion = async (
  article: DraftApiType & { taxonomy?: ArticleTaxonomy },
  locale: LocaleType,
): Promise<ConvertedDraftType> => {
  const visualElement = convertFieldWithFallback<'visualElement'>(article, 'visualElement', '');
  const metaImage = undefined; // TODO: article.metaImage;
  // TODO: const footnotes = article.content && article.content.footNotes ? article.content.footNotes : undefined;

  const conceptIds = await fetchConceptList(article.conceptIds);
  const relatedContent = await fetchArticleList(article.relatedContent);

  return {
    ...article,
    title: convertFieldWithFallback<'title'>(article, 'title', ''),
    introduction: convertFieldWithFallback<'introduction'>(article, 'introduction', ''),
    visualElement,
    content: convertFieldWithFallback<'content'>(article, 'content', ''),
    metaDescription: convertFieldWithFallback<'metaDescription'>(article, 'metaDescription', ''),
    metaImage,
    tags: convertFieldWithFallback<'tags', string[]>(article, 'tags', []),
    conceptIds,
    relatedContent,
    language: locale,
  };
};

export const transformArticle = (article: ArticleType) => {
  // @ts-ignore TODO: figure out if this part is actually used (`metaData` doesn't exist on `ArticleType`).
  const footNotes = defined(article.metaData.footnotes, []);
  return {
    ...article,
    created: formatDate(article.created),
    updated: formatDate(article.updated),
    published: formatDate(article.published),
    footNotes,
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

export const isGrepCodeValid = (grepCode: string) => {
  return !!grepCode.match(/^(K(E|M)\d+|TT\d+)$/);
};

export const nullOrUndefined = (metaImageId?: unknown | null | undefined) => {
  return metaImageId === null ? null : undefined;
};
