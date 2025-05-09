/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ElementType } from "./interfaces";
import { ASIDE_ELEMENT_TYPE } from "./plugins/aside/asideTypes";
import { AUDIO_ELEMENT_TYPE } from "./plugins/audio/audioTypes";
import { CAMPAIGN_BLOCK_ELEMENT_TYPE } from "./plugins/campaignBlock/types";
import { CODE_BLOCK_ELEMENT_TYPE } from "./plugins/codeBlock/types";
import { COMMENT_INLINE_ELEMENT_TYPE } from "./plugins/comment/inline/types";
import { CONCEPT_INLINE_ELEMENT_TYPE } from "./plugins/concept/inline/types";
import { DETAILS_ELEMENT_TYPE } from "./plugins/details/detailsTypes";
import { TYPE_EMBED_ERROR } from "./plugins/embed/types";
import { EXTERNAL_ELEMENT_TYPE, IFRAME_ELEMENT_TYPE } from "./plugins/external/types";
import { FILE_ELEMENT_TYPE } from "./plugins/file/types";
import { FOOTNOTE_ELEMENT_TYPE } from "./plugins/footnote/types";
import { FRAMED_CONTENT_ELEMENT_TYPE } from "./plugins/framedContent/framedContentTypes";
import { GRID_ELEMENT_TYPE } from "./plugins/grid/types";
import { H5P_ELEMENT_TYPE } from "./plugins/h5p/types";
import { IMAGE_ELEMENT_TYPE } from "./plugins/image/types";
import { KEY_FIGURE_ELEMENT_TYPE } from "./plugins/keyFigure/types";
import { LINK_ELEMENT_TYPE, CONTENT_LINK_ELEMENT_TYPE } from "./plugins/link/types";
import { MATH_ELEMENT_TYPE } from "./plugins/mathml/mathTypes";
import { REPHRASE_ELEMENT_TYPE } from "./plugins/rephrase/rephraseTypes";
import { PITCH_ELEMENT_TYPE } from "./plugins/pitch/types";
import { RELATED_ELEMENT_TYPE } from "./plugins/related/types";
import { SPAN_ELEMENT_TYPE } from "./plugins/span/types";
import { TYPE_TABLE } from "./plugins/table/types";
import { BRIGHTCOVE_ELEMENT_TYPE } from "./plugins/video/types";
import { SYMBOL_ELEMENT_TYPE } from "./plugins/symbol/types";

export const inlines: ElementType[] = [
  CONCEPT_INLINE_ELEMENT_TYPE,
  FOOTNOTE_ELEMENT_TYPE,
  LINK_ELEMENT_TYPE,
  CONTENT_LINK_ELEMENT_TYPE,
  MATH_ELEMENT_TYPE,
  REPHRASE_ELEMENT_TYPE,
  SPAN_ELEMENT_TYPE,
  COMMENT_INLINE_ELEMENT_TYPE,
  SYMBOL_ELEMENT_TYPE,
];

export const blocks: ElementType[] = [
  ASIDE_ELEMENT_TYPE,
  FRAMED_CONTENT_ELEMENT_TYPE,
  CODE_BLOCK_ELEMENT_TYPE,
  DETAILS_ELEMENT_TYPE,
  AUDIO_ELEMENT_TYPE,
  BRIGHTCOVE_ELEMENT_TYPE,
  TYPE_EMBED_ERROR,
  EXTERNAL_ELEMENT_TYPE,
  IFRAME_ELEMENT_TYPE,
  H5P_ELEMENT_TYPE,
  IMAGE_ELEMENT_TYPE,
  FILE_ELEMENT_TYPE,
  RELATED_ELEMENT_TYPE,
  TYPE_TABLE,
  PITCH_ELEMENT_TYPE,
  GRID_ELEMENT_TYPE,
  KEY_FIGURE_ELEMENT_TYPE,
  CAMPAIGN_BLOCK_ELEMENT_TYPE,
];
