/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from "slate";
import { IframeEmbedData, OembedEmbedData } from "@ndla/types-embed";

export const IFRAME_ELEMENT_TYPE = "iframe";
export const IFRAME_PLUGIN = "iframe-plugin";

export const EXTERNAL_ELEMENT_TYPE = "external";
export const EXTERNAL_PLUGIN = "external-plugin";

export interface ExternalPluginOptions {
  disableNormalize?: boolean;
}

export interface IframePluginOptions {
  disableNormalize?: boolean;
}

export interface ExternalElement {
  type: "external";
  data?: OembedEmbedData;
  isFirstEdit?: boolean;
  children: Descendant[];
}

export interface IframeElement {
  type: "iframe";
  data?: IframeEmbedData;
  isFirstEdit?: boolean;
  children: Descendant[];
}
