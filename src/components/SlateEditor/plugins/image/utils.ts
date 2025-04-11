/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { jsx as slatejsx } from "slate-hyperscript";
import { IMAGE_ELEMENT_TYPE } from "./types";

export const defaultImageBlock = () => slatejsx("element", { type: IMAGE_ELEMENT_TYPE });
