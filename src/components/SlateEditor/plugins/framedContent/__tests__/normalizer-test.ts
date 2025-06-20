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
import { TYPE_HEADING } from "../../heading/types";
import { LINK_ELEMENT_TYPE } from "../../link/types";
import { TYPE_PARAGRAPH } from "../../paragraph/types";
import { TYPE_SECTION } from "../../section/types";
import { FRAMED_CONTENT_ELEMENT_TYPE } from "../framedContentTypes";
import { anySlateElementId } from "../../../../../__tests__/vitest.setup";

const editor = createSlate({ plugins: learningResourcePlugins });

describe("framedContent normalizer tests", () => {
  test("adds paragraphs around framedContent element", () => {
    const editorValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          {
            type: FRAMED_CONTENT_ELEMENT_TYPE,
            children: [{ type: TYPE_PARAGRAPH, children: [{ text: "content" }] }],
          },
          {
            type: FRAMED_CONTENT_ELEMENT_TYPE,
            children: [{ type: TYPE_PARAGRAPH, children: [{ text: "content" }] }],
          },
          {
            type: FRAMED_CONTENT_ELEMENT_TYPE,
            children: [{ type: TYPE_PARAGRAPH, children: [{ text: "content" }] }],
          },
        ],
      },
    ];

    const expectedValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        id: anySlateElementId,
        children: [
          { type: TYPE_PARAGRAPH, id: anySlateElementId, children: [{ text: "" }] },
          {
            type: FRAMED_CONTENT_ELEMENT_TYPE,
            id: anySlateElementId,
            children: [{ type: TYPE_PARAGRAPH, id: anySlateElementId, children: [{ text: "content" }] }],
          },
          { type: TYPE_PARAGRAPH, id: anySlateElementId, children: [{ text: "" }] },
          {
            type: FRAMED_CONTENT_ELEMENT_TYPE,
            id: anySlateElementId,
            children: [{ type: TYPE_PARAGRAPH, id: anySlateElementId, children: [{ text: "content" }] }],
          },
          { type: TYPE_PARAGRAPH, id: anySlateElementId, children: [{ text: "" }] },
          {
            type: FRAMED_CONTENT_ELEMENT_TYPE,
            id: anySlateElementId,
            children: [{ type: TYPE_PARAGRAPH, id: anySlateElementId, children: [{ text: "content" }] }],
          },
          { type: TYPE_PARAGRAPH, id: anySlateElementId, children: [{ text: "" }] },
        ],
      },
    ];
    editor.reinitialize({ value: editorValue, shouldNormalize: true });
    expect(editor.children).toEqual(expectedValue);
  });

  test("adds paragraph to empty framedContent element", () => {
    const editorValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          {
            type: FRAMED_CONTENT_ELEMENT_TYPE,
            children: [],
          },
        ],
      },
    ];

    const expectedValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        id: anySlateElementId,
        children: [
          { type: TYPE_PARAGRAPH, id: anySlateElementId, children: [{ text: "" }] },
          {
            type: FRAMED_CONTENT_ELEMENT_TYPE,
            id: anySlateElementId,
            children: [{ type: TYPE_PARAGRAPH, id: anySlateElementId, children: [{ text: "" }] }],
          },
          { type: TYPE_PARAGRAPH, id: anySlateElementId, children: [{ text: "" }] },
        ],
      },
    ];
    editor.reinitialize({ value: editorValue, shouldNormalize: true });
    expect(editor.children).toEqual(expectedValue);
  });

  test("adds paragraph at the end of framedContent with only heading", () => {
    const editorValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          {
            type: FRAMED_CONTENT_ELEMENT_TYPE,
            children: [{ type: TYPE_HEADING, level: 1, children: [{ text: "content" }] }],
          },
        ],
      },
    ];

    const expectedValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        id: anySlateElementId,
        children: [
          { type: TYPE_PARAGRAPH, id: anySlateElementId, children: [{ text: "" }] },
          {
            type: FRAMED_CONTENT_ELEMENT_TYPE,
            id: anySlateElementId,
            children: [
              { type: TYPE_HEADING, id: anySlateElementId, level: 1, children: [{ text: "content" }] },
              { type: TYPE_PARAGRAPH, id: anySlateElementId, children: [{ text: "" }] },
            ],
          },
          { type: TYPE_PARAGRAPH, id: anySlateElementId, children: [{ text: "" }] },
        ],
      },
    ];
    editor.reinitialize({ value: editorValue, shouldNormalize: true });
    expect(editor.children).toEqual(expectedValue);
  });

  test("unwraps content of wrong type", () => {
    const editorValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          {
            type: FRAMED_CONTENT_ELEMENT_TYPE,
            children: [
              {
                type: LINK_ELEMENT_TYPE,
                data: {
                  href: "testurl",
                },
                children: [{ type: TYPE_PARAGRAPH, children: [{ text: "content" }] }],
              },
            ],
          },
        ],
      },
    ];

    const expectedValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        id: anySlateElementId,
        children: [
          { type: TYPE_PARAGRAPH, id: anySlateElementId, children: [{ text: "" }] },
          {
            type: FRAMED_CONTENT_ELEMENT_TYPE,
            id: anySlateElementId,
            children: [{ type: TYPE_PARAGRAPH, id: anySlateElementId, children: [{ text: "content" }] }],
          },
          { type: TYPE_PARAGRAPH, id: anySlateElementId, children: [{ text: "" }] },
        ],
      },
    ];
    editor.reinitialize({ value: editorValue, shouldNormalize: true });
    expect(editor.children).toEqual(expectedValue);
  });
});
