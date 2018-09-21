/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  resolveJsonOrRejectWithError,
  apiResourceUrl,
  fetchAuthorized,
} from '../../util/apiHelpers';
import config from '../../config';
import formatDate from '../../util/formatDate';

const articleUrl = apiResourceUrl('/article-api/v2/articles');
const conceptUrl = apiResourceUrl('/article-api/v1/concepts');

export const searchArticles = (id, locale, queryString = '') =>
  fetchAuthorized(
    `${articleUrl}/${id}?language=${locale}&fallback=true${queryString}`,
  ).then(resolveJsonOrRejectWithError);

export const searchRelatedArticles = async (input, locale, contentType) => {
  await new Promise(resolve => setTimeout(resolve, 50));
  const query = `&type=articles&query=${input}${
    contentType ? `&content-type=${contentType}` : ''
  }`;
  const response = await searchArticles('', locale, query);

  return response.results;
};

export const getArticle = id =>
  fetchAuthorized(`${articleUrl}/${id}`).then(resolveJsonOrRejectWithError);

export const getPreviewArticle = async (article, locale) => {
  const articleConverterUrl = config.localConverter
    ? 'http://localhost:3100/article-converter'
    : apiResourceUrl('/article-converter');
  const response = await fetchAuthorized(
    `${articleConverterUrl}/json/${locale}/transform-article`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({ article }),
    },
  );
  return resolveJsonOrRejectWithError(response);
};

export const fetchConcept = async (conceptId, language) => {
  const response = await fetchAuthorized(
    `${conceptUrl}/${conceptId}?language=${language}`,
  );
  const concept = await resolveJsonOrRejectWithError(response);
  return concept;
};

export const articleConverter = (
  {
    metaDescription = {},
    content = {},
    introduction = {},
    title = {},
    tags = {},
    visualElement = {},
    created,
    updated,
    ...rest
  },
  language,
) => ({
  ...rest,
  introduction: introduction.introduction,
  metaDescription: metaDescription.metaDescription,
  visualElement: visualElement.visualElement || {},
  title: title.title,
  content: content.content,
  tags: tags.tags || [],
  footnotes: content.footNotes,
  created: formatDate(created, language),
  updated: formatDate(updated, language),
});
