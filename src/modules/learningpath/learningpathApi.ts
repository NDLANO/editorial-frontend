/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  ILearningPathSummaryV2DTO,
  ILearningPathTagsSummaryDTO,
  ILearningPathV2DTO,
  ILearningStepV2DTO,
  INewCopyLearningPathV2DTO,
  INewLearningPathV2DTO,
  INewLearningStepV2DTO,
  ISearchResultV2DTO,
  IUpdatedLearningPathV2DTO,
  IUpdatedLearningStepV2DTO,
  openapi,
} from "@ndla/types-backend/learningpath-api";
import { CopyLearningPathBody, SearchBody } from "./learningpathApiInterfaces";
import { createAuthClient } from "../../util/apiHelpers";
import { resolveJsonOATS } from "../../util/resolveJsonOrRejectWithError";

const client = createAuthClient<openapi.paths>();

export const fetchLearningpath = (id: number, locale?: string): Promise<ILearningPathV2DTO> =>
  client
    .GET("/learningpath-api/v2/learningpaths/{learningpath_id}", {
      params: { path: { learningpath_id: id }, query: { language: locale, fallback: true } },
    })
    .then(resolveJsonOATS);

export const fetchLearningpathTags = async (
  language?: string,
  fallback?: boolean,
): Promise<ILearningPathTagsSummaryDTO> => {
  const res = await client.GET("/learningpath-api/v2/learningpaths/tags", {
    params: { query: { language, fallback } },
  });
  return resolveJsonOATS(res);
};

export const fetchLearningpaths = (ids: number[], language?: string): Promise<ILearningPathV2DTO[]> =>
  client
    .GET("/learningpath-api/v2/learningpaths/ids", {
      params: {
        query: {
          ids,
          language,
          fallback: true,
          page: 1,
          "page-size": ids.length,
        },
      },
    })
    .then(resolveJsonOATS);

export const fetchLearningpathsWithArticle = (id: number): Promise<ILearningPathSummaryV2DTO[]> =>
  client
    .GET("/learningpath-api/v2/learningpaths/contains-article/{article_id}", { params: { path: { article_id: id } } })
    .then(resolveJsonOATS);

export const updateStatusLearningpath = (id: number, status: string, message?: string): Promise<ILearningPathV2DTO> =>
  client
    .PUT("/learningpath-api/v2/learningpaths/{learningpath_id}/status", {
      params: { path: { learningpath_id: id } },
      body: { status, message },
    })
    .then(resolveJsonOATS);

export const updateLearningPathTaxonomy = (id: number, createIfMissing: boolean = false): Promise<ILearningPathV2DTO> =>
  client
    .POST("/learningpath-api/v2/learningpaths/{learningpath_id}/update-taxonomy", {
      params: { path: { learningpath_id: id }, query: { "create-if-missing": createIfMissing } },
    })
    .then(resolveJsonOATS);

export const learningpathSearch = async (query: SearchBody & { ids?: number[] }): Promise<ISearchResultV2DTO> => {
  if (query.ids && query.ids.length === 0) {
    return {
      totalCount: 0,
      page: 1,
      pageSize: 0,
      language: "nb",
      results: [],
    };
  }

  return client.POST("/learningpath-api/v2/learningpaths/search", { body: query }).then(resolveJsonOATS);
};

export const learningpathCopy = (id: number, query: CopyLearningPathBody): Promise<ILearningPathV2DTO> =>
  client
    .POST("/learningpath-api/v2/learningpaths/{learningpath_id}/copy", {
      body: query,
      params: { path: { learningpath_id: id } },
    })
    .then(resolveJsonOATS);

export const postLearningpath = async (learningpath: INewLearningPathV2DTO): Promise<ILearningPathV2DTO> => {
  const res = await client.POST("/learningpath-api/v2/learningpaths", {
    body: learningpath,
  });
  return resolveJsonOATS(res);
};

export const patchLearningpath = async (
  id: number,
  learningpath: IUpdatedLearningPathV2DTO,
): Promise<ILearningPathV2DTO> => {
  const res = await client.PATCH("/learningpath-api/v2/learningpaths/{learningpath_id}", {
    body: learningpath,
    params: { path: { learningpath_id: id } },
  });
  return resolveJsonOATS(res);
};

export const deleteLearningpathLanguage = async (id: number, language: string): Promise<boolean> => {
  const res = await client.DELETE("/learningpath-api/v2/learningpaths/{learningpath_id}/language/{p1}", {
    params: { path: { learningpath_id: id, p1: language } },
  });
  return res.response.ok;
};

export const postLearningStep = async (id: number, step: INewLearningStepV2DTO): Promise<ILearningStepV2DTO> => {
  const res = await client.POST("/learningpath-api/v2/learningpaths/{learningpath_id}/learningsteps", {
    body: step,
    params: { path: { learningpath_id: id } },
  });
  return resolveJsonOATS(res);
};

export const patchLearningStep = async (
  learningpathId: number,
  stepId: number,
  step: IUpdatedLearningStepV2DTO,
): Promise<ILearningStepV2DTO> => {
  const res = await client.PATCH(
    "/learningpath-api/v2/learningpaths/{learningpath_id}/learningsteps/{learningstep_id}",
    {
      body: step,
      params: { path: { learningpath_id: learningpathId, learningstep_id: stepId } },
    },
  );
  return resolveJsonOATS(res);
};

export const deleteLearningStep = async (learningpathId: number, stepId: number): Promise<boolean> => {
  const res = await client.DELETE(
    "/learningpath-api/v2/learningpaths/{learningpath_id}/learningsteps/{learningstep_id}",
    { params: { path: { learningpath_id: learningpathId, learningstep_id: stepId } } },
  );
  return res.response.ok;
};

export const putLearningStepOrder = async (learningpathId: number, stepId: number, seqNo: number): Promise<boolean> => {
  const res = await client.PUT(
    "/learningpath-api/v2/learningpaths/{learningpath_id}/learningsteps/{learningstep_id}/seqNo",
    {
      params: { path: { learningpath_id: learningpathId, learningstep_id: stepId } },
      body: { seqNo },
    },
  );
  return res.response.ok;
};

export const putLearningpathStatus = async (learningpathId: number, status: string): Promise<boolean> => {
  const res = await client.PUT("/learningpath-api/v2/learningpaths/{learningpath_id}/status", {
    params: { path: { learningpath_id: learningpathId } },
    body: { status },
  });
  return res.response.ok;
};

export const postCopyLearningpath = async (
  learningpathId: number,
  learningpath: INewCopyLearningPathV2DTO,
): Promise<ILearningPathV2DTO> => {
  const res = await client.POST("/learningpath-api/v2/learningpaths/{learningpath_id}/copy", {
    params: { path: { learningpath_id: learningpathId } },
    body: learningpath,
  });

  return resolveJsonOATS(res);
};
