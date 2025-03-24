/**
 * Copyright (c) 2021-present, NDLA.
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
import { TYPE_CODEBLOCK } from "../plugins/codeBlock/types";
import { TYPE_COMMENT_BLOCK } from "../plugins/comment/block/types";
import { TYPE_DEFINITION_LIST } from "../plugins/definitionList/types";
import { TYPE_DETAILS } from "../plugins/details/types";
import { TYPE_EMBED_ERROR } from "../plugins/embed/types";
import { TYPE_EXTERNAL } from "../plugins/external/types";
import { TYPE_FILE } from "../plugins/file/types";
import { TYPE_GRID } from "../plugins/grid/types";
import { TYPE_H5P } from "../plugins/h5p/types";
import { TYPE_HEADING } from "../plugins/heading/types";
import { TYPE_LIST } from "../plugins/list/types";
import { TYPE_PARAGRAPH } from "../plugins/paragraph/types";
import { TYPE_SPAN } from "../plugins/span/types";
import { TYPE_TABLE } from "../plugins/table/types";
import { TYPE_EMBED_BRIGHTCOVE } from "../plugins/video/types";
import { TYPE_CONCEPT_INLINE } from "../plugins/concept/inline/types";
import { TYPE_COMMENT_INLINE } from "../plugins/comment/inline/types";
import { TYPE_CONTENT_LINK, TYPE_LINK } from "../plugins/link/types";
import { FRAMED_CONTENT_ELEMENT_TYPE } from "../plugins/framedContent/framedContentTypes";
import { REPHRASE_ELEMENT_TYPE } from "../plugins/rephrase";
import { BLOCK_QUOTE_ELEMENT_TYPE } from "../plugins/blockquote/blockquoteTypes";

export const firstTextBlockElement: Element["type"][] = [TYPE_PARAGRAPH, TYPE_HEADING, BLOCK_QUOTE_ELEMENT_TYPE];

export const textBlockElements: Element["type"][] = [
  TYPE_PARAGRAPH,
  TYPE_HEADING,
  TYPE_LIST,
  BLOCK_QUOTE_ELEMENT_TYPE,
  TYPE_TABLE,
  AUDIO_ELEMENT_TYPE,
  TYPE_EMBED_BRIGHTCOVE,
  TYPE_EXTERNAL,
  TYPE_EMBED_ERROR,
  TYPE_H5P,
  TYPE_FILE,
  TYPE_CODEBLOCK,
  ASIDE_ELEMENT_TYPE,
  FRAMED_CONTENT_ELEMENT_TYPE,
  TYPE_DETAILS,
  TYPE_DEFINITION_LIST,
  TYPE_GRID,
  TYPE_SPAN,
];

export const inlineElements: Element["type"][] = [
  TYPE_CONCEPT_INLINE,
  TYPE_COMMENT_INLINE,
  TYPE_LINK,
  TYPE_CONTENT_LINK,
  REPHRASE_ELEMENT_TYPE,
];

export const lastTextBlockElement: Element["type"][] = [TYPE_PARAGRAPH];

export const afterOrBeforeTextBlockElement: Element["type"][] = [TYPE_PARAGRAPH, TYPE_HEADING, TYPE_COMMENT_BLOCK];

export const createNode = (type: ElementType, attributes?: Partial<Element>) =>
  slatejsx("element", { ...attributes, type });
