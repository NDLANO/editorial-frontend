/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { jsx as slatejsx } from "slate-hyperscript";
import { EXTERNAL_ELEMENT_TYPE, IFRAME_ELEMENT_TYPE } from "./types";

export const defaultExternalBlock = () =>
  slatejsx("element", { type: EXTERNAL_ELEMENT_TYPE, isFirstEdit: true }, { text: "" });

export const defaultIframeBlock = () =>
  slatejsx("element", { type: IFRAME_ELEMENT_TYPE, isFirstEdit: true }, { text: "" });
