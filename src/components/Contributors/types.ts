/*
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export interface ContributorType {
  name: string;
  type: string;
  focusOnMount?: boolean | null;
}

export type ContributorFieldName = keyof ContributorType;
