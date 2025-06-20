/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createSlate, PARAGRAPH_ELEMENT_TYPE } from "@ndla/editor";
import { learningResourcePlugins } from "../../../../../containers/ArticlePage/LearningResourcePage/components/learningResourcePlugins";
import { Descendant } from "slate";
import { SYMBOL_ELEMENT_TYPE } from "../types";
import { anySlateElementId } from "../../../../../__tests__/vitest.setup";

const editor = createSlate({ plugins: learningResourcePlugins });

describe("symbol normalizer tests", () => {
  test("symbol element without symbol and not first edit is removed", () => {
    const editorValue: Descendant[] = [
      {
        type: PARAGRAPH_ELEMENT_TYPE,
        children: [
          { text: "foo" },
          {
            type: SYMBOL_ELEMENT_TYPE,
            isFirstEdit: false,
            children: [],
          },
          { text: "bar" },
        ],
      },
    ];

    const expectedValue: Descendant[] = [
      {
        type: PARAGRAPH_ELEMENT_TYPE,
        id: anySlateElementId,
        children: [{ text: "foobar" }],
      },
    ];

    editor.reinitialize({ value: editorValue, shouldNormalize: true });
    expect(editor.children).toEqual(expectedValue);
  });

  test("symbol element with symbol should remain after normalization", () => {
    const editorValue: Descendant[] = [
      {
        type: PARAGRAPH_ELEMENT_TYPE,
        children: [
          { text: "foo" },
          {
            type: SYMBOL_ELEMENT_TYPE,
            symbol: "$",
            children: [],
          },
          { text: "bar" },
        ],
      },
    ];

    const expectedValue: Descendant[] = [
      {
        type: PARAGRAPH_ELEMENT_TYPE,
        id: anySlateElementId,
        children: [
          { text: "foo" },
          {
            type: SYMBOL_ELEMENT_TYPE,
            symbol: "$",
            children: [{ text: "" }],
          },
          { text: "bar" },
        ],
      },
    ];

    editor.reinitialize({ value: editorValue, shouldNormalize: true });
    expect(editor.children).toEqual(expectedValue);
  });
});
