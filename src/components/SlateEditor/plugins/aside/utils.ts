/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { jsx as slatejsx } from "slate-hyperscript";
import { defaultParagraphBlock } from "../paragraph/utils";
import { ASIDE_ELEMENT_TYPE } from "./asideTypes";

export const defaultAsideBlock = () =>
  slatejsx("element", { type: ASIDE_ELEMENT_TYPE, data: { type: "factAside" } }, defaultParagraphBlock());
