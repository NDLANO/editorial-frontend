/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { request, gql } from 'graphql-request';
import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query';
import config from '../../config';
import { apiResourceUrl } from '../../util/apiHelpers';

const gqlEndpoint = config.localConverter
  ? 'http://localhost:4000/graphql-api/graphql'
  : apiResourceUrl('/graphql-api/graphql');

interface UseTransformArticle {
  content: string;
  language: string;
  visualElement?: string;
  subject?: string;
  previewH5p?: boolean;
  draftConcept?: boolean;
  absoluteUrl?: boolean;
}

export const transformArticleQueryKey = (params?: Partial<UseTransformArticle>) => [
  'TRANSFORM_ARTICLE',
  params,
];

export const usePreviewArticle = (
  content: string,
  language: string,
  visualElement?: string,
  options?: UseQueryOptions<string>,
): UseQueryResult<string> => {
  return useTransformArticle(
    {
      content,
      language,
      visualElement,
      previewH5p: true,
      draftConcept: true,
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

export const useTransformArticle = (
  params: UseTransformArticle,
  options?: UseQueryOptions<string>,
): UseQueryResult<string> => {
  return useQuery<string>(
    ['TRANSFORM_ARTICLE', params],
    async (): Promise<string> => {
      const res = await request(gqlEndpoint, transformArticleMutation, params, {
        'Accept-Language': params.language,
      });
      return res.transformArticleContent;
    },
    options,
  );
};
