import queryString from 'query-string';

import {
  resolveJsonOrRejectWithError,
  apiResourceUrl,
  fetchAuthorized,
} from '../../util/apiHelpers';
import config from '../../config';

const conceptUrl = apiResourceUrl('/concept-api/v1/concepts');

/*export const searchResources = async query => {
  const response = await fetchAuthorized(
    `${conceptUrl}/?${queryString.stringify(transformQuery(query))}`,
  );
  return resolveJsonOrRejectWithError(response);
};*/

export const fetchAllConcepts = async locale => {
  const response = await fetchAuthorized(`${conceptUrl}?language=${locale}`);
  const concept = await resolveJsonOrRejectWithError(response);
  return concept;
};

export const fetchConcept = async (conceptId, locale) => {
  const response = await fetchAuthorized(
    `${conceptUrl}/${conceptId}?language=${locale}&fallback=true`,
  );
  const concept = await resolveJsonOrRejectWithError(response);
  return concept;
};

export const addConcept = concept =>
  fetchAuthorized(`${conceptUrl}/`, {
    method: 'POST',
    body: JSON.stringify(concept),
  }).then(resolveJsonOrRejectWithError);

export const updateConcept = concept =>
  fetchAuthorized(`${conceptUrl}/${concept.id}`, {
    method: 'PATCH',
    body: JSON.stringify(concept),
  }).then(resolveJsonOrRejectWithError);

export const validateConcept = (id, concept) =>
  fetchAuthorized(`${conceptUrl}/${id}/validate/`, {
    method: 'PUT',
    body: JSON.stringify(concept),
  }).then(resolveJsonOrRejectWithError);
