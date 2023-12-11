/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from 'slate';
import { LinkBlockEmbedData } from '@ndla/types-embed';

export const TYPE_LINK_BLOCK_LIST = 'link-block-list';

export interface LinkBlockListElement {
  type: 'link-block-list';
  data?: LinkBlockEmbedData[];
  isFirstEdit?: boolean;
  children: Descendant[];
}
