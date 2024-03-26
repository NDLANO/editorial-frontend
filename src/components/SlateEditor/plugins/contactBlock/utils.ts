/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { jsx as slatejsx } from "slate-hyperscript";
import { TYPE_CONTACT_BLOCK } from "./types";

export const defaultContactBlock = () =>
  slatejsx("element", { type: TYPE_CONTACT_BLOCK, isFirstEdit: true }, { text: "" });
