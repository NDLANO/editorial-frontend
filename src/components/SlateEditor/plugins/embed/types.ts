/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from "slate";

export interface ErrorEmbedElement {
  type: "error-embed";
  data: ErrorEmbed;
  children: Descendant[];
}

export interface ErrorEmbed {
  resource: "error";
  message: string;
}

export const TYPE_NDLA_EMBED = "ndlaembed";
