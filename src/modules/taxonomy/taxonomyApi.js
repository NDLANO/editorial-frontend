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
import {
  createResource,
  createDeleteResourceTypes,
  createDeleteUpdateFilters,
  createDeleteUpdateTopicResources,
} from '.';

const resolveTaxonomyJsonOrRejectWithError = res =>
  resolveJsonOrRejectWithError(res, true);

const baseUrl = apiResourceUrl('/taxonomy/v1');

function fetchTopicArticle(topicId, locale) {
  return fetchAuthorized(
    `${baseUrl}/topics/${topicId}/?language=${locale}`,
  ).then(resolveJsonOrRejectWithError);
}

/* Option items */
function fetchResourceTypes(locale) {
  return fetchAuthorized(`${baseUrl}/resource-types/?language=${locale}`).then(
    resolveJsonOrRejectWithError,
  );
}

function fetchFilters(locale) {
  return fetchAuthorized(`${baseUrl}/filters/?language=${locale}`).then(
    resolveJsonOrRejectWithError,
  );
}

function fetchRelevances(locale) {
  return fetchAuthorized(`${baseUrl}/relevances/?language=${locale}`).then(
    resolveJsonOrRejectWithError,
  );
}

/* Queries */
function queryResources(articleId, language) {
  return fetchAuthorized(
    `${baseUrl}/queries/resources/?contentURI=${encodeURIComponent(
      `urn:article:${articleId}`,
    )}&?language=${language}`,
  ).then(resolveJsonOrRejectWithError);
}

/* Taxonomy actions */
async function updateTaxonomy(taxonomy, allTopics) {
  try {
    let resource = await queryResources(taxonomy.articleId, taxonomy.language);
    if (
      resource.length === 0 &&
      (taxonomy.resourceTypes.length > 0 ||
        taxonomy.filter.length > 0 ||
        taxonomy.topics.length > 0)
    ) {
      await createResource({
        contentUri: `urn:article:${taxonomy.articleId}`,
        name: taxonomy.articleName,
      });
      resource = await queryResources(taxonomy.articleId, taxonomy.language);
      // resource = [{ id: resourceId.replace(/(\/v1\/resources\/)/, '') }];
      return true;
    }
    if (resource.length !== 0 && resource[0].id) {
      createDeleteResourceTypes(
        resource[0].id,
        taxonomy.resourceTypes,
        taxonomy.language,
      );

      createDeleteUpdateFilters(
        resource[0].id,
        taxonomy.filter,
        taxonomy.language,
      );

      createDeleteUpdateTopicResources(
        resource[0].id,
        taxonomy.topics,
        taxonomy.language,
        allTopics,
      );
      return true;
    }
    return false;
  } catch (e) {
    throw new Error(e);
  }
}

export {
  resolveTaxonomyJsonOrRejectWithError,
  fetchResourceTypes,
  fetchFilters,
  fetchTopicArticle,
  fetchRelevances,
  queryResources,
  updateTaxonomy,
};
