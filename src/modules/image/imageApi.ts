/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  IImageMetaInformationV3DTO,
  IUpdateImageMetaInformationDTO,
  ISearchResultV3DTO,
  ITagsSearchResultDTO,
  ISearchParamsDTO,
  INewImageMetaInformationV2DTO,
  openapi,
} from "@ndla/types-backend/image-api";
import { StringSort } from "../../containers/SearchPage/components/form/SearchForm";
import { throwErrorPayload, createAuthClient } from "../../util/apiHelpers";
import { resolveJsonOATS, resolveOATS } from "../../util/resolveJsonOrRejectWithError";
import { createFormData } from "../../util/formDataHelper";

const client = createAuthClient<openapi.paths>();

export const postImage = async (
  metadata: INewImageMetaInformationV2DTO,
  file: Blob,
): Promise<IImageMetaInformationV3DTO> => {
  const res = await client.POST("/image-api/v3/images", {
    body: {
      metadata,
      file,
    },
    bodySerializer(body) {
      return createFormData(body.file, body.metadata);
    },
  });

  return resolveJsonOATS(res);
};

export const fetchImage = (id: number | string, language?: string): Promise<IImageMetaInformationV3DTO> =>
  client
    .GET("/image-api/v3/images/{image_id}", {
      params: {
        path: {
          image_id: typeof id === "string" ? Number(id) : id,
        },
        query: {
          language,
        },
      },
    })
    .then((r) => resolveJsonOATS(r));

export const updateImage = async (
  id: number,
  metadata: IUpdateImageMetaInformationDTO,
  file?: Blob | string,
): Promise<IImageMetaInformationV3DTO> =>
  client
    .PATCH("/image-api/v3/images/{image_id}", {
      params: {
        path: {
          image_id: id,
        },
      },
      body: {
        metadata,
        file: file instanceof Blob ? file : undefined,
      },
      bodySerializer(body) {
        return createFormData(body.file, body.metadata);
      },
    })
    .then((r) => resolveJsonOATS(r));

export const postSearchImages = async (body: StringSort<ISearchParamsDTO>): Promise<ISearchResultV3DTO> =>
  client
    .POST("/image-api/v3/images/search", {
      body: {
        ...body,
        // @ts-expect-error TODO: API's use different sorting types and we share them in the frontend
        sort: body.sort,
      },
    })
    .then((r) => resolveJsonOATS(r));

export const onError = (err: Response & Error) => {
  throwErrorPayload(err.status, err.message ?? err.statusText, err);
};

export const deleteLanguageVersionImage = async (
  imageId: number,
  locale: string,
): Promise<IImageMetaInformationV3DTO | void> => {
  return client
    .DELETE("/image-api/v3/images/{image_id}/language/{language}", {
      params: {
        path: {
          image_id: imageId,
          language: locale,
        },
      },
    })
    .then((r) => resolveOATS(r));
};

export const fetchSearchTags = async (input: string, language: string): Promise<ITagsSearchResultDTO> =>
  client
    .GET("/image-api/v3/images/tag-search", {
      params: {
        query: {
          query: input,
          language,
        },
      },
    })
    .then((r) => resolveJsonOATS(r));

export const cloneImage = async (imageId: number, file: Blob): Promise<IImageMetaInformationV3DTO> =>
  client
    .POST("/image-api/v3/images/{image_id}/copy", {
      body: {
        file,
      },
      bodySerializer(body) {
        return createFormData(body.file, undefined);
      },
      params: {
        path: {
          image_id: imageId,
        },
      },
    })
    .then((r) => resolveJsonOATS(r));
