/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant, Editor, Transforms } from "slate";
import { createSlate } from "@ndla/editor";
import { learningResourcePlugins } from "../../../../../containers/ArticlePage/LearningResourcePage/components/learningResourcePlugins";
import { TYPE_PARAGRAPH } from "../../paragraph/types";
import { TYPE_SECTION } from "../../section/types";
import { TYPE_HEADING } from "../types";
import { anySlateElementId } from "../../../../../__tests__/vitest.setup";

const editor = createSlate({ plugins: learningResourcePlugins });

describe("heading normalizer tests", () => {
  test("unwrap empty header if not selected", () => {
    const editorValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          {
            type: TYPE_PARAGRAPH,
            children: [{ text: "" }],
          },
          {
            type: TYPE_HEADING,
            level: 2,
            children: [{ text: "" }],
          },
          {
            type: TYPE_HEADING,
            level: 3,
            children: [{ text: "not empty" }],
          },
          {
            type: TYPE_PARAGRAPH,
            children: [{ text: "" }],
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
          {
            type: TYPE_PARAGRAPH,
            id: anySlateElementId,
            children: [{ text: "" }],
          },
          {
            type: TYPE_HEADING,
            id: anySlateElementId,
            level: 3,
            children: [{ text: "not empty" }],
          },
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

  test("dont remove empty header if selected", () => {
    const editorValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          {
            type: TYPE_PARAGRAPH,
            children: [{ text: "" }],
          },
          {
            type: TYPE_HEADING,
            level: 2,
            children: [{ text: "" }],
          },
          {
            type: TYPE_PARAGRAPH,
            children: [{ text: "" }],
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
          {
            type: TYPE_HEADING,
            id: anySlateElementId,
            level: 2,
            children: [{ text: "" }],
          },
          {
            type: TYPE_PARAGRAPH,
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
      type: TYPE_SECTION,
      children: [
        {
          type: TYPE_PARAGRAPH,
          children: [{ text: "" }],
        },
        {
          type: TYPE_HEADING,
          level: 2,
          children: [{ text: "Test", bold: true }],
        },
        {
          type: TYPE_PARAGRAPH,
          children: [{ text: "" }],
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
        {
          type: TYPE_HEADING,
          id: anySlateElementId,
          level: 2,
          children: [{ text: "Test" }],
        },
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
