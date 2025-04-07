/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from "slate";
import { createSlate, PARAGRAPH_ELEMENT_TYPE, SECTION_ELEMENT_TYPE } from "@ndla/editor";
import { learningResourcePlugins } from "../../../../../containers/ArticlePage/LearningResourcePage/components/learningResourcePlugins";
import { SPAN_ELEMENT_TYPE } from "../types";
import { anySlateElementId } from "../../../../../__tests__/vitest.setup";

const editor = createSlate({ plugins: learningResourcePlugins });

describe("span normalizer tests", () => {
  test("Span with language remains after normalization", () => {
    const editorValue: Descendant[] = [
      {
        type: SECTION_ELEMENT_TYPE,
        children: [
          {
            type: PARAGRAPH_ELEMENT_TYPE,
            children: [
              { text: "" },
              {
                type: SPAN_ELEMENT_TYPE,
                data: { lang: "en" },
                children: [{ text: "test" }],
              },
              { text: "" },
            ],
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
            children: [
              { text: "" },
              {
                type: SPAN_ELEMENT_TYPE,
                data: { lang: "en" },
                children: [{ text: "test" }],
              },
              { text: "" },
            ],
          },
        ],
      },
    ];

    editor.reinitialize({ value: editorValue, shouldNormalize: true });
    expect(editor.children).toEqual(expectedValue);
  });
});
