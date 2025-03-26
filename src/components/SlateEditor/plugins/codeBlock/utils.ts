/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { jsx as slatejsx } from "slate-hyperscript";
import { CODE_BLOCK_ELEMENT_TYPE } from "./types";

export const defaultCodeblockBlock = () =>
  slatejsx("element", { type: CODE_BLOCK_ELEMENT_TYPE, data: {}, isFirstEdit: true }, [{ text: "" }]);
