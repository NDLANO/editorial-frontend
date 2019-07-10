import queryString from 'query-string';

import {
  resolveJsonOrRejectWithError,
  apiResourceUrl,
  fetchAuthorized,
} from '../../util/apiHelpers';
import config from '../../config';

const conceptUrl = apiResourceUrl('/concept-api/v1/concepts');

/*export const searchConcepts = (id, locale) =>
  fetchAuthorized(`${conceptUrl}/${id}?language=${locale}`).then(
    resolveJsonOrRejectWithError,
  );*/

export const searchResources = async query => {
  const response = await fetchAuthorized(
    `${conceptUrl}/?${queryString.stringify(transformQuery(query))}`,
  );
  return resolveJsonOrRejectWithError(response);
};
/*export const searchRelatedArticles = async (input, locale, contentType) => {
    await new Promise(resolve => setTimeout(resolve, 50));
    const query = `&type=articles&query=${input}${
      contentType ? `&content-type=${contentType}` : ''
    }`;
    const response = await searchArticles('', locale, query);
  
    return response.results;
  };*/

/*export const fetchConcept = (id, locale) =>
    fetchAuthorized(`${conceptUrl}/${id}?language=${locale}`).then(
      resolveJsonOrRejectWithError,
    );*/

/*const articleConverterUrl = config.localConverter
    ? 'http://localhost:3100/article-converter'
    : apiResourceUrl('/article-converter');*/

/* export const getArticleFromArticleConverter = (id, locale) =>
    fetchAuthorized(`${articleConverterUrl}/json/${locale}/${id}`).then(
      resolveJsonOrRejectWithError,
    );*/

/*export const getPreviewArticle = async (article, locale) => {
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
  };*/

export const fetchAllConcepts = async (locale) => {
  const response = await fetchAuthorized(
    `${conceptUrl}?language=${locale}`,
  );
  const concept = await resolveJsonOrRejectWithError(response);
  return concept;
};

export const fetchConcept = async (conceptId, locale) => {
  const response = await fetchAuthorized(
    `${conceptUrl}/${conceptId}?language=${locale}`,
  );
  const concept = await resolveJsonOrRejectWithError(response);
  return concept;
};

export const addConcept = concept => {
  fetchAuthorized(`${conceptUrl}/`, {
    method: 'POST',
    body: JSON.stringify(concept),
  }).then(resolveJsonOrRejectWithError);
};
