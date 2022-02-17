/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export type ConceptStatusStateMachineType = Record<ConceptStatusType, string[]>;

// TODO: Check if we can generate enums from backend instead of string
export type ConceptStatusType =
  | 'DRAFT'
  | 'QUALITY_ASSURED'
  | 'PUBLISHED'
  | 'QUEUED_FOR_LANGUAGE'
  | 'ARCHIVED'
  | 'TRANSLATED'
  | 'UNPUBLISHED'
  | string;

export interface ConceptStatus {
  current: ConceptStatusType;
  other: ConceptStatusType[];
}

export interface ConceptQuery {
  query?: string;
  language?: string;
  page?: number;
  'page-size'?: number;
  ids?: string;
  sort?: string;
  fallback?: boolean;
  scrollId?: string;
  subjects?: string;
  tags?: string;
  status?: string;
  users?: string;
  'embed-id'?: number;
  'embed-resource'?: string;
}
