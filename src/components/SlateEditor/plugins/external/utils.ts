/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { jsx as slatejsx } from "slate-hyperscript";
import { TYPE_EXTERNAL, TYPE_IFRAME } from "./types";

export const defaultExternalBlock = () => slatejsx("element", { type: TYPE_EXTERNAL, isFirstEdit: true }, { text: "" });

export const defaultIframeBlock = () => slatejsx("element", { type: TYPE_IFRAME, isFirstEdit: true }, { text: "" });
