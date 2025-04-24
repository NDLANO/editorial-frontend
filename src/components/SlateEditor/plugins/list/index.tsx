/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  listSerializer as _listSerializer,
  listPlugin as _listPlugin,
  LINK_ELEMENT_TYPE,
  PARAGRAPH_ELEMENT_TYPE,
  HEADING_ELEMENT_TYPE,
} from "@ndla/editor";
import { BLOCK_QUOTE_ELEMENT_TYPE } from "../blockquote/blockquoteTypes";
import { COMMENT_INLINE_ELEMENT_TYPE } from "../comment/inline/types";
import { CONCEPT_INLINE_ELEMENT_TYPE } from "../concept/inline/types";
import { FOOTNOTE_ELEMENT_TYPE } from "../footnote/types";
import { CONTENT_LINK_ELEMENT_TYPE } from "../link/types";
import { MATH_ELEMENT_TYPE } from "../mathml/mathTypes";

export const listSerializer = _listSerializer.configure({
  inlineTypes: [
    CONCEPT_INLINE_ELEMENT_TYPE,
    FOOTNOTE_ELEMENT_TYPE,
    LINK_ELEMENT_TYPE,
    CONTENT_LINK_ELEMENT_TYPE,
    MATH_ELEMENT_TYPE,
    COMMENT_INLINE_ELEMENT_TYPE,
  ],
});

export const listPlugin = _listPlugin.configure({
  options: {
    allowedListItemFirstChildTypes: [PARAGRAPH_ELEMENT_TYPE, HEADING_ELEMENT_TYPE, BLOCK_QUOTE_ELEMENT_TYPE],
  },
});
