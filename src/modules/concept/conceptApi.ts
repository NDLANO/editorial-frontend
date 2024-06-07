/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  IConcept,
  IDraftConceptSearchParams,
  IConceptSearchResult,
  INewConcept,
  ITagsSearchResult,
  IUpdatedConcept,
} from "@ndla/types-backend/concept-api";
import { StringSort } from "../../containers/SearchPage/components/form/SearchForm";
import { ConceptStatusStateMachineType } from "../../interfaces";
import { resolveJsonOrRejectWithError, apiResourceUrl, fetchAuthorized } from "../../util/apiHelpers";

const draftConceptUrl: string = apiResourceUrl("/concept-api/v1/drafts");

export const fetchSearchTags = async (input: string, language: string): Promise<ITagsSearchResult> => {
  const response = await fetchAuthorized(
    `${draftConceptUrl}/tag-search/?language=${language}&query=${input}&fallback=true`,
  );
  return resolveJsonOrRejectWithError(response);
};

export const fetchAllTags = async (language: string): Promise<string[]> => {
  const response = await fetchAuthorized(`${draftConceptUrl}/tags/?language=${language}&fallback=true`);
  return resolveJsonOrRejectWithError(response);
};

export const fetchAllSubjects = async (): Promise<string[]> => {
  const response = await fetchAuthorized(`${draftConceptUrl}/subjects/`);
  return resolveJsonOrRejectWithError(response);
};

export const fetchConcept = async (conceptId: string | number, locale?: string): Promise<IConcept> => {
  const languageParam = locale ? `language=${locale}&` : "";
  return fetchAuthorized(`${draftConceptUrl}/${conceptId}?${languageParam}fallback=true`).then((r) =>
    resolveJsonOrRejectWithError<IConcept>(r),
  );
};

export const addConcept = async (concept: INewConcept): Promise<IConcept> =>
  fetchAuthorized(`${draftConceptUrl}/`, {
    method: "POST",
    body: JSON.stringify(concept),
  }).then((r) => resolveJsonOrRejectWithError<IConcept>(r));

export const updateConcept = async (id: number, concept: IUpdatedConcept): Promise<IConcept> =>
  fetchAuthorized(`${draftConceptUrl}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(concept),
  }).then((r) => resolveJsonOrRejectWithError<IConcept>(r));

export const deleteLanguageVersionConcept = async (conceptId: number, language: string): Promise<IConcept> =>
  fetchAuthorized(`${draftConceptUrl}/${conceptId}?language=${language}`, {
    method: "DELETE",
  }).then((r) => resolveJsonOrRejectWithError<IConcept>(r));

export const fetchStatusStateMachine = async (): Promise<ConceptStatusStateMachineType> =>
  fetchAuthorized(`${draftConceptUrl}/status-state-machine/`).then((r) =>
    resolveJsonOrRejectWithError<ConceptStatusStateMachineType>(r),
  );

export const updateConceptStatus = async (id: number, status: string): Promise<IConcept> =>
  fetchAuthorized(`${draftConceptUrl}/${id}/status/${status}`, {
    method: "PUT",
  }).then((r) => resolveJsonOrRejectWithError<IConcept>(r));

export const postSearchConcepts = async (
  body: StringSort<IDraftConceptSearchParams>,
): Promise<IConceptSearchResult> => {
  const response = await fetchAuthorized(`${draftConceptUrl}/search/`, {
    method: "POST",
    body: JSON.stringify(body),
  });
  return resolveJsonOrRejectWithError(response);
};
