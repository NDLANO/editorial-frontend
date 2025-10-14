/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant, Editor, Transforms } from "slate";
import { createSlate, HEADING_ELEMENT_TYPE, PARAGRAPH_ELEMENT_TYPE, SECTION_ELEMENT_TYPE } from "@ndla/editor";
import { learningResourcePlugins } from "../../../../../containers/ArticlePage/LearningResourcePage/components/learningResourcePlugins";
import { anySlateElementId } from "../../../../../__tests__/vitest.setup";

const editor = createSlate({ plugins: learningResourcePlugins });

describe("heading normalizer tests", () => {
  test("unwrap empty header if not selected", () => {
    const editorValue: Descendant[] = [
      {
        type: SECTION_ELEMENT_TYPE,
        children: [
          {
            type: PARAGRAPH_ELEMENT_TYPE,
            children: [{ text: "" }],
          },
          {
            type: HEADING_ELEMENT_TYPE,
            level: 2,
            children: [{ text: "" }],
          },
          {
            type: HEADING_ELEMENT_TYPE,
            level: 3,
            children: [{ text: "not empty" }],
          },
          {
            type: PARAGRAPH_ELEMENT_TYPE,
            children: [{ text: "" }],
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
            type: PARAGRAPH_ELEMENT_TYPE,
            id: anySlateElementId,
            children: [{ text: "" }],
          },
          {
            type: HEADING_ELEMENT_TYPE,
            id: anySlateElementId,
            level: 3,
            children: [{ text: "not empty" }],
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

  test("dont remove empty header if selected", () => {
    const editorValue: Descendant[] = [
      {
        type: SECTION_ELEMENT_TYPE,
        children: [
          {
            type: PARAGRAPH_ELEMENT_TYPE,
            children: [{ text: "" }],
          },
          {
            type: HEADING_ELEMENT_TYPE,
            level: 2,
            children: [{ text: "" }],
          },
          {
            type: PARAGRAPH_ELEMENT_TYPE,
            children: [{ text: "" }],
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
            type: HEADING_ELEMENT_TYPE,
            id: anySlateElementId,
            level: 2,
            children: [{ text: "" }],
          },
          {
            type: PARAGRAPH_ELEMENT_TYPE,
            id: anySlateElementId,
            children: [{ text: "" }],
          },
        ],
      },
    ];

    editor.reinitialize({ value: editorValue });
    Transforms.select(editor, [0, 1, 0]);
    Editor.normalize(editor, { force: true });
    expect(editor.children).toEqual(expectedValue);
  });
});

test("remove bold marker on header", () => {
  const editorValue: Descendant[] = [
    {
      type: SECTION_ELEMENT_TYPE,
      children: [
        {
          type: PARAGRAPH_ELEMENT_TYPE,
          children: [{ text: "" }],
        },
        {
          type: HEADING_ELEMENT_TYPE,
          level: 2,
          children: [{ text: "Test", bold: true }],
        },
        {
          type: PARAGRAPH_ELEMENT_TYPE,
          children: [{ text: "" }],
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
          type: HEADING_ELEMENT_TYPE,
          id: anySlateElementId,
          level: 2,
          children: [{ text: "Test" }],
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
