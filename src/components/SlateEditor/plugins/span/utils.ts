/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { jsx as slatejsx } from "slate-hyperscript";
import { SpanElement } from ".";
import { SPAN_ELEMENT_TYPE } from "./types";

export const defaultSpanBlock = (data: SpanElement["data"] = {}) =>
  slatejsx("element", { type: SPAN_ELEMENT_TYPE, data }, { text: "" }) as SpanElement;
