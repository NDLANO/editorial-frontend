/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ContentLinkEmbedData } from "@ndla/types-embed";
import { Descendant } from "slate";

export const LINK_ELEMENT_TYPE = "link";
export const LINK_PLUGIN = "link";

export const CONTENT_LINK_ELEMENT_TYPE = "content-link";
export const CONTENT_LINK_PLUGIN = "content-link";

export interface LinkElement {
  type: "link";
  data: LinkEmbedData;
  children: Descendant[];
  isFirstEdit?: boolean;
}

export interface ContentLinkElement {
  type: "content-link";
  data: ContentLinkEmbedData;
  children: Descendant[];
  isFirstEdit?: boolean;
}

export type LinkEmbedData = {
  href: string;
  target?: string;
  title?: string;
  rel?: string;
};

export interface LinkData {
  href: string;
  text: string;
  openInNew: boolean;
}
