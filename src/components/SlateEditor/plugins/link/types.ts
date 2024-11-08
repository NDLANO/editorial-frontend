/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export const TYPE_LINK = "link";
export const TYPE_CONTENT_LINK = "content-link";

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
