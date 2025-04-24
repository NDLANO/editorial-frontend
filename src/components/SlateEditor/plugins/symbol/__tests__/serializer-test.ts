/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from "slate";
import { SYMBOL_ELEMENT_TYPE } from "../types";
import { blockContentToEditorValue, blockContentToHTML } from "../../../../../util/articleContentConverter";

const editor: Descendant[] = [{ type: SYMBOL_ELEMENT_TYPE, symbol: "$", isFirstEdit: false, children: [{ text: "" }] }];

const html = '<ndlaembed data-resource="symbol">$</ndlaembed>';

describe("symbol serializing tests", () => {
  test("serializing", () => {
    const res = blockContentToHTML(editor);
    expect(res).toMatch(html);
  });

  test("serializing without symbol removes symbol node", () => {
    const editorWithoutSymbol: Descendant[] = [
      {
        type: SYMBOL_ELEMENT_TYPE,
        children: [],
      },
    ];

    const res = blockContentToHTML(editorWithoutSymbol);
    expect(res).toEqual("");
  });

  test("deserializing", () => {
    const res = blockContentToEditorValue(html);
    expect(res).toEqual(editor);
  });
});
