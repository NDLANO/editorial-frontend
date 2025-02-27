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
import { TYPE_QUOTE } from "../blockquote/types";
import { TYPE_COMMENT_INLINE } from "../comment/inline/types";
import { TYPE_CONCEPT_INLINE } from "../concept/inline/types";
import { TYPE_FOOTNOTE } from "../footnote/types";
import { TYPE_CONTENT_LINK } from "../link/types";
import { MATH_ELEMENT_TYPE } from "../mathml/mathTypes";

export const listSerializer = _listSerializer.configure({
  inlineTypes: [
    TYPE_CONCEPT_INLINE,
    TYPE_FOOTNOTE,
    LINK_ELEMENT_TYPE,
    TYPE_CONTENT_LINK,
    MATH_ELEMENT_TYPE,
    TYPE_COMMENT_INLINE,
  ],
});

export const listPlugin = _listPlugin.configure({
  options: {
    allowedListItemFirstChildTypes: [PARAGRAPH_ELEMENT_TYPE, HEADING_ELEMENT_TYPE, TYPE_QUOTE],
  },
});
