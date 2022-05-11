/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  VersionPostBody,
  VersionPutBody,
  VersionType,
} from '../../modules/taxonomy/versions/versionApiTypes';

export interface VersionFormType {
  name: string;
  locked: boolean;
  sourceId?: string;
}

export const versionTypeToVersionFormType = (version?: VersionType): VersionFormType => {
  return {
    name: version?.name ?? '',
    locked: !!version?.locked,
  };
};

export const versionFormTypeToVersionPutType = (formVersion: VersionFormType): VersionPutBody => {
  return {
    name: formVersion.name,
    locked: formVersion.locked,
  };
};

export const versionFormTypeToVersionPostType = (formVersion: VersionFormType): VersionPostBody => {
  return {
    name: formVersion.name,
    locked: formVersion.locked,
  };
};
