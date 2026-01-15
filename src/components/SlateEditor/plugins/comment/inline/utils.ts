/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor, Transforms, Range, Location } from "slate";
import { jsx as slatejsx } from "slate-hyperscript";
import { COMMENT_INLINE_ELEMENT_TYPE } from "./types";
import hasNodeOfType from "../../../utils/hasNodeOfType";
import { isCommentInlineElement } from "./queries/commentInlineQueries";

export const insertComment = (editor: Editor) => {
  if (hasNodeOfType(editor, COMMENT_INLINE_ELEMENT_TYPE)) {
    Transforms.unwrapNodes(editor, { match: isCommentInlineElement, voids: true });
    return;
  }
  if (editor.selection && Location.isRange(editor.selection) && !Range.isCollapsed(editor.selection)) {
    Transforms.wrapNodes(editor, slatejsx("element", { type: COMMENT_INLINE_ELEMENT_TYPE, isFirstEdit: true }), {
      at: Editor.unhangRange(editor, editor.selection),
      split: true,
    });
  }
};
