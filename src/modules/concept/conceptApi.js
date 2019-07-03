
import {
    resolveJsonOrRejectWithError,
    apiResourceUrl,
    fetchAuthorized,
  } from '../../util/apiHelpers';
  import config from '../../config';

  const conceptUrl = apiResourceUrl('/concept-api/v1/concepts');
  
  export const searchConcepts = (id, locale) =>
    fetchAuthorized(
      `${conceptUrl}/${id}?language=${locale}`,
    ).then(resolveJsonOrRejectWithError);
  
  /*export const searchRelatedArticles = async (input, locale, contentType) => {
    await new Promise(resolve => setTimeout(resolve, 50));
    const query = `&type=articles&query=${input}${
      contentType ? `&content-type=${contentType}` : ''
    }`;
    const response = await searchArticles('', locale, query);
  
    return response.results;
  };*/
  
  export const getArticle = (id) =>
    fetchAuthorized(`${conceptUrl}/${id}`).then(
      resolveJsonOrRejectWithError,
    );
  
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
  
  export const fetchConcept = async (conceptId) => {
    const response = await fetchAuthorized(
      `${conceptUrl}/${conceptId}`,
    );
    const concept = await resolveJsonOrRejectWithError(response);
    return concept;
  };
  