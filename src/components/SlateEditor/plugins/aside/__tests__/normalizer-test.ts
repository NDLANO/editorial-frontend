/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createSlate, HEADING_ELEMENT_TYPE, PARAGRAPH_ELEMENT_TYPE, SECTION_ELEMENT_TYPE } from "@ndla/editor";
import { Descendant } from "slate";
import { anySlateElementId } from "../../../../../__tests__/vitest.setup";
import { learningResourcePlugins } from "../../../../../containers/ArticlePage/LearningResourcePage/components/learningResourcePlugins";
import { LINK_ELEMENT_TYPE } from "../../link/types";
import { ASIDE_ELEMENT_TYPE } from "../asideTypes";

const editor = createSlate({ plugins: learningResourcePlugins });

describe("aside normalizer tests", () => {
  test("adds paragraphs around aside element", () => {
    const editorValue: Descendant[] = [
      {
        type: SECTION_ELEMENT_TYPE,
        children: [
          {
            type: ASIDE_ELEMENT_TYPE,
            data: { type: "factAside" },
            children: [{ type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "content" }] }],
          },
          {
            type: ASIDE_ELEMENT_TYPE,
            data: { type: "factAside" },
            children: [{ type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "content" }] }],
          },
          {
            type: ASIDE_ELEMENT_TYPE,
            data: { type: "factAside" },
            children: [{ type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "content" }] }],
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
            type: ASIDE_ELEMENT_TYPE,
            id: anySlateElementId,
            data: { type: "factAside" },
            children: [{ type: PARAGRAPH_ELEMENT_TYPE, id: anySlateElementId, children: [{ text: "content" }] }],
          },
          { type: PARAGRAPH_ELEMENT_TYPE, id: anySlateElementId, children: [{ text: "" }] },
          {
            type: ASIDE_ELEMENT_TYPE,
            id: anySlateElementId,
            data: { type: "factAside" },
            children: [{ type: PARAGRAPH_ELEMENT_TYPE, id: anySlateElementId, children: [{ text: "content" }] }],
          },
          { type: PARAGRAPH_ELEMENT_TYPE, id: anySlateElementId, children: [{ text: "" }] },
          {
            type: ASIDE_ELEMENT_TYPE,
            id: anySlateElementId,
            data: { type: "factAside" },
            children: [{ type: PARAGRAPH_ELEMENT_TYPE, id: anySlateElementId, children: [{ text: "content" }] }],
          },
          { type: PARAGRAPH_ELEMENT_TYPE, id: anySlateElementId, children: [{ text: "" }] },
        ],
      },
    ];
    editor.reinitialize({ value: editorValue, shouldNormalize: true });
    expect(editor.children).toEqual(expectedValue);
  });

  test("adds paragraphs to empty aside element", () => {
    const editorValue: Descendant[] = [
      {
        type: SECTION_ELEMENT_TYPE,
        children: [
          {
            type: ASIDE_ELEMENT_TYPE,
            data: { type: "factAside" },
            children: [],
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
            type: ASIDE_ELEMENT_TYPE,
            id: anySlateElementId,
            data: { type: "factAside" },
            children: [{ type: PARAGRAPH_ELEMENT_TYPE, id: anySlateElementId, children: [{ text: "" }] }],
          },
          { type: PARAGRAPH_ELEMENT_TYPE, id: anySlateElementId, children: [{ text: "" }] },
        ],
      },
    ];
    editor.reinitialize({ value: editorValue, shouldNormalize: true });
    expect(editor.children).toEqual(expectedValue);
  });

  test("adds paragraph at the end of aside with only heading", () => {
    const editorValue: Descendant[] = [
      {
        type: SECTION_ELEMENT_TYPE,
        children: [
          {
            type: ASIDE_ELEMENT_TYPE,
            data: { type: "factAside" },
            children: [{ type: HEADING_ELEMENT_TYPE, level: 1, children: [{ text: "content" }] }],
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
            type: ASIDE_ELEMENT_TYPE,
            id: anySlateElementId,
            data: { type: "factAside" },
            children: [
              { type: HEADING_ELEMENT_TYPE, id: anySlateElementId, level: 1, children: [{ text: "content" }] },
              { type: PARAGRAPH_ELEMENT_TYPE, id: anySlateElementId, children: [{ text: "" }] },
            ],
          },
          { type: PARAGRAPH_ELEMENT_TYPE, id: anySlateElementId, children: [{ text: "" }] },
        ],
      },
    ];
    editor.reinitialize({ value: editorValue, shouldNormalize: true });
    expect(editor.children).toEqual(expectedValue);
  });

  test("unwraps content of wrong type", () => {
    const editorValue: Descendant[] = [
      {
        type: SECTION_ELEMENT_TYPE,
        children: [
          {
            type: ASIDE_ELEMENT_TYPE,
            data: { type: "factAside" },
            children: [
              {
                type: LINK_ELEMENT_TYPE,
                data: {
                  href: "testurl",
                },
                children: [{ type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "content" }] }],
              },
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
          { type: PARAGRAPH_ELEMENT_TYPE, id: anySlateElementId, children: [{ text: "" }] },
          {
            type: ASIDE_ELEMENT_TYPE,
            id: anySlateElementId,
            data: { type: "factAside" },
            children: [{ type: PARAGRAPH_ELEMENT_TYPE, id: anySlateElementId, children: [{ text: "content" }] }],
          },
          { type: PARAGRAPH_ELEMENT_TYPE, id: anySlateElementId, children: [{ text: "" }] },
        ],
      },
    ];
    editor.reinitialize({ value: editorValue, shouldNormalize: true });
    expect(editor.children).toEqual(expectedValue);
  });
});
