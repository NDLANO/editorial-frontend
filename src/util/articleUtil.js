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

export const isDraftPublished = (status = {}) =>
  (status.other && status.other.includes(articleStatuses.PUBLISHED)) ||
  status.current === articleStatuses.PUBLISHED;

export const transformArticleToApiVersion = article => ({
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
  conceptIds: article.conceptIds.map(e => e.conceptId),
  relatedContent: article.relatedContent.map(e => (e.articleId ? e.articleId : e)),
});

export const transformArticleFromApiVersion = (article, locale, conceptIds, relatedContent) => ({
  ...article,
  title: convertFieldWithFallback(article, 'title', ''),
  introduction: convertFieldWithFallback(article, 'introduction', ''),
  visualElement: convertFieldWithFallback(article, 'visualElement', {}),
  content: convertFieldWithFallback(article, 'content', ''),
  footnotes: article.content && article.content.footNotes ? article.content.footNotes : undefined,
  metaDescription: convertFieldWithFallback(article, 'metaDescription', ''),
  tags: convertFieldWithFallback(article, 'tags', []),
  conceptIds,
  relatedContent,
  ...(locale ? { language: locale } : {}),
});

export const transformArticle = article => {
  if (!article) {
    return undefined;
  }
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

export const isGrepCodeValid = grepCode => {
  return !!grepCode.match(/^(K(E|M)\d+|TT\d+)$/);
};

export const nullOrUndefined = metaImageId => {
  return metaImageId === null ? null : undefined;
};

export function submitFormWithMessage(formikContext, createMessage) {
  const { submitForm, isValid, errors } = formikContext;
  if (isValid) {
    submitForm();
  } else {
    const e = Object.keys(errors).map(key => `${key}: ${errors[key]}`);
    createMessage({
      message: e.join(' '),
      severity: 'danger',
      timeToLive: 0,
    });
  }
}
