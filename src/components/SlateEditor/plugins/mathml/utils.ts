/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor, Range, Transforms } from "slate";
import { jsx as slatejsx } from "slate-hyperscript";
import hasNodeOfType from "../../utils/hasNodeOfType";
import { isMathElement } from "./queries/mathQueries";

export const insertMathml = (editor: Editor) => {
  const { selection } = editor;
  if (!Range.isRange(selection)) return;

  if (hasNodeOfType(editor, "mathml")) {
    Transforms.unwrapNodes(editor, { match: isMathElement, voids: true });
    return;
  }

  if (Range.isCollapsed(selection)) {
    Transforms.insertNodes(
      editor,
      slatejsx("element", { type: "mathml", data: {}, isFirstEdit: true }, [{ text: "" }]),
      { at: Editor.unhangRange(editor, selection) },
    );
  } else {
    Transforms.wrapNodes(editor, slatejsx("element", { type: "mathml", data: {}, isFirstEdit: true }, [{ text: "" }]), {
      at: Editor.unhangRange(editor, selection),
      split: true,
    });
  }
};
