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
import { ASIDE_ELEMENT_TYPE, ASIDE_PLUGIN } from "./asideTypes";
import { isAsideElement } from "./queries/asideQueries";

const normalizerConfig: NormalizerConfig = {
  nodes: {
    allowed: textBlockElements,
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
    allowed: firstTextBlockElement,
    defaultType: PARAGRAPH_ELEMENT_TYPE,
  },
  lastNode: {
    allowed: lastTextBlockElement,
    defaultType: PARAGRAPH_ELEMENT_TYPE,
  },
};

export const asidePlugin = createPlugin({
  name: ASIDE_PLUGIN,
  type: ASIDE_ELEMENT_TYPE,
  normalize: (editor, node, path, logger) => {
    if (isAsideElement(node)) {
      return defaultNormalizer(editor, node, path, normalizerConfig, logger);
    }
    return false;
  },
});
