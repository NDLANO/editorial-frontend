/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from "slate";
import { createSlate } from "@ndla/editor";
import { learningResourcePlugins } from "../../../../../containers/ArticlePage/LearningResourcePage/components/learningResourcePlugins";
import { TYPE_PARAGRAPH } from "../../paragraph/types";
import { TYPE_SECTION } from "../../section/types";
import { anySlateElementId } from "../../../../../__tests__/vitest.setup";

const editor = createSlate({ plugins: learningResourcePlugins });

describe("mark normalizer tests", () => {
  test("Remove marks from empty text nodes", () => {
    const editorValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          {
            type: TYPE_PARAGRAPH,
            children: [{ bold: true, italic: true, text: "" }],
          },
        ],
      },
    ];

    const expectedValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        id: anySlateElementId,
        children: [
          {
            type: TYPE_PARAGRAPH,
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
