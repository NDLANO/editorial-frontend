/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { jsx as slatejsx } from "slate-hyperscript";
import { H5P_ELEMENT_TYPE } from "./types";

export const defaultH5pBlock = () => slatejsx("element", { type: H5P_ELEMENT_TYPE, isFirstEdit: true }, [{ text: "" }]);
