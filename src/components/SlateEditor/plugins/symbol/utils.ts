/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor, Transforms, Range } from "slate";
import { jsx as slatejsx } from "slate-hyperscript";
import { SYMBOL_ELEMENT_TYPE } from "./types";

export const insertSymbol = (editor: Editor) => {
  if (editor.selection) {
    const symbol = slatejsx("element", { type: SYMBOL_ELEMENT_TYPE, isFirstEdit: true });
    Transforms.insertNodes(editor, symbol, { at: Range.start(editor.selection) });
  }
};
