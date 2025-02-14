/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createPlugin, PARAGRAPH_ELEMENT_TYPE } from "@ndla/editor";
import { FRAMED_CONTENT_ELEMENT_TYPE, FRAMED_CONTENT_PLUGIN } from "./framedContentTypes";
import { defaultBlockNormalizer, NormalizerConfig } from "../../utils/defaultNormalizer";
import { isFramedContentElement } from "./queries/framedContentQueries";
import {
  afterOrBeforeTextBlockElement,
  firstTextBlockElement,
  lastTextBlockElement,
  textBlockElements,
} from "../../utils/normalizationHelpers";
import { TYPE_COPYRIGHT } from "../copyright/types";

const config: NormalizerConfig = {
  nodes: {
    allowed: textBlockElements.concat(TYPE_COPYRIGHT),
    defaultType: PARAGRAPH_ELEMENT_TYPE,
  },
  previous: {
    allowed: afterOrBeforeTextBlockElement,
    defaultType: PARAGRAPH_ELEMENT_TYPE,
  },
  next: {
    allowed: afterOrBeforeTextBlockElement,
    defaultType: PARAGRAPH_ELEMENT_TYPE,
  },
  firstNode: {
    allowed: firstTextBlockElement.concat(TYPE_COPYRIGHT),
    defaultType: PARAGRAPH_ELEMENT_TYPE,
  },
  lastNode: {
    allowed: lastTextBlockElement.concat(TYPE_COPYRIGHT),
    defaultType: PARAGRAPH_ELEMENT_TYPE,
  },
};

export const framedContentPlugin = createPlugin({
  type: FRAMED_CONTENT_ELEMENT_TYPE,
  name: FRAMED_CONTENT_PLUGIN,
  normalize: (editor, node, path, logger) => {
    if (isFramedContentElement(node)) {
      return defaultBlockNormalizer(editor, node, path, config, logger);
    }
    return false;
  },
});
