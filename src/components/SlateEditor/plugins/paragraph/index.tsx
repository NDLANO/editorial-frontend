/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  paragraphPlugin as _paragraphPlugin,
  paragraphSerializer as _paragraphSerializer,
  LIST_ITEM_ELEMENT_TYPE,
  NOOP_ELEMENT_TYPE,
} from "@ndla/editor";
import { SUMMARY_ELEMENT_TYPE } from "../details/summaryTypes";
import { TABLE_CELL_ELEMENT_TYPE } from "../table/types";

export const paragraphSerializer = _paragraphSerializer;

export const paragraphPlugin = _paragraphPlugin.configure({
  options: {
    nonSerializableParents: {
      override: true,
      value: [TABLE_CELL_ELEMENT_TYPE, LIST_ITEM_ELEMENT_TYPE, SUMMARY_ELEMENT_TYPE, NOOP_ELEMENT_TYPE],
    },
  },
});
