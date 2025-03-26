/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { jsx as slatejsx } from "slate-hyperscript";
import { Range, Editor, Transforms } from "slate";
import { REPHRASE_ELEMENT_TYPE } from "./rephraseTypes";

export const insertRephrase = (editor: Editor) => {
  if (Range.isRange(editor.selection) && !Range.isCollapsed(editor.selection)) {
    Transforms.wrapNodes(editor, slatejsx("element", { type: REPHRASE_ELEMENT_TYPE }, []), {
      at: Editor.unhangRange(editor, editor.selection),
      split: true,
    });
  }
};
