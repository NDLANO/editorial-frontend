/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createPlugin, isElementOfType, PARAGRAPH_ELEMENT_TYPE } from "@ndla/editor";
import { AUDIO_ELEMENT_TYPE, AUDIO_PLUGIN, AudioElementType, AudioPluginOptions } from "./audioTypes";
import { defaultBlockNormalizer, NormalizerConfig } from "../../utils/defaultNormalizer";
import { afterOrBeforeTextBlockElement } from "../../utils/normalizationHelpers";

const normalizerConfig: NormalizerConfig = {
  previous: {
    allowed: afterOrBeforeTextBlockElement,
    defaultType: PARAGRAPH_ELEMENT_TYPE,
  },
  next: {
    allowed: afterOrBeforeTextBlockElement,
    defaultType: PARAGRAPH_ELEMENT_TYPE,
  },
};

export const audioPlugin = createPlugin<AudioElementType, AudioPluginOptions>({
  name: AUDIO_PLUGIN,
  type: AUDIO_ELEMENT_TYPE,
  isVoid: true,
  options: {
    disableNormalization: false,
  },
  normalize: (editor, node, path, logger, options) => {
    if (isElementOfType(node, AUDIO_ELEMENT_TYPE) && !options.disableNormalization) {
      return defaultBlockNormalizer(editor, node, path, normalizerConfig, logger);
    }
    return false;
  },
});
