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

export const defaultSymbol = (symbol?: string) =>
  slatejsx("element", { type: SYMBOL_ELEMENT_TYPE, symbol, isFirstEdit: !symbol }, [{ text: "" }]);

export const insertSymbol = (editor: Editor) => {
  if (editor.selection) {
    Transforms.insertNodes(editor, defaultSymbol(), { at: Range.start(editor.selection) });
  }
};
