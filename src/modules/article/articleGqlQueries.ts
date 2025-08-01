/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { request, gql, Variables } from "graphql-request";
import { useQuery, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import config from "../../config";
import { TRANFSFORM_ARTICLE } from "../../queryKeys";
import { apiResourceUrl } from "../../util/apiHelpers";

const gqlEndpoint = config.localConverter
  ? "http://localhost:4000/graphql-api/graphql"
  : apiResourceUrl("/graphql-api/graphql");

interface UseTransformArticle extends Variables {
  content: string;
  language: string;
  visualElement?: string;
  subject?: string;
  previewH5p?: boolean;
  draftConcept?: boolean;
  absoluteUrl?: boolean;
}

export const transformArticleQueryKeys = {
  transformArticle: (params?: Partial<UseTransformArticle>) => [TRANFSFORM_ARTICLE, params] as const,
};

export const usePreviewArticle = (
  content: string,
  language: string,
  visualElement: string | undefined,
  useDraftConcepts: boolean,
  options?: Partial<UseQueryOptions<string>>,
): UseQueryResult<string> => {
  return useTransformArticle(
    {
      content,
      language,
      visualElement,
      previewH5p: true,
      draftConcept: useDraftConcepts,
      absoluteUrl: true,
    },
    options,
  );
};

const transformArticleMutation = gql`
  mutation transformArticle(
    $content: String!
    $visualElement: String
    $subject: String
    $previewH5p: Boolean
    $draftConcept: Boolean
    $absoluteUrl: Boolean
  ) {
    transformArticleContent(
      content: $content
      visualElement: $visualElement
      subject: $subject
      previewH5p: $previewH5p
      draftConcept: $draftConcept
      absoluteUrl: $absoluteUrl
    )
  }
`;

interface ReturnData {
  transformArticleContent: string;
}

export const useTransformArticle = (
  params: UseTransformArticle,
  options?: Partial<UseQueryOptions<string>>,
): UseQueryResult<string> => {
  return useQuery<string>({
    queryKey: transformArticleQueryKeys.transformArticle(params),
    queryFn: async (): Promise<string> => {
      const res = await request<ReturnData, UseTransformArticle>(gqlEndpoint, transformArticleMutation, params, {
        "Accept-Language": params.language,
      });
      return res.transformArticleContent;
    },
    ...options,
  });
};
