/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { AudioEmbedData } from "@ndla/types-embed";
import { Descendant } from "slate";

export const AUDIO_ELEMENT_TYPE = "audio";
export const AUDIO_PLUGIN = "audio";

export type AudioElementType = typeof AUDIO_ELEMENT_TYPE;

export interface AudioElement {
  type: "audio";
  data?: AudioEmbedData;
  children: Descendant[];
}

export interface AudioPluginOptions {
  disableNormalization?: boolean;
}
