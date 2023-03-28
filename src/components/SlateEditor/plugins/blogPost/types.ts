/*
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from 'slate';
import { BlogPostEmbedData } from '@ndla/types-embed';

export const TYPE_BLOGPOST = 'blog-post';

export interface BlogPostElement {
  type: 'blog-post';
  data?: BlogPostEmbedData;
  isFirstEdit: boolean;
  children: Descendant[];
}
