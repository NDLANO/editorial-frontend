/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from "slate";
import { createSlate, PARAGRAPH_ELEMENT_TYPE, SECTION_ELEMENT_TYPE } from "@ndla/editor";
import { learningResourcePlugins } from "../../../../../containers/ArticlePage/LearningResourcePage/components/learningResourcePlugins";
import { CODE_BLOCK_ELEMENT_TYPE } from "../types";
import { anySlateElementId } from "../../../../../__tests__/vitest.setup";

const editor = createSlate({ plugins: learningResourcePlugins });

describe("codeblock normalizer tests", () => {
  test("adds paragraphs around codeblock", () => {
    const editorValue: Descendant[] = [
      {
        type: SECTION_ELEMENT_TYPE,
        children: [
          {
            type: CODE_BLOCK_ELEMENT_TYPE,
            data: {
              codeContent: "print(1)",
              codeFormat: "python",
              resource: "code-block",
              title: "tittel",
            },
            children: [{ text: "" }],
            isFirstEdit: false,
          },
          {
            type: CODE_BLOCK_ELEMENT_TYPE,
            data: {
              codeContent: "print(1)",
              codeFormat: "python",
              resource: "code-block",
              title: "tittel",
            },
            children: [{ text: "" }],
            isFirstEdit: false,
          },
          {
            type: CODE_BLOCK_ELEMENT_TYPE,
            data: {
              codeContent: "print(1)",
              codeFormat: "python",
              resource: "code-block",
              title: "tittel",
            },
            children: [{ text: "" }],
            isFirstEdit: false,
          },
        ],
      },
    ];

    const expectedValue: Descendant[] = [
      {
        type: SECTION_ELEMENT_TYPE,
        id: anySlateElementId,
        children: [
          { type: PARAGRAPH_ELEMENT_TYPE, id: anySlateElementId, children: [{ text: "" }] },
          {
            type: CODE_BLOCK_ELEMENT_TYPE,
            id: anySlateElementId,
            data: {
              codeContent: "print(1)",
              codeFormat: "python",
              resource: "code-block",
              title: "tittel",
            },
            children: [{ text: "" }],
            isFirstEdit: false,
          },
          { type: PARAGRAPH_ELEMENT_TYPE, id: anySlateElementId, children: [{ text: "" }] },
          {
            type: CODE_BLOCK_ELEMENT_TYPE,
            id: anySlateElementId,
            data: {
              codeContent: "print(1)",
              codeFormat: "python",
              resource: "code-block",
              title: "tittel",
            },
            children: [{ text: "" }],
            isFirstEdit: false,
          },
          { type: PARAGRAPH_ELEMENT_TYPE, id: anySlateElementId, children: [{ text: "" }] },
          {
            type: CODE_BLOCK_ELEMENT_TYPE,
            id: anySlateElementId,
            data: {
              codeContent: "print(1)",
              codeFormat: "python",
              resource: "code-block",
              title: "tittel",
            },
            children: [{ text: "" }],
            isFirstEdit: false,
          },
          { type: PARAGRAPH_ELEMENT_TYPE, id: anySlateElementId, children: [{ text: "" }] },
        ],
      },
    ];
    editor.reinitialize({ value: editorValue, shouldNormalize: true });
    expect(editor.children).toEqual(expectedValue);
  });
});
