/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { Editor, Transforms, Path, Element } from "slate";
import { jsx as slatejsx } from "slate-hyperscript";
import { TYPE_COMMENT_BLOCK } from "./types";

export const wrapBlockInComment = (editor: Editor, blockElementPath: Path) => {
  Transforms.wrapNodes(editor, slatejsx("element", { type: TYPE_COMMENT_BLOCK, data: {}, isFirstEdit: true }), {
    at: blockElementPath,
    match: (node, path) => {
      return Element.isElement(node) && Path.equals(path, blockElementPath);
    },
    split: true,
  });
};

export const defaultStandaloneCommentBlock = () => {
  return slatejsx("element", {
    type: TYPE_COMMENT_BLOCK,
    data: {
      resource: "comment",
      isStandalone: "true",
    },
    isFirstEdit: true,
  });
};
