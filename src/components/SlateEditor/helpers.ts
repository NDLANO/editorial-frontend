/**
 * Copyright (c) 2021-present, NDLA.
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
import { TYPE_CONCEPT_INLINE } from "./plugins/concept/inline/types";
import { DETAILS_ELEMENT_TYPE } from "./plugins/details/detailsTypes";
import { TYPE_EMBED_ERROR } from "./plugins/embed/types";
import { TYPE_EXTERNAL } from "./plugins/external/types";
import { FILE_ELEMENT_TYPE } from "./plugins/file/types";
import { TYPE_FOOTNOTE } from "./plugins/footnote/types";
import { FRAMED_CONTENT_ELEMENT_TYPE } from "./plugins/framedContent/framedContentTypes";
import { TYPE_GRID } from "./plugins/grid/types";
import { H5P_ELEMENT_TYPE } from "./plugins/h5p/types";
import { TYPE_IMAGE } from "./plugins/image/types";
import { TYPE_KEY_FIGURE } from "./plugins/keyFigure/types";
import { TYPE_LINK, TYPE_CONTENT_LINK } from "./plugins/link/types";
import { MATH_ELEMENT_TYPE } from "./plugins/mathml/mathTypes";
import { TYPE_PITCH } from "./plugins/pitch/types";
import { TYPE_RELATED } from "./plugins/related/types";
import { TYPE_SPAN } from "./plugins/span/types";
import { TYPE_TABLE } from "./plugins/table/types";
import { TYPE_EMBED_BRIGHTCOVE } from "./plugins/video/types";

export const inlines: ElementType[] = [
  TYPE_CONCEPT_INLINE,
  TYPE_FOOTNOTE,
  TYPE_LINK,
  TYPE_CONTENT_LINK,
  MATH_ELEMENT_TYPE,
  TYPE_SPAN,
  COMMENT_INLINE_ELEMENT_TYPE,
];

export const blocks: ElementType[] = [
  ASIDE_ELEMENT_TYPE,
  FRAMED_CONTENT_ELEMENT_TYPE,
  CODE_BLOCK_ELEMENT_TYPE,
  DETAILS_ELEMENT_TYPE,
  AUDIO_ELEMENT_TYPE,
  TYPE_EMBED_BRIGHTCOVE,
  TYPE_EMBED_ERROR,
  TYPE_EXTERNAL,
  H5P_ELEMENT_TYPE,
  TYPE_IMAGE,
  FILE_ELEMENT_TYPE,
  TYPE_RELATED,
  TYPE_TABLE,
  TYPE_PITCH,
  TYPE_GRID,
  TYPE_KEY_FIGURE,
  CAMPAIGN_BLOCK_ELEMENT_TYPE,
];
