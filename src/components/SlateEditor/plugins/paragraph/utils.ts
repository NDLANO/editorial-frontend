/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { jsx as slatejsx } from "slate-hyperscript";
import { PARAGRAPH_ELEMENT_TYPE, ParagraphElement } from "@ndla/editor";

// TODO: This shouldn't need to be casted
export const defaultParagraphBlock = (): ParagraphElement =>
  slatejsx("element", { type: PARAGRAPH_ELEMENT_TYPE }, { text: "" }) as ParagraphElement;
