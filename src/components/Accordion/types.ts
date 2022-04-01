/*
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { SerializedStyles } from '@emotion/core';

export enum ButtonAppearance {
  FILL = 'fill',
  RESOURCEGROUP = 'resourceGroup',
  TAXONOMY = 'taxonomy',
}

export type AppearanceMap = {
  [key in ButtonAppearance]: SerializedStyles;
};
