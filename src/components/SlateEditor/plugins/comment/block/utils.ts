/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { jsx as slatejsx } from "slate-hyperscript";
import { TYPE_COMMENT_BLOCK } from "./types";

export const defaultCommentBlock = () => {
  return slatejsx(
    "element",
    {
      type: TYPE_COMMENT_BLOCK,
      isFirstEdit: true,
    },
    [{ text: "" }],
  );
};
