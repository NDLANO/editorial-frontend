/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { breakSerializer as _breakSerializer, breakPlugin as _breakPlugin } from "@ndla/editor";
import { ASIDE_ELEMENT_TYPE } from "../aside/asideTypes";
import { COPYRIGHT_ELEMENT_TYPE } from "../copyright/types";
import { DETAILS_ELEMENT_TYPE } from "../details/detailsTypes";
import { TYPE_DIV } from "../div/types";
import { FRAMED_CONTENT_ELEMENT_TYPE } from "../framedContent/framedContentTypes";
import { TYPE_GRID_CELL } from "../grid/types";
import { TYPE_TABLE_CELL } from "../table/types";
import { DISCLAIMER_ELEMENT_TYPE } from "../uuDisclaimer/types";

const allowedBreakContainers = ["section", "div", "aside", "li", "h1", "h2", "h3", "h4", "h5", "h6", "pre"];

export const breakSerializer = _breakSerializer.configure({
  allowedBreakContainers: {
    value: allowedBreakContainers,
    override: true,
  },
});

export const breakPlugin = _breakPlugin.configure({
  options: {
    validBreakParents: [
      TYPE_DIV,
      FRAMED_CONTENT_ELEMENT_TYPE,
      ASIDE_ELEMENT_TYPE,
      DETAILS_ELEMENT_TYPE,
      TYPE_GRID_CELL,
      DISCLAIMER_ELEMENT_TYPE,
      COPYRIGHT_ELEMENT_TYPE,
      TYPE_TABLE_CELL,
    ],
  },
});
