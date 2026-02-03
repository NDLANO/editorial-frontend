/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from "slate";
import { blockContentToEditorValue, blockContentToHTML } from "../../../../../util/articleContentConverter";
import { symbols } from "../constants";
import { SYMBOL_ELEMENT_TYPE, SymbolData } from "../types";

const knownSymbol = symbols[0];
const editorWithKnownSymbol: Descendant[] = [
  { type: SYMBOL_ELEMENT_TYPE, symbol: knownSymbol, isFirstEdit: false, children: [{ text: "" }] },
];
const htmlWithKnownSymbol = `<ndlaembed data-resource="symbol">${knownSymbol.text}</ndlaembed>`;

const unknownSymbol: SymbolData = { name: "unknown", text: "æ" };
const editorWithUnknownSymbol: Descendant[] = [
  { type: SYMBOL_ELEMENT_TYPE, symbol: unknownSymbol, isFirstEdit: false, children: [{ text: "" }] },
];
const htmlWithUnknownSymbol = `<ndlaembed data-resource="symbol">${unknownSymbol.text}</ndlaembed>`;

describe("symbol serializing tests", () => {
  test("serializing", () => {
    const res = blockContentToHTML(editorWithKnownSymbol);
    expect(res).toMatch(htmlWithKnownSymbol);
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

  test("deserializing known symbol", () => {
    const res = blockContentToEditorValue(htmlWithKnownSymbol);
    expect(res).toEqual(editorWithKnownSymbol);
  });

  test("deserializing unknown symbol", () => {
    const res = blockContentToEditorValue(htmlWithUnknownSymbol);
    expect(res).toEqual(editorWithUnknownSymbol);
  });
});
