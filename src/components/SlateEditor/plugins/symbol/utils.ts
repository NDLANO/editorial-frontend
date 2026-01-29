/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor, Transforms, Range } from "slate";
import { jsx as slatejsx } from "slate-hyperscript";
import { SYMBOL_ELEMENT_TYPE, SymbolData, SymbolElement } from "./types";
import hasNodeOfType from "../../utils/hasNodeOfType";
import { isSymbolElement } from "./queries";
import { symbols } from "./constants";

export const defaultSymbol = (symbolText?: string) => {
  let symbol: SymbolData | undefined;
  if (symbolText) {
    const symbolData = symbols.find(({ text }) => text === symbolText);
    symbol = symbolData ?? { name: "unknown", text: symbolText };
  }

  const attributes: Omit<SymbolElement, "children"> = { type: SYMBOL_ELEMENT_TYPE, symbol, isFirstEdit: !symbol };

  return slatejsx("element", attributes, [{ text: "" }]);
};

export const insertSymbol = (editor: Editor) => {
  if (hasNodeOfType(editor, SYMBOL_ELEMENT_TYPE)) {
    Transforms.removeNodes(editor, { match: isSymbolElement, voids: true });
    return;
  }

  if (editor.selection) {
    Transforms.insertNodes(editor, defaultSymbol(), { at: Range.start(editor.selection) });
  }
};
