/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { jsx as slatejsx } from "slate-hyperscript";
import { SpanElement } from ".";
import { TYPE_SPAN } from "./types";

export const defaultSpanBlock = () => slatejsx("element", { type: TYPE_SPAN, data: {} }, { text: "" }) as SpanElement;
