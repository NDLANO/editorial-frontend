/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { jsx as slatejsx } from "slate-hyperscript";
import { FRAMED_CONTENT_ELEMENT_TYPE } from "./framedContentTypes";

export const defaultFramedContentBlock = () =>
  slatejsx("element", { type: FRAMED_CONTENT_ELEMENT_TYPE, data: {} }, [{ text: "" }]);
