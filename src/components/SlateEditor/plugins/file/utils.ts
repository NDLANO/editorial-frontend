/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { jsx as slatejsx } from "slate-hyperscript";
import { FILE_ELEMENT_TYPE } from "./types";

export const defaultFileBlock = (data: DOMStringMap[]) => {
  return slatejsx("element", { type: FILE_ELEMENT_TYPE, data }, [{ text: "" }]);
};
