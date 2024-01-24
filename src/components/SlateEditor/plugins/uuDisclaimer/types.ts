/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from 'slate';
import { EmbedData } from '@ndla/types-embed';

export const TYPE_DISCLAIMER = 'disclaimer-block';

export interface DisclaimerElement {
  type: 'disclaimer-block';
  data?: EmbedData;
  children: Descendant[];
}
