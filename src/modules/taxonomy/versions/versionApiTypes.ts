/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export interface VersionType {
  id: string;
  versionType: VersionStatusType;
  name: string;
  hash: string;
  locked: boolean;
  published?: string;
  archived?: string;
}

export interface VersionPostBody {
  name: string;
  locked?: boolean;
}

export interface VersionPutBody {
  name?: string;
  locked?: boolean;
}

export interface GetVersionsParams {
  type?: VersionStatusType;
}

export type VersionStatusType = 'BETA' | 'ARCHIVED' | 'PUBLISHED';
