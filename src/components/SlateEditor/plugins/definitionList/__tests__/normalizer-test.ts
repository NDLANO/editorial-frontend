/**
 * Copyright (c) 2023-present, NDLA.
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
import { TYPE_DEFINITION_DESCRIPTION, TYPE_DEFINITION_LIST, TYPE_DEFINITION_TERM } from "../types";
import { anySlateElementId } from "../../../../../__tests__/vitest.setup";

const editor = createSlate({ plugins: learningResourcePlugins });

describe("definition normalizing tests", () => {
  test("should not remove any description or term", () => {
    const editorValue: Descendant[] = [
      {
        type: TYPE_DEFINITION_LIST,
        children: [
          { type: TYPE_DEFINITION_TERM, children: [{ text: "" }] },
          { type: TYPE_DEFINITION_DESCRIPTION, children: [{ text: "" }] },
          { type: TYPE_DEFINITION_TERM, children: [{ text: "" }] },
          { type: TYPE_DEFINITION_TERM, children: [{ text: "" }] },
          { type: TYPE_DEFINITION_DESCRIPTION, children: [{ text: "" }] },
          { type: TYPE_DEFINITION_TERM, children: [{ text: "" }] },
          { type: TYPE_DEFINITION_DESCRIPTION, children: [{ text: "" }] },
        ],
      },
    ];

    const expectedValue: Descendant[] = [
      {
        type: TYPE_DEFINITION_LIST,
        id: anySlateElementId,
        children: [
          { type: TYPE_DEFINITION_TERM, id: anySlateElementId, children: [{ text: "" }] },
          { type: TYPE_DEFINITION_DESCRIPTION, id: anySlateElementId, children: [{ text: "" }] },
          { type: TYPE_DEFINITION_TERM, id: anySlateElementId, children: [{ text: "" }] },
          { type: TYPE_DEFINITION_TERM, id: anySlateElementId, children: [{ text: "" }] },
          { type: TYPE_DEFINITION_DESCRIPTION, id: anySlateElementId, children: [{ text: "" }] },
          { type: TYPE_DEFINITION_TERM, id: anySlateElementId, children: [{ text: "" }] },
          { type: TYPE_DEFINITION_DESCRIPTION, id: anySlateElementId, children: [{ text: "" }] },
        ],
      },
    ];
    editor.reinitialize({ value: editorValue, shouldNormalize: true });
    expect(editor.children).toEqual(expectedValue);
  });

  test("should only contain term and description objects", () => {
    const editorValue: Descendant[] = [
      {
        type: TYPE_DEFINITION_LIST,
        children: [
          { type: TYPE_DEFINITION_TERM, children: [{ text: "" }] },
          { type: TYPE_DEFINITION_DESCRIPTION, children: [{ text: "" }] },
          { type: TYPE_DEFINITION_TERM, children: [{ text: "" }] },
          { type: TYPE_PARAGRAPH, children: [{ text: "" }] },
          { type: TYPE_DEFINITION_DESCRIPTION, children: [{ text: "" }] },
          { type: TYPE_DEFINITION_TERM, children: [{ text: "" }] },
          { type: TYPE_DEFINITION_TERM, children: [{ text: "" }] },
          { type: TYPE_DEFINITION_DESCRIPTION, children: [{ text: "" }] },
        ],
      },
    ];

    const expectedValue: Descendant[] = [
      {
        type: TYPE_DEFINITION_LIST,
        id: anySlateElementId,
        children: [
          { type: TYPE_DEFINITION_TERM, id: anySlateElementId, children: [{ text: "" }] },
          { type: TYPE_DEFINITION_DESCRIPTION, id: anySlateElementId, children: [{ text: "" }] },
          { type: TYPE_DEFINITION_TERM, id: anySlateElementId, children: [{ text: "" }] },
          { type: TYPE_DEFINITION_TERM, id: anySlateElementId, children: [{ text: "" }] },
          { type: TYPE_DEFINITION_TERM, id: anySlateElementId, children: [{ text: "" }] },
          { type: TYPE_DEFINITION_DESCRIPTION, id: anySlateElementId, children: [{ text: "" }] },
          { type: TYPE_DEFINITION_TERM, id: anySlateElementId, children: [{ text: "" }] },
          { type: TYPE_DEFINITION_TERM, id: anySlateElementId, children: [{ text: "" }] },
          { type: TYPE_DEFINITION_DESCRIPTION, id: anySlateElementId, children: [{ text: "" }] },
        ],
      },
    ];
    editor.reinitialize({ value: editorValue, shouldNormalize: true });
    expect(editor.children).toEqual(expectedValue);
  });

  test("should merge definition lists that comes after eachother", () => {
    const editorValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          {
            type: TYPE_PARAGRAPH,
            children: [{ text: "" }],
          },
          {
            type: TYPE_DEFINITION_LIST,
            children: [
              { type: TYPE_DEFINITION_TERM, children: [{ text: "" }] },
              { type: TYPE_DEFINITION_DESCRIPTION, children: [{ text: "" }] },
            ],
          },
          {
            type: TYPE_DEFINITION_LIST,
            children: [
              { type: TYPE_DEFINITION_TERM, children: [{ text: "" }] },
              { type: TYPE_DEFINITION_DESCRIPTION, children: [{ text: "" }] },
            ],
          },
          {
            type: TYPE_PARAGRAPH,
            children: [{ text: "" }],
          },
        ],
      },
    ];
    editor.reinitialize({ value: editorValue, shouldNormalize: true });
    expect(editor.children).toEqual([
      {
        type: TYPE_SECTION,
        id: anySlateElementId,
        children: [
          {
            type: TYPE_PARAGRAPH,
            id: anySlateElementId,
            children: [{ text: "" }],
          },
          {
            type: TYPE_DEFINITION_LIST,
            id: anySlateElementId,
            children: [
              { type: TYPE_DEFINITION_TERM, id: anySlateElementId, children: [{ text: "" }] },
              { type: TYPE_DEFINITION_DESCRIPTION, id: anySlateElementId, children: [{ text: "" }] },
              { type: TYPE_DEFINITION_TERM, id: anySlateElementId, children: [{ text: "" }] },
              { type: TYPE_DEFINITION_DESCRIPTION, id: anySlateElementId, children: [{ text: "" }] },
            ],
          },
          {
            type: TYPE_PARAGRAPH,
            id: anySlateElementId,
            children: [{ text: "" }],
          },
        ],
      },
    ]);
  });
});
