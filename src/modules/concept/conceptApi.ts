/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  ConceptDTO,
  DraftConceptSearchParamsDTO,
  ConceptSearchResultDTO,
  NewConceptDTO,
  TagsSearchResultDTO,
  UpdatedConceptDTO,
  openapi,
} from "@ndla/types-backend/concept-api";
import { ConceptStatusStateMachineType, StringSort } from "../../interfaces";
import { createAuthClient } from "../../util/apiHelpers";
import { resolveJsonOATS } from "../../util/resolveJsonOrRejectWithError";

const client = createAuthClient<openapi.paths>();

export const fetchSearchTags = async (query: string, language: string): Promise<TagsSearchResultDTO> =>
  client
    .GET("/concept-api/v1/drafts/tag-search", {
      params: {
        query: {
          language,
          query,
          fallback: true,
        },
      },
    })
    .then(resolveJsonOATS);

export const fetchAllTags = async (language: string): Promise<string[]> =>
  client
    .GET("/concept-api/v1/drafts/tags", {
      params: {
        query: {
          language,
          fallback: true,
        },
      },
    })
    .then(resolveJsonOATS);

export const fetchConcept = async (conceptId: number, locale?: string): Promise<ConceptDTO> =>
  client
    .GET("/concept-api/v1/drafts/{concept_id}", {
      params: {
        path: {
          concept_id: conceptId,
        },
        query: {
          language: locale,
          fallback: true,
        },
      },
    })
    .then(resolveJsonOATS);

export const addConcept = async (concept: NewConceptDTO): Promise<ConceptDTO> =>
  client.POST("/concept-api/v1/drafts", { body: concept }).then(resolveJsonOATS);

export const updateConcept = async (id: number, concept: UpdatedConceptDTO): Promise<ConceptDTO> =>
  client
    .PATCH("/concept-api/v1/drafts/{concept_id}", {
      params: {
        path: {
          concept_id: id,
        },
      },
      body: concept,
    })
    .then(resolveJsonOATS);

export const deleteLanguageVersionConcept = async (conceptId: number, language: string): Promise<ConceptDTO> =>
  client
    .DELETE("/concept-api/v1/drafts/{concept_id}", {
      params: { path: { concept_id: conceptId }, query: { language } },
    })
    .then(resolveJsonOATS);

export const fetchStatusStateMachine = async (): Promise<ConceptStatusStateMachineType> =>
  client.GET("/concept-api/v1/drafts/status-state-machine").then(resolveJsonOATS);

export const updateConceptStatus = async (id: number, status: string): Promise<ConceptDTO> =>
  client
    .PUT("/concept-api/v1/drafts/{concept_id}/status/{STATUS}", {
      params: { path: { concept_id: id, STATUS: status } },
    })
    .then(resolveJsonOATS);

export const postSearchConcepts = async (
  body: StringSort<DraftConceptSearchParamsDTO>,
): Promise<ConceptSearchResultDTO> =>
  client
    .POST("/concept-api/v1/drafts/search", {
      body: {
        ...body,
        // @ts-expect-error TODO: API's use different sorting types and we share them in the frontend
        sort: body.sort,
      },
    })
    .then(resolveJsonOATS);
