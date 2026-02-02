/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createPlugin, defaultNormalizer, NormalizerConfig, PARAGRAPH_ELEMENT_TYPE } from "@ndla/editor";
import {
  afterOrBeforeTextBlockElement,
  firstTextBlockElement,
  lastTextBlockElement,
  textBlockElements,
} from "../../utils/normalizationHelpers";
import { COPYRIGHT_ELEMENT_TYPE } from "../copyright/types";
import { FRAMED_CONTENT_ELEMENT_TYPE, FRAMED_CONTENT_PLUGIN } from "./framedContentTypes";
import { isFramedContentElement } from "./queries/framedContentQueries";

const config: NormalizerConfig = {
  nodes: {
    allowed: textBlockElements.concat(COPYRIGHT_ELEMENT_TYPE),
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
    allowed: firstTextBlockElement.concat(COPYRIGHT_ELEMENT_TYPE),
    defaultType: PARAGRAPH_ELEMENT_TYPE,
  },
  lastNode: {
    allowed: lastTextBlockElement.concat(COPYRIGHT_ELEMENT_TYPE),
    defaultType: PARAGRAPH_ELEMENT_TYPE,
  },
};

export const framedContentPlugin = createPlugin({
  type: FRAMED_CONTENT_ELEMENT_TYPE,
  name: FRAMED_CONTENT_PLUGIN,
  normalize: (editor, node, path, logger) => {
    if (isFramedContentElement(node)) {
      return defaultNormalizer(editor, node, path, config, logger);
    }
    return false;
  },
});
