/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createSlate, PARAGRAPH_ELEMENT_TYPE, SECTION_ELEMENT_TYPE } from "@ndla/editor";
import { Descendant } from "slate";
import { anySlateElementId } from "../../../../../__tests__/vitest.setup";
import { learningResourcePlugins } from "../../../../../containers/ArticlePage/LearningResourcePage/components/learningResourcePlugins";
import { RELATED_ELEMENT_TYPE } from "../types";

const editor = createSlate({ plugins: learningResourcePlugins });

describe("related normalizer tests", () => {
  test("adds paragraphs around related", () => {
    const editorValue: Descendant[] = [
      {
        type: SECTION_ELEMENT_TYPE,
        children: [
          {
            type: RELATED_ELEMENT_TYPE,
            children: [
              {
                text: "",
              },
            ],
            data: [],
          },
          {
            type: RELATED_ELEMENT_TYPE,
            children: [
              {
                text: "",
              },
            ],
            data: [],
          },
          {
            type: RELATED_ELEMENT_TYPE,
            children: [
              {
                text: "",
              },
            ],
            data: [],
          },
        ],
      },
    ];

    const expectedValue: Descendant[] = [
      {
        type: SECTION_ELEMENT_TYPE,
        id: anySlateElementId,
        children: [
          {
            type: PARAGRAPH_ELEMENT_TYPE,
            id: anySlateElementId,
            children: [{ text: "" }],
          },
          {
            type: RELATED_ELEMENT_TYPE,
            id: anySlateElementId,
            children: [
              {
                text: "",
              },
            ],
            data: [],
          },
          {
            type: PARAGRAPH_ELEMENT_TYPE,
            id: anySlateElementId,
            children: [{ text: "" }],
          },
          {
            type: RELATED_ELEMENT_TYPE,
            id: anySlateElementId,
            children: [
              {
                text: "",
              },
            ],
            data: [],
          },
          {
            type: PARAGRAPH_ELEMENT_TYPE,
            id: anySlateElementId,
            children: [{ text: "" }],
          },
          {
            type: RELATED_ELEMENT_TYPE,
            id: anySlateElementId,
            children: [
              {
                text: "",
              },
            ],
            data: [],
          },
          {
            type: PARAGRAPH_ELEMENT_TYPE,
            id: anySlateElementId,
            children: [{ text: "" }],
          },
        ],
      },
    ];
    editor.reinitialize({ value: editorValue, shouldNormalize: true });
    expect(editor.children).toEqual(expectedValue);
  });
});
