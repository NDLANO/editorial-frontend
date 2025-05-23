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
import { anySlateElementId } from "../../../../../__tests__/vitest.setup";
import {
  DEFINITION_DESCRIPTION_ELEMENT_TYPE,
  DEFINITION_LIST_ELEMENT_TYPE,
  DEFINITION_TERM_ELEMENT_TYPE,
} from "../definitionListTypes";

const editor = createSlate({ plugins: learningResourcePlugins });

describe("definition normalizing tests", () => {
  test("should not remove any description or term", () => {
    const editorValue: Descendant[] = [
      {
        type: DEFINITION_LIST_ELEMENT_TYPE,
        children: [
          { type: DEFINITION_TERM_ELEMENT_TYPE, children: [{ text: "" }] },
          { type: DEFINITION_DESCRIPTION_ELEMENT_TYPE, children: [{ text: "" }] },
          { type: DEFINITION_TERM_ELEMENT_TYPE, children: [{ text: "" }] },
          { type: DEFINITION_TERM_ELEMENT_TYPE, children: [{ text: "" }] },
          { type: DEFINITION_DESCRIPTION_ELEMENT_TYPE, children: [{ text: "" }] },
          { type: DEFINITION_TERM_ELEMENT_TYPE, children: [{ text: "" }] },
          { type: DEFINITION_DESCRIPTION_ELEMENT_TYPE, children: [{ text: "" }] },
        ],
      },
    ];

    const expectedValue: Descendant[] = [
      {
        type: DEFINITION_LIST_ELEMENT_TYPE,
        id: anySlateElementId,
        children: [
          { type: DEFINITION_TERM_ELEMENT_TYPE, id: anySlateElementId, children: [{ text: "" }] },
          { type: DEFINITION_DESCRIPTION_ELEMENT_TYPE, id: anySlateElementId, children: [{ text: "" }] },
          { type: DEFINITION_TERM_ELEMENT_TYPE, id: anySlateElementId, children: [{ text: "" }] },
          { type: DEFINITION_TERM_ELEMENT_TYPE, id: anySlateElementId, children: [{ text: "" }] },
          { type: DEFINITION_DESCRIPTION_ELEMENT_TYPE, id: anySlateElementId, children: [{ text: "" }] },
          { type: DEFINITION_TERM_ELEMENT_TYPE, id: anySlateElementId, children: [{ text: "" }] },
          { type: DEFINITION_DESCRIPTION_ELEMENT_TYPE, id: anySlateElementId, children: [{ text: "" }] },
        ],
      },
    ];
    editor.reinitialize({ value: editorValue, shouldNormalize: true });
    expect(editor.children).toEqual(expectedValue);
  });

  test("should only contain term and description objects", () => {
    const editorValue: Descendant[] = [
      {
        type: DEFINITION_LIST_ELEMENT_TYPE,
        children: [
          { type: DEFINITION_TERM_ELEMENT_TYPE, children: [{ text: "" }] },
          { type: DEFINITION_DESCRIPTION_ELEMENT_TYPE, children: [{ text: "" }] },
          { type: TYPE_PARAGRAPH, children: [{ text: "" }] },
          { type: DEFINITION_DESCRIPTION_ELEMENT_TYPE, children: [{ text: "" }] },
          { type: DEFINITION_TERM_ELEMENT_TYPE, children: [{ text: "" }] },
          { type: DEFINITION_TERM_ELEMENT_TYPE, children: [{ text: "" }] },
          { type: DEFINITION_DESCRIPTION_ELEMENT_TYPE, children: [{ text: "" }] },
        ],
      },
    ];
    const expectedValue: Descendant[] = [
      {
        type: DEFINITION_LIST_ELEMENT_TYPE,
        id: anySlateElementId,
        children: [
          { type: DEFINITION_TERM_ELEMENT_TYPE, id: anySlateElementId, children: [{ text: "" }] },
          { type: DEFINITION_DESCRIPTION_ELEMENT_TYPE, id: anySlateElementId, children: [{ text: "" }] },
          { type: DEFINITION_TERM_ELEMENT_TYPE, id: anySlateElementId, children: [{ text: "" }] },
          { type: DEFINITION_TERM_ELEMENT_TYPE, id: anySlateElementId, children: [{ text: "" }] },
          { type: DEFINITION_DESCRIPTION_ELEMENT_TYPE, id: anySlateElementId, children: [{ text: "" }] },
          { type: DEFINITION_TERM_ELEMENT_TYPE, id: anySlateElementId, children: [{ text: "" }] },
          { type: DEFINITION_TERM_ELEMENT_TYPE, id: anySlateElementId, children: [{ text: "" }] },
          { type: DEFINITION_DESCRIPTION_ELEMENT_TYPE, id: anySlateElementId, children: [{ text: "" }] },
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
            type: DEFINITION_LIST_ELEMENT_TYPE,
            children: [
              { type: DEFINITION_TERM_ELEMENT_TYPE, children: [{ text: "" }] },
              { type: DEFINITION_DESCRIPTION_ELEMENT_TYPE, children: [{ text: "" }] },
            ],
          },
          {
            type: DEFINITION_LIST_ELEMENT_TYPE,
            children: [
              { type: DEFINITION_TERM_ELEMENT_TYPE, children: [{ text: "" }] },
              { type: DEFINITION_DESCRIPTION_ELEMENT_TYPE, children: [{ text: "" }] },
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
            type: DEFINITION_LIST_ELEMENT_TYPE,
            id: anySlateElementId,
            children: [
              { type: DEFINITION_TERM_ELEMENT_TYPE, id: anySlateElementId, children: [{ text: "" }] },
              { type: DEFINITION_DESCRIPTION_ELEMENT_TYPE, id: anySlateElementId, children: [{ text: "" }] },
              { type: DEFINITION_TERM_ELEMENT_TYPE, id: anySlateElementId, children: [{ text: "" }] },
              { type: DEFINITION_DESCRIPTION_ELEMENT_TYPE, id: anySlateElementId, children: [{ text: "" }] },
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
