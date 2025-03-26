/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { jsx as slatejsx } from "slate-hyperscript";
import { COMMENT_BLOCK_ELEMENT_TYPE } from "./types";

export const defaultCommentBlock = () => {
  return slatejsx(
    "element",
    {
      type: COMMENT_BLOCK_ELEMENT_TYPE,
      isFirstEdit: true,
    },
    [{ text: "" }],
  );
};
