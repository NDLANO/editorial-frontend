/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Element } from "slate";
import { jsx as slatejsx } from "slate-hyperscript";
import { ElementType } from "../interfaces";
import { ASIDE_ELEMENT_TYPE } from "../plugins/aside/asideTypes";
import { AUDIO_ELEMENT_TYPE } from "../plugins/audio/audioTypes";
import { CODE_BLOCK_ELEMENT_TYPE } from "../plugins/codeBlock/types";
import { COMMENT_BLOCK_ELEMENT_TYPE } from "../plugins/comment/block/types";
import { DETAILS_ELEMENT_TYPE } from "../plugins/details/detailsTypes";
import { TYPE_EMBED_ERROR } from "../plugins/embed/types";
import { TYPE_EXTERNAL } from "../plugins/external/types";
import { FILE_ELEMENT_TYPE } from "../plugins/file/types";
import { TYPE_GRID } from "../plugins/grid/types";
import { H5P_ELEMENT_TYPE } from "../plugins/h5p/types";
import { TYPE_HEADING } from "../plugins/heading/types";
import { TYPE_LIST } from "../plugins/list/types";
import { TYPE_PARAGRAPH } from "../plugins/paragraph/types";
import { SPAN_ELEMENT_TYPE } from "../plugins/span/types";
import { TYPE_TABLE } from "../plugins/table/types";
import { BRIGHTCOVE_ELEMENT_TYPE } from "../plugins/video/types";
import { TYPE_CONCEPT_INLINE } from "../plugins/concept/inline/types";
import { COMMENT_INLINE_ELEMENT_TYPE } from "../plugins/comment/inline/types";
import { TYPE_CONTENT_LINK, TYPE_LINK } from "../plugins/link/types";
import { FRAMED_CONTENT_ELEMENT_TYPE } from "../plugins/framedContent/framedContentTypes";
import { BLOCK_QUOTE_ELEMENT_TYPE } from "../plugins/blockquote/blockquoteTypes";
import { REPHRASE_ELEMENT_TYPE } from "../plugins/rephrase/rephraseTypes";
import { DEFINITION_LIST_ELEMENT_TYPE } from "../plugins/definitionList/definitionListTypes";

export const firstTextBlockElement: Element["type"][] = [TYPE_PARAGRAPH, TYPE_HEADING, BLOCK_QUOTE_ELEMENT_TYPE];

export const textBlockElements: Element["type"][] = [
  TYPE_PARAGRAPH,
  TYPE_HEADING,
  TYPE_LIST,
  BLOCK_QUOTE_ELEMENT_TYPE,
  TYPE_TABLE,
  AUDIO_ELEMENT_TYPE,
  BRIGHTCOVE_ELEMENT_TYPE,
  TYPE_EXTERNAL,
  TYPE_EMBED_ERROR,
  H5P_ELEMENT_TYPE,
  FILE_ELEMENT_TYPE,
  CODE_BLOCK_ELEMENT_TYPE,
  ASIDE_ELEMENT_TYPE,
  FRAMED_CONTENT_ELEMENT_TYPE,
  DETAILS_ELEMENT_TYPE,
  DEFINITION_LIST_ELEMENT_TYPE,
  TYPE_GRID,
  REPHRASE_ELEMENT_TYPE,
  SPAN_ELEMENT_TYPE,
];

export const inlineElements: Element["type"][] = [
  TYPE_CONCEPT_INLINE,
  COMMENT_INLINE_ELEMENT_TYPE,
  TYPE_LINK,
  TYPE_CONTENT_LINK,
  REPHRASE_ELEMENT_TYPE,
];

export const lastTextBlockElement: Element["type"][] = [TYPE_PARAGRAPH];

export const afterOrBeforeTextBlockElement: Element["type"][] = [
  TYPE_PARAGRAPH,
  TYPE_HEADING,
  COMMENT_BLOCK_ELEMENT_TYPE,
];

export const createNode = (type: ElementType, attributes?: Partial<Element>) =>
  slatejsx("element", { ...attributes, type });
