/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from "slate";
import { ContactBlockEmbedData } from "@ndla/types-embed";

export interface ContactBlockElement {
  type: "contact-block";
  data?: ContactBlockEmbedData;
  isFirstEdit?: boolean;
  children: Descendant[];
}

export const CONTACT_BLOCK_ELEMENT_TYPE = "contact-block";
export const CONTACT_BLOCK_PLUGIN = "contact-block";
