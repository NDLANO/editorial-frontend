/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { UuDisclaimerEmbedData } from "@ndla/types-embed";
import { Descendant } from "slate";

export interface DisclaimerElement {
  type: "uu-disclaimer";
  data: UuDisclaimerEmbedData;
  children: Descendant[];
  isFirstEdit?: boolean;
}

export const DISCLAIMER_ELEMENT_TYPE = "uu-disclaimer";
export const DISCLAIMER_PLUGIN = "uu-disclaimer";
