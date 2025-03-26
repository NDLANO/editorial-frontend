/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from "slate";

export interface FileElement {
  type: "file";
  data: File[];
  children: Descendant[];
}

export const FILE_ELEMENT_TYPE = "file";
export const FILE_PLUGIN = "file";
